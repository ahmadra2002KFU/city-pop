import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const output = resolve('dist/client');
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
const origin = process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://example.test';
const pageUrl = new URL(`${basePath}/`, origin);
const htmlPath = resolve(output, 'index.html');
assert(existsSync(htmlPath), 'Static export did not produce index.html');
const html = readFileSync(htmlPath, 'utf8');
assert(html.includes('id="main"'), 'Export is missing the landing page');

let checked = 0;
function checkAsset(value, fromUrl) {
  if (!value || value.startsWith('#') || value.startsWith('data:')) return;
  const url = new URL(value, fromUrl);
  if (url.origin !== pageUrl.origin) return;
  assert(
    url.pathname.startsWith(`${basePath}/`),
    `Asset is outside the deployed project path: ${url.pathname}`,
  );
  const path = resolve(
    output,
    `.${decodeURIComponent(url.pathname.slice(basePath.length))}`,
  );
  assert(
    !relative(output, path).startsWith('..'),
    'Asset escapes the export directory',
  );
  assert(existsSync(path), `Missing exported asset: ${url.pathname}`);
  checked++;
}

for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  checkAsset(match[1], pageUrl);
}

function scanCss(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = resolve(directory, entry.name);
    if (entry.isDirectory()) scanCss(file);
    else if (entry.name.endsWith('.css')) {
      const cssUrl = new URL(
        relative(output, file).replaceAll('\\', '/'),
        pageUrl,
      );
      for (const match of readFileSync(file, 'utf8').matchAll(
        /url\(["']?([^"')]+)["']?\)/g,
      )) {
        checkAsset(match[1], cssUrl);
      }
    }
  }
}

scanCss(output);
console.log(
  `Static export verified: landing page and ${checked} asset references.`,
);
