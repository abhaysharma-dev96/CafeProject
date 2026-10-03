import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

// Compact Call + WhatsApp buttons (same look as the Reservations page, smaller).
// Number, message and on/off switches come from Admin > Settings.
const ContactButtons = ({ className = '' }) => {
  const { siteSettings } = useAdmin();
  if (!siteSettings) return null;

  const callDigits = String(siteSettings.contactNumber || '').replace(/[^\d+]/g, '');
  const showCall = siteSettings.callEnabled !== false && callDigits.replace(/\D/g, '').length >= 7;

  const waDigits = String(siteSettings.whatsappNumber || '').replace(/\D/g, '');
  const showWhatsApp = !!siteSettings.whatsappEnabled && waDigits.length >= 7;
  const waHref = `https://wa.me/${waDigits}${siteSettings.whatsappMessage ? `?text=${encodeURIComponent(siteSettings.whatsappMessage)}` : ''}`;

  if (!showCall && !showWhatsApp) return null;

  const base = 'inline-flex items-center justify-center gap-1.5 text-white text-sm py-2 px-4 rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-[0.97] transition-all';

  return (
    <div className={`flex gap-2 ${className}`}>
      {showCall && (
        <a href={`tel:${callDigits}`} className={`${base} bg-primary`}>
          <Phone size={16} /> Call Us
        </a>
      )}
      {showWhatsApp && (
        <a href={waHref} target="_blank" rel="noopener noreferrer" className={`${base} bg-[#25D366]`}>
          <MessageCircle size={16} /> WhatsApp
        </a>
      )}
    </div>
  );
};

export default ContactButtons;
