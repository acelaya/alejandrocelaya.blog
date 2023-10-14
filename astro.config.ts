import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { config } from './config/config';
import inferDescription from 'rehype-infer-description-meta';
import { rehypeMdxPluginPostSummary } from './plugins/rehype/mdx-post-summary-plugin.mjs';

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

  // FIXME Temp. Remove once Next.js is no longer needed
  srcDir: './src-astro'
});
