import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://datmo.io.vn',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
