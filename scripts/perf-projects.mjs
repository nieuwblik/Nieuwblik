import sharp from 'sharp';
import { stat, rename, unlink, readdir } from 'fs/promises';
import { resolve, join, extname } from 'path';

const DIR = resolve('src/assets/projects');
const MAX_W = 1400; // listings, mockups
const Q_WEBP = 78;
const Q_JPG = 78;

const k = (b) => (b / 1024).toFixed(1) + 'KB';

const files = await readdir(DIR);
const generatedWebpFromPng = []; // [oldPng, newWebp]

for (const name of files) {
  const path = join(DIR, name);
  const ext = extname(name).toLowerCase();
  if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) continue;

  const before = (await stat(path)).size;
  // skip very small files
  if (before < 50 * 1024) { console.log(`skip small: ${name} (${k(before)})`); continue; }

  try {
    if (ext === '.png') {
      // Convert PNG → WebP (new file, same basename .webp), then delete PNG
      const newPath = path.replace(/\.png$/i, '.webp');
      await sharp(path)
        .resize({ width: MAX_W, withoutEnlargement: true })
        .webp({ quality: Q_WEBP, effort: 6 })
        .toFile(newPath + '.tmp');
      const after = (await stat(newPath + '.tmp')).size;
      // Move tmp into place (may overwrite if .webp already exists)
      await rename(newPath + '.tmp', newPath);
      await unlink(path);
      generatedWebpFromPng.push([name, name.replace(/\.png$/i, '.webp')]);
      console.log(`PNG→WEBP ${name}  ${k(before)} → ${k(after)}`);
    } else if (ext === '.jpg' || ext === '.jpeg') {
      const tmp = path + '.tmp';
      await sharp(path)
        .resize({ width: MAX_W, withoutEnlargement: true })
        .jpeg({ quality: Q_JPG, mozjpeg: true })
        .toFile(tmp);
      const after = (await stat(tmp)).size;
      if (after < before) {
        await rename(tmp, path);
        console.log(`JPG  ${name}  ${k(before)} → ${k(after)}`);
      } else {
        await unlink(tmp);
        console.log(`= ${name} kept (${k(before)})`);
      }
    } else if (ext === '.webp') {
      const tmp = path + '.tmp';
      await sharp(path)
        .resize({ width: MAX_W, withoutEnlargement: true })
        .webp({ quality: Q_WEBP, effort: 6 })
        .toFile(tmp);
      const after = (await stat(tmp)).size;
      if (after < before) {
        await rename(tmp, path);
        console.log(`WEBP ${name}  ${k(before)} → ${k(after)}`);
      } else {
        await unlink(tmp);
        console.log(`= ${name} kept (${k(before)})`);
      }
    }
  } catch (e) {
    console.log(`✗ ${name}: ${e.message}`);
  }
}

console.log('\n--- PNG→WEBP renames (update imports) ---');
for (const [oldN, newN] of generatedWebpFromPng) console.log(`${oldN}  →  ${newN}`);
