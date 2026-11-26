// Post-build prerender: writes every route as complete static HTML.
//
// Why: the site is a React app. Left alone, the HTML the server sends is an
// empty <div id="root">, and everything a guest reads arrives through
// JavaScript. Search engines run that JavaScript; most AI crawlers and
// assistants (GPTBot, ClaudeBot, PerplexityBot and the fetchers behind them)
// and every link-preview bot (iMessage, Slack, LinkedIn, WhatsApp) do not, so
// they saw a blank page. This step renders each route with the same
// components the browser uses (client/src/entry-server.tsx, built to .ssr/ by
// `vite build --ssr`) and writes the result, with that route's <head> tags,
// to dist/<route>/index.html. The browser then hydrates that markup
// (client/src/main.tsx), so visitors get the same app as before.
//
// Files written:
//   dist/index.html            the homepage, prerendered
//   dist/<route>/index.html    every other route in pageMeta.json
//   dist/spa-fallback.html     the empty shell, for URLs with no page of
//                              their own (vercel.json rewrites unknown paths
//                              here and the app shows its Not Found page)
//
// Source of truth for the head tags is client/src/lib/pageMeta.json (also used
// by the runtime usePageMeta hook), so the two never drift.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(ROOT, "dist");
const SITE_URL = "https://www.andiamoinbanca.com";

const pageMeta = JSON.parse(
  readFileSync(resolve(ROOT, "client/src/lib/pageMeta.json"), "utf8"),
);
const template = readFileSync(resolve(DIST, "index.html"), "utf8");

// Drift guard: the planner PDF is generated from eventMenus.json. If the data
// changed and the PDF was not regenerated, fail the build while the PDF is
// published, otherwise only warn. Regenerate with `pnpm pdf:event-menus`.
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
{
  const menus = JSON.parse(readFileSync(resolve(ROOT, "client/src/data/eventMenus.json"), "utf8"));
  const { pdf, ...hashable } = menus;
  const want = createHash("sha256").update(JSON.stringify(hashable)).digest("hex").slice(0, 16);
  const metaPath = resolve(ROOT, "client/public/andiamo-event-menus.meta.json");
  const have = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, "utf8")).dataHash : null;
  if (have !== want) {
    const msg = `event menus PDF is stale (data ${want}, pdf ${have}): run "pnpm pdf:event-menus" and commit the PDF`;
    if (pdf?.published) throw new Error(msg);
    console.warn("prerender: " + msg);
  }
}


