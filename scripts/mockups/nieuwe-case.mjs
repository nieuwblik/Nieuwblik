// Maakt de mockup-beelden voor een portfolio-case.
//
//   node scripts/mockups/nieuwe-case.mjs <slug> <url> [--toestel monitor|tablet] [--telefoon warm|studio]
//                                         [--verberg "<css-selectors>"] [--alleen hero|telefoon]
//
// Voorbeeld:
//   node scripts/mockups/nieuwe-case.mjs taxi-drechterland https://taxidrechterland.nl \
//     --verberg "button.fixed.right-5.bottom-6, div.fixed.bottom-3.left-3"
//
// Schrijft naar src/assets/cases/:
//   <slug>-scherm.webp    full-page desktop-screenshot voor de hero (CaseMockup of CaseTablet)
//   <slug>-telefoon.webp  telefoonfoto met de mobiele site in het scherm (CaseTelefoon)
// en print de regels voor src/data/caseMockups.ts. Instellingen: zie README.md hiernaast.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { maakScreenshot } from "./screenshot.mjs";
import { metStatusbalk, inTelefoon, GLANS } from "./telefoon.mjs";

const HIER = dirname(fileURLToPath(import.meta.url));
const UIT = join(HIER, "../../src/assets/cases");
/**
 * Telefoonfoto's met groen scherm. midden = verticaal midden van de telefoon in de
 * foto (0-1), voor caseMockups.ts; glans = licht op het glas (zie telefoon.mjs).
 */
const TELEFOONS = {
  warm: { basis: join(HIER, "basis/telefoon-groen-9x16.webp"), midden: 0.44, telefoonHoogte: 0.44, glans: GLANS.warm },
  studio: { basis: join(HIER, "basis/telefoon-studio-9x16.webp"), midden: 0.47, telefoonHoogte: 0.52, glans: GLANS.studio },
};

/**
 * Hero-screenshot: het venster heeft de verhouding van het scherm in het toestel
 * (monitor 1,82, tablet 1,50), wordt scherp gemaakt en daarna op 1800 breed gezet.
 */
const HEROS = {
  monitor: { breedte: 1440, hoogte: 790, dpr: 1.5, uitBreedte: 1800, kwaliteit: 82 },
  tablet: { breedte: 1440, hoogte: 960, dpr: 1.25, uitBreedte: 1800, kwaliteit: 82 },
};
/** Mobiele screenshot: iPhone-viewport zonder statusbalk (402×820 pt @3x); de statusbalk komt er los bij. */
const MOBIEL = { breedte: 402, hoogte: 820, dpr: 3, kwaliteit: 84 };
/** WebP kan niet hoger dan 16383 px. */
const WEBP_MAX = 16383;

const args = process.argv.slice(2);
const optie = (naam) => { const i = args.indexOf(naam); return i >= 0 ? args.splice(i, 2)[1] : undefined; };
const verberg = optie("--verberg") ?? "";
const alleen = optie("--alleen");
const toestel = optie("--toestel") ?? "monitor";
const telefoonSoort = optie("--telefoon") ?? "warm";
const HERO = HEROS[toestel], TELEFOON = TELEFOONS[telefoonSoort];
if (!HERO) throw new Error(`Onbekend toestel: ${toestel} (monitor of tablet)`);
if (!TELEFOON) throw new Error(`Onbekende telefoonfoto: ${telefoonSoort} (warm of studio)`);
const [slug, url] = args;
if (!slug || !url) {
  console.error('Gebruik: node scripts/mockups/nieuwe-case.mjs <slug> <url> [--toestel monitor|tablet] [--telefoon warm|studio] [--verberg "<css>"] [--alleen hero|telefoon]');
  process.exit(1);
}
mkdirSync(UIT, { recursive: true });
const naam = slug.replace(/-(\w)/g, (_, c) => c.toUpperCase());
let heroMaat;

if (alleen !== "telefoon") {
  console.log(`Hero (${toestel}): full-page screenshot van ${url}`);
  const png = await maakScreenshot({ url, ...HERO, volledig: true, verberg });
  let beeld = sharp(png).resize(HERO.uitBreedte);
  const { info } = await beeld.clone().raw().toBuffer({ resolveWithObject: true });
  if (info.height > WEBP_MAX) {
    console.warn(`  pagina is ${info.height}px hoog na schalen; afgekapt op ${WEBP_MAX}px (WebP-limiet)`);
    beeld = sharp(await beeld.png().toBuffer()).extract({ left: 0, top: 0, width: info.width, height: WEBP_MAX });
  }
  const res = await beeld.webp({ quality: HERO.kwaliteit }).toFile(join(UIT, `${slug}-scherm.webp`));
  heroMaat = [res.width, res.height];
  console.log(`  -> src/assets/cases/${slug}-scherm.webp (${res.width}×${res.height}, ${Math.round(res.size / 1024)} kB)`);
}

let telefoonMaat;
if (alleen !== "hero") {
  console.log(`Telefoon: mobiele screenshot van ${url}`);
  const png = await maakScreenshot({ url, ...MOBIEL, mobiel: true, verberg });
  const scherm = await metStatusbalk(png);
  const foto = await inTelefoon(TELEFOON.basis, scherm, TELEFOON.glans);
  const res = await sharp(foto).webp({ quality: MOBIEL.kwaliteit }).toFile(join(UIT, `${slug}-telefoon.webp`));
  telefoonMaat = [res.width, res.height];
  console.log(`  -> src/assets/cases/${slug}-telefoon.webp (${res.width}×${res.height}, ${Math.round(res.size / 1024)} kB)`);
}

console.log("\nVoeg toe aan src/data/caseMockups.ts:\n");
if (heroMaat) {
  console.log(`import ${naam} from "@/assets/cases/${slug}-scherm.webp";
import ${naam}Set from "@/assets/cases/${slug}-scherm.webp?w=720;1440;1800&format=webp&as=srcset";
// in caseMockups:
  "${slug}": { src: ${naam}, srcSet: ${naam}Set, breedte: ${heroMaat[0]}, hoogte: ${heroMaat[1]}${toestel === "tablet" ? ', toestel: "tablet"' : ""} },\n`);
}
if (telefoonMaat) {
  console.log(`import ${naam}Telefoon from "@/assets/cases/${slug}-telefoon.webp";
import ${naam}TelefoonSet from "@/assets/cases/${slug}-telefoon.webp?w=800;1200;1600;2160&format=webp&as=srcset";
// in caseTelefoons:
  "${slug}": { src: ${naam}Telefoon, srcSet: ${naam}TelefoonSet, breedte: ${telefoonMaat[0]}, hoogte: ${telefoonMaat[1]}, midden: ${TELEFOON.midden}, telefoonHoogte: ${TELEFOON.telefoonHoogte} },`);
}
console.log("\nDaarna: sitemap/lastmod bijwerken en de checks draaien (zie README.md).");
