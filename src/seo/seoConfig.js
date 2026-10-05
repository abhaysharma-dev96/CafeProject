// Central SEO config: per-page title, description and keywords.
// "{brand}" is replaced with the website name saved in Admin > Settings.

export const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');

export const DEFAULT_BRAND = 'Brew & Hearth';
export const OG_IMAGE_PATH = '/og-image.png';

const brandKeywords = ['{brand}', '{brand} cafe', '{brand} Portland'];

export const PAGES = {
  home: {
    path: '/',
    title: '{brand} | Specialty Coffee, Artisan Bakery & Cozy Café in Portland, OR',
    description:
      'Visit {brand} in Portland for freshly roasted specialty coffee, handcrafted espresso, artisan pastries and all-day brunch in a warm, cozy café. Order online or reserve a table.',
    keywords: [
      'cafe in Portland',
      'best coffee shop in Portland',
      'specialty coffee Portland OR',
      'artisan bakery Portland',
      'fresh roasted coffee',
      'local coffee roasters',
      'cozy cafe near me',
      'brunch cafe Portland',
      'espresso bar',
      'cafe with free wifi',
      'coffee and pastries',
      ...brandKeywords
    ]
  },
  menu: {
    path: '/menu',
    title: 'Menu – Coffee, Espresso, Pastries & Brunch | {brand}',
    description:
      'Browse the {brand} menu: single-origin coffee, lattes, cold brew, tea, fresh-baked pastries, sandwiches and brunch favourites. Order online for pickup or dine-in.',
    keywords: [
      'cafe menu Portland',
      'coffee menu',
      'latte and cappuccino',
      'cold brew coffee',
      'fresh baked pastries',
      'croissants and muffins',
      'breakfast and brunch menu',
      'order coffee online',
      'cafe takeaway',
      'vegan cafe options',
      ...brandKeywords
    ]
  },
  about: {
    path: '/about',
    title: 'Our Story – Craft Coffee Roasters & Bakers | {brand}',
    description:
      'Discover the story behind {brand}: from a small home roaster to a Portland neighbourhood café built on ethically sourced beans, careful roasting and artisan baking.',
    keywords: [
      'about our cafe',
      'craft coffee roasters',
      'ethically sourced coffee beans',
      'single origin coffee',
      'artisan baker Portland',
      'barista training',
      'independent coffee shop',
      'local cafe story',
      ...brandKeywords
    ]
  },
  gallery: {
    path: '/gallery',
    title: 'Gallery – Café Interior, Latte Art & Fresh Bakes | {brand}',
    description:
      'See inside {brand}: our cozy café interior, latte art, fresh pastries and community moments. Photos from our Portland coffee shop.',
    keywords: [
      'cafe gallery',
      'latte art',
      'cafe interior photos',
      'coffee shop ambience',
      'pastry photos',
      'instagram worthy cafe',
      ...brandKeywords
    ]
  },
  reservations: {
    path: '/reservations',
    title: 'Reserve a Table & Contact Us | {brand} Portland',
    description:
      'Book a table at {brand} in Portland, plan a group get-together or send us a message. Find our address, opening hours, phone number and WhatsApp.',
    keywords: [
      'book a table cafe',
      'cafe reservation Portland',
      'group booking cafe',
      'private events cafe',
      'cafe opening hours',
      'cafe near me',
      'contact cafe',
      ...brandKeywords
    ]
  },
  // Admin, kitchen and login screens: never indexed.
  private: {
    path: '',
    title: '{brand} – Staff Area',
    description: '',
    keywords: []
  }
};
