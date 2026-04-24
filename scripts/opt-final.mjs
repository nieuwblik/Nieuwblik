import sharp from 'sharp';
import { stat, rename, unlink } from 'fs/promises';
import { resolve } from 'path';
const tasks = [
  ['public/og-image.webp', 1200, 78],
  ['src/assets/justin-job-compressed.webp', 1000, 80],
];
for (const [p, w, q] of tasks) {
  const abs = resolve(p);
  const before = (await stat(abs)).size;
  const tmp = abs + '.tmp';
  await sharp(abs).resize({width:w, withoutEnlargement:true}).webp({quality:q, effort:6}).toFile(tmp);
  const after = (await stat(tmp)).size;
  if (after < before) { await rename(tmp, abs); console.log(`${p}  ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB`); }
  else { await unlink(tmp); console.log(`= ${p} kept`); }
}
