import { defineConfig } from "drizzle-kit";

// Training app uses Vercel Postgres (separate from the legacy MySQL template
// config in drizzle.config.ts). Vercel injects POSTGRES_URL; we also accept
// DATABASE_URL for local overrides. The URL is only needed for push/migrate,
// not for `generate`, so we don't hard-throw when it's absent.
const connectionString =
  process.env.POSTGRES_URL ?? process.env.DATABASE_URL ?? "";

export default defineConfig({
  schema: "./api/_lib/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
