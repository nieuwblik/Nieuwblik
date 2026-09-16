#!/usr/bin/env node
/**
 * SEO-verificatie, pass 1: tegen een lokale productiebuild.
 *
 *   NITRO_PRESET=node-server npm run build
 *   PORT=4310 node .output/server/index.mjs
 *   node scripts/seo-verify.mjs http://localhost:4310
 *
 * Controleert per route:
 *  1. Status: 200 voor sitemap-URL's, 301 met de juiste Location voor elke regel
 *     in redirects.csv, 404 voor onbekende paden.
 *  2. Precies één canonical, op de gekozen host, gelijk aan de eigen URL.
 *  3. Precies één <h1>.
 *  4. Titel en meta description aanwezig, niet leeg en uniek over alle routes.
 *  5. Precies één JSON-LD-blok; elk @type in de @graph precies één keer.
 *  6. Bij een FAQ: aantal acceptedAnswer = aantal zichtbare vragen, en elke
 *     antwoordtekst staat in de HTML (zonder JavaScript).
 *  7. Elke sitemap-URL geeft 200, elke indexeerbare 200-route (gevonden door te
 *     crawlen) staat in de sitemap, en geen sitemap-URL staat in redirects.csv.
 *
 * Exit-code 0 als alles groen is, anders 1.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = (process.argv[2] ?? "http://localhost:4310").replace(/\/$/, "");
const SITE_URL = fs.readFileSync(path.join(ROOT, "src/config/site.ts"), "utf8").match(/export const SITE_URL = "([^"]+)"/)[1];

const fouten = [];
const fout = (route, check, detail) => fouten.push({ route, check, detail });
let checks = 0;
const ok = (voorwaarde, route, check, detail) => {
  checks++;
  if (!voorwaarde) fout(route, check, detail);
};

// ── helpers ──────────────────────────────────────────────────────────
const decode = (s) =>
  s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
const normaliseer = (s) => decode(s).replace(/\s+/g, " ").trim();
const zichtbareTekst = (html) =>
  normaliseer(html.replace(/<!-- -->/g, "").replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " "));
const absoluut = (pad) => (pad === "/" ? `${SITE_URL}/` : `${SITE_URL}${pad}`);

async function haal(pad) {
  const res = await fetch(BASE + pad, { redirect: "manual", headers: { "user-agent": "nieuwblik-seo-verify" } });
  const html = res.status === 200 || res.status === 404 ? (await res.text()).replace(/\0/g, "") : "";
  return { status: res.status, location: res.headers.get("location"), html };
}

async function inBatches(items, fn, grootte = 8) {
  const uit = [];
  for (let i = 0; i < items.length; i += grootte) uit.push(...(await Promise.all(items.slice(i, i + grootte).map(fn))));
  return uit;
}

// ── bronnen ──────────────────────────────────────────────────────────
const sitemapRes = await fetch(`${BASE}/sitemap.xml`);
const sitemapXml = await sitemapRes.text();
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
ok(sitemapRes.status === 200 && sitemapUrls.length > 0, "/sitemap.xml", "sitemap bereikbaar", `status ${sitemapRes.status}, ${sitemapUrls.length} URL's`);
for (const u of sitemapUrls) ok(u.startsWith(`${SITE_URL}/`), u, "sitemap-host", `verwacht ${SITE_URL}`);
const sitemapPaden = sitemapUrls.map((u) => new URL(u).pathname.replace(/(.)\/$/, "$1"));

const csv = fs.readFileSync(path.join(ROOT, "redirects.csv"), "utf8").trim().split(/\r?\n/);
ok(csv[0] === "source_path,target_url,rule_type", "redirects.csv", "kolommen", csv[0]);
const redirects = csv.slice(1).map((r) => {
  const [source_path, target_url, rule_type] = r.split(",");
  return { source_path, target_url, rule_type };
});

const robots = await (await fetch(`${BASE}/robots.txt`)).text();
ok(robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`), "/robots.txt", "Sitemap-regel op gekozen host", robots.match(/Sitemap:.*/)?.[0]);

// ── 1-6: elke sitemap-URL ────────────────────────────────────────────
const titels = new Map();
const beschrijvingen = new Map();

