import withPlugins from 'next-compose-plugins';
import withFonts from 'next-fonts';
import mdx from '@next/mdx';
import rehypePrism from '@mapbox/rehype-prism';
import inferDescription from 'rehype-infer-description-meta';
import { rehypeMdxPluginPostSummary } from './plugins/rehype/mdx-post-summary-plugin.mjs';
import { config as env } from './config/config.mjs';

const withMDX = mdx({
  options: {
    providerImportSource: '@mdx-js/react',
    rehypePlugins: [
      [inferDescription, { inferDescriptionHast: true, truncateSize: 300 }],
      rehypeMdxPluginPostSummary,
      rehypePrism,
    ],
  },
});

export default withPlugins([ withFonts, withMDX ], {
  enableSvg: true,
  trailingSlash: true, // Makes pages to be exported as index.html files
  swcMinify: true, // This will make compiled assets to be minified via SWC instead of webpack plugin
  env,
  eslint: {
    ignoreDuringBuilds: true,
  },
});
