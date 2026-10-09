// Mobiele screenshot in de telefoonfoto zetten: statusbalk erboven, groen scherm
// opsporen en de screenshot er met perspectief (homografie) in leggen.
import sharp from "sharp";

/** iPhone-scherm in pixels (402×874 punten @3x) en de statusbalk (54 pt). */
export const SCHERM = { breedte: 1206, hoogte: 2622, statusbalk: 162 };

/**
 * Zet een statusbalk (9:41, bereik, wifi, batterij) boven een mobiele screenshot
 * van 402×820 @3x. Kleur van de balk = gemiddelde van de bovenste pixelrijen van de site.
 */
export async function metStatusbalk(sitePng) {
  const { breedte: W, hoogte: H, statusbalk: SB } = SCHERM;
  const meta = await sharp(sitePng).metadata();
  const rij = await sharp(sitePng).extract({ left: 0, top: 0, width: meta.width, height: 6 }).removeAlpha().raw().toBuffer();
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < rij.length; i += 3) { r += rij[i]; g += rij[i + 1]; b += rij[i + 2]; }
  const n = rij.length / 3;
  const kleur = `rgb(${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)})`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${SB}">
  <rect width="100%" height="100%" fill="${kleur}"/>
  <text x="168" y="102" font-family="Segoe UI, Arial, sans-serif" font-weight="600" font-size="52" fill="#fff" text-anchor="middle">9:41</text>
  <g fill="#fff" transform="translate(842,64)">
    <rect x="0" y="27" width="9" height="12" rx="2"/><rect x="14" y="20" width="9" height="19" rx="2"/>
    <rect x="28" y="12" width="9" height="27" rx="2"/><rect x="42" y="4" width="9" height="35" rx="2"/>
  </g>
  <g transform="translate(938,66)" fill="#fff">
    <path d="M24 36 l-7-7 a10 10 0 0 1 14 0z"/>
    <path d="M10 22 a20 20 0 0 1 28 0 l-5 5 a13 13 0 0 0 -18 0z"/>
    <path d="M2 14 a31 31 0 0 1 44 0 l-5 5 a24 24 0 0 0 -34 0z"/>
  </g>
  <g transform="translate(1004,64)">
    <rect x="1.5" y="1.5" width="70" height="35" rx="11" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="3"/>
    <rect x="6" y="6" width="61" height="26" rx="7" fill="#fff"/>
    <rect x="76" y="13" width="5" height="12" rx="2.5" fill="#fff" fill-opacity="0.45"/>
  </g>
