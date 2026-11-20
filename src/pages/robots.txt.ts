import type { APIRoute } from 'astro';
import { site } from '../config/site';
import { withBase } from '../lib/url';

export const GET: APIRoute = ({ site: astroSite }) => {
  const origin = astroSite?.origin ?? site.url;
  const sitemap = new URL(withBase('/sitemap.xml'), origin).href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
