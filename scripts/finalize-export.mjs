// Vinext exports routes as `partners.html`; GitHub Pages also needs
// `partners/index.html` so that `/partners/` (the form the site links to) resolves.
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';

const output = resolve(import.meta.dirname, '../dist/client');
const copied = [];

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '_next' && entry.name !== 'media') walk(file);
    } else if (
      entry.name.endsWith('.html') &&
      entry.name !== 'index.html' &&
      entry.name !== '404.html'
    ) {
      const target = resolve(directory, entry.name.slice(0, -5), 'index.html');
      mkdirSync(dirname(target), { recursive: true });
      copyFileSync(file, target);
      copied.push(relative(output, target).replaceAll('\\', '/'));
    }
  }
}

walk(output);
console.log(`Directory-style routes written: ${copied.join(', ') || 'none'}`);
