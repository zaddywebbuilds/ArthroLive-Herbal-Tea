/**
 * Path helpers for deployments that live under a sub-path.
 *
 * On a GitHub project page the site is served from
 *   https://<user>.github.io/<repo>/
 * so every absolute path ("/images/x.webp", "/privacy-policy") must be
 * prefixed with that base. On a custom domain the base is just "/".
 *
 * BASE_PATH and SITE_URL are set by the build (see astro.config.mjs and
 * .github/workflows/deploy.yml), so nothing here needs editing by hand.
 */

/** The base path, normalised to '' or '/segment' (never a trailing slash). */
export const BASE: string = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');

/** Prefix an absolute site path with the deployment base. */
export function withBase(path: string): string {
  if (!path.startsWith('/')) return path;
  return `${BASE}${path}` || '/';
}

/** The deployed origin, e.g. 'https://zaddywebbuilds.github.io'. */
export const ORIGIN: string = (import.meta.env.SITE_URL as string) || '';

/** Absolute URL for canonical tags, Open Graph and structured data. */
export function absolute(path: string, origin: string): string {
  return new URL(withBase(path), origin).href;
}
