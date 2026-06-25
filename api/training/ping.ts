// Diagnostic endpoint: zero imports. If this responds but the other training
// endpoints 500 at load, the failure is in bundling the db/* modules.
export default function handler(
  _req: { method?: string },
  res: { status: (n: number) => { json: (b: unknown) => void } },
) {
  res.status(200).json({ ok: true, ts: Date.now() });
}
