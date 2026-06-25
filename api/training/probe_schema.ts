import { employees } from "../../db/schema";
export default function handler(_req: any, res: any) {
  res.status(200).json({ ok: true, table: !!employees });
}
