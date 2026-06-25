// Drizzle schema for the Akkaya Hospitality Group training backend (Postgres).
// Mirrors the client-side types in TrainingContext so the localStorage store
// can be swapped for this without UI changes.

import {
  pgTable,
  text,
  integer,
  boolean,
  doublePrecision,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const employees = pgTable("employees", {
  id: text("id").primaryKey(), // crypto.randomUUID()
  // Normalized (trim + lowercase) name — the login key, unique per group.
  nameKey: text("name_key").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  location: text("location").notNull(),
  pinHash: text("pin_hash").notNull(),
  isManager: boolean("is_manager").notNull().default(false),
  acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true }),
  signatureName: text("signature_name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const moduleProgress = pgTable(
  "module_progress",
  {
    id: text("id").primaryKey(),
    employeeId: text("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),
    moduleId: text("module_id").notNull(),
    bestPct: doublePrecision("best_pct").notNull().default(0), // 0..1
    passed: boolean("passed").notNull().default(false),
    attempts: integer("attempts").notNull().default(0),
    lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    // Question ids missed on the best attempt, stored as a Postgres text[].
    wrongQuestionIds: text("wrong_question_ids")
      .array()
      .notNull()
      .default([]),
  },
  (t) => ({
    // One progress row per (employee, module).
    employeeModule: uniqueIndex("module_progress_employee_module_idx").on(
      t.employeeId,
      t.moduleId,
    ),
  }),
);

export type EmployeeRow = typeof employees.$inferSelect;
export type ModuleProgressRow = typeof moduleProgress.$inferSelect;
