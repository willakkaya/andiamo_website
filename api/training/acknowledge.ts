import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import {
  db,
  getProgress,
  setAcknowledgement,
  toEmployeeDTO,
  verifyToken,
} from "../_lib/client";
import { employees } from "../_lib/schema";
import { configured, getBearer, methodGuard, wrap } from "../_lib/http";

async function handler(req: VercelRequest, res: VercelResponse) {
  if (!methodGuard(req, res, "POST") || !configured(res)) return;

  const session = verifyToken(getBearer(req));
  if (!session) return res.status(401).json({ error: "Not signed in" });

  const { signatureName } = (req.body ?? {}) as { signatureName?: string };
  if (!signatureName || signatureName.trim().length < 2) {
    return res.status(400).json({ error: "A typed signature is required" });
  }

  await setAcknowledgement(session.employeeId, signatureName);

  const row = (
    await db.select().from(employees).where(eq(employees.id, session.employeeId)).limit(1)
  )[0];
  if (!row) return res.status(404).json({ error: "Employee not found" });

  const progress = await getProgress(row.id);
  return res.status(200).json({ employee: toEmployeeDTO(row, progress) });
}

export default wrap(handler);
