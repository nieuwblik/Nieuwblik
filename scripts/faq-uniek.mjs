/**
 * Controleert dat geen twee steden (bijna) dezelfde FAQ-vragen krijgen.
 *
 * Draaien: npm run faq:uniek
 *
 * Twee controles:
 *  1. Gelijkenis. Elke vraag wordt vergeleken met elke vraag van een andere
 *     stad. De plaatsnaam wordt eruit gehaald, want "vindbaarheid in Leiden"
 *     en "vindbaarheid in Zwolle" zijn dezelfde vraag. Boven GRENS is het een
 *     fout, daarboven maar onder WAARSCHUWING een melding om naar te kijken.
 *  2. Aantal algemene vragen. Vragen over op afstand werken, langskomen,
 *     lokale vindbaarheid en buurplaatsen mogen per stad maximaal MAX_ALGEMEEN
 *     keer voorkomen; de rest moet echt over die plaats gaan.
 */
import { cityLokaal } from "../src/data/cityLokaal.ts";

const GRENS = 0.7;
const WAARSCHUWING = 0.55;
const MAX_ALGEMEEN = 2;

/** Patronen die op elke stadspagina vrijwel hetzelfde zouden worden. */
const ALGEMEEN = [
  { naam: "op afstand / Enkhuizen", re: /enkhuizen|op afstand|afstand werken/ },
  { naam: "langskomen", re: /langskomen|langs komen|op locatie|fysieke afspraak/ },
  { naam: "lokale vindbaarheid", re: /vindbaar|gevonden worden|seo|google bedrijfsprofiel/ },
  { naam: "buurplaatsen", re: /omliggende|buurt|buurplaats|omgeving|ook voor bedrijven in/ },
];

const plaatsnamen = Object.keys(cityLokaal).map((s) => s.replace(/-/g, " "));

/** Kleine letters, geen leestekens, zonder plaatsnamen. */
function normaliseer(vraag) {
  let t = vraag.toLowerCase().replace(/[^a-zà-ÿ\s]/g, " ");
  for (const p of plaatsnamen) t = t.replaceAll(p, " ");
  return t.replace(/\s+/g, " ").trim();
}

const STOPWOORDEN = new Set(
  "de het een en of van in op voor met ook jullie je jouw wij we ons onze is zijn kan kunnen aan dat die deze er te".split(" "),
);

function woorden(vraag) {
  return new Set(normaliseer(vraag).split(" ").filter((w) => w.length > 2 && !STOPWOORDEN.has(w)));
}

/** Jaccard: overlap gedeeld door de vereniging. */
function gelijkenis(a, b) {
  const doorsnede = [...a].filter((w) => b.has(w)).length;
  const vereniging = new Set([...a, ...b]).size;
  return vereniging === 0 ? 0 : doorsnede / vereniging;
}

const vragen = [];
for (const [slug, data] of Object.entries(cityLokaal)) {
  data.faq.forEach((item, i) => vragen.push({ slug, i, q: item.q, set: woorden(item.q) }));
}

const fouten = [];
const meldingen = [];

// 1. Gelijkenis tussen steden
for (let a = 0; a < vragen.length; a++) {
  for (let b = a + 1; b < vragen.length; b++) {
    if (vragen[a].slug === vragen[b].slug) continue;
    const score = gelijkenis(vragen[a].set, vragen[b].set);
    if (score < WAARSCHUWING) continue;
    const regel = `${(score * 100).toFixed(0)}%  ${vragen[a].slug}: "${vragen[a].q}"\n        ${vragen[b].slug}: "${vragen[b].q}"`;
    (score >= GRENS ? fouten : meldingen).push(regel);
  }
}

// 1b. Dubbele vragen binnen één stad
for (const [slug, data] of Object.entries(cityLokaal)) {
  const gezien = new Map();
  data.faq.forEach((item) => {
    const sleutel = normaliseer(item.q);
    if (gezien.has(sleutel)) fouten.push(`100% ${slug}: vraag staat twee keer — "${item.q}"`);
    gezien.set(sleutel, true);
  });
}

// 2. Te veel algemene vragen per stad
for (const [slug, data] of Object.entries(cityLokaal)) {
  const geraakt = ALGEMEEN.filter((p) => data.faq.some((item) => p.re.test(normaliseer(item.q))));
  if (geraakt.length > MAX_ALGEMEEN) {
    fouten.push(
      `${slug}: ${geraakt.length} algemene vragen (max ${MAX_ALGEMEEN}) — ${geraakt.map((p) => p.naam).join(", ")}`,
    );
  }
}

const steden = Object.keys(cityLokaal).length;
console.log(`FAQ-controle: ${steden} steden, ${vragen.length} vragen.`);

if (meldingen.length) {
  console.log(`\nKijk nog even na (${WAARSCHUWING * 100}% tot ${GRENS * 100}% overlap):`);
  for (const m of meldingen) console.log(`  ${m}`);
}

if (fouten.length) {
  console.log(`\nFout (${fouten.length}):`);
  for (const f of fouten) console.log(`  ${f}`);
  process.exit(1);
}

console.log("Geen twee steden met (bijna) dezelfde vragen. Goed.");
