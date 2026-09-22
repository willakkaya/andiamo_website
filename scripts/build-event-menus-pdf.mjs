// Builds the planner packet PDF from the same data the site renders.
//   node scripts/build-event-menus-pdf.mjs            -> client/public/andiamo-event-menus.pdf
//   node scripts/build-event-menus-pdf.mjs --out=x.pdf --html   (--html also keeps the source HTML beside the PDF)
// Uses headless Chrome on this Mac; Hoefler Text + Big Caslon are macOS system fonts, so
// the PDF matches Will's print taste even though the website uses different faces.
import { readFileSync, writeFileSync, existsSync, statSync, mkdtempSync, unlinkSync } from "node:fs";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { join, resolve, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_PATH = join(ROOT, "client/src/data/eventMenus.json");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v = true] = a.replace(/^--/, "").split("="); return [k, v]; }));
const OUT = resolve(args.out || join(ROOT, "client/public/andiamo-event-menus.pdf"));

const data = JSON.parse(readFileSync(DATA_PATH, "utf8"));
const { pdf: _pdf, ...hashable } = data;
const dataHash = createHash("sha256").update(JSON.stringify(hashable)).digest("hex").slice(0, 16);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const logo = `data:image/webp;base64,${readFileSync(join(ROOT, "client/public/andiamo-logo.webp")).toString("base64")}`;
const SERVICE = { all: "served to every guest", shared: "for the table, family style", "choose-one": "each guest chooses one" };
const money = (n) => `$${n}`;
const byPrice = (rows) => [...rows].sort((a, b) => a.price - b.price);
const tiers = data.tiers;
const dinners = tiers.filter((t) => t.meal === "dinner");

// ---------- page 1: rates, rooms, how booking works, contact ----------
const ratesRows = tiers.map((t) => `
  <tr>
    <td class="price num"><sup>$</sup>${t.price}</td>
    <td class="menu"><b>${esc(t.name)}</b><small>${esc(t.coursesLabel)}${t.note ? ` · ${esc(t.note)}` : ""}</small></td>
    <td class="mains">${esc(t.mainsSummary.join(" · "))}</td>
    <td class="also">${esc(t.alsoServed)}</td>
  </tr>`).join("");

const page1 = `
<section class="page cover">
  <header class="mast">
    <img class="logo" src="${logo}" alt="">
    <div>
      <p class="lab">Andiamo in Banca · Private events</p>
      <h1>Event menus &amp; pricing</h1>
      <p class="lede">Planner's copy, with prices. Guest menu cards are printed without prices. As of ${esc(data.asOf)}.</p>
    </div>
  </header>

  <table class="rates">
    <thead><tr><th class="num">Per guest</th><th>Menu</th><th>Main course, each guest chooses one</th><th>Also served</th></tr></thead>
    <tbody>${ratesRows}</tbody>
  </table>
  <p class="fine">Per guest. A 20% gratuity and sales tax are added to the final bill. Wine pairings ($30, $75 or $150 per guest) and soft drinks ($5) are optional additions; the $120 menu includes the espresso bar. Every menu has a vegetarian main course; gluten-free and other needs on request.</p>

  <div class="two">
    <div>
      <p class="lab">Where your group sits</p>
      <dl class="rooms">${data.rooms.map((r) => `<div><dt>${esc(r.name)}</dt><dd><b>${esc(r.capacity)}.</b> ${esc(r.note)}</dd></div>`).join("")}</dl>
      <p class="fine">Every event menu is available in The Vault.</p>
    </div>
    <div>
      <p class="lab">How booking works</p>
      <ol class="how">
        <li>${esc(data.terms.deposit)}</li>
        <li>${esc(data.terms.headcount)}</li>
        <li>${esc(data.terms.ordering)}</li>
        <li>${esc(data.terms.gratuity)} ${esc(data.terms.tax)}</li>
        <li>The owner coordinates every private event personally.</li>
      </ol>
    </div>
  </div>

  <footer class="contact">
    <span>Events desk <b>(650) 745-8811</b></span><span>events@andiamoinbanca.com</span><span>301 Linden Avenue, South San Francisco</span><span>andiamoinbanca.com/event-menus</span>
  </footer>
</section>`;

