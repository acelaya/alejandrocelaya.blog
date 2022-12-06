const sitemap = require("nextjs-sitemap-generator");
const config = require('../config/config');

const outDir = `${__dirname}/../out`;

// TODO Make MJS

sitemap({
  baseUrl: config.SITE_URL,
  pagesDirectory: outDir,
  targetDirectory: outDir,
  ignoredExtensions: ['js', 'map', 'ico', 'xml', 'txt'],
  ignoredPaths: ['[fallback]', 'assets', '404'],
  ignoreIndexFiles: true,
});
