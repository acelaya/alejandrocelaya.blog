const withPlugins = require('next-compose-plugins');
const withFonts = require('next-fonts');
const withMDX = require('@next/mdx')();
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = withPlugins([ withFonts, withMDX ], {
  enableSvg: true,
  trailingSlash: true, // Makes pages to be exported as index.html files
  env: {
    GA: 'UA-38351554-3',
    DISQUS_SHORTNAME: 'acelayablog',
    CARBON_SERVE: 'CK7IVK3W',
    CARBON_PLACEMENT: 'blogalejandrocelayacom',
    SITE_URL: 'https://alejandrocelaya.blog',
    SITE_TITLE: 'Alejandro Celaya | Blog',
    SITE_SUBTITLE: 'Software development, agile methodologies and open source projects'
  },
  webpack(config) {
    config.optimization.minimizer = config.optimization.minimizer || [];
    config.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({}));

    return config;
  },
});
