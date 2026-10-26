// Renders public/apple-touch-icon.png (180 × 180) from public/favicon.svg.
// Run with `node scripts/build-icons.mjs` after changing the favicon; the PNG is committed.
// iOS applies its own rounded mask, so the icon is a full square on the favicon's background.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const svg = readFileSync(resolve(root, 'public/favicon.svg'), 'utf8');
const size = 180;

const viewBox = svg.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/);
if (!viewBox)
  throw new Error('favicon.svg needs a viewBox of the form "0 0 w h"');
const background = svg.match(/<rect[^>]*fill="(#[0-9a-fA-F]{3,8})"/)?.[1];
if (!background)
  throw new Error('favicon.svg needs a background <rect> with a hex fill');

// Render at the target size directly (density scales the SVG's own width) for crisp edges.
const density = (72 * size) / Number(viewBox[1]);
const target = resolve(root, 'public/apple-touch-icon.png');
await sharp(Buffer.from(svg), { density })
  .resize(size, size)
  .flatten({ background })
  .png({ compressionLevel: 9 })
  .toFile(target);

console.log(`Wrote ${target} (${size}×${size}) on ${background}.`);