</svg>`;
  const site = await sharp(sitePng).resize(W, H - SB, { fit: "cover", position: "top" }).toBuffer();
  return sharp({ create: { width: W, height: H, channels: 3, background: kleur } })
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }, { input: site, top: SB, left: 0 }])
    .png().toBuffer();
}

/** Lost de homografie op die 4 bronpunten op 4 doelpunten afbeeldt. */
function homografie(bron, doel) {
  const A = [], bv = [];
  for (let i = 0; i < 4; i++) {
    const [u, v] = bron[i], [x, y] = doel[i];
    A.push([u, v, 1, 0, 0, 0, -u * x, -v * x]); bv.push(x);
    A.push([0, 0, 0, u, v, 1, -u * y, -v * y]); bv.push(y);
  }
  for (let c = 0; c < 8; c++) {
    let m = c; for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[m][c])) m = r;
    [A[c], A[m]] = [A[m], A[c]]; [bv[c], bv[m]] = [bv[m], bv[c]];
    for (let r = 0; r < 8; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k]; bv[r] -= f * bv[c]; }
  }
  return [...bv.map((v, i) => v / A[i][i]), 1];
}

/**
 * Glans op het glas, per soort foto.
 * - warm: buiten in de zon (Taxi Drechterland): warme diagonale glans, zwarten iets opgetild.
 * - studio: zacht diffuus studiolicht (Feigro): neutrale, lichtere glans.
 */
export const GLANS = {
  warm: { kleur: [255, 236, 205], sterkte: 0.09, onder: 0.03, optillen: 5, contrast: 0.97 },
  studio: { kleur: [255, 255, 255], sterkte: 0.06, onder: 0.015, optillen: 3, contrast: 0.98 },
};

/**
 * Zoekt het egale #00FF00 scherm in een foto (ook schuin of in perspectief): de
 * rechte middenstukken van de vier randen worden gefit, de hoeken zijn hun
 * snijpunten (dus zonder afronding). `radius` is de afronding van de schermhoeken
 * in fotopixels, gemeten langs de diagonaal van de linkerbovenhoek.
 */
export function vindScherm(F, W, H) {
  const groen = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const d = F[i * 3 + 1] - Math.max(F[i * 3], F[i * 3 + 2]);
    groen[i] = Math.max(0, Math.min(1, (d - 40) / 90));
  }
  const isGroen = (x, y) => groen[y * W + x] > 0.5;
  let minY = H, maxY = 0, minX = W, maxX = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (isGroen(x, y)) { minY = Math.min(minY, y); maxY = Math.max(maxY, y); minX = Math.min(minX, x); maxX = Math.max(maxX, x); }
  if (minY > maxY) throw new Error("Geen groen scherm gevonden in de foto.");

  const rand = [];
  for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++)
    if (isGroen(x, y) && (!isGroen(x - 1, y) || !isGroen(x + 1, y) || !isGroen(x, y - 1) || !isGroen(x, y + 1))) rand.push([x, y]);
  const extreem = (f) => rand.reduce((m, p) => (f(p) > f(m) ? p : m));
  const ruw = { lb: extreem(([x, y]) => -(x + y)), rb: extreem(([x, y]) => x - y), ro: extreem(([x, y]) => x + y), lo: extreem(([x, y]) => y - x) };
  const midden = [(ruw.lb[0] + ruw.rb[0] + ruw.ro[0] + ruw.lo[0]) / 4, (ruw.lb[1] + ruw.rb[1] + ruw.ro[1] + ruw.lo[1]) / 4];
  // Per stap langs een zijde alleen het buitenste randpunt (zo telt een Dynamic Island niet mee).
  const zijde = (a, b) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], len2 = dx * dx + dy * dy, len = Math.sqrt(len2);
    let nx = dy / len, ny = -dx / len;
    if ((midden[0] - a[0]) * nx + (midden[1] - a[1]) * ny > 0) { nx = -nx; ny = -ny; }
    const beste = new Map();
    for (const [x, y] of rand) {
      const t = ((x - a[0]) * dx + (y - a[1]) * dy) / len2;
      if (t <= 0.2 || t >= 0.8) continue;
      const d = (x - a[0]) * nx + (y - a[1]) * ny;
      if (d < -80) continue;
      const k = Math.round(t * len);
      if (!beste.has(k) || d > beste.get(k).d) beste.set(k, { d, p: [x, y] });
    }
    return [...beste.values()].map((v) => v.p);
  };
  const fit = (pts, swap) => {
    let n = 0, sx = 0, sy = 0, sxx = 0, sxy = 0;
    for (const [px, py] of pts) { const u = swap ? py : px, v = swap ? px : py; n++; sx += u; sy += v; sxx += u * u; sxy += u * v; }
    const p = (n * sxy - sx * sy) / (n * sxx - sx * sx); return { p, q: (sy - p * sx) / n };
  };
  const L = fit(zijde(ruw.lb, ruw.lo), true), R = fit(zijde(ruw.rb, ruw.ro), true);
  const T = fit(zijde(ruw.lb, ruw.rb), false), B = fit(zijde(ruw.lo, ruw.ro), false);
  const snij = (z, h) => { const y = (h.p * z.q + h.q) / (1 - h.p * z.p); return [z.p * y + z.q, y]; };
  const hoeken = [snij(L, T), snij(R, T), snij(R, B), snij(L, B)];

  // Hoekafronding: vanaf de scherpe hoek langs de diagonaal naar binnen tot het eerste groen.
  // Bij een cirkelboog met straal r is die afstand r·(√2 − 1).
  const [hx, hy] = hoeken[0];
  const lx = midden[0] - hx, ly = midden[1] - hy, ll = Math.hypot(lx, ly);
  let afstand = 0;
  while (afstand < ll && !isGroen(Math.round(hx + (lx / ll) * afstand), Math.round(hy + (ly / ll) * afstand))) afstand += 0.25;
  const radius = afstand / (Math.SQRT2 - 1);

  return { groen, grens: { minX, maxX, minY, maxY }, hoeken, radius };
}

/**
 * Legt `schermPng` (1206×2622) in het groene scherm van `fotoPad`, met perspectief
 * (homografie) en 4x supersampling. Afgeronde hoeken en het Dynamic Island blijven
 * staan omdat alleen groene pixels vervangen worden. Daarna glans op het glas
 * (zie GLANS) en de groene zweem van de randen. Geeft een PNG-buffer terug.
 */
export async function inTelefoon(fotoPad, schermPng, glans = GLANS.warm) {
  const foto = await sharp(fotoPad).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = foto.info.width, H = foto.info.height, F = foto.data;
  const { groen, grens: { minX, maxX, minY, maxY }, hoeken } = vindScherm(F, W, H);
  console.log("  schermhoeken in de foto:", hoeken.map(([x, y]) => `${Math.round(x)},${Math.round(y)}`).join("  "));

  const scherm = await sharp(schermPng).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const SW = scherm.info.width, SH = scherm.info.height, S = scherm.data;
  const Hi = homografie(hoeken, [[0, 0], [SW, 0], [SW, SH], [0, SH]]);
  const naarScherm = (px, py) => { const w = Hi[6] * px + Hi[7] * py + 1; return [(Hi[0] * px + Hi[1] * py + Hi[2]) / w, (Hi[3] * px + Hi[4] * py + Hi[5]) / w]; };
  const sample = (u, v, k) => {
    u = Math.max(0, Math.min(SW - 1.001, u - 0.5)); v = Math.max(0, Math.min(SH - 1.001, v - 0.5));
    const x0 = Math.floor(u), y0 = Math.floor(v), fx = u - x0, fy = v - y0, i = (y0 * SW + x0) * 3;
    return S[i + k] * (1 - fx) * (1 - fy) + S[i + 3 + k] * fx * (1 - fy) + S[i + SW * 3 + k] * (1 - fx) * fy + S[i + SW * 3 + 3 + k] * fx * fy;
  };

  const uit = Buffer.from(F), marge = 8;
  const SS = [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]];
  for (let y = Math.max(0, minY - marge); y <= Math.min(H - 1, maxY + marge); y++) {
    for (let x = Math.max(0, minX - marge); x <= Math.min(W - 1, maxX + marge); x++) {
      const i = y * W + x, a = groen[i];
      if (a <= 0) continue;
      const kleur = [0, 0, 0];
      for (const [ox, oy] of SS) { const [u, v] = naarScherm(x + ox, y + oy); for (let k = 0; k < 3; k++) kleur[k] += sample(u, v, k) / 4; }
      // Glas: zwarten iets opgetild en een zachte diagonale glans.
      const [u, v] = naarScherm(x + 0.5, y + 0.5);
      const g = glans.sterkte * Math.exp(-((((u / SW) * 0.9 + (v / SH) * 0.55 - 0.42) / 0.2) ** 2)) + glans.onder * (1 - v / SH);
      for (let k = 0; k < 3; k++) kleur[k] = kleur[k] * glans.contrast + glans.optillen + (glans.kleur[k] - kleur[k]) * g;
      const onder = [F[i * 3], Math.min(F[i * 3 + 1], Math.max(F[i * 3], F[i * 3 + 2])), F[i * 3 + 2]];
      for (let k = 0; k < 3; k++) uit[i * 3 + k] = Math.round(Math.max(0, Math.min(255, kleur[k] * a + onder[k] * (1 - a))));
    }
  }
  ontgroenRand(uit, groen, W, H, { minX, maxX, minY, maxY }, marge);
  return sharp(uit, { raw: { width: W, height: H, channels: 3 } }).png().toBuffer();
}

/** Groene zweem op de rand net buiten het scherm (bezel) neutraliseren. */
function ontgroenRand(uit, groen, W, H, { minX, maxX, minY, maxY }, marge) {
  for (let y = Math.max(1, minY - marge); y <= Math.min(H - 2, maxY + marge); y++) {
    for (let x = Math.max(1, minX - marge); x <= Math.min(W - 2, maxX + marge); x++) {
      const i = y * W + x; if (groen[i] > 0) continue;
      const r = uit[i * 3], g = uit[i * 3 + 1], b = uit[i * 3 + 2];
      if (g > Math.max(r, b) + 12) uit[i * 3 + 1] = Math.max(r, b) + 12;
    }
  }
}

/**
 * Voor een toestel waarvan de site in code in het scherm komt (tablet-hero): maakt
 * het groene scherm zwart (toestel uit) en geeft de schermhoeken als fractie van de
 * foto, de verhouding van het scherm en de hoekafronding als fractie van de
 * schermbreedte. Plus een masker (PNG, wit met als alfa de groenheid, halve
 * resolutie): in CSS over het scherm gelegd blijft alles wat in de foto vóór het
 * scherm zit (een duim op de rand) ook vóór de site.
 * Geeft { png, masker, hoeken, verhouding, radius, breedte, hoogte } terug.
 */
export async function schermUit(fotoPad, zwart = [8, 8, 9]) {
  const foto = await sharp(fotoPad).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = foto.info.width, H = foto.info.height, F = foto.data;
  const { groen, grens, hoeken, radius } = vindScherm(F, W, H);
  const uit = Buffer.from(F);
  for (let i = 0; i < W * H; i++) {
    const a = groen[i];
    if (a <= 0) continue;
    const onder = [F[i * 3], Math.min(F[i * 3 + 1], Math.max(F[i * 3], F[i * 3 + 2])), F[i * 3 + 2]];
    for (let k = 0; k < 3; k++) uit[i * 3 + k] = Math.round(zwart[k] * a + onder[k] * (1 - a));
  }
  ontgroenRand(uit, groen, W, H, grens, 8);
  const [lb, rb, ro, lo] = hoeken;
  const breedteScherm = (Math.hypot(rb[0] - lb[0], rb[1] - lb[1]) + Math.hypot(ro[0] - lo[0], ro[1] - lo[1])) / 2;
  const hoogteScherm = (Math.hypot(lo[0] - lb[0], lo[1] - lb[1]) + Math.hypot(ro[0] - rb[0], ro[1] - rb[1])) / 2;
  const alfa = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) { alfa[i * 4] = alfa[i * 4 + 1] = alfa[i * 4 + 2] = 255; alfa[i * 4 + 3] = Math.round(groen[i] * 255); }
  return {
    png: await sharp(uit, { raw: { width: W, height: H, channels: 3 } }).png().toBuffer(),
    masker: await sharp(alfa, { raw: { width: W, height: H, channels: 4 } }).resize(Math.round(W / 2)).png({ compressionLevel: 9 }).toBuffer(),
    hoeken: hoeken.map(([x, y]) => [x / W, y / H]),
    verhouding: breedteScherm / hoogteScherm,
    radius: radius / breedteScherm,
    breedte: W,
    hoogte: H,
  };
}
