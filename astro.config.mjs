import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://thevolleyballuniforms.com',
  // Canonical tags and sitemap all use trailing-slash URLs (/slug/). Force the
  // server to redirect the no-slash form to the slash form so /slug and /slug/
  // are not both 200 (duplicate URLs); the served URL then matches the canonical.
  trailingSlash: 'always',
  integrations: [tailwind(), sitemap({ lastmod: new Date('2026-07-10') })],
  output: 'hybrid',
  adapter: vercel(),
});
