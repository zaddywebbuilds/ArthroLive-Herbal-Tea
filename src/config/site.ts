/**
 * ArthroLive Ghana - central site configuration
 * ---------------------------------------------
 * EVERYTHING the business needs to change lives in this one file:
 * prices, quantities, contact details, delivery terms, tracking IDs
 * and the order submission endpoint.
 *
 * Items marked  >>> CONFIRM <<<  are placeholders that must be replaced
 * with verified business information before the site goes live.
 */

export type Currency = 'GHS';

export interface Package {
  id: string;
  name: string;
  teaQty: number;
  balmQty: number;
  /** Price in Ghana cedis */
  price: number;
  /** Saving vs buying the Starter Pack repeatedly. 0 = no saving shown. */
  saving: number;
  badge?: string;
  cta: string;
  blurb: string;
}

export const site = {
  brand: 'ArthroLive',
  tagline: 'Herbal Tea + Soothing Massage Balm',
  /** Canonical production URL. Update when the domain is live. */
  url: 'https://nostalgiasales.com',
  locale: 'en_GH',
  country: 'Ghana',

  meta: {
    title: 'ArthroLive Ghana | Herbal Tea & Balm for Joint Comfort',
    description:
      'Discover ArthroLive Herbal Tea and Herbal Balm in Ghana. A two-product wellness routine for everyday body comfort and soothing topical massage.',
    ogImage: '/arthrolive-ghana-social-share.jpg',
  },

  currency: 'GHS' as Currency,
  currencySymbol: 'GH\u20B5',

  /** ------------------------------------------------------------------
   *  CONTACT  >>> CONFIRM <<<
   *  Leave a value as an empty string and the site simply hides that
   *  element rather than showing a fake number.
   *  ------------------------------------------------------------------ */
  contact: {
    phone: '+233 59 721 0794',
    whatsapp: '233597210794',
    email: 'orders@nostalgiasales.com',
    hours: '',            // >>> CONFIRM <<< e.g. 'Monday to Saturday, 8am to 6pm'
    company: 'Nostalgia Sales',
    address: 'Ghana',
  } as Record<'phone' | 'whatsapp' | 'email' | 'hours' | 'company' | 'address', string>,

  /** ------------------------------------------------------------------
   *  DELIVERY & PAYMENT  >>> CONFIRM <<<
   *  Only state what the business can actually honour.
   *  ------------------------------------------------------------------ */
  delivery: {
    freeNationwide: true,
    /** Shown on the order summary when freeNationwide is false. */
    feeAccra: 0,
    feeOtherRegions: 0,
    /** Set to '' to show "our team will confirm your delivery schedule". */
    timeline: '',
    payOnDelivery: true,
    note: 'Our team calls every customer to confirm the order before dispatch.',
  },

  /** ------------------------------------------------------------------
   *  PRICING  >>> CONFIRM <<<
   *  ------------------------------------------------------------------ */
  packages: [
    {
      id: 'starter',
      name: 'Starter Pack',
      teaQty: 1,
      balmQty: 1,
      price: 270,
      saving: 0,
      cta: 'Order 1 Pack',
      blurb: 'A first full routine for one person.',
    },
    {
      id: 'double',
      name: 'Double Pack',
      teaQty: 2,
      balmQty: 2,
      price: 470,
      saving: 70,
      badge: 'Best Value Pick',
      cta: 'Order 2 Packs',
      blurb: 'Enough to keep the routine going, or share with a partner.',
    },
    {
      id: 'family',
      name: 'Family Pack',
      teaQty: 3,
      balmQty: 3,
      price: 670,
      saving: 140,
      cta: 'Order 3 Packs',
      blurb: 'For a household, or for your parents and grandparents.',
    },
  ] as Package[],

  /** ------------------------------------------------------------------
   *  PRODUCTS
   *  ------------------------------------------------------------------ */
  products: {
    tea: {
      name: 'ArthroLive Herbal Tea',
      size: '20 tea bags',
      type: 'Herbal beverage',
      description:
        'A herbal tea you prepare and drink as part of your normal day, like any other tea in the house.',
      points: [
        '20 individually sealed tea bags',
        'Herbal beverage, prepared with hot water',
        'Designed to complement a daily wellness routine',
        'Prepare and drink according to the directions on the pack',
      ],
    },
    balm: {
      name: 'ArthroLive Herbal Balm',
      size: '50g jar',
      type: 'Topical massage balm',
      description:
        'A topical balm you massage into the areas that feel tight, sore or uncomfortable.',
      points: [
        '50g jar, easy to keep by the bed or in a bag',
        'For external use on intact skin only',
        'Designed for soothing massage of the area you choose',
        'Convenient for everyday body care at home',
      ],
    },
  },

  /** ------------------------------------------------------------------
   *  INGREDIENTS  >>> SUPPLIER DATA REQUIRED <<<
   *
   *  The single biggest credibility gap on the page. People taking
   *  medication want to know what they are drinking and rubbing on.
   *
   *  Copy these straight off the physical pack or the supplier's spec
   *  sheet. Do NOT write them from memory and do NOT describe what an
   *  ingredient "does" in the body unless the pack or the supplier
   *  states it. While both lists are empty the whole section is hidden.
   *  ------------------------------------------------------------------ */
  ingredients: {
    /** e.g. 'Each tea bag contains:' - whatever the pack says. */
    teaIntro: '',
    tea: [] as { name: string; note?: string }[],

    balmIntro: '',
    balm: [] as { name: string; note?: string }[],

    /** Anything printed on the pack: allergens, storage, warnings. */
    precautions: [] as string[],

    /**
     * Only a registration the business actually holds, exactly as issued.
     * e.g. { authority: 'Ghana FDA', number: 'FDA/HD/00-0000' }
     */
    registration: null as { authority: string; number: string } | null,
  },

  /** ------------------------------------------------------------------
   *  PRODUCT PROOF  >>> REAL MEDIA REQUIRED <<<
   *
   *  Studio renders show what the pack looks like; they do not prove the
   *  product exists. Shoot these on a phone, they do not need to be
   *  pretty. Put files in source-images/ (photos) or public/video/.
   *
   *  Each entry: { type: 'image' | 'video', src, alt, caption }
   *  For an image, `src` is the manifest key (filename without extension).
   *  While this is empty the section is hidden.
   *  ------------------------------------------------------------------ */
  proof: {
    heading: 'The Real Thing, In Our Hands',
    intro:
      'Photographs and clips of the actual packs we deliver, filmed by our own team in Ghana.',
    media: [] as {
      type: 'image' | 'video';
      src: string;
      poster?: string;
      alt: string;
      caption?: string;
    }[],
  },

  /** ------------------------------------------------------------------
   *  HOW LONG A PACK LASTS  >>> CONFIRM AGAINST THE LABEL <<<
   *  Leave at 0 to hide the "lasts about N days" line everywhere.
   *  Set it ONLY from the directions printed on the pack.
   *  ------------------------------------------------------------------ */
  supply: {
    /** Tea bags used per day according to the label. */
    teaBagsPerDay: 0,
    /** Free-text override, used instead of the calculation when set. */
    note: '',
  },

  /** ------------------------------------------------------------------
   *  ORDER SUBMISSION
   *  Paste the Google Apps Script /exec URL here. See backend/SETUP.md.
   *  While it is empty the form will NOT pretend an order succeeded.
   *  ------------------------------------------------------------------ */
  order: {
    /**
     * 'cf7'  post to the Contact Form 7 REST API on the same WordPress
     *        site. This is what the VeraFem funnel already uses, so orders
     *        land in the same inbox and need no new infrastructure.
     * 'json' post JSON to a Google Apps Script or similar (backend/SETUP.md).
     */
    mode: 'cf7' as 'cf7' | 'json',

    /**
     * CF7 form 194 on nostalgiasales.com, the same form the VeraFem page
     * posts to. Orders are told apart by the subject line.
     *
     * To give ArthroLive its own form instead: duplicate the form in
     * WP Admin > Contact, keep the four field names (your-name, your-email,
     * your-subject, your-message), then put the new ID in this URL and in
     * cf7UnitTag.
     */
    endpoint: 'https://nostalgiasales.com/wp-json/contact-form-7/v1/contact-forms/194/feedback',

    /** Where CF7 mails the order. Must match the form's own Mail settings. */
    cf7Email: 'orders@nostalgiasales.com',
    cf7UnitTag: 'wpcf7-f194-arthrolive',

    /**
     * Content type for the POST body. The body is always JSON.
     *
     * 'text/plain;charset=utf-8' keeps the request "simple" so the browser
     * sends no CORS preflight. Google Apps Script does not answer preflight
     * requests, so this is REQUIRED for the Apps Script backend.
     *
     * Switch to 'application/json' only for a backend that handles CORS
     * preflight itself (Formspree, your own API, a Make/Zapier webhook).
     */
    contentType: 'text/plain;charset=utf-8',

    /**
     * Must match SHARED_SECRET in backend/orders.gs. Leave both empty to
     * skip the check. This only filters out casual bots: it is visible in
     * the page source, so it is not authentication.
     */
    secret: '',

    /** Minimum seconds a visitor must spend before a submit is accepted. */
    minFillSeconds: 3,
  },

  /** ------------------------------------------------------------------
   *  TRACKING  -  leave empty to disable. Nothing loads until an ID is set.
   *  ------------------------------------------------------------------ */
  tracking: {
    metaPixelId: '',
    ga4MeasurementId: '',
    gtmContainerId: '',
  },

  /** ------------------------------------------------------------------
   *  CUSTOMER REVIEWS  >>> REAL REVIEWS ONLY <<<
   *
   *  Add an entry only for a review a real customer actually gave you,
   *  with their permission to publish it. Never write one yourself and
   *  never invent a name, a town, a rating or a recovery story.
   *
   *  `consent` must be true for the entry to render at all.
   *  `photo` / `video` are optional manifest keys or /video/ paths.
   *  The section stays hidden until at least one consented entry exists.
   *  ------------------------------------------------------------------ */
  testimonials: [] as {
    name: string;
    location: string;
    quote: string;
    consent: boolean;
    photo?: string;
    video?: string;
  }[],
} as const;

