// Generates public/sitemap.xml and public/robots.txt before every build.
// Set SITE_URL in your host (Vercel > Settings > Environment Variables),
// e.g. SITE_URL=https://www.yourcafe.com
import { writeFileSync, mkdirSync } from 'node:fs';

const siteUrl = (process.env.SITE_URL || 'https://www.brewandhearth.com').replace(/\/$/, '');
const pages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/menu', priority: '0.9', changefreq: 'weekly' },
  { path: '/reservations', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/gallery', priority: '0.6', changefreq: 'monthly' }
];
const today = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${siteUrl}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /kitchen

Sitemap: ${siteUrl}/sitemap.xml
`;

mkdirSync('public', { recursive: true });
writeFileSync('public/sitemap.xml', sitemap);
writeFileSync('public/robots.txt', robots);
console.log(`SEO files generated for ${siteUrl}`);
