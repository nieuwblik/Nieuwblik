import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import { readdir } from 'node:fs/promises';

for (const name of ['website-kosten', 'website-checklist', 'website-doorlooptijd', 'website-vernieuwen', 'wordpress-snelheid', 'website-zzp']) {
  test(`${name}: maximaal 50 kB`, async () => {
    const file = new URL(`../src/assets/blog/${name}.webp`, import.meta.url);
    const { size } = await stat(file);
    assert.ok(size > 0 && size <= 50_000, `${name} is ${size} bytes`);
  });
}

const assets = new URL('../src/assets/blog/', import.meta.url);
for (const name of (await readdir(assets)).filter((name) => name.startsWith('pictogram-') && name.endsWith('.webp'))) {
  test(`${name}: maximaal 50 kB`, async () => {
    const { size } = await stat(new URL(name, assets));
    assert.ok(size > 0 && size <= 50_000, `${name} is ${size} bytes`);
  });
}