const esc = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Each swap is [label, pattern, value]. The pattern captures the text before
// and after the value; the value is spliced in by a FUNCTION, never as a
// replacement string, because descriptions contain prices and String.replace
// reads "$1" in a replacement string as "capture group 1" ("$120 dinners" used
// to paste the tag's own opening into the middle of the description).
function swapsFor(route, meta) {
  const url = esc(`${SITE_URL}${route}`);
  const title = esc(meta.title);
  const desc = esc(meta.description);
  const swaps = [
    ["title", /(<title>)[^<]*(<\/title>)/, title],
    ["description", /(<meta name="description" content=")[^"]*(")/, desc],
    ["og:title", /(<meta property="og:title" content=")[^"]*(")/, title],
    ["og:description", /(<meta property="og:description" content=")[^"]*(")/, desc],
    ["og:url", /(<meta property="og:url" content=")[^"]*(")/, url],
    ["twitter:title", /(<meta name="twitter:title" content=")[^"]*(")/, title],
    ["twitter:description", /(<meta name="twitter:description" content=")[^"]*(")/, desc],
    ["canonical", /(<link rel="canonical" href=")[^"]*(")/, url],
  ];
  if (meta.image) {
    const img = esc(
      meta.image.startsWith("http") ? meta.image : `${SITE_URL}${meta.image}`,
    );
    swaps.push(["og:image", /(<meta property="og:image" content=")[^"]*(")/, img]);
    swaps.push(["twitter:image", /(<meta name="twitter:image" content=")[^"]*(")/, img]);
  }
  return swaps;
}

// The server build of the app (see package.json "build").
const SSR_ENTRY = resolve(ROOT, ".ssr/entry-server.js");
if (!existsSync(SSR_ENTRY)) {
  throw new Error(
    "prerender: .ssr/entry-server.js is missing. Run the full `pnpm build` (it runs `vite build --ssr` before this script).",
  );
}
const { render } = await import(pathToFileURL(SSR_ENTRY).href);

const ROOT_DIV = '<div id="root"></div>';
if (!template.includes(ROOT_DIV)) {
  throw new Error(`prerender: ${ROOT_DIV} not found in dist/index.html — aborting so the build fails loudly`);
}

// The empty shell, for URLs that have no page of their own. Static hosting
// answers those with a 200, so the shell carries noindex: that is one of the
// two fixes Google documents for single-page apps, and it keeps mistyped or
// invented URLs (AI crawlers request a lot of them) out of every index.
// It also drops the canonical and og:url tags, which would otherwise tell a
// crawler that every unknown URL is the homepage.
if (/<meta name="robots"/.test(template)) {
  throw new Error("prerender: index.html already has a robots meta tag; decide which one the fallback shell should carry");
}
const shell = template
  .replace("<head>", () => '<head>\n    <meta name="robots" content="noindex" />')
  .replace(/[ \t]*<link rel="canonical" href="[^"]*"\s*\/>\n?/, "")
  .replace(/[ \t]*<meta property="og:url" content="[^"]*"\s*\/>\n?/, "");
if (!shell.includes('<meta name="robots" content="noindex" />') || /rel="canonical"|property="og:url"/.test(shell)) {
  throw new Error("prerender: could not prepare the fallback shell (noindex missing, or canonical/og:url still present)");
}
writeFileSync(resolve(DIST, "spa-fallback.html"), shell);

// Every page in the router must have an entry in pageMeta.json. A route that
// is missing one would never be prerendered: visitors would still get it
// through the fallback shell, but that shell is empty and noindex, so the page
// would be invisible to crawlers with nothing to say so.
{
  const appSource = readFileSync(resolve(ROOT, "client/src/App.tsx"), "utf8");
  const routes = [...appSource.matchAll(/<Route\s+path=\{?"([^"]+)"\}?/g)].map((m) => m[1]);
  if (routes.length === 0) {
    throw new Error("prerender: found no <Route path=...> in client/src/App.tsx; update this check");
  }
  const missing = routes.filter((r) => r !== "/404" && !(r in pageMeta));
  if (missing.length) {
    throw new Error(
      `prerender: ${missing.join(", ")} ${missing.length > 1 ? "are routes" : "is a route"} in App.tsx with no entry in client/src/lib/pageMeta.json. Add one so the page is prerendered.`,
    );
  }
}

let count = 0;
for (const [route, meta] of Object.entries(pageMeta)) {
  let html = template;
  // The homepage keeps the head tags written by hand in client/index.html
  // (its social-preview copy is shorter than its meta description on purpose).
  for (const [label, regex, value] of route === "/" ? [] : swapsFor(route, meta)) {
    if (!regex.test(html)) {
      throw new Error(
        `prerender: tag "${label}" not found in index.html — aborting so the build fails loudly`,
      );
    }
    html = html.replace(regex, (_match, before, after) => before + value + after);
  }

  // The page itself. Guard against a route silently rendering nothing (a
  // missing <Route>, or a component that throws on the server).
  const body = render(route);
  const words = body.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  if (!/<h1[\s>]/.test(body) || words < 80) {
    throw new Error(
      `prerender: ${route} rendered ${words} words and ${/<h1[\s>]/.test(body) ? "an" : "no"} <h1> — aborting so the build fails loudly`,
    );
  }
  html = html.replace(ROOT_DIV, () => `<div id="root">${body}</div>`);

  const outFile =
    route === "/" ? resolve(DIST, "index.html") : resolve(DIST, route.replace(/^\//, ""), "index.html");
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);
  count++;
  console.log(`  ✓ ${route} → ${outFile.slice(ROOT.length + 1)} (${words} words)`);
}

console.log(`prerender: wrote ${count} pages + dist/spa-fallback.html`);
