import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://thevolleyballuniforms.com',
  integrations: [tailwind(), sitemap()],
  output: 'hybrid',
  adapter: node({ mode: 'standalone' }),
});