// ---------- pages 2-5: one tier per page ----------
const tierPage = (t) => `
<section class="page tier">
  <div class="margin">
    <p class="big num"><sup>$</sup>${t.price}</p>
    <p class="lab">per guest</p>
    <h2>${esc(t.name)}</h2>
    <p class="sub">${esc(t.coursesLabel)}${t.note ? ` · ${esc(t.note)}` : ""}</p>
    ${t.winePairing ? `<p class="sub">Wine pairing optional, from $30 per guest</p>` : ""}
  </div>
  <div class="courses">
    ${t.courses.map((c) => `
    <div class="course">
      <div class="ch"><h3>${esc(c.label)}</h3><p class="rule">${SERVICE[c.rule]}</p></div>
      <ul class="dishes ${c.dishes.length > 1 ? "two" : ""}">
        ${c.dishes.map((d) => `<li><b>${esc(d.name)}</b>${d.diet ? `<i class="diet">${esc(d.diet.join(" · "))}</i>` : ""}<p>${esc(d.desc)}</p></li>`).join("")}
      </ul>
    </div>`).join("")}
  </div>
  <footer class="pf"><span>Andiamo in Banca · ${esc(t.name)} · $${t.price} per guest</span><span>events@andiamoinbanca.com · (650) 745-8811</span></footer>
</section>`;

// ---------- page 6: pairings, additions, questions ----------
const ledger = (title, sub, rows, note) => `
  <div class="ledger">
    <h3>${esc(title)}</h3>${sub ? `<p class="rule">${esc(sub)}</p>` : ""}
    <ul>${rows.map((r) => `<li><div class="row"><span class="n">${esc(r.label || r.displayName)}</span><span class="dots"></span><span class="pr num">${money(r.price)}</span></div>${r.desc ? `<p>${esc(r.desc)}</p>` : ""}${note && r.includedIn120 ? `<em>${note}</em>` : ""}</li>`).join("")}</ul>
  </div>`;
