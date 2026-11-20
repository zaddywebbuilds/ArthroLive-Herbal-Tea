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
  url: 'https://arthrolive.com.gh',
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
    phone: '',            // e.g. '+233 20 000 0000'
    whatsapp: '',         // digits only, international format e.g. '233200000000'
    email: '',            // e.g. 'orders@arthrolive.com.gh'
    hours: 'Monday to Saturday, 8am to 6pm',
    company: 'ArthroLive Ghana',
    address: '',          // e.g. 'Accra, Ghana'
  },

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
   *  ORDER SUBMISSION
   *  Set `endpoint` to a URL that accepts a JSON POST (Google Apps
   *  Script, Formspree, your own API, a Make/Zapier webhook...).
   *  While it is empty the form will NOT pretend an order succeeded.
   *  ------------------------------------------------------------------ */
  order: {
    endpoint: '',          // >>> CONFIRM <<<  e.g. 'https://script.google.com/macros/s/.../exec'
    method: 'POST' as const,
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

  /** Set to true only when real, verified customer reviews exist. */
  showTestimonials: false,
  testimonials: [] as { name: string; location: string; quote: string }[],
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

export const formatPrice = (amount: number): string =>
  `${site.currencySymbol}${amount.toLocaleString('en-GH')}`;
