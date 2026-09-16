/**
 * Sitemapgenerator met de routedefinities als bron.
 *
 * - Statische routes komen uit src/routeTree.gen.ts (FileRoutesByFullPath). Een
 *   nieuwe pagina komt dus vanzelf in de sitemap.
 * - Elke dynamische route ($param) heeft hieronder een bron die de echte slugs
 *   levert. Staat er een nieuwe dynamische route in de routeboom zonder bron,
 *   dan faalt de generator: liever een kapotte build dan pagina's die stil uit
 *   de sitemap vallen.
 * - Uitgesloten: de catch-all (404), bedankpagina's, /admin, statische routes
 *   met noIndex, en alles wat in de redirecttabel staat.
 * - lastmod per pagina uit git: voor een statische pagina de laatste commit op
 *   routebestand en paginacomponent, voor een dynamische pagina de laatste
 *   commit op het eigen data-blok (git blame). Zonder git (bijvoorbeeld in een
 *   build-omgeving zonder historie) blijft de lastmod uit de huidige sitemap
 *   staan; alleen een pagina die daar nog niet in stond krijgt de datum van vandaag.
 *
 * Draait bij elke build (vite.config.ts) en met: npm run generate-sitemap
 * Schrijft ook robots.txt, zodat de Sitemap-regel dezelfde host gebruikt.
 */
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { SITE_URL } from "../src/config/site";
import { REDIRECTS } from "../src/config/redirects";
import { cities } from "../src/data/cities";
import { industries } from "../src/data/industries";
import { getLocalRegions } from "../src/data/regions";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rel = (p: string) => path.join(ROOT, p);
const VANDAAG = new Date().toISOString().slice(0, 10);

interface Entry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

// ── git ─────────────────────────────────────────────────────────────
let gitBeschikbaar = true;
function git(args: string[]): string {
  if (!gitBeschikbaar) return "";
  try {
    return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    gitBeschikbaar = false;
    return "";
  }
}

/**
 * Commits die geen inhoud voor bezoekers veranderden (hostnaam, schema-opbouw,
 * markup, links). lastmod hoort een inhoudelijke wijziging te volgen; anders
 * staat na elke refactor de hele site op vandaag en negeert Google het veld.
 * Match op het begin van de commit-onderwerpregel.
 */
const NIET_INHOUDELIJK = [
  /^sideEffects: false verwijderd/,
  /^Defect 1:/,
  /^Defect 2:/,
  /^Defect 3:/,
  /^Defect 4:/,
  /^Defect 5:/,
  /^Defect 6: één JSON-LD/,
  /^Defect 7:/,
];
const inhoudelijk = (onderwerp: string) => !NIET_INHOUDELIJK.some((re) => re.test(onderwerp));

/** Laatste inhoudelijke commitdatum (YYYY-MM-DD) waarop een van deze bestanden veranderde. */
function laatsteCommit(bestanden: string[]): string | null {
  const uit = git(["log", "--format=%cs%x09%s", "--", ...bestanden]);
  for (const regel of uit.split("\n")) {
    const [datum, onderwerp = ""] = regel.split("\t");
    if (datum && inhoudelijk(onderwerp)) return datum;
  }
  return null;
}

/** Laatste inhoudelijke commitdatum van een regelbereik (1-based, inclusief). */
function laatsteCommitRegels(bestand: string, van: number, tot: number): string | null {
  const uit = git(["blame", "--porcelain", "-L", `${van},${tot}`, "--", bestand]);
  // Porcelain geeft per commit één keer de kopregels (committer-time, summary).
  const tijden: number[] = [];
  let tijd = 0;
  for (const regel of uit.split("\n")) {
    if (regel.startsWith("committer-time ")) tijd = Number(regel.slice(15));
    else if (regel.startsWith("summary ") && inhoudelijk(regel.slice(8))) tijden.push(tijd);
  }
  if (!tijden.length) return null;
  return new Date(Math.max(...tijden) * 1000).toISOString().slice(0, 10);
}

// ── bestaande lastmods als vangnet zonder git ───────────────────────
const bestaand = new Map<string, string>();
const sitemapPad = rel("public/sitemap.xml");
if (fs.existsSync(sitemapPad)) {
  const xml = fs.readFileSync(sitemapPad, "utf8");
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)) {
    bestaand.set(new URL(m[1]!).pathname.replace(/(.)\/$/, "$1"), m[2]!);
  }
}

// ── routes uit de routeboom ─────────────────────────────────────────
function routePaden(): string[] {
  const tree = fs.readFileSync(rel("src/routeTree.gen.ts"), "utf8");
  const blok = tree.match(/export interface FileRoutesByFullPath \{([\s\S]*?)\n\}/);
  if (!blok) throw new Error("FileRoutesByFullPath niet gevonden in src/routeTree.gen.ts");
  return [...blok[1]!.matchAll(/^\s*'([^']+)':/gm)].map((m) => m[1]!);
}