const page6 = `
<section class="page last">
  <div class="three">
    ${ledger("Wine pairings", "Optional, per guest, chosen by the sommelier", data.winePairings.filter((w) => w.key !== "none"))}
    ${ledger("For a reception hour", "Per guest", byPrice(data.horsDoeuvres))}
    ${ledger("Add to any menu", "Per guest", byPrice(data.additions), "Included in the $120 menu.")}
  </div>
  <p class="lab" style="margin-top:14pt">Questions</p>
  <dl class="faq">${data.faq.map((f) => `<div><dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd></div>`).join("")}</dl>
  <footer class="pf"><span>Andiamo in Banca · Event menus &amp; pricing · as of ${esc(data.asOf)}</span><span>andiamoinbanca.com/event-menus</span></footer>
</section>`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Andiamo in Banca · Event menus &amp; pricing</title>
<style>
@page { size: letter; margin: 0; }
* { box-sizing: border-box; margin: 0; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: "Hoefler Text", Georgia, serif; color: #1d1a16; font-size: 10.6pt; line-height: 1.42; background: #fff; }
.page { width: 8.5in; height: 11in; padding: .55in .7in .55in; page-break-after: always; position: relative; overflow: hidden; }
.page.last { page-break-after: auto; }
.num { font-variant-numeric: lining-nums tabular-nums; }
.lab { font-family: "Copperplate", "Hoefler Text", serif; font-size: 8pt; letter-spacing: .18em; text-transform: uppercase; color: #6b6259; }
h1, h2, .big, .price, .rates th, .rooms dt, .faq dt, .ledger h3 { font-family: "Big Caslon", "Hoefler Text", Georgia, serif; font-weight: 500; }
h1 { font-size: 28pt; line-height: 1; margin: 4pt 0 6pt; }
.lede { font-size: 10.5pt; color: #4a443d; max-width: 5.6in; }
.mast { display: grid; grid-template-columns: 62pt 1fr; gap: 16pt; align-items: start; border-bottom: 1px solid #9a7b3c; padding-bottom: 14pt; margin-bottom: 16pt; }
.logo { width: 58pt; height: auto; }
.rates { width: 100%; border-collapse: collapse; border-top: 3px double #1d1a16; border-bottom: 3px double #1d1a16; }
.rates th { text-align: left; font-family: "Copperplate", serif; font-weight: 400; font-size: 7.5pt; letter-spacing: .16em; text-transform: uppercase; color: #6b6259; padding: 7pt 6pt 5pt; border-bottom: 1px solid #b8b0a5; }
.rates th.num, .rates td.price { text-align: right; width: 62pt; padding-right: 10pt; }
.rates td { vertical-align: top; padding: 6pt 6pt; border-bottom: 1px solid #ddd6cb; font-size: 9.2pt; line-height: 1.3; }
.rates tr:last-child td { border-bottom: 0; }
.rates td.price { font-size: 20pt; line-height: 1; border-right: 1px solid #b8b0a5; }
.rates td.price sup { font-size: .48em; vertical-align: .7em; color: #9a7b3c; } .big sup { font-size: .42em; vertical-align: .95em; color: #9a7b3c; margin-right: 1pt; }
.rates td.menu { width: 96pt; } .rates td.menu b { font-size: 12.5pt; display: block; line-height: 1.1; } .rates td.menu small { display: block; color: #6b6259; margin-top: 2pt; }
.rates td.mains { width: 2.55in; } .rates td.also { color: #4a443d; }
.fine { font-size: 8.8pt; color: #4a443d; margin-top: 8pt; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 26pt; margin-top: 14pt; }
.rooms { border-top: 1px solid #b8b0a5; margin-top: 6pt; } .rooms div { display: grid; grid-template-columns: 82pt 1fr; gap: 8pt; padding: 4pt 0; border-bottom: 1px solid #ddd6cb; } .rooms dt { font-size: 10.5pt; } .rooms dd { font-size: 9pt; color: #4a443d; line-height: 1.3; } .rooms dd b { color: #1d1a16; font-weight: 500; }
.how { margin: 6pt 0 0 12pt; font-size: 9.2pt; line-height: 1.3; } .how li { padding: 2.5pt 0; border-bottom: 1px solid #ddd6cb; }
.contact { position: absolute; left: .7in; right: .7in; bottom: .5in; display: flex; flex-wrap: wrap; gap: 6pt 18pt; font-size: 9pt; color: #4a443d; border-top: 1px solid #9a7b3c; padding-top: 8pt; } .contact b { color: #1d1a16; font-weight: 500; }
/* tier pages */
.tier { display: grid; grid-template-columns: 1.35in 1fr; column-gap: 26pt; align-content: start; border-top: 3px double #1d1a16; padding-top: 18pt; }
.margin { border-right: 1px solid #b8b0a5; padding-right: 14pt; }
.big { font-size: 52pt; line-height: .9; }
.margin .lab { margin-top: 6pt; } .margin h2 { font-size: 20pt; margin-top: 14pt; line-height: 1.05; } .sub { font-size: 9.6pt; color: #4a443d; margin-top: 4pt; }
.course { display: grid; grid-template-columns: 1.05in 1fr; gap: 12pt; padding: 10pt 0; border-top: 1px solid #ddd6cb; } .course:first-child { border-top: 0; padding-top: 0; }
.ch h3 { font-family: "Big Caslon", serif; font-weight: 500; font-size: 12.5pt; line-height: 1.1; } .rule { font-style: italic; font-size: 9pt; color: #6b6259; margin-top: 2pt; }
.dishes { list-style: none; display: grid; gap: 7pt 14pt; } .dishes.two { grid-template-columns: 1fr 1fr; }
.dishes b { font-weight: 500; font-size: 11pt; display: block; line-height: 1.15; } .dishes .diet { display: block; font-family: "Copperplate", serif; font-style: normal; font-size: 6.8pt; letter-spacing: .16em; text-transform: uppercase; color: #6b6259; margin-top: 2pt; } .dishes p { font-size: 9.3pt; color: #4a443d; margin-top: 2pt; }
.pf { position: absolute; left: .7in; right: .7in; bottom: .5in; display: flex; justify-content: space-between; font-family: "Copperplate", serif; font-size: 7pt; letter-spacing: .14em; text-transform: uppercase; color: #6b6259; border-top: 1px solid #ddd6cb; padding-top: 6pt; }
/* last page */
.three { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18pt; }
.ledger h3 { font-size: 13pt; } .ledger ul { list-style: none; padding: 0; border-top: 1px solid #b8b0a5; margin-top: 6pt; }
.ledger li { padding: 4pt 0; border-bottom: 1px solid #ddd6cb; } .ledger .row { display: flex; align-items: baseline; gap: 5pt; } .ledger .n { font-size: 10pt; line-height: 1.15; } .ledger .dots { flex: 1; border-bottom: 1px dotted #9a9188; margin-bottom: 3pt; min-width: 8pt; } .ledger .pr { flex: none; }
.ledger p { font-size: 8.4pt; color: #4a443d; line-height: 1.3; } .ledger p + em, .ledger em { display: block; margin-top: 1pt; font-style: normal; font-family: "Copperplate", serif; font-size: 6.6pt; letter-spacing: .14em; text-transform: uppercase; color: #6b6259; }
.faq { border-top: 1px solid #b8b0a5; margin-top: 6pt; columns: 2; column-gap: 24pt; } .faq div { break-inside: avoid; padding: 4pt 0; border-bottom: 1px solid #ddd6cb; } .faq dt { font-size: 10pt; line-height: 1.15; } .faq dd { font-size: 8.4pt; color: #4a443d; margin-top: 1pt; line-height: 1.3; }
</style></head><body>${page1}${tiers.map(tierPage).join("")}${page6}</body></html>`;

const tmp = mkdtempSync(join(tmpdir(), "andiamo-pdf-"));
const htmlPath = join(tmp, "packet.html");
writeFileSync(htmlPath, html);
if (args.html) writeFileSync(OUT.replace(/\.pdf$/, ".html"), html);
if (existsSync(OUT)) unlinkSync(OUT);

// Headless Chrome sometimes never exits on this Mac: poll for a stable file, then kill it.
const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--no-margins", `--print-to-pdf=${OUT}`, `file://${htmlPath}`], { stdio: "ignore" });
const started = Date.now();
let last = -1, stable = 0;
while (Date.now() - started < 60000) {
  await new Promise((r) => setTimeout(r, 500));
  const size = existsSync(OUT) ? statSync(OUT).size : -1;
  if (size > 0 && size === last) { if (++stable >= 3) break; } else stable = 0;
  last = size;
}
chrome.kill("SIGKILL");
if (!existsSync(OUT) || statSync(OUT).size === 0) { console.error("PDF was not written"); process.exit(1); }
// Chrome embeds a fresh font subset per page; pypdf merges and compresses them losslessly.
await new Promise((res) => {
  const py = spawn("python3", ["-c", `
import sys
from pypdf import PdfReader, PdfWriter
r = PdfReader(sys.argv[1]); w = PdfWriter(clone_from=r)
w.compress_identical_objects(remove_identicals=True, remove_orphans=True)
for p in w.pages: p.compress_content_streams()
w.write(sys.argv[1])`, OUT], { stdio: "inherit" });
  py.on("exit", res);
});
if (OUT === resolve(join(ROOT, "client/public/andiamo-event-menus.pdf"))) {
  writeFileSync(join(ROOT, "client/public/andiamo-event-menus.meta.json"), JSON.stringify({ dataHash, asOf: data.asOf, pages: tiers.length + 2 }, null, 2) + "\n");
}
console.log(`wrote ${OUT} (${Math.round(statSync(OUT).size / 1024)} KB), data hash ${dataHash}`);