/** All 16 administrative regions of Ghana. */
export const GHANA_REGIONS = [
  'Ahafo',
  'Ashanti',
  'Bono',
  'Bono East',
  'Central',
  'Eastern',
  'Greater Accra',
  'North East',
  'Northern',
  'Oti',
  'Savannah',
  'Upper East',
  'Upper West',
  'Volta',
  'Western',
  'Western North',
] as const;

export const lowestPrice = Math.min(...site.packages.map((p) => p.price));

/** Reviews that are real AND cleared for publication. */
export const publishableTestimonials = site.testimonials.filter((t) => t.consent);

export const hasIngredients =
  site.ingredients.tea.length > 0 || site.ingredients.balm.length > 0;

export const hasProof = site.proof.media.length > 0;

/** Price per tea+balm set, so the saving on bigger packs is obvious. */
export function perSetPrice(pkg: Package): number {
  return pkg.price / Math.max(pkg.teaQty, 1);
}

/**
 * "Lasts about N days" for a package, or '' when the label data has not
 * been entered. Never guessed.
 */
export function supplyDuration(pkg: Package): string {
  if (site.supply.note) return site.supply.note;
  const perDay = site.supply.teaBagsPerDay;
  if (!perDay || perDay <= 0) return '';
  const days = Math.floor((pkg.teaQty * 20) / perDay);
  return `About ${days} days of tea`;
}

