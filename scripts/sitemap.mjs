// Flat sitemap generator.
//
// Portfolio convention: ONE flat /sitemap.xml per site, no sitemap index.
// @astrojs/sitemap can only emit sitemap-index.xml + sitemap-0.xml, so the
// sitemap is built here instead, after `astro build`, by walking the pages that
// were actually rendered.
//
// Two properties this buys us:
//   1. Every <loc> is taken from the page's own <link rel="canonical">, so the
//      sitemap URL form always equals the URL the site serves (this site is
//      trailingSlash: 'always'). No 308 redirect chains inside the sitemap.
//   2. Pages marked noindex (404, thank-you) are skipped automatically.
import { existsSync, readdirSync, readFileSync, writeFileSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://thevolleyballuniforms.com';
// Static output roots to publish the sitemap into (vercel adapter + plain build).
const ROOTS = ['.vercel/output/static', 'dist/client', 'dist'].filter(
  (p) => existsSync(p) && statSync(p).isDirectory(),
);

if (ROOTS.length === 0) {
  console.error('[sitemap] no build output directory found — run `astro build` first');
  process.exit(1);
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name === 'index.html') out.push(full);
  }
  return out;
}

const root = ROOTS[0];
const pages = walk(root);
const urls = [];
const skipped = [];

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  if (/name="robots"\s+content="[^"]*noindex/i.test(html)) {
    skipped.push(file);
    continue;
  }
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  const fallback = SITE + '/' + file.slice(root.length + 1).replace(/index\.html$/, '');
  const loc = (canonical || fallback).replace(/\/?$/, '/');
  if (!loc.startsWith(SITE)) {
    console.error(`[sitemap] refusing off-site URL from ${file}: ${loc}`);
    process.exit(1);
  }
  urls.push(loc);
}

const unique = [...new Set(urls)].sort();
if (unique.length === 0) {
  console.error('[sitemap] no indexable pages found — refusing to write an empty sitemap');
  process.exit(1);
}

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  unique.map((u) => `  <url><loc>${u}</loc></url>`).join('\n') +
  '\n</urlset>\n';

for (const dir of ROOTS) {
  writeFileSync(join(dir, 'sitemap.xml'), xml);
  // Remove any index-style sitemap left behind by a previous build or integration.
  for (const stale of readdirSync(dir)) {
    if (/^sitemap(-index|-\d+|_index)\.xml$/.test(stale)) {
      rmSync(join(dir, stale), { force: true });
      console.log(`[sitemap] removed stale ${stale} from ${dir}`);
    }
  }
}

console.log(
  `[sitemap] wrote sitemap.xml with ${unique.length} URLs to ${ROOTS.join(', ')}` +
    (skipped.length ? ` (skipped ${skipped.length} noindex page(s))` : ''),
);
