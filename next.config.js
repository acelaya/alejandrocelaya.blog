const withPlugins = require('next-compose-plugins');
const withFonts = require('next-fonts');
const withMDX = require('@next/mdx')();
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const env = require('./config/config');

module.exports = withPlugins([ withFonts, withMDX ], {
  enableSvg: true,
  trailingSlash: true, // Makes pages to be exported as index.html files
  env,
  webpack(config, { dev, isServer }) {
    config.optimization.minimizer = config.optimization.minimizer || [];
    config.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({}));

    if (!dev && isServer) {
      const originalEntry = config.entry;

      config.entry = async () => {
        const entries = { ...(await originalEntry()) };

        // These scripts can import components from the app and use ES modules
        entries['./scripts/generate-feed'] = './scripts/generate-feed.js';

        return entries;
      };
    }


    return config;
  },
});