/**
 * Things that must be filled in before paid traffic is sent here.
 * Printed as a build warning by scripts/check-readiness.mjs.
 */
export function readinessGaps(): string[] {
  const gaps: string[] = [];
  if (!site.order.endpoint) gaps.push('order.endpoint is empty, so the form cannot take orders');
  if (!site.contact.phone && !site.contact.whatsapp) gaps.push('no phone or WhatsApp number, so buyers cannot reach you');
  if (!site.contact.email) gaps.push('contact.email is empty');
  if (!site.contact.hours) gaps.push('contact.hours is empty');
  if (!hasIngredients) gaps.push('ingredients are empty, the biggest credibility gap for a herbal product');
  if (!hasProof) gaps.push('proof.media is empty, so there is no real photo or video of the product');
  if (publishableTestimonials.length === 0) gaps.push('no consented customer reviews');
  if (!site.supply.teaBagsPerDay && !site.supply.note) gaps.push('supply data missing, so packages cannot show how long they last');
  if (!site.tracking.metaPixelId && !site.tracking.ga4MeasurementId && !site.tracking.gtmContainerId) gaps.push('no tracking ID, so ad spend cannot be attributed');
  return gaps;
}

export const formatPrice = (amount: number): string =>
  `${site.currencySymbol}${amount.toLocaleString('en-GH')}`;