const paginas = await inBatches(sitemapPaden, async (pad) => ({ pad, ...(await haal(pad)) }));
for (const { pad, status, html } of paginas) {
  ok(status === 200, pad, "status 200", `kreeg ${status}`);
  if (status !== 200) continue;
  const head = html.slice(0, html.indexOf("</head>"));

  const canonicals = [...html.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  ok(canonicals.length === 1, pad, "precies één canonical", `${canonicals.length} gevonden`);
  ok(canonicals[0] === absoluut(pad), pad, "canonical = eigen URL op gekozen host", `${canonicals[0]} (verwacht ${absoluut(pad)})`);

  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  ok(h1 === 1, pad, "precies één h1", `${h1} gevonden`);

  const titel = normaliseer(head.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const beschrijving = normaliseer(head.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
  ok(titel.length > 0, pad, "titel aanwezig", "leeg of ontbreekt");
  ok(beschrijving.length > 0, pad, "meta description aanwezig", "leeg of ontbreekt");
  if (titel) titels.set(titel, [...(titels.get(titel) ?? []), pad]);
  if (beschrijving) beschrijvingen.set(beschrijving, [...(beschrijvingen.get(beschrijving) ?? []), pad]);

  const blokken = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  ok(blokken.length === 1, pad, "precies één JSON-LD-blok", `${blokken.length} gevonden`);
  let graph = [];
  try {
    graph = blokken.flatMap((b) => { const j = JSON.parse(b); return j["@graph"] ?? [j]; });
  } catch (e) {
    fout(pad, "JSON-LD parsebaar", e.message);
  }
  const typen = graph.flatMap((n) => [].concat(n["@type"] ?? []));
  const dubbel = [...new Set(typen.filter((t, i) => typen.indexOf(t) !== i))];
  ok(dubbel.length === 0, pad, "elk schema-@type één keer", `dubbel: ${dubbel.join(", ")}`);
  for (const t of ["Organization", "WebSite", "ProfessionalService", "BreadcrumbList"]) ok(typen.includes(t), pad, `schema bevat ${t}`, `typen: ${typen.join(", ")}`);
  ok(!/aggregateRating/.test(blokken.join("")), pad, "geen aggregateRating", "aggregateRating gevonden");

  const faq = graph.find((n) => [].concat(n["@type"]).includes("FAQPage"));
  const vragen = (html.match(/data-faq-vraag/g) || []).length;
  const acceptedAnswers = (blokken.join("").match(/"acceptedAnswer"/g) || []).length;
  if (faq || vragen) {
    ok(acceptedAnswers === vragen, pad, "acceptedAnswer = zichtbare vragen", `${acceptedAnswers} acceptedAnswer, ${vragen} vragen`);
    const tekst = zichtbareTekst(html);
    const ontbreekt = (faq?.mainEntity ?? []).filter((q) => !tekst.includes(normaliseer(q.acceptedAnswer.text)));
    ok(ontbreekt.length === 0, pad, "elke antwoordtekst in de HTML", `ontbreekt: ${ontbreekt.map((q) => q.name).join(" | ")}`);
  }
}
for (const [titel, paden] of titels) ok(paden.length === 1, paden.join(", "), "titel uniek", titel);
for (const [b, paden] of beschrijvingen) ok(paden.length === 1, paden.join(", "), "meta description uniek", b.slice(0, 80));

// ── 1: redirects ─────────────────────────────────────────────────────
const redirectBronnen = new Set();
await inBatches(redirects, async ({ source_path, target_url, rule_type }) => {
  redirectBronnen.add(source_path);
  ok(rule_type === "redirect", source_path, "rule_type = redirect", rule_type);
  ok(target_url.startsWith(`${SITE_URL}/`), source_path, "target_url op gekozen host", target_url);
  const { status, location } = await haal(source_path);
  ok(status === 301, source_path, "status 301", `kreeg ${status}`);
  ok(location === target_url, source_path, "Location = target_url", `${location} (verwacht ${target_url})`);
  const doel = await haal(new URL(target_url).pathname);
  ok(doel.status === 200, source_path, "bestemming geeft 200", `${target_url} gaf ${doel.status}`);
});

// ── 1: onbekende paden geven een echte 404 zonder canonical ─────────
const onbekend = ["/bestaat-echt-niet", "/project-bestaat-niet", "/website-laten-maken-fysiotherapie", "/website-laten-maken-onbekend", "/blog/bestaat-niet", "/portfolio/bestaat-niet", "/werkgebied/bestaat-niet", "/regio/bestaat-niet"];
await inBatches(onbekend, async (pad) => {
  const { status, html } = await haal(pad);
  ok(status === 404, pad, "status 404", `kreeg ${status}`);
  ok(!/<link[^>]*rel="canonical"/.test(html), pad, "404 zonder canonical", "canonical gevonden");
  ok(/<meta name="robots" content="noindex/.test(html), pad, "404 met noindex", "geen noindex");
});

// ── 7: sitemap tegen gecrawlde routes ────────────────────────────────
for (const pad of sitemapPaden) ok(!redirectBronnen.has(pad), pad, "sitemap-URL staat niet in redirects.csv", "wel in redirects.csv");

const gecrawld = new Map();
const gelinktVanaf = new Map(); // doelpad -> Set(bronpagina's)
const wachtrij = ["/"];
const gezien = new Set(wachtrij);
while (wachtrij.length) {
  const batch = wachtrij.splice(0, 8);
  await Promise.all(batch.map(async (pad) => {
    const r = await haal(pad);
    gecrawld.set(pad, r);
    if (r.status !== 200) return;
    for (const m of r.html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
      let href = decode(m[1]);
      // Absolute links naar de eigen host tellen ook als intern.
      if (href.startsWith(SITE_URL)) href = href.slice(SITE_URL.length) || "/";
      if (!href.startsWith("/") || href.startsWith("//")) continue;
      const doel = href.split("#")[0].split("?")[0].replace(/(.)\/$/, "$1");
      if (!doel || /^\/(admin|assets)(\/|$)|\.[a-z0-9]{2,5}$/i.test(doel)) continue;
      if (!gelinktVanaf.has(doel)) gelinktVanaf.set(doel, new Set());
      gelinktVanaf.get(doel).add(pad);
      if (gezien.has(doel)) continue;
      gezien.add(doel);
      wachtrij.push(doel);
    }
  }));
}
const indexeerbaar200 = [...gecrawld].filter(([, r]) => r.status === 200 && !/<meta name="robots" content="noindex/.test(r.html)).map(([p]) => p);
const inSitemap = new Set(sitemapPaden);
for (const pad of indexeerbaar200) ok(inSitemap.has(pad), pad, "indexeerbare 200-route staat in sitemap", "ontbreekt in sitemap");
for (const [pad, r] of gecrawld) ok(r.status === 200, pad, "interne link naar bestaande pagina", `gaf ${r.status}${r.location ? " -> " + r.location : ""}`);

// Interne links horen naar de eindbestemming te wijzen, nooit naar een redirect.
for (const [doel, bronnen] of gelinktVanaf) {
  ok(!redirectBronnen.has(doel), doel, "geen interne link naar een pad in redirects.csv", `gelinkt vanaf ${[...bronnen].slice(0, 5).join(", ")}${bronnen.size > 5 ? " …" : ""}`);
}

// Geen weespagina's: elke sitemap-URL moet via een interne link bereikbaar zijn.
for (const pad of sitemapPaden) {
  ok(pad === "/" || gelinktVanaf.has(pad), pad, "sitemap-URL is intern gelinkt", "nergens gelinkt (wees)");
}

// Ook in de broncode: letterlijke interne paden naar een redirect (vangt links
// die alleen client-side renderen, zoals popups, en die de crawl dus niet ziet).
const bronBestanden = [];
const loop = (dir) => {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const vol = path.join(dir, d.name);
    if (d.isDirectory()) { if (!["assets"].includes(d.name)) loop(vol); }
    else if (/\.(tsx?|mjs)$/.test(d.name) && !/routeTree\.gen\.ts$|config[\\/]redirects\.ts$/.test(vol)) bronBestanden.push(vol);
  }
};
loop(path.join(ROOT, "src"));
for (const bestand of bronBestanden) {
  const code = fs.readFileSync(bestand, "utf8");
  for (const bron of redirectBronnen) {
    const re = new RegExp(`["'\`(]${bron.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'\`)#?]`);
    ok(!re.test(code), bron, "geen link naar een redirect in de broncode", path.relative(ROOT, bestand));
  }
}
const robotsPublic = fs.readFileSync(path.join(ROOT, "public/llms.txt"), "utf8");
for (const bron of redirectBronnen) ok(!robotsPublic.includes(`(${bron})`), bron, "geen link naar een redirect in llms.txt", "public/llms.txt");

// ── rapport ──────────────────────────────────────────────────────────
console.log(`Basis: ${BASE}   Host: ${SITE_URL}`);
console.log(`Sitemap: ${sitemapPaden.length} URL's · Redirects: ${redirects.length} · Onbekende paden: ${onbekend.length} · Gecrawld: ${gecrawld.size} (${indexeerbaar200.length} indexeerbaar)`);
console.log(`Checks: ${checks}, fouten: ${fouten.length}`);
if (fouten.length) {
  const perCheck = new Map();
  for (const f of fouten) perCheck.set(f.check, [...(perCheck.get(f.check) ?? []), f]);
  for (const [check, lijst] of perCheck) {
    console.log(`\n✗ ${check} (${lijst.length})`);
    for (const f of lijst.slice(0, 15)) console.log(`   ${f.route}: ${f.detail}`);
    if (lijst.length > 15) console.log(`   … en ${lijst.length - 15} meer`);
  }
  process.exit(1);
}
console.log("\n✓ Alles groen.");
