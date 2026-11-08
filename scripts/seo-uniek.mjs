/**
 * Controleert dat de SEO-stadspagina's (/seo-hoorn, /seo-haarlem, ...) niet op
 * elkaar lijken.
 *
 * Draaien: npm run seo:uniek
 *
 * De plaatsnaam en regio gaan eruit voor de vergelijking, want "klanten uit
 * Hoorn" en "klanten uit Schagen" is dezelfde zin. Twee controles:
 *  1. Elke tekst (punt, FAQ-vraag met antwoord, intro, waarom-tekst) wordt
 *     vergeleken met de teksten van de andere pagina's. Boven GRENS is het een
 *     fout, boven WAARSCHUWING een melding.
 *  2. Per paar pagina's het aandeel gedeelde woordgroepen (drie woorden). Boven
 *     PAAR_GRENS lijken de pagina's als geheel te veel op elkaar.
 *
 * De prijsalinea en het portfolio staan in SeoStad.tsx en zijn bewust overal
 * gelijk; die vallen hier buiten.
 */
import * as steden from "../src/data/seoSteden.ts";

const GRENS = 0.7;
const WAARSCHUWING = 0.55;
const PAAR_GRENS = 0.25;

const paginas = Object.values(steden).filter((d) => d && typeof d === "object" && "slug" in d);

const namen = [...new Set(paginas.flatMap((d) => [d.stad, d.regio]).map((n) => n.toLowerCase()))].sort((a, b) => b.length - a.length);

function normaliseer(t) {
  let s = t.toLowerCase();
  for (const n of namen) s = s.replaceAll(n, " ");
  return s.replace(/[^a-zà-ÿ0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

const woorden = (t) => normaliseer(t).split(" ").filter(Boolean);
function drietallen(t) {
  const w = woorden(t);
  const uit = new Set();
  for (let i = 0; i + 2 < w.length; i++) uit.add(`${w[i]} ${w[i + 1]} ${w[i + 2]}`);
  return uit;
}
function gelijkenis(a, b) {
  const A = drietallen(a), B = drietallen(b);
  if (!A.size || !B.size) return normaliseer(a) === normaliseer(b) ? 1 : 0;
  let samen = 0;
  for (const x of A) if (B.has(x)) samen++;
  return samen / Math.min(A.size, B.size);
}

function teksten(d) {
  return [
    { soort: "intro", tekst: d.intro },
    { soort: "waarom", tekst: d.waaromTekst },
    { soort: "voorbeelden", tekst: d.voorbeelden },
    ...(d.blokken ?? []).map((b) => ({ soort: `punt "${b.h3}"`, tekst: `${b.h3}. ${b.text}` })),
    // Vraag en antwoord samen: "Wat kost SEO in …?" mag overal staan, zolang het antwoord eigen is.
    ...d.faq.map((f) => ({ soort: `FAQ "${f.q}"`, tekst: `${f.q} ${f.a}` })),
  ];
}

let fouten = 0, meldingen = 0;
for (let i = 0; i < paginas.length; i++)
  for (let j = i + 1; j < paginas.length; j++) {
    const a = paginas[i], b = paginas[j];
    for (const x of teksten(a))
      for (const y of teksten(b)) {
        const g = gelijkenis(x.tekst, y.tekst);
        if (g >= GRENS) {
          fouten++;
          console.log(`FOUT ${Math.round(g * 100)}%  ${a.slug} (${x.soort}) en ${b.slug} (${y.soort})`);
        } else if (g >= WAARSCHUWING) {
          meldingen++;
          console.log(`let op ${Math.round(g * 100)}%  ${a.slug} (${x.soort}) en ${b.slug} (${y.soort})`);
        }
      }
    const heelA = teksten(a).map((t) => t.tekst).join(" ");
    const heelB = teksten(b).map((t) => t.tekst).join(" ");
    const A = drietallen(heelA), B = drietallen(heelB);
    let samen = 0;
    for (const x of A) if (B.has(x)) samen++;
    const paar = samen / Math.min(A.size, B.size);
    if (paar >= PAAR_GRENS) {
      fouten++;
      console.log(`FOUT ${a.slug} en ${b.slug} delen ${Math.round(paar * 100)}% van hun woordgroepen`);
    }
  }

console.log(`\n${paginas.length} SEO-pagina's vergeleken: ${fouten} fout, ${meldingen} om naar te kijken.`);
if (fouten) process.exit(1);
