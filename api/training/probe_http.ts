import { methodGuard } from "../../db/http";
export default function handler(_req: any, res: any) {
  res.status(200).json({ ok: true, methodGuard: typeof methodGuard });
}
