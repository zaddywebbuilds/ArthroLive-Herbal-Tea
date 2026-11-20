/**
 * Prints what still has to be filled in before paid traffic is sent to the
 * site. Runs as part of `npm run build`.
 *
 * It never fails the build: a half-configured site must still be
 * deployable so the team can look at it. It just refuses to let the gaps
 * go unnoticed.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(path.join(root, 'src', 'config', 'site.ts'), 'utf8');

/**
 * Dependency-free reads of the config source. `block` narrows the search to
 * one config object first, so that e.g. supply.note is never confused with
 * delivery.note.
 */
const section = (name) => {
  const start = src.indexOf(`${name}: {`);
  if (start === -1) return '';
  let depth = 0;
  for (let i = src.indexOf('{', start); i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}' && --depth === 0) return src.slice(start, i + 1);
  }
  return '';
};
const str = (key, block = src) => {
  const m = block.match(new RegExp(`\\b${key}:\\s*'([^']*)'`));
  return m ? m[1] : '';
};
const emptyArray = (key, block = src) =>
  new RegExp(`\\b${key}:\\s*\\[\\]`).test(block);
const num = (key, block = src) => {
  const m = block.match(new RegExp(`\\b${key}:\\s*(\\d+)`));
  return m ? Number(m[1]) : 0;
};

const ingredientsBlock = section('ingredients');
const supplyBlock = section('supply');
const proofBlock = section('proof');

const gaps = [];
const add = (what, why) => gaps.push({ what, why });

if (!str('endpoint')) add('order.endpoint', 'the form cannot take a single order');
if (!str('phone') && !str('whatsapp')) add('contact.phone / whatsapp', 'buyers have no way to reach you');
if (!str('email')) add('contact.email', 'no support address in the footer');
if (!str('hours')) add('contact.hours', 'buyers do not know when you answer');
if (emptyArray('tea', ingredientsBlock) && emptyArray('balm', ingredientsBlock))
  add('ingredients', 'the biggest credibility gap for a herbal product');
if (emptyArray('media', proofBlock)) add('proof.media', 'no real photo or video proves the product exists');
if (emptyArray('testimonials')) add('testimonials', 'no social proof at all');
if (!num('teaBagsPerDay', supplyBlock) && !str('note', supplyBlock))
  add('supply', 'packages cannot say how long a pack lasts');
if (!str('metaPixelId') && !str('ga4MeasurementId') && !str('gtmContainerId')) add('tracking', 'ad spend cannot be attributed');

const line = '─'.repeat(64);
if (gaps.length === 0) {
  console.log(`\n\x1b[32m✓ Readiness check: everything is filled in.\x1b[0m\n`);
} else {
  console.log(`\n\x1b[33m${line}\n  NOT READY FOR PAID TRAFFIC - ${gaps.length} item(s) outstanding\n${line}\x1b[0m`);
  for (const g of gaps) {
    console.log(`  \x1b[33m•\x1b[0m \x1b[1m${g.what}\x1b[0m\n      ${g.why}`);
  }
  console.log(`\n  Fill these in \x1b[1msrc/config/site.ts\x1b[0m. The site still builds and\n  deploys; sections with no data stay hidden rather than showing\n  placeholder or invented content.\n\x1b[33m${line}\x1b[0m\n`);
}
