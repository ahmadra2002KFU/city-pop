// Verifies the static export before deployment: every route exists with the right
// language and sections, and every asset it references (including runtime image
// paths from the media manifest) is present in dist/client. It also checks the
// search and sharing layer: canonical and hreflang links, the Open Graph card
// (file present, real pixel size equal to the tags), the schema.org Event JSON-LD
// (parses, dates equal content/facts.ts), sitemap.xml, robots.txt, the
// apple-touch-icon and the branded 404 page.
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'dist/client');
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');

/** Exported HTML of one file in dist/client. */
function readExport(file) {
  const path = resolve(output, file);
  assert(existsSync(path), `Static export did not produce ${file}`);
  return readFileSync(path, 'utf8');
}

const attribute = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'))?.[1]?.replaceAll('&amp;', '&');

// URL normalisation: Next prints the site root as `https://host` without the slash.
const normalUrl = (value) => (value ? new URL(value).href : value);

/** <link rel=…> tags of a page: canonical URL and hreflang → href. */
function links(html) {
  let canonical = null;
  const alternates = {};
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    const rel = attribute(tag, 'rel');
    if (rel === 'canonical') canonical = normalUrl(attribute(tag, 'href'));
    const hreflang = attribute(tag, 'hrefLang');
    if (rel === 'alternate' && hreflang) alternates[hreflang] = normalUrl(attribute(tag, 'href'));
  }
  return { canonical, alternates };
}

/** <meta property|name=… content=…> tags of a page; a key may repeat. */
function metaTags(html) {
  const tags = {};
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    const key = attribute(tag, 'property') ?? attribute(tag, 'name');
    const content = attribute(tag, 'content');
    if (key && content !== undefined) (tags[key] ??= []).push(content);
  }
  return tags;
}

// Without NEXT_PUBLIC_SITE_ORIGIN the build falls back to lib/site-url.ts's default
// origin; read it back from the home page instead of repeating it here.
const origin =
  process.env.NEXT_PUBLIC_SITE_ORIGIN?.replace(/\/$/, '') ||
  new URL(links(readExport('index.html')).canonical ?? 'https://missing.invalid').origin;

const visitorIds = ['main', 'zones', 'hub', 'map', 'visit'];
const partnerIds = ['main', 'numbers', 'masterplan', 'spaces', 'sponsorship', 'enquire'];
const routes = [
  { path: '/', file: 'index.html', lang: 'ar', ids: visitorIds, ar: '/', en: '/en/' },
  { path: '/partners/', file: 'partners/index.html', lang: 'ar', ids: partnerIds, ar: '/partners/', en: '/en/partners/' },
  { path: '/en/', file: 'en/index.html', lang: 'en', ids: visitorIds, ar: '/', en: '/en/' },
  { path: '/en/partners/', file: 'en/partners/index.html', lang: 'en', ids: partnerIds, ar: '/partners/', en: '/en/partners/' },
];
const absolute = (path) => new URL(`${basePath}${path}`, origin).href;

// Facts superseded by the October 2026 decks must never come back.
const retiredFacts = ['28,189', '2,100', '4 × 3', 'شهر كامل', 'one full month'];

// The event dates are the single source in content/facts.ts.
const factsSource = readFileSync(resolve(root, 'content/facts.ts'), 'utf8');
const datesMatch = factsSource.match(/dates:\s*\{[^}]*?start:\s*'(\d{4}-\d{2}-\d{2})'[^}]*?end:\s*'(\d{4}-\d{2}-\d{2})'/s);
assert(datesMatch, 'Could not read dates.start / dates.end from content/facts.ts');
const [, factStart, factEnd] = datesMatch;

let checked = 0;
const seen = new Set();
/** Resolves a same-origin URL to its file in dist/client and asserts it exists. */
function assetFile(value, fromUrl) {
  if (!value || value.startsWith('#') || value.startsWith('data:') || value.startsWith('mailto:')) return null;
  const url = new URL(value, fromUrl);
  if (url.origin !== new URL(origin).origin) return null;
  assert(url.pathname.startsWith(`${basePath}/`), `Asset is outside the deployed project path: ${url.pathname}`);
  let path = resolve(output, `.${decodeURIComponent(url.pathname.slice(basePath.length))}`);
  assert(!relative(output, path).startsWith('..'), 'Asset escapes the export directory');
  if (url.pathname.endsWith('/')) path = resolve(path, 'index.html');
  if (!seen.has(path)) {
    seen.add(path);
    assert(existsSync(path), `Missing exported asset: ${url.pathname}`);
    checked++;
  }
  return path;
}
const checkAsset = (value, fromUrl) => void assetFile(value, fromUrl);

