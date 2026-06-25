// Training backend: Vercel Postgres (Drizzle) client, auth helpers, and the
// query helpers the API routes use. Kept separate from the legacy MySQL
// template client in server/db.ts.

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
import { employees, moduleProgress } from "./schema";
import type { EmployeeRow, ModuleProgressRow } from "./schema";

// Lazy DB: the pool is created on first use, never at import. Creating it
// eagerly throws when the connection string is absent, which would crash the
// whole serverless function at startup (FUNCTION_INVOCATION_FAILED) instead of
// surfacing a readable error. The Vercel/Neon integration provides POSTGRES_URL;
// we also accept the common fallbacks.
function makeDb(connectionString: string) {
  const pool = createPool({ connectionString });
  return drizzle(pool, { schema: { employees, moduleProgress } });
}
type DrizzleDb = ReturnType<typeof makeDb>;
let _db: DrizzleDb | null = null;

function realDb(): DrizzleDb {
  if (!_db) {
    const connectionString =
      process.env.POSTGRES_URL ??
      process.env.POSTGRES_PRISMA_URL ??
      process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "Database connection string missing (set POSTGRES_URL on this deployment)",
      );
    }
    _db = makeDb(connectionString);
  }
  return _db;
}

// A proxy so existing `db.select()/insert()/update()` calls keep working while
// deferring pool creation to first use. Methods are bound to the real client.
export const db = new Proxy({} as DrizzleDb, {
  get(_target, prop) {
    const value = realDb()[prop as keyof DrizzleDb];
    return typeof value === "function" ? value.bind(realDb()) : value;
  },
});

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------
export function hashPin(pin: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pin, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPin(pin: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(pin, salt, 32);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export type SessionPayload = { employeeId: string; isManager: boolean };

const SESSION_SECRET = process.env.TRAINING_SESSION_SECRET ?? "";

export function signToken(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", SESSION_SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyToken(token: string | null | undefined): SessionPayload | null {
  if (!token || !SESSION_SECRET) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", SESSION_SECRET).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
  } catch {
    return null;
  }
}

export const normalizeKey = (name: string) => name.trim().toLowerCase();

// ---------------------------------------------------------------------------
// Serialization — shape the client (TrainingContext) expects
// ---------------------------------------------------------------------------
export type EmployeeDTO = {
  id: string;
  name: string;
  role: string;
  location: string;
  isManager: boolean;
  acknowledgedAt: string | null;
  signatureName: string | null;
  createdAt: string;
  modules: Record<
    string,
    {
      bestPct: number;
      passed: boolean;
      attempts: number;
      lastAttemptAt: string;
      wrongQuestionIds: string[];
    }
  >;
};

export function toEmployeeDTO(
  emp: EmployeeRow,
  progress: ModuleProgressRow[],
): EmployeeDTO {
  const modules: EmployeeDTO["modules"] = {};
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
    signatureName: emp.signatureName ?? null,
    createdAt: emp.createdAt.toISOString(),
    modules,
  };
}

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------
export async function findEmployeeByKey(nameKey: string) {
  const rows = await db
    .select()
    .from(employees)
    .where(eq(employees.nameKey, nameKey))
    .limit(1);
  return rows[0] ?? null;
}

export async function getProgress(employeeId: string) {
  return db
    .select()
    .from(moduleProgress)
    .where(eq(moduleProgress.employeeId, employeeId));
}

export async function createEmployee(input: {
  name: string;
  role: string;
  location: string;
  pin: string;
  isManager: boolean;
}): Promise<EmployeeRow> {
  const row: EmployeeRow = {
    id: randomUUID(),
    nameKey: normalizeKey(input.name),
    name: input.name.trim(),
    role: input.role,
    location: input.location,
    pinHash: hashPin(input.pin),
    isManager: input.isManager,
    acknowledgedAt: null,
    signatureName: null,
    createdAt: new Date(),
  };
  await db.insert(employees).values(row);
  return row;
}

export async function updateEmployeeMeta(
  id: string,
  fields: Partial<Pick<EmployeeRow, "role" | "location" | "name" | "isManager">>,
) {
  await db.update(employees).set(fields).where(eq(employees.id, id));
}

export async function recordAttempt(input: {
  employeeId: string;
  moduleId: string;
  bestPct: number;
  passed: boolean;
  wrongQuestionIds: string[];
  passThreshold: number;
}): Promise<ModuleProgressRow> {
  const existing = (
    await db
      .select()
      .from(moduleProgress)
      .where(
        and(
          eq(moduleProgress.employeeId, input.employeeId),
          eq(moduleProgress.moduleId, input.moduleId),
        ),
      )
      .limit(1)
  )[0];

  const now = new Date();
  if (!existing) {
    const row: ModuleProgressRow = {
      id: randomUUID(),
      employeeId: input.employeeId,
      moduleId: input.moduleId,
      bestPct: input.bestPct,
      passed: input.passed,
      attempts: 1,
      lastAttemptAt: now,
      wrongQuestionIds: input.wrongQuestionIds,
    };
    await db.insert(moduleProgress).values(row);
    return row;
  }

  const isBest = input.bestPct >= existing.bestPct;
  const next: Partial<ModuleProgressRow> = {
    bestPct: Math.max(existing.bestPct, input.bestPct),
    passed: existing.passed || input.passed,
    attempts: existing.attempts + 1,
    lastAttemptAt: now,
    wrongQuestionIds: isBest ? input.wrongQuestionIds : existing.wrongQuestionIds,
  };
  await db.update(moduleProgress).set(next).where(eq(moduleProgress.id, existing.id));
  return { ...existing, ...next } as ModuleProgressRow;
}

export async function setAcknowledgement(id: string, signatureName: string) {
  await db
    .update(employees)
    .set({ acknowledgedAt: new Date(), signatureName: signatureName.trim() })
    .where(eq(employees.id, id));
}

export async function listAllWithProgress(): Promise<EmployeeDTO[]> {
  const emps = await db.select().from(employees);
  const allProgress = await db.select().from(moduleProgress);
  const byEmp = new Map<string, ModuleProgressRow[]>();
  for (const p of allProgress) {
    const arr = byEmp.get(p.employeeId) ?? [];
    arr.push(p);
    byEmp.set(p.employeeId, arr);
  }
  return emps.map((e) => toEmployeeDTO(e, byEmp.get(e.id) ?? []));
}
