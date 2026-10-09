/**
 * Sitemapgenerator met de routedefinities als bron.
 *
 * - Statische routes komen uit de routebestanden in src/routes/_public. Een
 *   nieuwe pagina komt dus vanzelf in de sitemap.
 * - Elke dynamische route ($param) heeft hieronder een bron die de echte slugs
 *   levert. Staat er een nieuwe dynamische route in de routeboom zonder bron,
 *   dan faalt de generator: liever een kapotte build dan pagina's die stil uit
 *   de sitemap vallen.
 * - Uitgesloten: de catch-all (404), bedankpagina's, /admin, statische routes
 *   met noIndex, en alles wat in de redirecttabel staat.
 * - lastmod per pagina uit git: voor een statische pagina de laatste commit op
 *   routebestand en paginacomponent, voor een dynamische pagina de laatste
 *   commit op het eigen data-blok (git blame). Niet-gecommitte wijzigingen
 *   tellen als vandaag.
 * - Git geldt als onbetrouwbaar als het ontbreekt, als de repository shallow is
 *   (de build-omgeving van Lovable heeft alleen de laatste commit, waardoor
 *   elke pagina de datum van die commit kreeg), of als meer dan 90% van de
 *   URL's via git dezelfde datum krijgt. Dan komen de datums uit de
 *   gecommitte public/sitemap.xml; alleen een URL die daar nog niet in staat
 *   krijgt de builddatum. Daarom hoort public/sitemap.xml bij elke
 *   contentwijziging mee in de commit (controle: npm run sitemap:check).
 * - Dezelfde datums gaan naar src/data/lastmod.ts, waaruit de pagina's hun
 *   dateModified en article:modified_time halen. Zo zeggen sitemap en
 *   structured data hetzelfde.
 *
 * Draait bij elke build (vite.config.ts) en met: npm run generate-sitemap
 * Met --check schrijft hij niets en faalt hij als de gecommitte sitemap of
 * lastmod.ts afwijkt van wat hij nu zou genereren.
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
const CONTROLE = process.argv.includes("--check");
const LASTMOD_BESTAND = "src/data/lastmod.ts";

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
  // dateModified uit dezelfde bron als de sitemap: geen inhoudelijke wijziging.
  /^Lastmod en dateModified uit één bron/,
];
const inhoudelijk = (onderwerp: string) => !NIET_INHOUDELIJK.some((re) => re.test(onderwerp));

/** Laatste inhoudelijke commitdatum (YYYY-MM-DD) waarop een van deze bestanden veranderde. */
function laatsteCommit(bestanden: string[]): string | null {
  // Nog niet gecommitte wijzigingen: die worden vandaag gecommit.
  if (git(["status", "--porcelain", "--", ...bestanden]).trim()) return VANDAAG;
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
  // Porcelain: per regel een kop met de commit-hash, de eerste keer per commit
  // gevolgd door committer-time en summary, en dan de regel zelf (met een tab).
  // Regels met alleen haakjes en komma's tellen niet: die horen bij een nieuw
  // blok dat direct na dit blok is ingevoegd.
  const commits = new Map<string, { tijd: number; summary: string }>();
  const tijden: number[] = [];
  let hash = "";
  for (const regel of uit.split("\n")) {
    const kop = /^([0-9a-f]{40}) \d+ \d+/.exec(regel);
    if (kop) {
      hash = kop[1]!;
      if (!commits.has(hash)) commits.set(hash, { tijd: 0, summary: "" });
    } else if (regel.startsWith("committer-time ")) commits.get(hash)!.tijd = Number(regel.slice(15));
    else if (regel.startsWith("summary ")) commits.get(hash)!.summary = regel.slice(8);
    else if (regel.startsWith("\t")) {
      if (/^[\s{}[\](),;]*$/.test(regel.slice(1))) continue;
      const commit = commits.get(hash)!;
      if (inhoudelijk(commit.summary)) tijden.push(commit.tijd);
    }
  }
  if (!tijden.length) return null;
  return new Date(Math.max(...tijden) * 1000).toISOString().slice(0, 10);
}

// ── gecommitte sitemap: vangnet als git onbetrouwbaar is ──────────
/** Als git(), maar een fout (bestand niet in git) zet git niet op onbeschikbaar. */
function gitStil(args: string[]): string {
  if (!gitBeschikbaar) return "";
  try {
    return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return "";
  }
}
const sitemapPad = rel("public/sitemap.xml");
const ondiep = git(["rev-parse", "--is-shallow-repository"]).trim() === "true";

/** URL-pad → lastmod uit een sitemap-XML. */
function leesSitemap(xml: string): Map<string, string> {
  const uit = new Map<string, string>();
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)) {
    uit.set(new URL(m[1]!).pathname.replace(/(.)\/$/, "$1"), m[2]!);
  }
  return uit;
}

