import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { config } from './config/config';

// https://astro.build/config
export default defineConfig({
  site: config.SITE_URL,
  outDir: './build',
  integrations: [sitemap(), react(), mdx()],
});
