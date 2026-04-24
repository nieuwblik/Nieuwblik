import sharp from 'sharp';
import { stat } from 'fs/promises';
import { resolve } from 'path';

// [input, output, maxWidth, quality]
const tasks = [
  // AI logos (used in homepage)
  ['src/assets/ai/copilot-logo.png', 'src/assets/ai/copilot-logo.webp', 400, 82],
  ['src/assets/ai/claude-logo.png', 'src/assets/ai/claude-logo.webp', 400, 82],
  ['src/assets/ai/grok-logo.png', 'src/assets/ai/grok-logo.webp', 400, 82],
  ['src/assets/ai/perplexity-logo.png', 'src/assets/ai/perplexity-logo.webp', 400, 82],
  // Tools
  ['src/assets/tools/gemini-logo.png', 'src/assets/tools/gemini-logo.webp', 400, 82],
  ['src/assets/tools/figma-logo.png', 'src/assets/tools/figma-logo.webp', 400, 82],
  ['src/assets/tools/hadoseo-logo.png', 'src/assets/tools/hadoseo-logo.webp', 400, 82],
  ['src/assets/tools/lovable-logo.png', 'src/assets/tools/lovable-logo.webp', 400, 82],
  // Hero / brand
  ['src/assets/justin-slok.png', 'src/assets/justin-slok.webp', 800, 82],
  ['src/assets/logo.png', 'src/assets/logo.webp', 400, 90],
  // Blog images
  ['src/assets/blog/lovable-logo.png', 'src/assets/blog/lovable-logo.webp', 600, 82],
  ['src/assets/blog/cursor-logo.png', 'src/assets/blog/cursor-logo.webp', 600, 82],
  ['src/assets/blog/claude-logo.png', 'src/assets/blog/claude-logo.webp', 600, 82],
  ['src/assets/blog/bolt-logo.png', 'src/assets/blog/bolt-logo.webp', 600, 82],
  ['src/assets/blog/replit-logo.png', 'src/assets/blog/replit-logo.webp', 600, 82],
  ['src/assets/blog/stripe-logo.png', 'src/assets/blog/stripe-logo.webp', 600, 82],
  ['src/assets/blog/supabase-logo.png', 'src/assets/blog/supabase-logo.webp', 600, 82],
  ['src/assets/blog/vibecode-hadoseo.png', 'src/assets/blog/vibecode-hadoseo.webp', 1200, 80],
];

// Re-compress oversized webps in place
const recompress = [
  ['src/assets/blog/nieuwblik-x-benoted-phone.webp', 1000, 78],
  ['src/assets/blog/nieuwblik-sponsor-madjoe.webp', 1200, 78],
  ['src/assets/blog/nieuwblik-x-benoted-macbook.webp', 1200, 78],
  ['src/assets/blog/nieuwblik-x-benoted-cover.webp', 1200, 78],
  ['src/assets/blog/brand-storytelling.jpg', 1200, 78],
];

const k = (b) => (b / 1024).toFixed(1) + 'KB';

for (const [inP, outP, w, q] of tasks) {
  try {
    const before = (await stat(resolve(inP))).size;
    await sharp(resolve(inP))
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: q, effort: 6 })
      .toFile(resolve(outP));
    const after = (await stat(resolve(outP))).size;
    console.log(`✓ ${outP}  ${k(before)} → ${k(after)}`);
  } catch (e) {
    console.log(`✗ ${inP}: ${e.message}`);
  }
}

for (const [p, w, q] of recompress) {
  try {
    const abs = resolve(p);
    const before = (await stat(abs)).size;
    const tmp = abs + '.tmp';
    const isJpg = p.endsWith('.jpg') || p.endsWith('.jpeg');
    let pipeline = sharp(abs).resize({ width: w, withoutEnlargement: true });
    pipeline = isJpg ? pipeline.jpeg({ quality: q, mozjpeg: true }) : pipeline.webp({ quality: q, effort: 6 });
    await pipeline.toFile(tmp);
    const after = (await stat(tmp)).size;
    if (after < before) {
      const { rename } = await import('fs/promises');
      await rename(tmp, abs);
      console.log(`✓ recompressed ${p}  ${k(before)} → ${k(after)}`);
    } else {
      const { unlink } = await import('fs/promises');
      await unlink(tmp);
      console.log(`= ${p} kept (${k(before)})`);
    }
  } catch (e) {
    console.log(`✗ ${p}: ${e.message}`);
  }
}
