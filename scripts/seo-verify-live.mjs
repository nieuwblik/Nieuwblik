#!/usr/bin/env node
/**
 * SEO-verificatie, pass 2: tegen de live site, na deploy en HadoSEO-cachepurge.
 *
 *   node scripts/seo-verify-live.mjs                 (standaard https://nieuwblik.com)
 *   node scripts/seo-verify-live.mjs https://nieuwblik.com
 *
 * HadoSEO serveert crawlers een eigen cache. Daarom wordt elke regel uit
 * redirects.csv twee keer gecontroleerd: met een gewone browser-user-agent en
 * met de Googlebot-user-agent. Een regel is pas groen als beide een 301 geven
 * met exact de target_url als Location.
 *
 * Extra controles op de lagen waar pass 1 niet bij kan:
 *  - onbekende paden geven een echte 404 (HadoSEO cachete een origin-404 als 200);
 *  - https://www.nieuwblik.com 301't in één stap naar de gekozen host.
 *
 * Exit-code 0 als alles groen is, anders 1.
 */
import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = (process.argv[2] ?? "https://nieuwblik.com").replace(/\/$/, "");

const AGENTS = {
  browser: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
  googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
};

const csv = fs.readFileSync(path.join(ROOT, "redirects.csv"), "utf8").trim().split(/\r?\n/).slice(1);
const regels = csv.map((r) => {
  const [source_path, target_url] = r.split(",");
  return { source_path, target_url };
});

/**
 * Eén request zoals een crawler hem stuurt, zonder redirects te volgen.
 * Bewust node:https en niet fetch(): fetch stuurt extra headers mee
 * (sec-fetch-mode e.d.) waarop HadoSEO de www-redirect overslaat, wat een
 * vertekend beeld geeft.
 */
function vraag(url, agent) {
  return new Promise((resolve) => {
    const lib = url.startsWith("https:") ? https : http;
    const req = lib.request(url, { method: "GET", headers: { "user-agent": AGENTS[agent], accept: "text/html,*/*" } }, (res) => {
      res.resume();
      const loc = res.headers.location;
      resolve({ status: res.statusCode, location: loc ? new URL(loc, url).href : null });
    });
    req.setTimeout(30000, () => req.destroy(new Error("timeout")));
    req.on("error", (e) => resolve({ status: 0, location: null, fout: e.message }));
    req.end();
  });
}

const resultaten = [];
const controleer = async (label, url, agent, verwachtStatus, verwachtLocation) => {
  const r = await vraag(url, agent);
  const goed = r.status === verwachtStatus && (verwachtLocation === undefined || r.location === verwachtLocation);
  resultaten.push({ label, agent, goed, kreeg: `${r.status}${r.location ? " -> " + r.location : ""}${r.fout ? " (" + r.fout + ")" : ""}`, verwacht: `${verwachtStatus}${verwachtLocation ? " -> " + verwachtLocation : ""}` });
};

for (let i = 0; i < regels.length; i += 6) {
  await Promise.all(
    regels.slice(i, i + 6).flatMap(({ source_path, target_url }) =>
      Object.keys(AGENTS).map((agent) => controleer(source_path, BASE + source_path, agent, 301, target_url)),
    ),
  );
}

const onbekend = "/seo-verify-bestaat-niet-" + Date.now();
for (const agent of Object.keys(AGENTS)) {
  await controleer(`onbekend pad ${onbekend}`, BASE + onbekend, agent, 404);
  await controleer("www naar gekozen host", "https://www.nieuwblik.com/", agent, 301, `${BASE}/`);
}

const fout = resultaten.filter((r) => !r.goed);
console.log(`Basis: ${BASE}`);
console.log(`Redirectregels: ${regels.length} × ${Object.keys(AGENTS).length} user agents, plus 404- en www-controle`);
console.log(`Checks: ${resultaten.length}, fouten: ${fout.length}\n`);
for (const r of fout) console.log(`✗ [${r.agent}] ${r.label}: kreeg ${r.kreeg}, verwacht ${r.verwacht}`);
if (fout.length) {
  console.log("\nNog rood. Is de deploy live, de HadoSEO-redirectimport gedaan en de cache geleegd?");
  process.exit(1);
}
console.log("✓ Alles groen: /webdesign en de andere oude URL's geven live een 301, voor browsers en voor Googlebot.");
