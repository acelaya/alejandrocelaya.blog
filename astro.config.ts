import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { config } from './config/config';
import inferDescription from 'rehype-infer-description-meta';
import { rehypeMdxPluginPostSummary } from './plugins/rehype/mdx-post-summary-plugin.mjs';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://astro.build/config
export default defineConfig({
  site: config.SITE_URL,
  outDir: './build',
  integrations: [sitemap(), react(), mdx({
    rehypePlugins: [
      [inferDescription, { inferDescriptionHast: true, truncateSize: 300 }],
      rehypeMdxPluginPostSummary,
    ]
  })],

  vite: {
    plugins: [
      nodePolyfills({
        include: [],
        globals: {
          // react-18-image-lightbox is no longer maintain and depends on the `global` object
          // Enable temporarily until we can migrate to something else
          global: true,
        }
      }),
    ],
  },
});
