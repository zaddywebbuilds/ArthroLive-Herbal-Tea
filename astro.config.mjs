// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

/**
 * SITE_URL  the deployed origin, no trailing slash
 *           e.g. https://zaddywebbuilds.github.io  or  https://arthrolive.com.gh
 * BASE_PATH the sub-path the site is served from
 *           '/ArthroLive-Herbal-Tea' on a GitHub project page, '/' on a domain
 *
 * Both are set by .github/workflows/deploy.yml. The defaults below are for
 * local development, where the site always runs at the root.
 */
const SITE_URL = process.env.SITE_URL || 'https://zaddywebbuilds.github.io';
const BASE_PATH = process.env.BASE_PATH || '/';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  output: 'static',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'always' },
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.SITE_URL': JSON.stringify(SITE_URL),
    },
  },
});
