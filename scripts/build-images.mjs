/**
 * Generates responsive WebP derivatives in public/images/ from the
 * original PNG/JPG masters in source-images/.
 * Originals are never modified. Run: npm run images
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'source-images');
const OUT = path.join(root, 'public', 'images');

const WIDTHS = [400, 700, 1000, 1400];
const QUALITY = 74;

fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(SRC).filter((f) => /\.(png|jpe?g)$/i.test(f));
const manifest = {};

for (const file of files) {
  const base = file.replace(/\.(png|jpe?g)$/i, '');
  const input = path.join(SRC, file);
  const meta = await sharp(input).metadata();
  const widths = [...new Set(WIDTHS.filter((w) => w < meta.width).concat(Math.min(meta.width, 1400)))].sort((a, b) => a - b);

  const sources = [];
  for (const w of widths) {
    const name = `${base}-${w}.webp`;
    await sharp(input).resize({ width: w }).webp({ quality: QUALITY, effort: 6 }).toFile(path.join(OUT, name));
    sources.push({ w, src: `/images/${name}` });
  }

  manifest[base] = {
    width: meta.width,
    height: meta.height,
    ratio: +(meta.width / meta.height).toFixed(4),
    sources,
  };
  console.log(`${base}  ${meta.width}x${meta.height}  ->  ${widths.join(', ')}`);
}

// Social sharing / Open Graph image (1200x630)
await sharp(path.join(SRC, 'arthrolive-herbal-tea-balm-ghana-hero.png'))
  .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
  .jpeg({ quality: 82 })
  .toFile(path.join(root, 'public', 'arthrolive-ghana-social-share.jpg'));

fs.writeFileSync(path.join(root, 'src', 'data', 'images.json'), JSON.stringify(manifest, null, 2));
console.log(`\nDone. ${files.length} masters -> ${Object.values(manifest).reduce((n, m) => n + m.sources.length, 0)} WebP derivatives.`);
