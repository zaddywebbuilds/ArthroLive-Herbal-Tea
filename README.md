# ArthroLive Ghana

Single-page sales site for ArthroLive Herbal Tea (20 tea bags) and ArthroLive Herbal
Balm (50g), built for customers in Ghana.

Astro 7 (static output) + Tailwind CSS 4 + TypeScript. No runtime framework, no
third-party JavaScript unless a tracking ID is configured.

---

## Before this goes live

`npm run build` ends with a readiness check that lists everything still
outstanding. All of it lives in **`src/config/site.ts`**.

Sections with no data **do not render at all**, so an unfinished site never shows
placeholder or invented content. Fill the config and the section appears.

| What | Where | Why it matters |
|---|---|---|
| **Ingredients** | `site.ingredients` | The biggest credibility gap for a herbal product. Transcribe from the physical pack or the supplier spec sheet. Do not write them from memory, and do not give an ingredient a claimed effect unless the pack states one. |
| **Real product media** | `site.proof.media` | Studio renders show what a pack looks like; they do not prove it exists. Phone footage is fine: an unboxing, the tea bags close up, the balm being opened. |
| **Customer reviews** | `site.testimonials` | Each needs `consent: true` or it will not render. Never invent a name, town, rating or recovery story. |
| **Contact details** | `site.contact` | Currently empty, so the footer shows a placeholder line. Never send paid traffic in that state. |
| **Order endpoint** | `site.order.endpoint` | See [backend/SETUP.md](backend/SETUP.md). Until it is set the form refuses to submit and says so. |
| **How long a pack lasts** | `site.supply` | Set `teaBagsPerDay` from the label only. Pricing cards then show "About N days of tea". |
| Prices (GH₵270 / 470 / 670) | `site.packages` | From the brief, needs confirmation. |
| Free nationwide delivery | `site.delivery.freeNationwide` | Currently `true`. Confirm you can honour it. |
| Canonical domain | `site.url` | A branded domain reads as more established than a github.io address. |
| Tracking IDs | `site.tracking` | Nothing loads until set. |

### A note on claims

The page is written to everyday comfort and routine, never to treatment outcomes.
When you add ingredients, keep each `note` to what the pack itself says. Do not
describe what an ingredient does in the body unless the manufacturer states it,
and never imply ArthroLive treats, cures or reverses any condition.

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

Orders go into a Google Sheet via a free Google Apps Script web app. The script
is in [`backend/orders.gs`](backend/orders.gs) and the step-by-step guide is in
[`backend/SETUP.md`](backend/SETUP.md). Roughly: create a sheet, paste the script,
deploy it as a web app, paste the `/exec` URL into `order.endpoint`.

The body is posted as `text/plain` on purpose. Apps Script does not answer CORS
preflight requests, so that keeps it a "simple" request. The payload is still
JSON. Switch `order.contentType` to `application/json` only if you move to a
backend that handles CORS itself.

Until an endpoint is set, a valid submission shows an error explaining the order
was **not** sent; it never shows a false confirmation. The same applies if the
backend rejects the order or the network fails.

Form protection: a honeypot field, a minimum fill time, an optional shared secret,
and a one-submission lock that prevents duplicate orders from repeated taps.

Set `contact.whatsapp` and an "Order on WhatsApp" link appears under the submit
button, prefilled with the package the visitor selected. It stays hidden while
that field is empty.

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
