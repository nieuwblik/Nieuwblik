import sharp from 'sharp';
import { stat, rename, unlink, readdir } from 'fs/promises';
import { resolve, join, extname } from 'path';
const DIR = resolve('src/assets/recente-projecten');
const files = await readdir(DIR);
const renames = [];
for (const name of files) {
  const path = join(DIR, name);
  const ext = extname(name).toLowerCase();
  if (!['.png','.jpg','.jpeg','.webp'].includes(ext)) continue;
  const before = (await stat(path)).size;
  if (before < 50*1024) { console.log(`skip ${name}`); continue; }
  try {
    if (ext === '.png') {
      const newPath = path.replace(/\.png$/i, '.webp');
      await sharp(path).resize({width:1200, withoutEnlargement:true}).webp({quality:80, effort:6}).toFile(newPath+'.tmp');
      const after = (await stat(newPath+'.tmp')).size;
      await rename(newPath+'.tmp', newPath);
      await unlink(path);
      renames.push([name, name.replace(/\.png$/i, '.webp')]);
      console.log(`PNG→WEBP ${name} ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB`);
    } else {
      const tmp = path+'.tmp';
      await sharp(path).resize({width:1200, withoutEnlargement:true}).webp({quality:78, effort:6}).toFile(tmp);
      const after = (await stat(tmp)).size;
      if (after < before) { await rename(tmp, path); console.log(`WEBP ${name} ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB`); }
      else { await unlink(tmp); console.log(`= ${name}`); }
    }
  } catch(e) { console.log(`✗ ${name}: ${e.message}`); }
}
console.log('renames:', renames);
