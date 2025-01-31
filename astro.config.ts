import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';
import { config } from './config/config';

// https://astro.build/config
export default defineConfig({
  site: config.SITE_URL,
  outDir: './build',
  integrations: [sitemap(), react(), expressiveCode(), mdx()],

  vite: {
    plugins: [tailwind()],

    server: {
      watch: {
        ignored: ['**/home/**', '**/build/**', '**/.idea/**', '**/node_modules/**', '**/.git/**']
      },
    },
  },
});
