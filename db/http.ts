// Small helpers shared by the training API routes. Lives outside api/ so it
// isn't itself turned into a serverless function.
import type { VercelRequest, VercelResponse } from "@vercel/node";

export function getBearer(req: VercelRequest): string | null {
  const h = req.headers.authorization;
  if (!h) return null;
  const [scheme, token] = h.split(" ");
  return scheme === "Bearer" && token ? token : null;
}

export function methodGuard(
  req: VercelRequest,
  res: VercelResponse,
  method: "GET" | "POST",
): boolean {
  if (req.method !== method) {
    res.status(405).json({ error: "Method not allowed" });
    return false;
  }
  return true;
}

export function configured(res: VercelResponse): boolean {
  if (!process.env.TRAINING_SESSION_SECRET) {
    res.status(500).json({ error: "Server auth secret not configured" });
    return false;
  }
  return true;
}

// Wrap a handler so any thrown error returns a readable JSON 500 instead of an
// opaque FUNCTION_INVOCATION_FAILED.
export function wrap(
  fn: (req: VercelRequest, res: VercelResponse) => Promise<unknown> | unknown,
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      await fn(req, res);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unexpected server error";
      if (!res.headersSent) res.status(500).json({ error: message });
    }
  };
}
