import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { db, listAllWithProgress, verifyToken } from "../_lib/client";
import { employees } from "../_lib/schema";
import { configured, getBearer, methodGuard, wrap } from "../_lib/http";

async function handler(req: VercelRequest, res: VercelResponse) {
  if (!methodGuard(req, res, "GET") || !configured(res)) return;

  const session = verifyToken(getBearer(req));
  if (!session) return res.status(401).json({ error: "Not signed in" });

  // Re-check manager status against the DB, not just the token claim.
  const row = (
    await db.select().from(employees).where(eq(employees.id, session.employeeId)).limit(1)
  )[0];
  if (!row || !row.isManager) {
    return res.status(403).json({ error: "Managers only" });
  }

  const all = await listAllWithProgress();
  return res.status(200).json({ employees: all });
}

export default wrap(handler);
