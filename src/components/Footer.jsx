import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

// Brand icons drawn inline (lucide no longer ships brand logos)
const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const XIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const defaultQuickLinks = 'Home|/\nMenu|/menu\nAbout|/about\nGallery|/gallery\nReservations|/reservations';

const Footer = () => {
  const { siteSettings } = useAdmin();
  const defaults = {
    logoUrl: '',
    websiteName: 'Brew & Hearth',
    footerText: 'A space for mindful consumption and deliberate pauses.',
    contactNumber: '(555) 123-4567',
    email: 'hello@brewandhearth.com',
    address: '123 Artisan Alley, Portland, OR 97209',
    shopOpenTime: '08:00 AM',
    shopCloseTime: '08:00 PM',
    copyright: '© 2024 Brew & Hearth. All Rights Reserved.',
    quickLinks: defaultQuickLinks
  };
  const s = siteSettings || {};
  const settings = {
    ...defaults,
    ...Object.fromEntries(
      Object.entries(s).filter(([, value]) => value !== '' && value !== null && value !== undefined)
    )
  };

  const logoUrl = typeof settings.logoUrl === 'string' ? settings.logoUrl.trim() : '';

  // "Label|/path" per line (set from Admin > Settings)
  const quickLinks = (settings.quickLinks || defaultQuickLinks)
    .split('\n')
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter(([label, to]) => label && to);

  const whatsappHref = s.whatsappEnabled && s.whatsappNumber
    ? `https://wa.me/${String(s.whatsappNumber).replace(/\D/g, '')}${s.whatsappMessage ? `?text=${encodeURIComponent(s.whatsappMessage)}` : ''}`
    : '';

  // An icon only shows when its link is filled in from Admin > Settings
  const socials = [
    { name: 'Instagram', href: s.instagramUrl, Icon: InstagramIcon },
    { name: 'WhatsApp', href: whatsappHref, Icon: MessageCircle },
    { name: 'Facebook', href: s.facebookUrl, Icon: FacebookIcon },
    { name: 'X', href: s.twitterUrl, Icon: XIcon },
    { name: 'LinkedIn', href: s.linkedinUrl, Icon: LinkedinIcon }
  ].filter((item) => typeof item.href === 'string' && item.href.trim() && item.href.trim() !== '#');

  const linkClass = 'text-white/70 hover:text-white transition-colors';

  return (
    <footer className="bg-primary text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-center md:text-left">
          {/* Brand, text, social icons */}
          <div>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              {logoUrl ? (
                <img src={logoUrl} alt={settings.websiteName} className="h-12 w-12 rounded-full object-cover border border-white/20" />
              ) : null}
              <h2 className="font-headline-md text-2xl">{settings.websiteName}</h2>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              {settings.footerText}
            </p>
            {socials.length > 0 && (
              <div className="flex justify-center md:justify-start gap-3 mt-6">
                {socials.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    title={name}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white hover:text-primary transition-all"
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick links: project pages */}
          <div>
            <h4 className="font-bold mb-5 uppercase text-xs tracking-widest text-white/50">Quick Links</h4>
            <ul className="flex flex-col items-center md:items-start gap-3 text-sm">
              {quickLinks.map(([label, to]) => (
                <li key={`${label}-${to}`}>
                  {/^https?:\/\//i.test(to)
                    ? <a href={to} target="_blank" rel="noopener noreferrer" className={linkClass}>{label}</a>
                    : <Link to={to} className={linkClass}>{label}</Link>}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-5 uppercase text-xs tracking-widest text-white/50">Contact</h4>
            <ul className="flex flex-col items-center md:items-start gap-4 text-sm">
              <li className="flex items-center gap-3">
                <Phone size={16} className="shrink-0 text-white/60" />
                <a href={`tel:${settings.contactNumber}`} className={linkClass}>{settings.contactNumber}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="shrink-0 text-white/60" />
                <a href={`mailto:${settings.email}`} className={`${linkClass} break-all`}>{settings.email}</a>
              </li>
              <li className="flex items-start gap-3 text-white/70 text-left">
                <MapPin size={16} className="shrink-0 mt-0.5 text-white/60" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Clock size={16} className="shrink-0 text-white/60" />
                <span>{settings.shopOpenTime} - {settings.shopCloseTime}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 text-white/50 text-xs text-center">
          <p>{settings.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
