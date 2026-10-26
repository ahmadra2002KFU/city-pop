// Verifies the static export before deployment: every route exists with the right
// language and sections, and every asset it references (including runtime image
// paths from the media manifest) is present in dist/client.
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'dist/client');
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
const origin = process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://example.test';

const routes = [
  { path: '/', file: 'index.html', lang: 'ar', ids: ['main', 'zones', 'hub', 'map', 'visit'] },
  { path: '/partners/', file: 'partners/index.html', lang: 'ar', ids: ['main', 'numbers', 'masterplan', 'spaces', 'sponsorship', 'enquire'] },
  { path: '/en/', file: 'en/index.html', lang: 'en', ids: ['main', 'zones', 'hub', 'map', 'visit'] },
  { path: '/en/partners/', file: 'en/partners/index.html', lang: 'en', ids: ['main', 'numbers', 'masterplan', 'spaces', 'sponsorship', 'enquire'] },
];

// Facts superseded by the October 2026 decks must never come back.
const retiredFacts = ['28,189', '2,100', '4 × 3', 'شهر كامل', 'one full month'];

let checked = 0;
const seen = new Set();
function checkAsset(value, fromUrl) {
  if (!value || value.startsWith('#') || value.startsWith('data:') || value.startsWith('mailto:')) return;
  const url = new URL(value, fromUrl);
  if (url.origin !== new URL(origin).origin) return;
  assert(url.pathname.startsWith(`${basePath}/`), `Asset is outside the deployed project path: ${url.pathname}`);
  let path = resolve(output, `.${decodeURIComponent(url.pathname.slice(basePath.length))}`);
  assert(!relative(output, path).startsWith('..'), 'Asset escapes the export directory');
  if (url.pathname.endsWith('/')) path = resolve(path, 'index.html');
  if (seen.has(path)) return;
  seen.add(path);
  assert(existsSync(path), `Missing exported asset: ${url.pathname}`);
  checked++;
}

for (const route of routes) {
  const file = resolve(output, route.file);
  assert(existsSync(file), `Static export did not produce ${route.file}`);
  const html = readFileSync(file, 'utf8');
  const pageUrl = new URL(`${basePath}${route.path}`, origin);
  assert(html.includes(`<html lang="${route.lang}"`), `${route.file} should declare lang="${route.lang}"`);
  for (const id of route.ids) {
    assert(html.includes(`id="${id}"`), `${route.file} is missing section #${id}`);
  }
  for (const fact of retiredFacts) {
    assert(!html.includes(fact), `${route.file} still states a retired fact: ${fact}`);
  }
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (match[0].startsWith('href') && /hrefLang|rel="alternate"|rel="canonical"/.test(html.slice(match.index - 80, match.index))) continue;
    checkAsset(match[1].replaceAll('&amp;', '&'), pageUrl);
  }
  for (const match of html.matchAll(/(?:srcSet|srcset|imageSrcSet|imagesrcset)="([^"]+)"/g)) {
    for (const candidate of match[1].split(',')) checkAsset(candidate.trim().split(/\s+/)[0], pageUrl);
  }
}

// Runtime image paths are built from the media manifest, so check every variant.
const manifestSource = readFileSync(resolve(root, 'content/media.generated.ts'), 'utf8');
const manifest = JSON.parse(manifestSource.slice(manifestSource.indexOf('{'), manifestSource.lastIndexOf('} as const') + 1));
for (const [id, image] of Object.entries(manifest)) {
  for (const width of image.widths) {
    assert(existsSync(resolve(output, `media/${id}-${width}.webp`)), `Missing media variant ${id}-${width}.webp`);
    checked++;
  }
  assert(existsSync(resolve(output, `media/${image.fallback}`)), `Missing media fallback ${image.fallback}`);
}

function scanCss(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = resolve(directory, entry.name);
    if (entry.isDirectory()) scanCss(file);
    else if (entry.name.endsWith('.css')) {
      const cssUrl = new URL(`${basePath}/${relative(output, file).replaceAll('\\', '/')}`, origin);
      for (const match of readFileSync(file, 'utf8').matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
        checkAsset(match[1], cssUrl);
      }
    }
  }
}
scanCss(output);

console.log(`Static export verified: ${routes.length} routes and ${checked} asset references.`);