// De versie uit de laatste commit, niet het bestand op schijf: dat kan al door
// een eerdere run overschreven zijn. Zonder git is het bestand op schijf de
// gecommitte versie (de build heeft het nog niet aangeraakt).
const gecommitXml = gitStil(["show", "HEAD:public/sitemap.xml"]) || (fs.existsSync(sitemapPad) ? fs.readFileSync(sitemapPad, "utf8") : "");
const gecommit = leesSitemap(gecommitXml);

// ── routes uit de routebestanden ────────────────────────────────────
/**
 * Alle publieke routes, rechtstreeks uit de bestanden in src/routes/_public
 * (TanStack file-based routing). Bewust niet uit src/routeTree.gen.ts: die wordt
 * pas tijdens de build ververst en kan dan nog een verwijderde route bevatten.
 * Vorm gelijk aan de fullPaths van de router: index-routes met slash (/blog/).
 */
function routePaden(): string[] {
  const basis = rel("src/routes/_public");
  const paden: string[] = [];
  const loop = (dir: string) => {
    for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
      const vol = path.join(dir, d.name);
      if (d.isDirectory()) loop(vol);
      else if (/\.tsx$/.test(d.name)) {
        const segmenten = path.relative(basis, vol).replace(/\.tsx$/, "").split(path.sep).filter((s) => !s.startsWith("_"));
        const laatste = segmenten.pop()!;
        const pre = segmenten.length ? `/${segmenten.join("/")}` : "";
        paden.push(laatste === "index" ? `${pre}/` : `${pre}/${laatste}`);
      }
    }
  };
  loop(basis);
  return paden.sort();
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
  /**
   * Handgeschreven lokale tekst in een ander bestand (cityLokaal.ts of
   * werkgebiedLokaal.ts). Staat de pagina daar, dan telt ook dat blok mee; de
   * jongste datum wint.
   */
  lokaal?: { bestand: string; startRegel: RegExp; alleStarts: RegExp };
}

/**
 * Laatste inhoudelijke datum van één data-blok: van de startregel tot de
 * volgende startregel. Met totKolomNul stopt het blok ook bij de eerste
 * niet-ingesprongen regel (de afsluitende `};` van cityLokaal.ts). Niet voor
 * bestanden met meerregelige teksten: daarin begint inhoud ook in kolom 0.
 */
function lastmodBlok(pad: string, bestand: string, startRegel: RegExp, alleStarts: RegExp, verplicht = true, totKolomNul = false): string | null {
  const regels = fs.readFileSync(rel(bestand), "utf8").split(/\r?\n/);
  const start = regels.findIndex((r) => startRegel.test(r)) + 1;
  if (!start) {
    if (!verplicht) return null;
    throw new Error(`Data-blok niet gevonden voor ${pad} in ${bestand}`);
  }
  const einde = regels.findIndex((r, i) => i >= start && (alleStarts.test(r) || (totKolomNul && /^\S/.test(r))));
  return laatsteCommitRegels(bestand, start, einde === -1 ? regels.length : einde);
}

