// Turns the built page into one file the desk can open as it is: the server-rendered HTML,
// its stylesheets inlined, no scripts (every number is already in the HTML).
// Usage: node scripts/render-page.mjs [route]   (default: kb/incidents/4471-split)
import fs from 'node:fs';
import path from 'node:path';

const route = process.argv[2] ?? 'kb/incidents/4471-split';
const built = path.join('build', `${route}.html`);
let html = fs.readFileSync(built, 'utf8');

html = html.replace(/<link[^>]+rel="stylesheet"[^>]*>/g, (tag) => {
  const href = tag.match(/href="([^"]+)"/)[1];
  const file = path.join('build', href.replace(/^(\.\.\/|\.\/)+/, '').replace(/^\//, ''));
  return `<style>${fs.readFileSync(file, 'utf8')}</style>`;
});
html = html
  .replace(/<link[^>]+rel="modulepreload"[^>]*>/g, '')
  .replace(/<script[\s\S]*?<\/script>/g, '')
  .replace(/<!--[\s\S]*?-->/g, '');

const out = path.join('rendered', `${route}.html`);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(`wrote ${out} (${html.length} bytes)`);
