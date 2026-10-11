// Telefoon in de hand voor de homepage-hero (GolfHero): een uitgesneden hand met
// iPhone, met per site een mobiele screenshot in het scherm.
//
//   node scripts/mockups/hero-telefoon.mjs [--alleen-screenshots] [--alleen-samenstellen]
//
// Invoer:
//   basis/hero-hand-groen.webp      de foto met groen scherm (Higgsfield, zie README)
//   basis/hero-hand-alfa.png        dezelfde foto uitgesneden (achtergrond verwijderd)
// Uit (src/assets/hero/):
//   hero-telefoon-<slug>.webp       hand + telefoon met de site, transparante achtergrond
//
// De screenshots komen eerst in scripts/mockups/basis/hero-scherm-<slug>.png, zodat
// samenstellen opnieuw kan zonder de sites opnieuw te bezoeken.

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { maakScreenshot } from "./screenshot.mjs";
import { metStatusbalk, inTelefoon, GLANS } from "./telefoon.mjs";

const HIER = dirname(fileURLToPath(import.meta.url));
const UIT = join(HIER, "../../src/assets/hero");
const BASIS = join(HIER, "basis/hero-hand-groen.webp");
const ALFA = join(HIER, "basis/hero-hand-alfa.png");

/** De drie sites op de telefoon, in de volgorde waarin ze wisselen. */
export const SITES = [
  { slug: "danique-kwakman", url: "https://daniquekwakman.nl" },
  { slug: "kyodai-originals", url: "https://www.kyodaioriginals.nl" },
  { slug: "puur-in-harmonie", url: "https://www.puurinharmonie.nl" },
];

/** Zelfde mobiele screenshot als bij de cases: 402×820 pt @3x, statusbalk erbij. */
const MOBIEL = { breedte: 402, hoogte: 820, dpr: 3 };
/** Breedte van het eindbeeld; de hero toont de telefoon hooguit ~600 px breed (2x). */
const UIT_BREEDTE = 1400;

const args = process.argv.slice(2);
const alleenScreenshots = args.includes("--alleen-screenshots");
const alleenSamenstellen = args.includes("--alleen-samenstellen");

for (const { slug, url } of SITES) {
  const schermPad = join(HIER, `basis/hero-scherm-${slug}.png`);
  if (!alleenSamenstellen) {
    console.log(`Screenshot: ${url}`);
    const png = await maakScreenshot({ url, ...MOBIEL, mobiel: true });
    await sharp(await metStatusbalk(png)).toFile(schermPad);
  }
  if (alleenScreenshots) continue;
  if (!existsSync(BASIS) || !existsSync(ALFA))
    throw new Error(
      "basis/hero-hand-groen.webp of hero-hand-alfa.png ontbreekt",
    );

  // Site in het groene scherm, dan de alfa van de uitgesneden foto eroverheen.
  const foto = await inTelefoon(BASIS, schermPad, GLANS.studio);
  const { width: W, height: H } = await sharp(foto).metadata();
  // Het masker is een grijswaardenbeeld (wit = hand en telefoon).
  // Ruwe buffers: sharp voert removeAlpha() pas aan het eind van een pipeline uit,
  // dus in één keten zou het nieuwe alfakanaal er weer af gaan.
  const alfa = await sharp(ALFA)
    .resize(W, H, { fit: "fill" })
    .extractChannel(0)
    .raw()
    .toBuffer();
  const rgb = await sharp(foto).removeAlpha().raw().toBuffer();
  const rgba = await sharp(rgb, { raw: { width: W, height: H, channels: 3 } })
    .joinChannel(alfa, { raw: { width: W, height: H, channels: 1 } })
    .png()
    .toBuffer();
  const res = await sharp(rgba)
    .trim({ threshold: 0 })
    .resize(UIT_BREEDTE)
    .webp({ quality: 86, alphaQuality: 90 })
    .toFile(join(UIT, `hero-telefoon-${slug}.webp`));
  console.log(
    `  -> src/assets/hero/hero-telefoon-${slug}.webp (${res.width}×${res.height}, ${Math.round(res.size / 1024)} kB)`,
  );
}
