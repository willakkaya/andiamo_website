import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { db, getProgress, toEmployeeDTO, verifyToken } from "../../db/client";
import { employees } from "../../db/schema";
import { configured, getBearer, methodGuard } from "../../db/http";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!methodGuard(req, res, "GET") || !configured(res)) return;

  const session = verifyToken(getBearer(req));
  if (!session) return res.status(401).json({ error: "Not signed in" });

  const row = (
    await db.select().from(employees).where(eq(employees.id, session.employeeId)).limit(1)
  )[0];
  if (!row) return res.status(404).json({ error: "Employee not found" });

  const progress = await getProgress(row.id);
  return res.status(200).json({ employee: toEmployeeDTO(row, progress) });
}
