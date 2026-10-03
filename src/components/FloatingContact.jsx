import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

// Call + WhatsApp buttons fixed at the bottom-right of every public page.
// Numbers, message and on/off switches come from Admin > Settings.
const FloatingContact = () => {
  const { siteSettings } = useAdmin();
  if (!siteSettings) return null;

  const callDigits = String(siteSettings.contactNumber || '').replace(/[^\d+]/g, '');
  const showCall = siteSettings.callEnabled !== false && callDigits.replace(/\D/g, '').length >= 7;

  const waDigits = String(siteSettings.whatsappNumber || '').replace(/\D/g, '');
  const showWhatsApp = !!siteSettings.whatsappEnabled && waDigits.length >= 7;
  const waHref = `https://wa.me/${waDigits}${siteSettings.whatsappMessage ? `?text=${encodeURIComponent(siteSettings.whatsappMessage)}` : ''}`;

  if (!showCall && !showWhatsApp) return null;

  const base = 'w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-transform';

  return (
    <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-40 flex flex-col gap-3">
      {showCall && (
        <a href={`tel:${callDigits}`} aria-label="Call us" title="Call us" className={`${base} bg-primary`}>
          <Phone size={24} />
        </a>
      )}
      {showWhatsApp && (
        <a href={waHref} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" title="Chat on WhatsApp" className={`${base} bg-[#25D366]`}>
          <MessageCircle size={26} />
        </a>
      )}
    </div>
  );
};

export default FloatingContact;