/** Routebestand onder src/routes/_public bij een fullPath. */
function routeBestand(fullPath: string): string {
  const pad = fullPath === "/" ? "index" : fullPath.endsWith("/") ? `${fullPath.slice(1)}index` : fullPath.slice(1);
  const bestand = `src/routes/_public/${pad}.tsx`;
  if (!fs.existsSync(rel(bestand))) throw new Error(`Routebestand niet gevonden voor ${fullPath}: ${bestand}`);
  return bestand;
}

/** Het paginacomponent dat een routebestand importeert (@/pages/...). */
function paginaBestand(routeFile: string): string | null {
  const bron = fs.readFileSync(rel(routeFile), "utf8");
  const m = bron.match(/from "@\/pages\/([^"]+)"/);
  if (!m) return null;
  const bestand = `src/pages/${m[1]}.tsx`;
  return fs.existsSync(rel(bestand)) ? bestand : null;
}

// ── bronnen voor dynamische routes ──────────────────────────────────
interface Item {
  pad: string;
  bestand: string;
  /** Regel waar het data-blok van dit item begint. */
  startRegel: RegExp;
}

function lastmodItem(item: Item, alleStarts: RegExp): string | null {
  const regels = fs.readFileSync(rel(item.bestand), "utf8").split(/\r?\n/);
  const starts = regels.map((r, i) => (alleStarts.test(r) ? i + 1 : 0)).filter(Boolean);
  const start = regels.findIndex((r) => item.startRegel.test(r)) + 1;
  if (!start) throw new Error(`Data-blok niet gevonden voor ${item.pad} in ${item.bestand}`);
  const volgende = starts.find((s) => s > start) ?? regels.length + 1;
  return laatsteCommitRegels(item.bestand, start, volgende - 1);
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const slugsUit = (bestand: string, re: RegExp) => [...fs.readFileSync(rel(bestand), "utf8").matchAll(re)].map((m) => m[1]!);

const DYNAMISCH: Record<string, () => { items: Item[]; alleStarts: RegExp }> = {
  "/$landingPath": () => ({
    items: [
      ...cities.map((c) => ({ pad: `/website-laten-maken-${c.slug}`, bestand: "src/data/cities.ts", startRegel: new RegExp(`^\\s*"slug": "${esc(c.slug)}",`) })),
      ...industries.map((i) => ({ pad: `/website-laten-maken-${i.slug}`, bestand: "src/data/industries.ts", startRegel: new RegExp(`^\\s*"slug": "${esc(i.slug)}",`) })),
    ],
    alleStarts: /^\s*"slug": "/,
  }),
  "/blog/$slug": () => ({
    items: slugsUit("src/data/blogPosts.ts", /^ {4}slug: "([^"]+)"/gm).map((slug) => ({
      pad: `/blog/${slug}`, bestand: "src/data/blogPosts.ts", startRegel: new RegExp(`^ {4}slug: "${esc(slug)}"`),
    })),
    alleStarts: /^ {4}slug: "/,
  }),
  "/portfolio/$slug": () => ({
    items: slugsUit("src/data/projects.ts", /^ {4}slug: "([^"]+)"/gm).map((slug) => ({
      pad: `/portfolio/${slug}`, bestand: "src/data/projects.ts", startRegel: new RegExp(`^ {4}slug: "${esc(slug)}"`),
    })),
    alleStarts: /^ {4}slug: "/,
  }),
  "/regio/$slug": () => ({
    // Alleen de hubs zelf (4 spaties inspringing), niet de steden erbinnen.
    items: slugsUit("src/pages/RegionalHub.tsx", /^ {4}slug: "([^"]+)"/gm).map((slug) => ({
      pad: `/regio/${slug}`, bestand: "src/pages/RegionalHub.tsx", startRegel: new RegExp(`^ {4}slug: "${esc(slug)}"`),
    })),
    alleStarts: /^ {4}slug: "/,
  }),
  "/werkgebied/$slug": () => ({
    // Alleen lokale plaatsen hebben een eigen pagina (defect 2).
    items: getLocalRegions().map((r) => ({
      pad: `/werkgebied/${r.slug}`, bestand: "src/data/regions.ts", startRegel: new RegExp(`^\\s*slug: '${esc(r.slug)}',`),
    })),
    alleStarts: /^\s*slug: '/,
  }),
};

