// Turns one prerendered page from build/ into a single HTML file: its CSS inlined, its scripts
// dropped. The page is fully rendered at build time, so it reads the same without JavaScript.
// Usage: node scripts/standalone.mjs kb/incidents/4471-split rendered/4471-split.html
import fs from 'node:fs';
import path from 'node:path';

const [route, out] = process.argv.slice(2);
let html = fs.readFileSync(path.join('build', route, 'index.html'), 'utf8');
html = html.replace(/<link[^>]*href="([^"]+)"[^>]*rel="stylesheet"[^>]*>/g, (_, href) => {
  const file = path.resolve('build', route, href);
  return `<style>${fs.readFileSync(file, 'utf8')}</style>`;
});
html = html.replace(/<link[^>]+rel="modulepreload"[^>]*>/g, '').replace(/<script[\s\S]*?<\/script>/g, '');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log('wrote', out, html.length, 'bytes');