function lastmodItem(item: Item, alleStarts: RegExp): string | null {
  const datums = [lastmodBlok(item.pad, item.bestand, item.startRegel, alleStarts)];
  if (item.lokaal) datums.push(lastmodBlok(item.pad, item.lokaal.bestand, item.lokaal.startRegel, item.lokaal.alleStarts, false, true));
  const geldig = datums.filter((d): d is string => Boolean(d)).sort();
  return geldig.length ? geldig[geldig.length - 1]! : null;
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** Top-level sleutel in cityLokaal.ts / werkgebiedLokaal.ts: `  leiden: {` of `  "den-helder": {`. */
const lokaalBlok = (bestand: string, slug: string) => ({
  bestand,
  startRegel: new RegExp(`^  (?:${esc(slug)}|"${esc(slug)}"): \\{$`),
  alleStarts: /^  (?:[a-z]+|"[a-z-]+"): \{$/,
});
const slugsUit = (bestand: string, re: RegExp) => [...fs.readFileSync(rel(bestand), "utf8").matchAll(re)].map((m) => m[1]!);

const DYNAMISCH: Record<string, () => { items: Item[]; alleStarts: RegExp }> = {
  "/$landingPath": () => ({
    items: [
      ...cities.map((c) => ({
        pad: `/website-laten-maken-${c.slug}`, bestand: "src/data/cities.ts", startRegel: new RegExp(`^\\s*"slug": "${esc(c.slug)}",`),
        lokaal: lokaalBlok("src/data/cityLokaal.ts", c.slug),
      })),
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
      lokaal: lokaalBlok("src/data/werkgebiedLokaal.ts", r.slug),
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
// Eerst alle URL's met hun git-datum; pas daarna, als bekend is of git te
// vertrouwen is, de definitieve lastmod.
interface Kandidaat extends Omit<Entry, "lastmod"> {
  uitGit: string | null;
}
const kandidaten: Kandidaat[] = [];
const overgeslagen: string[] = [];

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
      kandidaten.push({ loc: item.pad, uitGit: lastmodItem(item, alleStarts), ...gewicht(item.pad) });
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
  kandidaten.push({ loc: pad, uitGit: laatsteCommit(bestanden), ...gewicht(pad) });
}

// ── is git te vertrouwen? ───────────────────────────────────────────
const perDatum = new Map<string, number>();
for (const k of kandidaten) if (k.uitGit) perDatum.set(k.uitGit, (perDatum.get(k.uitGit) ?? 0) + 1);
const aandeelGelijk = kandidaten.length ? Math.max(0, ...perDatum.values()) / kandidaten.length : 1;
const onbetrouwbaar = !gitBeschikbaar
  ? "git ontbreekt"
  : ondiep
    ? "shallow repository"
    : aandeelGelijk > 0.9
      ? `${Math.round(aandeelGelijk * 100)}% van de URL's krijgt via git dezelfde datum`
      : null;

const entries: Entry[] = kandidaten.map(({ uitGit, ...k }) => ({
  ...k,
  lastmod: (onbetrouwbaar ? null : uitGit) ?? gecommit.get(k.loc) ?? VANDAAG,
}));

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

// Pad → lastmod voor de pagina's zelf (dateModified, article:modified_time).
const lastmodBron = `// Gegenereerd door scripts/generate-sitemap.ts; niet met de hand aanpassen.
// Laatste inhoudelijke wijziging per pagina: dezelfde datums als de lastmod in
// public/sitemap.xml. Gebruikt voor dateModified en article:modified_time.
export const LASTMOD: Record<string, string> = {
${[...entries]
  .sort((a, b) => a.loc.localeCompare(b.loc))
  .map((e) => `  ${JSON.stringify(e.loc)}: "${e.lastmod}",`)
  .join("\n")}
};
`;

if (CONTROLE) {
  // Vergelijk met wat gestaged of gecommit is (de index), zodat dit ook als
  // pre-commit-controle werkt.
  const ingecheckt = leesSitemap(gitStil(["show", ":public/sitemap.xml"]) || gecommitXml);
  const nu = new Map(entries.map((e) => [e.loc, e.lastmod]));
  const fouten: string[] = [];
  for (const loc of nu.keys()) if (!ingecheckt.has(loc)) fouten.push(`ontbreekt in de gecommitte sitemap: ${loc}`);
  for (const loc of ingecheckt.keys()) if (!nu.has(loc)) fouten.push(`staat in de gecommitte sitemap maar wordt niet meer gegenereerd: ${loc}`);
  for (const [loc, d] of nu) if (ingecheckt.has(loc) && ingecheckt.get(loc) !== d) fouten.push(`lastmod ${loc}: gecommit ${ingecheckt.get(loc)}, nu ${d}`);
  const bronIngecheckt = gitStil(["show", `:${LASTMOD_BESTAND}`]).replace(/\r\n/g, "\n");
  if (bronIngecheckt !== lastmodBron) fouten.push(`${LASTMOD_BESTAND} wijkt af van de gegenereerde versie`);
  if (onbetrouwbaar) console.log(`Let op: git onbetrouwbaar (${onbetrouwbaar}); datums uit de gecommitte sitemap.`);
  if (fouten.length) {
    console.error(`Sitemapcontrole: ${fouten.length} afwijking(en). Draai npm run generate-sitemap en commit public/sitemap.xml en ${LASTMOD_BESTAND}.`);
    for (const f of fouten.slice(0, 40)) console.error("  " + f);
    process.exit(1);
  }
  console.log(`Sitemapcontrole: ${entries.length} URL's, gecommitte sitemap en ${LASTMOD_BESTAND} kloppen.`);
  process.exit(0);
}

fs.writeFileSync(sitemapPad, xml, "utf-8");
fs.writeFileSync(rel(LASTMOD_BESTAND), lastmodBron, "utf-8");

const robots = `# Robots.txt for Nieuwblik
# ${SITE_URL}
# Gegenereerd door scripts/generate-sitemap.ts; niet met de hand aanpassen.

User-agent: *
Allow: /
Disallow: /admin

# AI-crawlers mogen de publieke site lezen, maar niet het interne portaal
User-agent: GPTBot
Allow: /
Disallow: /admin

User-agent: ClaudeBot
Allow: /
Disallow: /admin

User-agent: PerplexityBot
Allow: /
Disallow: /admin

# Inhoudsoverzicht voor AI-assistenten: ${SITE_URL}/llms.txt
# (als commentaar: "Llms:" is geen robots.txt-regel en Search Console
# meldt hem dan als syntaxisfout; llms.txt staat op de vaste plek in de root)

# Sitemap
Sitemap: ${SITE_URL}/sitemap.xml
`;
fs.writeFileSync(rel("public/robots.txt"), robots, "utf-8");

const datums = new Set(entries.map((e) => e.lastmod));
console.log(
  `Sitemap: ${entries.length} URL's, ${datums.size} verschillende lastmod-datums${onbetrouwbaar ? ` (git onbetrouwbaar: ${onbetrouwbaar}; lastmod uit de gecommitte sitemap)` : ""}. Overgeslagen: ${overgeslagen.join(", ")}`,
);
