import React, { useEffect, useState } from 'react';
import { Search, Save, RotateCcw } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { PAGES, SITE_URL, DEFAULT_BRAND } from '../seo/seoConfig';

const PAGE_TABS = [
  ['home', 'Home'],
  ['menu', 'Menu'],
  ['about', 'About'],
  ['gallery', 'Gallery'],
  ['reservations', 'Reservations']
];

const emptyPage = { title: '', description: '', keywords: '' };

const emptySeo = {
  allowIndexing: true,
  siteUrl: '',
  defaultOgImage: '',
  twitterHandle: '',
  googleVerification: '',
  bingVerification: '',
  pages: Object.fromEntries(PAGE_TABS.map(([key]) => [key, { ...emptyPage }]))
};

// Merge what the server sent into the full shape so every field exists.
const withDefaults = (seo = {}) => ({
  ...emptySeo,
  ...seo,
  pages: Object.fromEntries(
    PAGE_TABS.map(([key]) => [key, { ...emptyPage, ...(seo.pages?.[key] || {}) }])
  )
});

const inputClass = 'w-full bg-surface p-3 rounded-xl border border-primary/5 outline-none focus:ring-2 focus:ring-primary/10';

// Green when inside the length Google usually shows, amber when too long.
const Counter = ({ value, ideal }) => (
  <span className={`text-xs font-normal ${value.length > ideal ? 'text-amber-600' : 'text-secondary/60'}`}>
    {value.length}/{ideal}
  </span>
);