// ── prioriteit en frequentie ────────────────────────────────────────
function gewicht(pad: string): { changefreq: string; priority: string } {
  if (pad === "/") return { changefreq: "weekly", priority: "1.0" };
  if (["/website-laten-maken", "/webdesign-bureau", "/seo-enkhuizen", "/diensten"].includes(pad)) return { changefreq: "monthly", priority: "0.9" };
  if (["/portfolio", "/blog"].includes(pad)) return { changefreq: "weekly", priority: "0.8" };
  if (pad.startsWith("/diensten/") || pad === "/over-ons") return { changefreq: "monthly", priority: "0.8" };
  if (pad.startsWith("/website-laten-maken-") || pad.startsWith("/blog/") || pad === "/taxi-website-laten-maken") return { changefreq: "monthly", priority: "0.7" };
  if (["/privacy", "/cookies", "/algemene-voorwaarden"].includes(pad)) return { changefreq: "yearly", priority: "0.3" };
  if (pad.startsWith("/portfolio/") || pad.startsWith("/werkgebied/") || pad.startsWith("/regio/")) return { changefreq: "monthly", priority: "0.6" };
  return { changefreq: "monthly", priority: "0.7" };
}

const UITGESLOTEN = new Set(["/$", "/bedankt"]);

// ── opbouwen ────────────────────────────────────────────────────────
const entries: Entry[] = [];
const overgeslagen: string[] = [];
const lastmodVoor = (pad: string, uitGit: string | null) => uitGit ?? bestaand.get(pad) ?? VANDAAG;

for (const fullPath of routePaden()) {
  if (fullPath.startsWith("/admin") || UITGESLOTEN.has(fullPath)) {
    overgeslagen.push(fullPath);
    continue;
  }

  if (fullPath.includes("$")) {
    const bron = DYNAMISCH[fullPath];
    if (!bron) throw new Error(`Dynamische route ${fullPath} heeft geen bron in scripts/generate-sitemap.ts`);
    const { items, alleStarts } = bron();
    for (const item of items) {
      entries.push({ loc: item.pad, lastmod: lastmodVoor(item.pad, lastmodItem(item, alleStarts)), ...gewicht(item.pad) });
    }
    continue;
  }

  const routeFile = routeBestand(fullPath);
  if (/noIndex:\s*true/.test(fs.readFileSync(rel(routeFile), "utf8"))) {
    overgeslagen.push(`${fullPath} (noindex)`);
    continue;
  }
  // Indexroutes staan in de routeboom met een slash (/blog/), maar serveren en
  // canonicaliseren zonder. De homepage houdt zijn slash.
  const pad = fullPath !== "/" && fullPath.endsWith("/") ? fullPath.slice(0, -1) : fullPath;
  const bestanden = [routeFile, paginaBestand(routeFile)].filter((b): b is string => Boolean(b));
  entries.push({ loc: pad, lastmod: lastmodVoor(pad, laatsteCommit(bestanden)), ...gewicht(pad) });
}

// ── controles ───────────────────────────────────────────────────────
const locs = entries.map((e) => e.loc);
const dubbel = locs.filter((l, i) => locs.indexOf(l) !== i);
if (dubbel.length) throw new Error(`Dubbele URL's in sitemap: ${dubbel.join(", ")}`);
const redirectBronnen = new Set(REDIRECTS.map((r) => r.from));
const conflict = locs.filter((l) => redirectBronnen.has(l));
if (conflict.length) throw new Error(`URL's in sitemap die ook een redirect zijn: ${conflict.join(", ")}`);

entries.sort((a, b) => Number(b.priority) - Number(a.priority) || a.loc.localeCompare(b.loc));

// ── schrijven ───────────────────────────────────────────────────────
const absoluut = (loc: string) => (loc === "/" ? `${SITE_URL}/` : `${SITE_URL}${loc}`);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map((e) => `  <url>\n    <loc>${absoluut(e.loc)}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`)
  .join("\n")}
</urlset>
`;
fs.writeFileSync(sitemapPad, xml, "utf-8");

const robots = `# Robots.txt for Nieuwblik
# ${SITE_URL}
# Gegenereerd door scripts/generate-sitemap.ts; niet met de hand aanpassen.

User-agent: *
Allow: /

# Intern portaal, dekt /admin en alles eronder
Disallow: /admin

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml
`;
fs.writeFileSync(rel("public/robots.txt"), robots, "utf-8");

const datums = new Set(entries.map((e) => e.lastmod));
console.log(
  `Sitemap: ${entries.length} URL's, ${datums.size} verschillende lastmod-datums${gitBeschikbaar ? "" : " (git niet beschikbaar: lastmod uit bestaande sitemap)"}. Overgeslagen: ${overgeslagen.join(", ")}`,
);
