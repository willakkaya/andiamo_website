// Local stand-in for Vercel's function runtime so /api/training works under
// plain `vite` dev (run with: pnpm run dev:api). Loads .env.local, wraps the
// real handler from api/training.ts with the few VercelRequest/VercelResponse
// conveniences it uses (query, body, status().json()), and listens on :3001 —
// vite proxies /api there (see vite.config.ts).
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFileSync } from "node:fs";
import path from "node:path";

const envPath = path.resolve(import.meta.dirname, "..", ".env.local");
try {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    const [, key, raw] = m;
    if (process.env[key] !== undefined) continue;
    process.env[key] = raw.replace(/^"(.*)"$/s, "$1");
  }
} catch {
  console.error(`Could not read ${envPath} — API will fail without POSTGRES_URL etc.`);
}

// The Neon pool emits 'error' when an idle pooled connection times out; with no
// listener that kills the process. Vercel functions are too short-lived to hit
// this, but this long-lived dev server isn't — log and keep serving.
process.on("uncaughtException", (e) => console.error("[dev-api] uncaught:", e.message));
process.on("unhandledRejection", (e) =>
  console.error("[dev-api] unhandled rejection:", e instanceof Error ? e.message : e),
);

const { default: handler } = await import("../api/training");

function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve(undefined);
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve(raw);
      }
    });
  });
}

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (!url.pathname.startsWith("/api/training")) {
    res.statusCode = 404;
    res.end("Not found");
    return;
  }

  const vreq = req as IncomingMessage & { query: Record<string, string>; body: unknown };
  vreq.query = Object.fromEntries(url.searchParams);
  vreq.body = await readBody(req);

  const vres = res as ServerResponse & {
    status: (code: number) => typeof vres;
    json: (obj: unknown) => typeof vres;
    send: (data: string) => typeof vres;
  };
  vres.status = (code: number) => {
    vres.statusCode = code;
    return vres;
  };
  vres.json = (obj: unknown) => {
    vres.setHeader("content-type", "application/json");
    vres.end(JSON.stringify(obj));
    return vres;
  };
  vres.send = (data: string) => {
    vres.end(data);
    return vres;
  };

  try {
    await handler(vreq as never, vres as never);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "dev-api crashed" }));
    }
  }
});

server.listen(3001, () => {
  console.log("dev-api listening on http://localhost:3001 (proxied from vite /api)");
});
