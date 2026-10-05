import { useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { SITE_URL, DEFAULT_BRAND, OG_IMAGE_PATH, PAGES } from '../seo/seoConfig';
import { buildSchema } from '../seo/schema';

// Create or update a <meta> tag in <head>. Empty content removes it.
const setMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!content) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setCanonical = (href) => {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!href) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const setJsonLd = (data) => {
  let el = document.getElementById('seo-jsonld');
  if (!data) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.id = 'seo-jsonld';
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
};

/**
 * Per-page SEO: title, description, keywords, canonical, Open Graph, Twitter
 * and JSON-LD. Values saved in Admin > SEO win; empty fields fall back to the
 * defaults in seo/seoConfig.js. Renders nothing.
 * Use `page="private"` for admin/login screens (always noindex).
 */
const Seo = ({ page = 'home' }) => {
  const { siteSettings } = useAdmin();
  const brand = siteSettings?.websiteName || DEFAULT_BRAND;

  useEffect(() => {
    const defaults = PAGES[page] || PAGES.home;
    const seo = siteSettings?.seo || {};
    const custom = seo.pages?.[page] || {};
    const isPrivate = page === 'private';
    const fill = (value) => value.replaceAll('{brand}', brand);

    const baseUrl = (seo.siteUrl || SITE_URL).replace(/\/$/, '');
    const title = fill(custom.title || defaults.title);
    const description = fill(custom.description || defaults.description);
    const keywords = custom.keywords ? fill(custom.keywords) : defaults.keywords.map(fill).join(', ');
    const url = `${baseUrl}${defaults.path}`;
    const image = seo.defaultOgImage || `${baseUrl}${OG_IMAGE_PATH}`;
    const indexable = !isPrivate && seo.allowIndexing !== false;
    const show = (value) => (isPrivate ? '' : value);

    document.title = title;
    setMeta('name', 'robots', indexable ? 'index, follow, max-image-preview:large' : 'noindex, nofollow');
    setMeta('name', 'description', show(description));
    setMeta('name', 'keywords', show(keywords));
    setCanonical(show(url));

    setMeta('property', 'og:type', show('website'));
    setMeta('property', 'og:site_name', show(brand));
    setMeta('property', 'og:title', show(title));
    setMeta('property', 'og:description', show(description));
    setMeta('property', 'og:url', show(url));
    setMeta('property', 'og:image', show(image));
    setMeta('property', 'og:locale', show('en_US'));

    setMeta('name', 'twitter:card', show('summary_large_image'));
    setMeta('name', 'twitter:site', show(seo.twitterHandle ? `@${seo.twitterHandle}` : ''));
    setMeta('name', 'twitter:title', show(title));
    setMeta('name', 'twitter:description', show(description));
    setMeta('name', 'twitter:image', show(image));

    setMeta('name', 'google-site-verification', show(seo.googleVerification || ''));
    setMeta('name', 'msvalidate.01', show(seo.bingVerification || ''));

    setJsonLd(isPrivate ? null : buildSchema(siteSettings || {}, brand, baseUrl, image));
  }, [page, brand, siteSettings]);

  return null;
};

export default Seo;
