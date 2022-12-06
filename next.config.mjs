import withPlugins from 'next-compose-plugins';
import withFonts from 'next-fonts';
import mdx from '@next/mdx';
import { config as env } from './config/config.mjs';

const withMDX = mdx({
  options: {
    providerImportSource: '@mdx-js/react',
  }
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
