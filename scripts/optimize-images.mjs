/**
 * Builds WebP renditions of every product photo: a 900px main view and a 220px
 * thumbnail. The gallery serves the small file to the thumbnail grid instead of
 * pulling five full-size JPEGs on a phone.
 *
 * Run with: node scripts/optimize-images.mjs
 */
import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.join(process.cwd(), 'public', 'images');
const SIZES = [
  { suffix: '-900', width: 900, quality: 78 },
  { suffix: '-220', width: 220, quality: 72 },
];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('._')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(jpe?g|png)$/i.test(entry.name)) yield full;
  }
}

let made = 0;
let saved = 0;

for await (const file of walk(ROOT)) {
  const dir = path.dirname(file);
  const base = path.basename(file).replace(/\.(jpe?g|png)$/i, '');
  await mkdir(dir, { recursive: true });

  for (const size of SIZES) {
    const out = path.join(dir, `${base}${size.suffix}.webp`);
    try {
      await stat(out);
      continue; // already generated
    } catch {}

    const info = await sharp(file)
      .resize({ width: size.width, withoutEnlargement: true })
      .webp({ quality: size.quality })
      .toFile(out);

    made += 1;
    saved += (await stat(file)).size - info.size;
  }
}

console.log(`Generated ${made} WebP renditions, ${(saved / 1024 / 1024).toFixed(1)} MB lighter than their sources.`);
