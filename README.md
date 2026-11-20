# ArthroLive Ghana

Single-page sales site for ArthroLive Herbal Tea (20 tea bags) and ArthroLive Herbal
Balm (50g), built for customers in Ghana.

Astro 7 (static output) + Tailwind CSS 4 + TypeScript. No runtime framework, no
third-party JavaScript unless a tracking ID is configured.

---

## Before this goes live

Everything below lives in **`src/config/site.ts`** and is marked `>>> CONFIRM <<<`.
The site deliberately does not invent any of it.

| What | Where | Status |
|---|---|---|
| Contact phone / WhatsApp / email | `site.contact` | **empty** — the footer hides the block until these are filled in |
| Order endpoint | `site.order.endpoint` | **empty** — the form refuses to submit and says so rather than faking success |
| Prices (GH₵270 / 470 / 670) | `site.packages` | from the brief, **needs your confirmation** |
| Free delivery nationwide | `site.delivery.freeNationwide` | currently `true`, **confirm you can honour this** |
| Delivery timeline | `site.delivery.timeline` | empty, so the page says the team confirms the schedule |
| Canonical domain | `site.url` + `public/robots.txt` | currently `arthrolive.com.gh` |
| Tracking IDs | `site.tracking` | empty — nothing loads until set |
| Customer reviews | `site.showTestimonials` + `site.testimonials` | `false` — the testimonial block is hidden and a verified-facts trust block shows instead |

## Commands

```bash
npm install
npm run images   # regenerate WebP derivatives from source-images/
npm run dev      # local dev server
npm run build    # images + static build into dist/
npm run preview  # serve the built site
```

`npm run build` runs the image pipeline first, so a clean clone builds correctly.

## Connecting the order form

Set `site.order.endpoint` to any URL that accepts a JSON `POST`. A Google Apps Script
web app, Formspree, a Make/Zapier webhook or your own API all work. The payload is:

```json
{
  "package": { "id": "double", "name": "Double Pack", "teaQty": 2, "balmQty": 2, "price": 470 },
  "delivery": { "fee": 0, "method": "Pay on delivery" },
  "total": 470,
  "currency": "GHS",
  "customer": {
    "fullName": "...", "phone": "+233...", "altPhone": "",
    "region": "...", "city": "...", "address": "...", "landmark": "..."
  },
  "meta": { "submittedAt": "ISO-8601", "page": "https://..." }
}
```

Phone numbers are normalised to `+233XXXXXXXXX` before they are sent. Until an endpoint
is set, a valid submission shows an error explaining the order was **not** sent; it never
shows a false confirmation.

Form protection: a honeypot field, a minimum fill time, and a one-submission lock that
prevents duplicate orders from repeated taps.

## Tracking

`src/components/Tracking.astro` injects nothing until an ID is set. Once set, it exposes
`window.alTrack(event, params)` which fans out to Meta Pixel, GA4 and GTM:

`PageView`, `ViewContent`, `PackageSelected`, `CtaClicked`, `InitiateCheckout`, `Lead`,
`OrderSubmitted`.

No `Purchase` event is ever fired, because no purchase happens on the site. Names, phone
numbers, addresses, regions and anything health-related are **never** passed to analytics.

## Structure

```
src/config/site.ts        all editable business data
src/components/           announcement bar, header, hero, symptom card, product card,
                          lifestyle gallery, pricing card, order form, FAQ, sticky CTA, footer
src/pages/index.astro     the single-page funnel + JSON-LD
src/pages/*.astro         privacy, terms, delivery & returns (linked from the footer only)
src/pages/sitemap.xml.ts  generated sitemap
scripts/build-images.mjs  WebP pipeline
source-images/            original masters, preserved
```

## SEO

One `<h1>`, logical `<h2>`/`<h3>` order, descriptive alt text, canonical URL, Open Graph
and Twitter card metadata with a 1200x630 share image, `robots.txt`, generated
`sitemap.xml`, and JSON-LD for Organization, WebSite, Product with per-package Offers in
GHS, and FAQPage. No aggregate rating schema, because there are no verified ratings.

All copy is in the server-rendered HTML; nothing meaningful depends on JavaScript.

## Claims policy

Copy is written to everyday comfort and routine, not to treatment outcomes. The site does
not claim ArthroLive cures arthritis, repairs nerves, or replaces prescribed treatment,
and it invents no ingredients, studies, approvals, statistics, reviews or sales figures.
The footer carries a product safety notice and directs persistent, severe or unexplained
symptoms to a qualified healthcare professional.

## Deploying

Static output in `dist/`. Suits GitHub Pages, Netlify or Cloudflare Pages. For GitHub
Pages, run `npm ci && npm run build` in the workflow and publish `dist/`.
