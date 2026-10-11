// Telefoon in de hand voor de homepage-hero (src/components/golf/HeroTelefoon.tsx):
// een uitgesneden hand met iPhone waarvan het scherm doorzichtig is, en per site een
// mobiele screenshot die in de hero achter dat gat langs scrolt.
//
//   node scripts/mockups/hero-telefoon.mjs [--alleen-screenshots] [--alleen-samenstellen]
//
// Invoer (zie hero-masker.mjs):
//   basis/hero-hand-groen.webp   de foto met groen scherm
//   basis/hero-hand-alfa.png     het masker (wit = hand en telefoon)
// Uit:
//   src/assets/hero/hero-hand.webp           hand + telefoon, scherm doorzichtig, 1400 breed
//   src/assets/hero/hero-scherm-<slug>.webp  mobiele screenshot met statusbalk, 720 breed
//   src/data/heroTelefoon.json               plaats en afronding van het scherm in hero-hand.webp
//
// De screenshots staan eerst in basis/hero-scherm-<slug>.png (niet in git), zodat
// samenstellen opnieuw kan zonder de sites opnieuw te bezoeken.

import { existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { maakScreenshot } from "./screenshot.mjs";
import { metStatusbalk, vindScherm, SCHERM } from "./telefoon.mjs";

const HIER = dirname(fileURLToPath(import.meta.url));
const ASSETS = join(HIER, "../../src/assets/hero");
const DATA = join(HIER, "../../src/data/heroTelefoon.json");
const BASIS = join(HIER, "basis/hero-hand-groen.webp");
const ALFA = join(HIER, "basis/hero-hand-alfa.png");

/** De drie sites op de telefoon, in de volgorde waarin ze voorbij scrollen. */
export const SITES = [
  { slug: "danique-kwakman", url: "https://daniquekwakman.nl" },
  { slug: "kyodai-originals", url: "https://www.kyodaioriginals.nl" },
  { slug: "puur-in-harmonie", url: "https://www.puurinharmonie.nl" },
];

/** Zelfde mobiele screenshot als bij de cases: 402×820 pt @3x, statusbalk erbij. */
const MOBIEL = { breedte: 402, hoogte: 820, dpr: 3 };
const HAND_BREEDTE = 1400;
const SCHERM_BREEDTE = 720;

const args = process.argv.slice(2);
const alleenScreenshots = args.includes("--alleen-screenshots");
const alleenSamenstellen = args.includes("--alleen-samenstellen");

// 1. Screenshots.
for (const { slug, url } of SITES) {
  const schermPad = join(HIER, `basis/hero-scherm-${slug}.png`);
  if (!alleenSamenstellen) {
    console.log(`Screenshot: ${url}`);
    const png = await maakScreenshot({ url, ...MOBIEL, mobiel: true });
    await sharp(await metStatusbalk(png)).toFile(schermPad);
  }
  if (alleenScreenshots) continue;
  if (!existsSync(schermPad))
    throw new Error(
      `${schermPad} ontbreekt; draai eerst zonder --alleen-samenstellen`,
    );
  const res = await sharp(schermPad)
    .resize(SCHERM_BREEDTE)
    .webp({ quality: 82 })
    .toFile(join(ASSETS, `hero-scherm-${slug}.webp`));
  console.log(
    `  -> src/assets/hero/hero-scherm-${slug}.webp (${res.width}×${res.height}, ${Math.round(res.size / 1024)} kB)`,
  );
}
if (alleenScreenshots) process.exit(0);

// 2. Hand met doorzichtig scherm.
if (!existsSync(BASIS) || !existsSync(ALFA))
  throw new Error("basis/hero-hand-groen.webp of hero-hand-alfa.png ontbreekt");
const { data: F, info } = await sharp(BASIS)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const W = info.width,
  H = info.height;
const { groen, hoeken, radius } = vindScherm(F, W, H, "groen");
const A = await sharp(ALFA)
  .resize(W, H, { fit: "fill" })
  .extractChannel(0)
  .raw()
  .toBuffer();

// Kleur van het groene scherm (gemiddelde van de volledig groene pixels).
const sg = [0, 0, 0];
let ng = 0;
for (let i = 0; i < W * H; i++)
  if (groen[i] >= 1) {
    for (let c = 0; c < 3; c++) sg[c] += F[i * 3 + c];
    ng++;
  }
for (let c = 0; c < 3; c++) sg[c] /= ng;

const rgba = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  const g = groen[i];
  for (let c = 0; c < 3; c++) {
    let v = F[i * 3 + c];
    // Halfgroene randpixels: het groen eruit rekenen, wat overblijft is de rand.
    if (g > 0 && g < 1) v = (v - g * sg[c]) / (1 - g);
    rgba[i * 4 + c] = Math.max(0, Math.min(255, Math.round(v)));
  }
  rgba[i * 4 + 3] = g >= 1 ? 0 : Math.round(A[i] * (1 - g));
}
const { data: bijgesneden, info: bij } = await sharp(rgba, {
  raw: { width: W, height: H, channels: 4 },
})
  .trim({ threshold: 0 })
  .png()
  .toBuffer({ resolveWithObject: true });
const links = -(bij.trimOffsetLeft ?? 0),
  boven = -(bij.trimOffsetTop ?? 0);
const res = await sharp(bijgesneden)
  .resize(HAND_BREEDTE)
  .webp({ quality: 88, alphaQuality: 95 })
  .toFile(join(ASSETS, "hero-hand.webp"));
console.log(
  `  -> src/assets/hero/hero-hand.webp (${res.width}×${res.height}, ${Math.round(res.size / 1024)} kB)`,
);

// 3. Plaats van het scherm als percentage van hero-hand.webp.
const xs = hoeken.map((p) => p[0]),
  ys = hoeken.map((p) => p[1]);
const x0 = Math.min(...xs) - links,
  x1 = Math.max(...xs) - links;
const y0 = Math.min(...ys) - boven,
  y1 = Math.max(...ys) - boven;
const pct = (v, totaal) => Math.round((v / totaal) * 100000) / 1000;
const maat = {
  breedte: res.width,
  hoogte: res.height,
  scherm: {
    links: pct(x0, bij.width),
    boven: pct(y0, bij.height),
    breedte: pct(x1 - x0, bij.width),
    hoogte: pct(y1 - y0, bij.height),
    /** Hoekafronding als percentage van de schermbreedte. */
    radius: pct(radius, x1 - x0),
  },
  /** Hoogte van de statusbalk als percentage van de schermhoogte. */
  statusbalk: pct(SCHERM.statusbalk, SCHERM.hoogte),
  sites: SITES.map((s) => s.slug),
};
writeFileSync(DATA, JSON.stringify(maat, null, 2) + "\n");
console.log("  -> src/data/heroTelefoon.json", JSON.stringify(maat.scherm));
