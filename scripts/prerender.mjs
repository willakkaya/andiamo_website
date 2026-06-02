// Post-build prerender: bakes per-route <head> meta tags into static HTML.
//
// Why: this is a client-rendered SPA, so social/link-preview crawlers
// (Facebook, LinkedIn, iMessage, Slack, WhatsApp, X) — which do NOT run
// JavaScript — would otherwise see the homepage's OG tags on every page.
// We copy dist/index.html per route and rewrite the head tags so each route
// has correct tags in its raw HTML. Real users still get the full SPA; Vercel
// serves the static file first, then falls back to index.html for SPA routes.
//
// Source of truth for the tags is client/src/lib/pageMeta.json (also used by
// the runtime usePageMeta hook), so the two never drift.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(ROOT, "dist");
const SITE_URL = "https://www.andiamoinbanca.com";

const pageMeta = JSON.parse(
  readFileSync(resolve(ROOT, "client/src/lib/pageMeta.json"), "utf8"),
);
const template = readFileSync(resolve(DIST, "index.html"), "utf8");

const esc = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function swapsFor(route, meta) {
  const url = esc(`${SITE_URL}${route}`);
  const title = esc(meta.title);
  const desc = esc(meta.description);
  const swaps = [
    ["title", /<title>[^<]*<\/title>/, `<title>${title}</title>`],
    ["description", /(<meta name="description" content=")[^"]*(")/, `$1${desc}$2`],
    ["og:title", /(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`],
    ["og:description", /(<meta property="og:description" content=")[^"]*(")/, `$1${desc}$2`],
    ["og:url", /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`],
    ["twitter:title", /(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`],
    ["twitter:description", /(<meta name="twitter:description" content=")[^"]*(")/, `$1${desc}$2`],
    ["canonical", /(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`],
  ];
  if (meta.image) {
    const img = esc(
      meta.image.startsWith("http") ? meta.image : `${SITE_URL}${meta.image}`,
    );
    swaps.push(["og:image", /(<meta property="og:image" content=")[^"]*(")/, `$1${img}$2`]);
    swaps.push(["twitter:image", /(<meta name="twitter:image" content=")[^"]*(")/, `$1${img}$2`]);
  }
  return swaps;
}

let count = 0;
for (const [route, meta] of Object.entries(pageMeta)) {
  if (route === "/") continue; // homepage = dist/index.html (also the SPA fallback)

  let html = template;
  for (const [label, regex, replacement] of swapsFor(route, meta)) {
    if (!regex.test(html)) {
      throw new Error(
        `prerender: tag "${label}" not found in index.html — aborting so the build fails loudly`,
      );
    }
    html = html.replace(regex, replacement);
  }

  const outDir = resolve(DIST, route.replace(/^\//, ""));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "index.html"), html);
  count++;
  console.log(`  ✓ ${route} → dist${route}/index.html`);
}

console.log(`prerender: wrote ${count} route HTML files`);
