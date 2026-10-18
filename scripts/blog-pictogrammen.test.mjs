import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';

for (const name of ['website-kosten', 'website-checklist', 'website-doorlooptijd', 'website-vernieuwen', 'wordpress-snelheid', 'website-zzp']) {
  test(`${name}: maximaal 50 kB`, async () => {
    const file = new URL(`../src/assets/blog/${name}.webp`, import.meta.url);
    const { size } = await stat(file);
    assert.ok(size > 0 && size <= 50_000, `${name} is ${size} bytes`);
  });
}