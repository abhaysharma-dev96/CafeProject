// Builds schema.org JSON-LD so Google can show the café as a rich local result
// (address, phone, hours, menu and reservation links).

// "08:00 AM" -> "08:00", "8:30 pm" -> "20:30"
const to24h = (value = '') => {
  const m = String(value).match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!m) return null;
  let hours = Number(m[1]);
  const period = (m[3] || '').toUpperCase();
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return `${String(hours).padStart(2, '0')}:${m[2]}`;
};

// "123 Artisan Alley, Portland, OR 97209" -> street / city / state / postcode
const parseAddress = (address = '') => {
  const parts = String(address).split(',').map((p) => p.trim()).filter(Boolean);
  const last = parts[parts.length - 1] || '';
  const region = last.match(/^([A-Za-z]{2})\s+(\d{4,6})$/);
  if (parts.length >= 3 && region) {
    return {
      '@type': 'PostalAddress',
      streetAddress: parts.slice(0, -2).join(', '),
      addressLocality: parts[parts.length - 2],
      addressRegion: region[1].toUpperCase(),
      postalCode: region[2],
      addressCountry: 'US'
    };
  }
  return { '@type': 'PostalAddress', streetAddress: address };
};

const isHttp = (url) => typeof url === 'string' && /^https?:\/\//i.test(url.trim());

export const buildSchema = (settings = {}, brand, siteUrl, fallbackImage) => {
  const opens = to24h(settings.shopOpenTime);
  const closes = to24h(settings.shopCloseTime);
  const sameAs = [settings.instagramUrl, settings.facebookUrl, settings.twitterUrl, settings.linkedinUrl].filter(isHttp);
  const logo = isHttp(settings.logoUrl) ? settings.logoUrl : fallbackImage;

  const cafe = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    '@id': `${siteUrl}/#cafe`,
    name: brand,
    url: `${siteUrl}/`,
    image: logo,
    logo,
    description:
      'Specialty coffee, artisan bakery and all-day brunch in a cozy neighbourhood café in Portland, Oregon.',
    servesCuisine: ['Coffee', 'Bakery', 'Brunch'],
    hasMenu: `${siteUrl}/menu`,
    acceptsReservations: `${siteUrl}/reservations`,
    address: parseAddress(settings.address || '123 Artisan Alley, Portland, OR 97209')
  };

  if (settings.contactNumber) cafe.telephone = settings.contactNumber;
  if (settings.email) cafe.email = settings.email;
  if (sameAs.length) cafe.sameAs = sameAs;
  if (opens && closes) {
    cafe.openingHoursSpecification = [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens,
        closes
      }
    ];
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: brand,
    url: `${siteUrl}/`
  };

  return [cafe, website];
};
