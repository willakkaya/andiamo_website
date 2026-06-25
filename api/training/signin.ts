import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  createEmployee,
  findEmployeeByKey,
  getProgress,
  normalizeKey,
  signToken,
  toEmployeeDTO,
  updateEmployeeMeta,
  verifyPin,
} from "../_lib/client";
import { configured, methodGuard, wrap } from "../_lib/http";

async function handler(req: VercelRequest, res: VercelResponse) {
  if (!methodGuard(req, res, "POST") || !configured(res)) return;

  const { name, role, location, pin, managerCode } = (req.body ?? {}) as Record<
    string,
    string
  >;

  if (!name || name.trim().length < 2 || !role || !location) {
    return res.status(400).json({ error: "Name, role, and location are required" });
  }
  if (!/^\d{4}$/.test(pin ?? "")) {
    return res.status(400).json({ error: "PIN must be 4 digits" });
  }

  // Manager access is gated by a shared code only managers are given.
  let isManager = false;
  if (role === "Manager") {
    if (!process.env.TRAINING_MANAGER_CODE) {
      return res.status(500).json({ error: "Manager code not configured" });
    }
    if (managerCode !== process.env.TRAINING_MANAGER_CODE) {
      return res.status(403).json({ error: "Incorrect manager code" });
    }
    isManager = true;
  }

  const key = normalizeKey(name);
  const existing = await findEmployeeByKey(key);

  let employee;
  if (existing) {
    if (!verifyPin(pin, existing.pinHash)) {
      return res.status(401).json({ error: "Incorrect PIN for that name" });
    }
    await updateEmployeeMeta(existing.id, { role, location, name: name.trim(), isManager });
    employee = { ...existing, role, location, name: name.trim(), isManager };
  } else {
    employee = await createEmployee({ name, role, location, pin, isManager });
  }

  const progress = await getProgress(employee.id);
  const token = signToken({ employeeId: employee.id, isManager });
  return res.status(200).json({ employee: toEmployeeDTO(employee, progress), token });
}

export default wrap(handler);
