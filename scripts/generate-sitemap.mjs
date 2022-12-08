import { dirname } from 'path';
import { fileURLToPath } from 'url';
import sitemap from "nextjs-sitemap-generator";
import { config } from '../config/config.mjs';

const currentDir = dirname(fileURLToPath(import.meta.url));
const outDir = `${currentDir}/../out`;

sitemap({
  baseUrl: config.SITE_URL,
  pagesDirectory: outDir,
  targetDirectory: outDir,
  ignoredExtensions: ['js', 'map', 'ico', 'xml', 'txt'],
  ignoredPaths: ['[fallback]', 'assets', '404'],
  ignoreIndexFiles: true,
});
