// Consolidated training API. Everything lives in this single function file and
// imports ONLY npm packages — no relative ./ imports — because Vercel does not
// compile relatively-imported .ts source files for functions in this Vite +
// "type":"module" project (they crash at load with FUNCTION_INVOCATION_FAILED).
// Routed as a dynamic segment so /api/training/signin, /me, /attempt,
// /employees, /acknowledge all land here via req.query.action.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  createHmac,
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { createPool } from "@vercel/postgres";
import { and, eq } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  boolean,
  doublePrecision,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Schema (mirrors db/schema.ts, which drizzle-kit uses for migrations)
// ---------------------------------------------------------------------------
const employees = pgTable("employees", {
  id: text("id").primaryKey(),
  nameKey: text("name_key").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  location: text("location").notNull(),
  pinHash: text("pin_hash").notNull(),
  isManager: boolean("is_manager").notNull().default(false),
  acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true }),
  signatureName: text("signature_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

const moduleProgress = pgTable(
  "module_progress",
  {
    id: text("id").primaryKey(),
    employeeId: text("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),
    moduleId: text("module_id").notNull(),
    bestPct: doublePrecision("best_pct").notNull().default(0),
    passed: boolean("passed").notNull().default(false),
    attempts: integer("attempts").notNull().default(0),
    lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    wrongQuestionIds: text("wrong_question_ids").array().notNull().default([]),
  },
  (t) => ({
    employeeModule: uniqueIndex("module_progress_employee_module_idx").on(
      t.employeeId,
      t.moduleId,
    ),
  }),
);

type EmployeeRow = typeof employees.$inferSelect;
type ModuleProgressRow = typeof moduleProgress.$inferSelect;

// ---------------------------------------------------------------------------
// Lazy DB
// ---------------------------------------------------------------------------
function makeDb(connectionString: string) {
  const pool = createPool({ connectionString });
  return drizzle(pool, { schema: { employees, moduleProgress } });
}
let _db: ReturnType<typeof makeDb> | null = null;
function db() {
  if (!_db) {
    const cs =
      process.env.POSTGRES_URL ??
      process.env.POSTGRES_PRISMA_URL ??
      process.env.DATABASE_URL;
    if (!cs) throw new Error("Database connection string missing (set POSTGRES_URL)");
    _db = makeDb(cs);
  }
  return _db;
}

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------
function hashPin(pin: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(pin, salt, 32).toString("hex")}`;
}
function verifyPin(pin: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(pin, salt, 32);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
type Session = { employeeId: string; isManager: boolean };
const SECRET = () => process.env.TRAINING_SESSION_SECRET ?? "";
function signToken(p: Session): string {
  const body = Buffer.from(JSON.stringify(p)).toString("base64url");
  const sig = createHmac("sha256", SECRET()).update(body).digest("base64url");
  return `${body}.${sig}`;
}
function verifyToken(token: string | null): Session | null {
  if (!token || !SECRET()) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", SECRET()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString()) as Session;
  } catch {
    return null;
  }
}
const normalizeKey = (name: string) => name.trim().toLowerCase();
function bearer(req: VercelRequest): string | null {
  const h = req.headers.authorization;
  if (!h) return null;
  const [scheme, token] = h.split(" ");
  return scheme === "Bearer" && token ? token : null;
}

// ---------------------------------------------------------------------------
// Serialization
// ---------------------------------------------------------------------------
function toDTO(emp: EmployeeRow, progress: ModuleProgressRow[]) {
  const modules: Record<string, unknown> = {};
  for (const p of progress) {
    modules[p.moduleId] = {
      bestPct: p.bestPct,
      passed: p.passed,
      attempts: p.attempts,
      lastAttemptAt: p.lastAttemptAt.toISOString(),
      wrongQuestionIds: p.wrongQuestionIds,
    };
  }
  return {
    id: emp.id,
    name: emp.name,
    role: emp.role,
    location: emp.location,
    isManager: emp.isManager,
    acknowledgedAt: emp.acknowledgedAt ? emp.acknowledgedAt.toISOString() : null,
    signatureName: emp.signatureName,
    createdAt: emp.createdAt.toISOString(),
    modules,
  };
}
async function getProgress(employeeId: string) {
  return db().select().from(moduleProgress).where(eq(moduleProgress.employeeId, employeeId));
}

// ---------------------------------------------------------------------------
// Action handlers
// ---------------------------------------------------------------------------
async function signin(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { name, role, location, pin, managerCode } = (req.body ?? {}) as Record<string, string>;
  if (!name || name.trim().length < 2 || !role || !location)
    return res.status(400).json({ error: "Name, role, and location are required" });
  if (!/^\d{4}$/.test(pin ?? "")) return res.status(400).json({ error: "PIN must be 4 digits" });

  let isManager = false;
  if (role === "Manager") {
    if (!process.env.TRAINING_MANAGER_CODE)
      return res.status(500).json({ error: "Manager code not configured" });
    if (managerCode !== process.env.TRAINING_MANAGER_CODE)
      return res.status(403).json({ error: "Incorrect manager code" });
    isManager = true;
  }

  const key = normalizeKey(name);
  const existing = (
    await db().select().from(employees).where(eq(employees.nameKey, key)).limit(1)
  )[0];

  let emp: EmployeeRow;
  if (existing) {
    if (!verifyPin(pin, existing.pinHash))
      return res.status(401).json({ error: "Incorrect PIN for that name" });
    await db()
      .update(employees)
      .set({ role, location, name: name.trim(), isManager })
      .where(eq(employees.id, existing.id));
    emp = { ...existing, role, location, name: name.trim(), isManager };
  } else {
    emp = {
      id: randomUUID(),
      nameKey: key,
      name: name.trim(),
      role,
      location,
      pinHash: hashPin(pin),
      isManager,
      acknowledgedAt: null,
      signatureName: null,
      createdAt: new Date(),
    };
    await db().insert(employees).values(emp);
  }

  const progress = await getProgress(emp.id);
  const token = signToken({ employeeId: emp.id, isManager });
  return res.status(200).json({ employee: toDTO(emp, progress), token });
}

async function me(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const session = verifyToken(bearer(req));
  if (!session) return res.status(401).json({ error: "Not signed in" });
  const row = (
    await db().select().from(employees).where(eq(employees.id, session.employeeId)).limit(1)
  )[0];
  if (!row) return res.status(404).json({ error: "Employee not found" });
  return res.status(200).json({ employee: toDTO(row, await getProgress(row.id)) });
}

async function attempt(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const session = verifyToken(bearer(req));
  if (!session) return res.status(401).json({ error: "Not signed in" });
  const { moduleId, answers, passThreshold } = (req.body ?? {}) as {
    moduleId?: string;
    answers?: { questionId: string; correct: boolean }[];
    passThreshold?: number;
  };
  if (!moduleId || !Array.isArray(answers) || answers.length === 0)
    return res.status(400).json({ error: "moduleId and answers are required" });

  const threshold = typeof passThreshold === "number" ? passThreshold : 0.8;
  const correct = answers.filter((a) => a.correct).length;
  const pct = correct / answers.length;
  const passed = pct >= threshold;
  const wrong = answers.filter((a) => !a.correct).map((a) => a.questionId);

  const existing = (
    await db()
      .select()
      .from(moduleProgress)
      .where(and(eq(moduleProgress.employeeId, session.employeeId), eq(moduleProgress.moduleId, moduleId)))
      .limit(1)
  )[0];

  const now = new Date();
  let row: ModuleProgressRow;
  if (!existing) {
    row = {
      id: randomUUID(),
      employeeId: session.employeeId,
      moduleId,
      bestPct: pct,
      passed,
      attempts: 1,
      lastAttemptAt: now,
      wrongQuestionIds: wrong,
    };
    await db().insert(moduleProgress).values(row);
  } else {
    const isBest = pct >= existing.bestPct;
    const next = {
      bestPct: Math.max(existing.bestPct, pct),
      passed: existing.passed || passed,
      attempts: existing.attempts + 1,
      lastAttemptAt: now,
      wrongQuestionIds: isBest ? wrong : existing.wrongQuestionIds,
    };
    await db().update(moduleProgress).set(next).where(eq(moduleProgress.id, existing.id));
    row = { ...existing, ...next };
  }

  return res.status(200).json({
    pct,
    module: {
      bestPct: row.bestPct,
      passed: row.passed,
      attempts: row.attempts,
      lastAttemptAt: row.lastAttemptAt,
      wrongQuestionIds: row.wrongQuestionIds,
    },
  });
}

/** Verifies the session AND re-checks isManager in the DB. Returns the manager
 *  row, or null after writing the error response. */
async function requireManager(req: VercelRequest, res: VercelResponse) {
  const session = verifyToken(bearer(req));
  if (!session) {
    res.status(401).json({ error: "Not signed in" });
    return null;
  }
  const me_ = (
    await db().select().from(employees).where(eq(employees.id, session.employeeId)).limit(1)
  )[0];
  if (!me_ || !me_.isManager) {
    res.status(403).json({ error: "Managers only" });
    return null;
  }
  return me_;
}

async function listEmployees(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!(await requireManager(req, res))) return;

  const emps = await db().select().from(employees);
  const allProgress = await db().select().from(moduleProgress);
  const byEmp = new Map<string, ModuleProgressRow[]>();
  for (const p of allProgress) {
    const arr = byEmp.get(p.employeeId) ?? [];
    arr.push(p);
    byEmp.set(p.employeeId, arr);
  }
  return res.status(200).json({ employees: emps.map((e) => toDTO(e, byEmp.get(e.id) ?? [])) });
}

async function resetPin(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!(await requireManager(req, res))) return;
  const { employeeId, newPin } = (req.body ?? {}) as { employeeId?: string; newPin?: string };
  if (!employeeId) return res.status(400).json({ error: "employeeId is required" });
  if (!/^\d{4}$/.test(newPin ?? ""))
    return res.status(400).json({ error: "New PIN must be 4 digits" });
  const target = (
    await db().select().from(employees).where(eq(employees.id, employeeId)).limit(1)
  )[0];
  if (!target) return res.status(404).json({ error: "Employee not found" });
  await db()
    .update(employees)
    .set({ pinHash: hashPin(newPin!) })
    .where(eq(employees.id, employeeId));
  return res.status(200).json({ ok: true });
}

async function removeEmployee(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const manager = await requireManager(req, res);
  if (!manager) return;
  const { employeeId } = (req.body ?? {}) as { employeeId?: string };
  if (!employeeId) return res.status(400).json({ error: "employeeId is required" });
  if (employeeId === manager.id)
    return res.status(400).json({ error: "You can't remove your own account" });
  // module_progress rows cascade-delete with the employee.
  await db().delete(employees).where(eq(employees.id, employeeId));
  return res.status(200).json({ ok: true });
}

async function acknowledge(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const session = verifyToken(bearer(req));
  if (!session) return res.status(401).json({ error: "Not signed in" });
  const { signatureName } = (req.body ?? {}) as { signatureName?: string };
  if (!signatureName || signatureName.trim().length < 2)
    return res.status(400).json({ error: "A typed signature is required" });
  await db()
    .update(employees)
    .set({ acknowledgedAt: new Date(), signatureName: signatureName.trim() })
    .where(eq(employees.id, session.employeeId));
  const row = (
    await db().select().from(employees).where(eq(employees.id, session.employeeId)).limit(1)
  )[0];
  if (!row) return res.status(404).json({ error: "Employee not found" });
  return res.status(200).json({ employee: toDTO(row, await getProgress(row.id)) });
}

// ---------------------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!process.env.TRAINING_SESSION_SECRET)
      return res.status(500).json({ error: "Server auth secret not configured" });
    const action = String(req.query.action ?? "");
    switch (action) {
      case "signin":
        return await signin(req, res);
      case "me":
        return await me(req, res);
      case "attempt":
        return await attempt(req, res);
      case "employees":
        return await listEmployees(req, res);
      case "reset-pin":
        return await resetPin(req, res);
      case "remove-employee":
        return await removeEmployee(req, res);
      case "acknowledge":
        return await acknowledge(req, res);
      default:
        return res.status(404).json({ error: `Unknown action: ${action}` });
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected server error";
    if (!res.headersSent) res.status(500).json({ error: message });
  }
}
