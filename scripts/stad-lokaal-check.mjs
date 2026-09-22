/**
 * Controleert de handgeschreven stadspagina's uit src/data/cityLokaal.ts tegen
 * de HTML die de server werkelijk teruggeeft.
 *
 * Draaien tegen de dev-server:  npm run stad:check -- http://localhost:4209
 * Of tegen een build:           npm run stad:check -- http://localhost:4310
 *
 * Gecontroleerd wordt per stad:
 *  - titel en meta description staan in de HTML, binnen de lengtegrens en uniek
 *  - H1, elke alinea en elke FAQ-vraag en -antwoord staan server-side in de HTML
 *  - de FAQPage in de JSON-LD komt overeen met de zichtbare vragen
 *  - canonical is de verwachte URL
 *  - elke interne link in de tekst bestaat en is geen redirect
 *  - de lokale tekst is tussen MIN_WOORDEN en MAX_WOORDEN woorden lang
 */
import { cityLokaal } from "../src/data/cityLokaal.ts";
import { cities } from "../src/data/cities.ts";
import { findRedirect } from "../src/config/redirects.ts";
import { SITE_URL } from "../src/config/site.ts";

const BASIS = process.argv[2] ?? "http://localhost:4209";
const MAX_TITEL = 60;
const MAX_META = 155;
const MIN_WOORDEN = 200;
const MAX_WOORDEN = 350;

let fouten = 0;
let controles = 0;
const titels = new Map();
const metas = new Map();

function ok(goed, waar, wat, details = "") {
  controles++;
  if (goed) return;
  fouten++;
  console.log(`  FOUT  ${waar} — ${wat}${details ? `: ${details}` : ""}`);
}

/** HTML-entiteiten terug naar tekst, zodat vergelijken met de bron werkt. */
function ontdoe(html) {
  return html
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

/** React zet <!-- --> tussen tekst en expressies; tags en die comments eruit. */
function zichtbareTekst(html) {
  return ontdoe(
    html
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<[^>]*>/g, " "),
  )
    .replace(/\s+/g, " ")
    // Elke tag wordt een spatie, dus een link vlak voor een komma levert
    // "Den Haag , Delft" op. Die spatie halen we weg voor het vergelijken.
    .replace(/\s+([,.;:!?])/g, "$1");
}

const zonderLinks = (t) => t.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
const paden = new Set(cities.map((c) => `/website-laten-maken-${c.slug}`));

for (const [slug, data] of Object.entries(cityLokaal)) {
  const pad = `/website-laten-maken-${slug}`;
  const res = await fetch(`${BASIS}${pad}`);
  const html = await res.text();
  const tekst = zichtbareTekst(html);
  console.log(`\n${pad}`);

  ok(res.status === 200, pad, "status 200", `kreeg ${res.status}`);

  const titel = ontdoe((html.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? "");
  ok(titel === data.title, pad, "titel uit cityLokaal", `HTML: "${titel}"`);
  ok(titel.length <= MAX_TITEL, pad, `titel max ${MAX_TITEL} tekens`, `${titel.length}`);
  ok(!titels.has(titel), pad, "titel uniek", `ook op ${titels.get(titel)}`);
  titels.set(titel, pad);

  const meta = ontdoe((html.match(/<meta name="description" content="([^"]*)"/) ?? [])[1] ?? "");
  ok(meta === data.metaDescription, pad, "meta uit cityLokaal", `HTML: "${meta}"`);
  ok(meta.length <= MAX_META, pad, `meta max ${MAX_META} tekens`, `${meta.length}`);
  ok(!metas.has(meta), pad, "meta uniek", `ook op ${metas.get(meta)}`);
  metas.set(meta, pad);

  const h1 = ontdoe((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) ?? [])[1] ?? "").replace(/<[^>]*>/g, "");
  ok(h1.trim() === data.h1, pad, "H1 uit cityLokaal", `HTML: "${h1.trim()}"`);

  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) ?? [])[1] ?? "";
  ok(canonical === `${SITE_URL}${pad}`, pad, "canonical", canonical);

  ok(tekst.includes(data.lokaal.h2), pad, "lokale H2 in HTML");
  data.lokaal.alineas.forEach((alinea, i) => {
    // Alleen de eerste zin vergelijken: links worden als losse elementen gerenderd.
    const eerste = zonderLinks(alinea).split(". ")[0];
    ok(tekst.includes(eerste), pad, `alinea ${i + 1} server-side in HTML`, eerste.slice(0, 50));
  });

  const woorden = zonderLinks(data.lokaal.alineas.join(" ")).split(/\s+/).length;
  ok(
    woorden >= MIN_WOORDEN && woorden <= MAX_WOORDEN,
    pad,
    `lokale tekst ${MIN_WOORDEN}-${MAX_WOORDEN} woorden`,
    `${woorden}`,
  );

  // Interne links uit de alinea's: bestaan ze, en is het geen redirect?
  for (const m of data.lokaal.alineas.join(" ").matchAll(/\[([^\]]+)\]\((\/[^)]+)\)/g)) {
    const doel = m[2];
    ok(paden.has(doel), pad, `interne link bestaat`, doel);
    ok(!findRedirect(doel), pad, `interne link is geen redirect`, doel);
    ok(html.includes(`href="${doel}"`), pad, `interne link staat in de HTML`, doel);
  }

  ok(data.faq.length >= 4 && data.faq.length <= 6, pad, "4 tot 6 FAQ-vragen", `${data.faq.length}`);
  data.faq.forEach((item, i) => {
    ok(tekst.includes(item.q), pad, `FAQ-vraag ${i + 1} in HTML`, item.q.slice(0, 45));
    ok(tekst.includes(item.a.split(". ")[0]), pad, `FAQ-antwoord ${i + 1} in HTML`, item.q.slice(0, 45));
  });

  const blokken = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  ok(blokken.length === 1, pad, "precies één JSON-LD blok", `${blokken.length}`);
  let graph = [];
  try {
    const data0 = JSON.parse(ontdoe(blokken[0][1]));
    graph = data0["@graph"] ?? [data0];
  } catch (e) {
    ok(false, pad, "JSON-LD is geldig", String(e));
  }
  const faqNode = graph.find((n) => n["@type"] === "FAQPage");
  ok(Boolean(faqNode), pad, "FAQPage in de @graph");
  if (faqNode) {
    ok(faqNode.mainEntity.length === data.faq.length, pad, "FAQPage even veel vragen als zichtbaar");
    ok(faqNode["@id"] === `${SITE_URL}${pad}#faq`, pad, "FAQPage @id", faqNode["@id"]);
    faqNode.mainEntity.forEach((q, i) => {
      ok(q.name === data.faq[i].q, pad, `FAQPage vraag ${i + 1} gelijk aan zichtbare vraag`);
    });
  }
  const webPage = graph.find((n) => n["@type"] === "WebPage");
  ok(webPage?.url === `${SITE_URL}${pad}`, pad, "WebPage url", webPage?.url);

  console.log(`  ${woorden} woorden lokale tekst, ${data.faq.length} FAQ-vragen, titel ${titel.length} tekens, meta ${meta.length} tekens`);
}

console.log(`\n${controles} controles, ${fouten} fout.`);
process.exit(fouten ? 1 : 0);
