// @astrojs/vercel 7.x only knows Node 18 and 20. On a newer build machine it
// labels the serverless function "nodejs18.x", which Vercel now rejects.
// Re-stamp every function's runtime from package.json "engines.node".
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';

const engines = JSON.parse(readFileSync('package.json', 'utf8')).engines?.node ?? '';
const major = engines.match(/\d+/)?.[0];
if (!major) process.exit(0);

const dir = '.vercel/output/functions';
if (!existsSync(dir)) process.exit(0);
for (const fn of readdirSync(dir)) {
  const file = `${dir}/${fn}/.vc-config.json`;
  if (!existsSync(file)) continue;
  const cfg = JSON.parse(readFileSync(file, 'utf8'));
  const want = `nodejs${major}.x`;
  if (typeof cfg.runtime === 'string' && /^nodejs\d+\.x$/.test(cfg.runtime) && cfg.runtime !== want) {
    console.log(`[vercel-runtime] ${fn}: ${cfg.runtime} -> ${want}`);
    cfg.runtime = want;
    writeFileSync(file, JSON.stringify(cfg, null, 2) + '\n');
  }
}
