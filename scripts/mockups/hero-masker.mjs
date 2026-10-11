// Snijdt de hand met telefoon uit een foto met een egale, lichte achtergrond.
//
//   node scripts/mockups/hero-masker.mjs <foto.png>
//
// Uit: basis/hero-hand-groen.webp (de foto, randkleuren zonder de achtergrond) en
// basis/hero-hand-alfa.png (masker, wit = hand en telefoon). Daarna
// hero-telefoon.mjs --alleen-samenstellen draaien.
//
// Waarom zelf: de Higgsfield-achtergrondverwijderaar liet lichte huid half
// doorschijnend. Hier telt de afstand tot de achtergrondkleur (per rij gemeten aan de
// linker- en rechterrand), alleen het grootste aaneengesloten vlak blijft staan en het
// masker krimpt 1 px, zodat er geen licht randje overblijft.

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HIER = dirname(fileURLToPath(import.meta.url));
const [bron] = process.argv.slice(2);
if (!bron) {
  console.error("Gebruik: node scripts/mockups/hero-masker.mjs <foto.png>");
  process.exit(1);
}

const { data: F, info } = await sharp(bron)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const W = info.width,
  H = info.height,
  RAND = 40;

// Achtergrondkleur per rij (links en rechts), lineair over de breedte.
const bg = new Float32Array(H * 6);
for (let y = 0; y < H; y++) {
  for (let c = 0; c < 3; c++) {
    let l = 0,
      r = 0;
    for (let x = 0; x < RAND; x++) {
      l += F[(y * W + x) * 3 + c];
      r += F[(y * W + W - 1 - x) * 3 + c];
    }
    bg[y * 6 + c] = l / RAND;
    bg[y * 6 + 3 + c] = r / RAND;
  }
  // Loopt de arm aan één kant de foto uit, dan is die rand geen achtergrond: neem
  // dan de lichtste van de twee voor beide kanten.
  let verschil = 0,
    lichtL = 0,
    lichtR = 0;
  for (let c = 0; c < 3; c++) {
    verschil = Math.max(verschil, Math.abs(bg[y * 6 + c] - bg[y * 6 + 3 + c]));
    lichtL += bg[y * 6 + c];
    lichtR += bg[y * 6 + 3 + c];
  }
  if (verschil > 20)
    for (let c = 0; c < 3; c++) {
      const v = lichtL > lichtR ? bg[y * 6 + c] : bg[y * 6 + 3 + c];
      bg[y * 6 + c] = v;
      bg[y * 6 + 3 + c] = v;
    }
}
const achtergrond = (x, y, c) => {
  const f = x / (W - 1);
  return bg[y * 6 + c] * (1 - f) + bg[y * 6 + 3 + c] * f;
};
const stap = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// 1. Masker uit de afstand tot de achtergrond.
const A = Buffer.alloc(W * H);
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    const i = y * W + x;
    let d = 0;
    for (let c = 0; c < 3; c++)
      d = Math.max(d, Math.abs(F[i * 3 + c] - achtergrond(x, y, c)));
    A[i] = Math.round(stap(6, 26, d) * 255);
  }

// 2. Alleen het grootste aaneengesloten vlak (op 1/8 schaal gezocht, daarna ruim gehouden).
const S = 8,
  w = Math.ceil(W / S),
  h = Math.ceil(H / S);
const klein = new Uint8Array(w * h);
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++)
    if (A[y * W + x] > 128) klein[((y / S) | 0) * w + ((x / S) | 0)] = 1;
const label = new Int32Array(w * h);
let beste = 0,
  besteMaat = 0,
  n = 0;
for (let s = 0; s < w * h; s++) {
  if (!klein[s] || label[s]) continue;
  n++;
  let maat = 0;
  const rij = [s];
  label[s] = n;
  while (rij.length) {
    const p = rij.pop();
    maat++;
    const px = p % w,
      py = (p / w) | 0;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const qx = px + dx,
        qy = py + dy;
      if (qx < 0 || qy < 0 || qx >= w || qy >= h) continue;
      const q = qy * w + qx;
      if (klein[q] && !label[q]) {
        label[q] = n;
        rij.push(q);
      }
    }
  }
  if (maat > besteMaat) {
    besteMaat = maat;
    beste = n;
  }
}
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    let binnen = false;
    for (let dy = -2; dy <= 2 && !binnen; dy++)
      for (let dx = -2; dx <= 2 && !binnen; dx++) {
        const kx = ((x / S) | 0) + dx,
          ky = ((y / S) | 0) + dy;
        if (
          kx >= 0 &&
          ky >= 0 &&
          kx < w &&
          ky < h &&
          label[ky * w + kx] === beste
        )
          binnen = true;
      }
    if (!binnen) A[y * W + x] = 0;
  }

// 3. Gaten binnen de hand dicht (de telefoon en schaduwen zijn nooit doorzichtig):
//    alles wat niet via achtergrond met de rand verbonden is, wordt dekkend.
const buiten = new Uint8Array(W * H);
const rij = [];
for (let x = 0; x < W; x++) {
  rij.push(x, (H - 1) * W + x);
}
for (let y = 0; y < H; y++) {
  rij.push(y * W, y * W + W - 1);
}
// De onderrand is afgesneden arm, daar begint geen achtergrond.
for (let k = rij.length - 1; k >= 0; k--) {
  const p = rij[k];
  if (A[p] < 128 && !buiten[p]) buiten[p] = 1;
  else rij.splice(k, 1);
}
while (rij.length) {
  const p = rij.pop(),
    px = p % W,
    py = (p / W) | 0;
  for (const q of [
    px + 1 < W ? p + 1 : -1,
    px > 0 ? p - 1 : -1,
    py + 1 < H ? p + W : -1,
    py > 0 ? p - W : -1,
  ]) {
    if (q >= 0 && !buiten[q] && A[q] < 128) {
      buiten[q] = 1;
      rij.push(q);
    }
  }
}
for (let i = 0; i < W * H; i++) if (!buiten[i] && A[i] < 255) A[i] = 255;

// 4. Masker 1 px krimpen (de onderste rijen niet: daar loopt de arm de foto uit).
const B = Buffer.alloc(W * H);
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    if (y >= H - 2) {
      B[y * W + x] = A[y * W + x];
      continue;
    }
    let mn = 255;
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const yy = Math.min(H - 1, Math.max(0, y + dy)),
          xx = Math.min(W - 1, Math.max(0, x + dx));
        mn = Math.min(mn, A[yy * W + xx]);
      }
    B[y * W + x] = mn;
  }

// 5. Randkleuren terugrekenen zonder de achtergrond.
const uit = Buffer.from(F);
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    const i = y * W + x,
      a = B[i] / 255;
    if (a <= 0.05 || a >= 0.98) continue;
    for (let c = 0; c < 3; c++)
      uit[i * 3 + c] = Math.max(
        0,
        Math.min(
          255,
          Math.round((F[i * 3 + c] - (1 - a) * achtergrond(x, y, c)) / a),
        ),
      );
  }

await sharp(uit, { raw: { width: W, height: H, channels: 3 } })
  .webp({ quality: 95 })
  .toFile(join(HIER, "basis/hero-hand-groen.webp"));
await sharp(B, { raw: { width: W, height: H, channels: 1 } })
  .png({ compressionLevel: 9 })
  .toFile(join(HIER, "basis/hero-hand-alfa.png"));
console.log(
  `basis/hero-hand-groen.webp en basis/hero-hand-alfa.png (${W}×${H})`,
);