const AdminSEO = () => {
  const { getSettings, updateSeo } = useAdmin();
  const [seo, setSeo] = useState(emptySeo);
  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const [activePage, setActivePage] = useState('home');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings()
      .then((settings) => {
        setSeo(withDefaults(settings.seo));
        setBrand(settings.websiteName || DEFAULT_BRAND);
      })
      .catch((error) => setStatus(error.message || 'Could not load SEO settings.'))
      .finally(() => setLoading(false));
  }, []);

  const updateGlobal = (key, value) => setSeo((current) => ({ ...current, [key]: value }));

  const updatePage = (key, value) =>
    setSeo((current) => ({
      ...current,
      pages: { ...current.pages, [activePage]: { ...current.pages[activePage], [key]: value } }
    }));

  const resetPage = () =>
    setSeo((current) => ({ ...current, pages: { ...current.pages, [activePage]: { ...emptyPage } } }));

  const save = async (event) => {
    event.preventDefault();
    setStatus('Saving...');
    try {
      const saved = await updateSeo(seo);
      setSeo(withDefaults(saved.seo));
      setStatus('SEO saved. Changes are live on the website now.');
    } catch (error) {
      setStatus(error.message || 'Could not save SEO settings.');
    }
  };

  const defaults = PAGES[activePage];
  const page = seo.pages[activePage];
  const fill = (text) => text.replaceAll('{brand}', brand);

  // What the visitor will see in Google for this page
  const baseUrl = (seo.siteUrl || SITE_URL).replace(/\/$/, '');
  const previewTitle = fill(page.title || defaults.title);
  const previewDescription = fill(page.description || defaults.description);
  const previewUrl = `${baseUrl}${defaults.path}`;
  const keywordCount = (page.keywords || defaults.keywords.join(','))
    .split(',')
    .filter((word) => word.trim()).length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <Search className="text-primary" size={28} />
        <h1 className="font-headline-md text-4xl text-primary">SEO</h1>
      </div>
      <p className="text-secondary/70 mb-8 max-w-2xl">
        Control how each page appears on Google and when shared on WhatsApp, Facebook or X. Leave a field empty to use
        the built-in default. You can write {'{brand}'} to insert your website name.
      </p>

      <form onSubmit={save} className="space-y-8">
        {loading ? (
          <p className="text-secondary/60">Loading SEO settings...</p>
        ) : (
          <>
            {/* Per-page SEO */}
            <section className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-primary/5 space-y-6">
              <div className="flex flex-wrap gap-2">
                {PAGE_TABS.map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActivePage(key)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      activePage === key ? 'bg-primary text-white' : 'bg-surface text-secondary hover:bg-primary/10'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Google result preview */}
              <div className="rounded-2xl border border-primary/10 bg-surface p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-secondary/50 mb-3">Google preview</p>
                <p className="text-xs text-secondary/70 break-all">{previewUrl}</p>
                <p className="text-xl text-[#1a0dab] leading-snug mt-1">{previewTitle}</p>
                <p className="text-sm text-secondary/80 mt-1">{previewDescription}</p>
              </div>

              <label className="block text-sm font-bold text-secondary">
                <span className="flex justify-between">
                  Page title <Counter value={page.title || previewTitle} ideal={60} />
                </span>
                <input
                  value={page.title}
                  onChange={(event) => updatePage('title', event.target.value)}
                  placeholder={defaults.title}
                  maxLength={120}
                  className={`${inputClass} mt-2 font-normal`}
                />
              </label>

              <label className="block text-sm font-bold text-secondary">
                <span className="flex justify-between">
                  Meta description <Counter value={page.description || previewDescription} ideal={160} />
                </span>
                <textarea
                  value={page.description}
                  onChange={(event) => updatePage('description', event.target.value)}
                  placeholder={defaults.description}
                  maxLength={320}
                  rows={3}
                  className={`${inputClass} mt-2 font-normal`}
                />
              </label>

              <label className="block text-sm font-bold text-secondary">
                <span className="flex justify-between">
                  Keywords (comma separated) <span className="text-xs font-normal text-secondary/60">{keywordCount} keywords</span>
                </span>
                <textarea
                  value={page.keywords}
                  onChange={(event) => updatePage('keywords', event.target.value)}
                  placeholder={defaults.keywords.join(', ')}
                  rows={3}
                  className={`${inputClass} mt-2 font-normal`}
                />
                <span className="mt-2 block text-xs font-normal text-secondary/60">
                  Use phrases people really search, e.g. "cafe in Portland", "best cold brew near me". Up to 30 keywords.
                </span>
              </label>

              <button
                type="button"
                onClick={resetPage}
                className="inline-flex items-center gap-2 rounded-lg border border-primary/10 px-3 py-2 text-xs font-bold text-secondary transition hover:bg-surface"
              >
                <RotateCcw size={14} /> Reset this page to default
              </button>
            </section>

            {/* Site-wide SEO */}
            <section className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-primary/5 space-y-6">
              <h2 className="font-headline-md text-2xl text-primary">Site-wide</h2>

              <label className="flex items-start gap-3 text-sm font-bold text-secondary">
                <input
                  type="checkbox"
                  checked={seo.allowIndexing}
                  onChange={(event) => updateGlobal('allowIndexing', event.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <span>
                  Allow Google to show this website in search results
                  <span className="mt-1 block text-xs font-normal text-secondary/60">
                    Turn this off only while the site is under construction.
                  </span>
                </span>
              </label>

              <div className="grid md:grid-cols-2 gap-5">
                <label className="block text-sm font-bold text-secondary">
                  Website address (domain)
                  <input
                    value={seo.siteUrl}
                    onChange={(event) => updateGlobal('siteUrl', event.target.value)}
                    placeholder="https://www.yourcafe.com"
                    className={`${inputClass} mt-2 font-normal`}
                  />
                  <span className="mt-2 block text-xs font-normal text-secondary/60">
                    Used for canonical links and share previews. Empty = the address the site is opened on.
                  </span>
                </label>

                <label className="block text-sm font-bold text-secondary">
                  Share image link (1200 x 630)
                  <input
                    value={seo.defaultOgImage}
                    onChange={(event) => updateGlobal('defaultOgImage', event.target.value)}
                    placeholder="https://.../share-image.jpg"
                    className={`${inputClass} mt-2 font-normal`}
                  />
                  <span className="mt-2 block text-xs font-normal text-secondary/60">
                    Shown when your link is shared. Must be a full https:// link.
                  </span>
                </label>

                <label className="block text-sm font-bold text-secondary">
                  X (Twitter) handle
                  <input
                    value={seo.twitterHandle}
                    onChange={(event) => updateGlobal('twitterHandle', event.target.value)}
                    placeholder="@brewandhearth"
                    className={`${inputClass} mt-2 font-normal`}
                  />
                </label>

                <div className="hidden md:block" />

                <label className="block text-sm font-bold text-secondary">
                  Google Search Console verification
                  <input
                    value={seo.googleVerification}
                    onChange={(event) => updateGlobal('googleVerification', event.target.value)}
                    placeholder="Paste the code or the whole meta tag"
                    className={`${inputClass} mt-2 font-normal`}
                  />
                </label>

                <label className="block text-sm font-bold text-secondary">
                  Bing Webmaster verification
                  <input
                    value={seo.bingVerification}
                    onChange={(event) => updateGlobal('bingVerification', event.target.value)}
                    placeholder="Paste the code or the whole meta tag"
                    className={`${inputClass} mt-2 font-normal`}
                  />
                </label>
              </div>
            </section>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
              >
                <Save size={18} /> Save SEO
              </button>
              {status && <p className="text-sm text-secondary">{status}</p>}
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default AdminSEO;