function checkReferences(html, pageUrl, label) {
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (match[0].startsWith('href') && /hrefLang|rel="alternate"|rel="canonical"/.test(html.slice(match.index - 80, match.index))) continue;
    try {
      checkAsset(match[1].replaceAll('&amp;', '&'), pageUrl);
    } catch (error) {
      error.message = `${label}: ${error.message}`;
      throw error;
    }
  }
  for (const match of html.matchAll(/(?:srcSet|srcset|imageSrcSet|imagesrcset)="([^"]+)"/g)) {
    for (const candidate of match[1].split(',')) checkAsset(candidate.trim().split(/\s+/)[0], pageUrl);
  }
}

const imageSizes = new Map();
async function imageSize(path) {
  if (!imageSizes.has(path)) {
    const { width, height } = await sharp(path).metadata();
    imageSizes.set(path, { width, height });
  }
  return imageSizes.get(path);
}

for (const route of routes) {
  const html = readExport(route.file);
  const pageUrl = new URL(absolute(route.path));
  assert(html.includes(`<html lang="${route.lang}"`), `${route.file} should declare lang="${route.lang}"`);
  for (const id of route.ids) {
    assert(html.includes(`id="${id}"`), `${route.file} is missing section #${id}`);
  }
  for (const fact of retiredFacts) {
    assert(!html.includes(fact), `${route.file} still states a retired fact: ${fact}`);
  }
  checkReferences(html, pageUrl, route.file);

  // Canonical and hreflang alternates.
  const { canonical, alternates } = links(html);
  assert.equal(canonical, pageUrl.href, `${route.file}: canonical link`);
  assert.equal(alternates.ar, absolute(route.ar), `${route.file}: hreflang="ar" alternate`);
  assert.equal(alternates.en, absolute(route.en), `${route.file}: hreflang="en" alternate`);
  assert.equal(alternates['x-default'], absolute(route.ar), `${route.file}: hreflang="x-default" alternate`);

  // Open Graph card: the file exists and its real size matches the declared size.
  const meta = metaTags(html);
  assert.equal(normalUrl(meta['og:url']?.[0]), pageUrl.href, `${route.file}: og:url`);
  const ogImage = meta['og:image']?.[0];
  assert(ogImage, `${route.file}: og:image is missing`);
  assert(/^https?:\/\//.test(ogImage), `${route.file}: og:image must be an absolute URL (${ogImage})`);
  const ogFile = assetFile(ogImage, pageUrl);
  assert(ogFile, `${route.file}: og:image is not served by this site (${ogImage})`);
  const size = await imageSize(ogFile);
  assert.equal(Number(meta['og:image:width']?.[0]), size.width, `${route.file}: og:image:width vs ${ogImage}`);
  assert.equal(Number(meta['og:image:height']?.[0]), size.height, `${route.file}: og:image:height vs ${ogImage}`);
  assert(meta['og:image:alt']?.[0]?.trim(), `${route.file}: og:image:alt is missing`);
  assert.equal(meta['twitter:image']?.[0], ogImage, `${route.file}: twitter:image should be the Open Graph card`);
  assert.equal(meta['twitter:card']?.[0], 'summary_large_image', `${route.file}: twitter:card`);

  // apple-touch-icon: referenced, present (checked above) and 180 × 180.
  const touchIcon = html.match(/<link\b[^>]*rel="apple-touch-icon"[^>]*>/)?.[0];
  assert(touchIcon, `${route.file}: apple-touch-icon link is missing`);
  const iconSize = await imageSize(assetFile(attribute(touchIcon, 'href'), pageUrl));
  assert(iconSize.width === 180 && iconSize.height === 180, `${route.file}: apple-touch-icon should be 180 × 180`);

  // schema.org Event JSON-LD.
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  assert.equal(blocks.length, 1, `${route.file}: expected exactly one JSON-LD block, found ${blocks.length}`);
  let event;
  try {
    event = JSON.parse(blocks[0][1]);
  } catch (error) {
    assert.fail(`${route.file}: JSON-LD does not parse (${error.message})`);
  }
  assert.equal(event['@context'], 'https://schema.org', `${route.file}: JSON-LD @context`);
  assert.equal(event['@type'], 'Event', `${route.file}: JSON-LD @type`);
  assert(event.name?.trim(), `${route.file}: JSON-LD Event needs a name`);
  assert.equal(event.startDate, factStart, `${route.file}: JSON-LD startDate should equal facts.dates.start`);
  assert.equal(event.endDate, factEnd, `${route.file}: JSON-LD endDate should equal facts.dates.end`);
  assert.equal(event.eventStatus, 'https://schema.org/EventScheduled', `${route.file}: JSON-LD eventStatus`);
  assert.equal(event.eventAttendanceMode, 'https://schema.org/OfflineEventAttendanceMode', `${route.file}: JSON-LD eventAttendanceMode`);
  assert.equal(event.location?.['@type'], 'Place', `${route.file}: JSON-LD location should be a Place`);
  assert(event.location.address?.addressLocality && event.location.address?.addressCountry, `${route.file}: JSON-LD location needs a locality and country`);
  assert.equal(event.organizer?.['@type'], 'Organization', `${route.file}: JSON-LD organizer`);
  assert.equal(event.url, pageUrl.href, `${route.file}: JSON-LD url should equal the canonical URL`);
  assert(!('offers' in event), `${route.file}: JSON-LD must not state offers until ticket prices are announced`);
  assert(Array.isArray(event.image) && event.image.length > 0, `${route.file}: JSON-LD needs images`);
  for (const image of event.image) {
    assert(/^https?:\/\//.test(image), `${route.file}: JSON-LD image must be absolute (${image})`);
    assert(assetFile(image, pageUrl), `${route.file}: JSON-LD image is not served by this site (${image})`);
  }
}

// sitemap.xml lists every route with all hreflang alternates; robots.txt points to it.
const sitemap = readExport('sitemap.xml');
const sitemapUrls = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => ({
  loc: block.match(/<loc>([^<]+)<\/loc>/)?.[1],
  alternates: Object.fromEntries(
    [...block.matchAll(/<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)"\/>/g)].map(([, lang, href]) => [lang, href]),
  ),
}));
assert.equal(sitemapUrls.length, routes.length, `sitemap.xml should list ${routes.length} pages, found ${sitemapUrls.length}`);
for (const route of routes) {
  const entry = sitemapUrls.find((url) => url.loc === absolute(route.path));
  assert(entry, `sitemap.xml is missing ${absolute(route.path)}`);
  assert.equal(entry.alternates.ar, absolute(route.ar), `sitemap.xml: ar alternate of ${route.path}`);
  assert.equal(entry.alternates.en, absolute(route.en), `sitemap.xml: en alternate of ${route.path}`);
  assert.equal(entry.alternates['x-default'], absolute(route.ar), `sitemap.xml: x-default alternate of ${route.path}`);
}
const robots = readExport('robots.txt');
assert(robots.includes(`Sitemap: ${absolute('/sitemap.xml')}`), 'robots.txt should point to sitemap.xml');
assert(!/^Disallow:\s*\/\s*$/m.test(robots), 'robots.txt must not block crawling (pages use a noindex meta tag instead)');

// The branded 404 page: GitHub Pages serves it at any depth, so every link must be
// absolute and every asset must resolve from a nested missing URL.
const notFound = readExport('404.html');
assert(!notFound.includes('This page could not be found'), '404.html is still the framework default page');
assert(/<meta name="robots" content="[^"]*noindex/.test(notFound), '404.html should be noindex');
for (const home of ['/', '/en/']) {
  assert(notFound.includes(`href="${basePath}${home}"`), `404.html should link to ${basePath}${home}`);
}
for (const match of notFound.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const value = match[1];
  if (value.startsWith('#') || value.startsWith('data:')) continue;
  assert(/^(?:https?:)?\/\//.test(value) || value.startsWith('/'), `404.html uses a relative URL, which breaks at depth: ${value}`);
}
checkReferences(notFound, new URL(absolute('/no/such/page/')), '404.html');

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

console.log(
  `Static export verified: ${routes.length} routes (canonical, hreflang, Open Graph, Event JSON-LD), ` +
    `sitemap.xml, robots.txt, 404.html and ${checked} asset references.`,
);
