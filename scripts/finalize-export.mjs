// Post-processes the static export in dist/client:
// 1. Vinext exports routes as `partners.html`; GitHub Pages also needs
//    `partners/index.html` so that `/partners/` (the form the site links to) resolves.
// 2. Writes sitemap.xml (every exported page, with its hreflang alternates) and
//    robots.txt. Both are derived from the canonical and alternate <link> tags the
//    pages already carry, so routes and URLs are never listed twice by hand.
import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';

const output = resolve(import.meta.dirname, '../dist/client');
const copied = [];
const pages = [];

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '_next' && entry.name !== 'media') walk(file);
    } else if (entry.name.endsWith('.html') && entry.name !== '404.html') {
      pages.push(file);
      if (entry.name !== 'index.html') {
        const target = resolve(directory, entry.name.slice(0, -5), 'index.html');
        mkdirSync(dirname(target), { recursive: true });
        copyFileSync(file, target);
        copied.push(relative(output, target).replaceAll('\\', '/'));
      }
    }
  }
}

walk(output);
console.log(`Directory-style routes written: ${copied.join(', ') || 'none'}`);

const attribute = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'))?.[1];
// URL normalisation: Next prints the site root as `https://host` without the slash.
const unescapeHtml = (value) => new URL(value.replaceAll('&amp;', '&')).href;
const escapeXml = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

/** Canonical URL and hreflang alternates of one exported page. */
function pageLinks(file) {
  const html = readFileSync(file, 'utf8');
  let canonical = null;
  const alternates = [];
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    const rel = attribute(tag, 'rel');
    const href = attribute(tag, 'href');
    if (!href) continue;
    if (rel === 'canonical') canonical = unescapeHtml(href);
    const hreflang = attribute(tag, 'hrefLang');
    if (rel === 'alternate' && hreflang) alternates.push({ hreflang, href: unescapeHtml(href) });
  }
  return { canonical, alternates };
}

const entries = new Map();
for (const file of pages) {
  const { canonical, alternates } = pageLinks(file);
  if (!canonical) throw new Error(`${relative(output, file)} has no canonical link; cannot list it in sitemap.xml`);
  entries.set(canonical, alternates);
}
if (!entries.size) throw new Error('No exported pages found for sitemap.xml');

const sorted = [...entries].sort(([a], [b]) => a.localeCompare(b));
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...sorted.map(([loc, alternates]) =>
    [
      '  <url>',
      `    <loc>${escapeXml(loc)}</loc>`,
      ...alternates.map(
        ({ hreflang, href }) =>
          `    <xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}"/>`,
      ),
      '  </url>',
    ].join('\n'),
  ),
  '</urlset>',
  '',
].join('\n');
writeFileSync(resolve(output, 'sitemap.xml'), sitemap);

// The site root's canonical URL is `<origin><base path>/`, the folder the files are served from.
const home = pageLinks(resolve(output, 'index.html')).canonical;
if (!home) throw new Error('index.html has no canonical link');
const sitemapUrl = new URL('sitemap.xml', home).href;
// Pages opt out of indexing with <meta name="robots" content="noindex"> (lib/page-metadata.ts).
// Crawling stays allowed so search engines can read that tag; blocking here would hide it.
writeFileSync(
  resolve(output, 'robots.txt'),
  ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemapUrl}`, ''].join('\n'),
);
console.log(`sitemap.xml lists ${entries.size} pages; robots.txt points to ${sitemapUrl}`);
