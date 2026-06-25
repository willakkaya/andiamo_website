import { drizzle } from "drizzle-orm/vercel-postgres";
export default function handler(_req: any, res: any) {
  res.status(200).json({ ok: true, drizzle: typeof drizzle });
}
