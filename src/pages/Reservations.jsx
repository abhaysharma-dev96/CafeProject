import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, CheckCircle2, AlertCircle, Star, Phone, MessageCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const timeSlots = [
  { value: '08:00', label: '08:00 AM' },
  { value: '09:00', label: '09:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '13:00', label: '01:00 PM' },
  { value: '14:00', label: '02:00 PM' },
  { value: '15:00', label: '03:00 PM' }
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namePattern = /^[A-Za-z\s'-]{2,}$/;
const phonePattern = /^\+?[0-9\s-]{7,16}$/;

const Reservations = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  const { addReservation, addMessage, addReview, siteSettings } = useAdmin();
  const mapAddress = siteSettings?.address || '123 Artisan Alley, Portland, OR 97209';

  // Call / WhatsApp buttons. Numbers, message and on/off switches come from Admin > Settings.
  const callNumber = String(siteSettings?.contactNumber || '').trim();
  const callDigits = callNumber.replace(/[^\d+]/g, '');
  const showCall = siteSettings?.callEnabled !== false && callDigits.length >= 7;
  const waDigits = String(siteSettings?.whatsappNumber || '').replace(/\D/g, '');
  const showWhatsApp = !!siteSettings?.whatsappEnabled && waDigits.length >= 7;
  const whatsappHref = `https://wa.me/${waDigits}${siteSettings?.whatsappMessage ? `?text=${encodeURIComponent(siteSettings.whatsappMessage)}` : ''}`;

  const [reservation, setReservation] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    partySize: 2,
    notes: ''
  });
  const [reservationStatus, setReservationStatus] = useState(null); // null | 'success' | 'error'
  const [reservationError, setReservationError] = useState('');

  const [review, setReview] = useState({ name: '', rating: 0, comment: '' });
  const [reviewStatus, setReviewStatus] = useState(null);
  const [reviewError, setReviewError] = useState('');

  const [contact, setContact] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = useState(null);
  const [contactError, setContactError] = useState('');

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    if (!reservation.name || !namePattern.test(reservation.name.trim())) {
      setReservationError('Please enter your name.');
      setReservationStatus('error');
      setTimeout(() => setReservationStatus(null), 3000);
      return;
    }
    if (!phonePattern.test(reservation.phone.trim())) {
      setReservationError('Please enter a valid phone number.');
      setReservationStatus('error');
      setTimeout(() => setReservationStatus(null), 3000);
      return;
    }
    if (!emailPattern.test(reservation.email.trim())) {
      setReservationError('Please enter a valid email address.');
      setReservationStatus('error');
      setTimeout(() => setReservationStatus(null), 3000);
      return;
    }
    if (!reservation.date) {
      setReservationError('Please select a date.');
      setReservationStatus('error');
      setTimeout(() => setReservationStatus(null), 3000);
      return;
    }
    if (!reservation.time) {
      setReservationError('Please select a time.');
      setReservationStatus('error');
      setTimeout(() => setReservationStatus(null), 3000);
      return;
    }
    try {
      await addReservation({ ...reservation });
      setReservationStatus('success');
      setReservation({ name: '', phone: '', email: '', date: '', time: '', partySize: 2, notes: '' });
      setTimeout(() => setReservationStatus(null), 4000);
    } catch (err) {
      setReservationError(err.message || 'Could not save your reservation. Please try again.');
      setReservationStatus('error');
      setTimeout(() => setReservationStatus(null), 4000);
    }
  };

  const showReview = (status, error = '') => {
    setReviewError(error);
    setReviewStatus(status);
    setTimeout(() => setReviewStatus(null), status === 'success' ? 5000 : 3500);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!namePattern.test(review.name.trim())) return showReview('error', 'Please enter your name (letters only).');
    if (!review.rating) return showReview('error', 'Please select a star rating.');
    if (review.comment.trim().length < 1) return showReview('error', 'Please write your review.');
    try {
      await addReview({ ...review, name: review.name.trim(), comment: review.comment.trim() });
      setReview({ name: '', rating: 0, comment: '' });
      showReview('success');
    } catch (err) {
      showReview('error', err.message || 'Could not submit your review. Please try again.');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contact.name || !contact.email || !contact.subject || !contact.message) {
      setContactError('Please fill in all fields.');
      setContactStatus('error');
      setTimeout(() => setContactStatus(null), 3000);
      return;
    }
    if (!namePattern.test(contact.name.trim())) {
      setContactError('Please enter a valid name (letters only, min 2 characters).');
      setContactStatus('error');
      setTimeout(() => setContactStatus(null), 3000);
      return;
    }
    if (!emailPattern.test(contact.email)) {
      setContactError('Please enter a valid email address.');
      setContactStatus('error');
      setTimeout(() => setContactStatus(null), 3000);
      return;
    }
    if (contact.message.trim().length < 10) {
      setContactError('Message should be at least 10 characters.');
      setContactStatus('error');
      setTimeout(() => setContactStatus(null), 3000);
      return;
    }
    try {
      await addMessage({ ...contact });
      setContactStatus('success');
      setContact({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setContactStatus(null), 4000);
    } catch (err) {
      setContactError(err.message || 'Could not send your message. Please try again.');
      setContactStatus('error');
      setTimeout(() => setContactStatus(null), 4000);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-headline-lg text-4xl md:text-6xl text-primary mb-6"
          >
            Join Us at the Hearth
          </motion.h1>
          <p className="text-secondary max-w-xl mx-auto">Reserve a table for a curated coffee experience or reach out with any inquiries.</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Reservation Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] shadow-sm border border-primary/5 relative"
          >
            <div className="flex items-center gap-3 mb-8">
              <Calendar className="text-primary" />
              <h2 className="font-headline-md text-3xl text-primary">Reserve a Table</h2>
            </div>

            <form className="space-y-8" onSubmit={handleReservationSubmit} noValidate>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-secondary/60 ml-1">Your Name</label>
                <input 
                  type="text" 
                  required
                  minLength={2}
                  placeholder="e.g. John Smith"
                  value={reservation.name}
                  onChange={(e) => setReservation({ ...reservation, name: e.target.value })}
                  className="w-full bg-surface p-4 rounded-2xl border border-primary/5 outline-none focus:ring-2 focus:ring-primary/10" 
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-secondary/60 ml-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    inputMode="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={reservation.phone}
                    onChange={(e) => setReservation({ ...reservation, phone: e.target.value })}
                    className="w-full bg-surface p-4 rounded-2xl border border-primary/5 outline-none focus:ring-2 focus:ring-primary/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-secondary/60 ml-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={reservation.email}
                    onChange={(e) => setReservation({ ...reservation, email: e.target.value })}
                    className="w-full bg-surface p-4 rounded-2xl border border-primary/5 outline-none focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-secondary/60 ml-1">Date</label>
                  <input 
                    type="date" 
                    required
                    min={todayStr}
                    value={reservation.date}
                    onChange={(e) => setReservation({ ...reservation, date: e.target.value })}
                    className="w-full bg-surface p-4 rounded-2xl border border-primary/5 outline-none focus:ring-2 focus:ring-primary/10" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-secondary/60 ml-1">Time</label>
                  <select 
                    required
                    value={reservation.time}
                    onChange={(e) => setReservation({ ...reservation, time: e.target.value })}
                    className="w-full bg-surface p-4 rounded-2xl border border-primary/5 outline-none focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="" disabled>Select Time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.label}>{slot.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-secondary/60 ml-1">Party Size</label>
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  {[1, 2, 3, 4, '5+'].map((n) => (
                    <button 
                      key={n} 
                      type="button" 
                      onClick={() => setReservation({ ...reservation, partySize: n })}
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-primary/10 flex items-center justify-center font-bold text-sm sm:text-base transition-all ${reservation.partySize === n ? 'bg-primary text-white scale-110' : 'hover:bg-primary/5'}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-secondary/60 ml-1">Special Requests</label>
                <div className="flex flex-wrap gap-2">
                  {['Pack order to-go', 'Birthday celebration', 'Allergy / Dietary', 'Wheelchair accessible', 'High chair needed'].map((tag) => {
                    const isSelected = reservation.notes.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setReservation((prev) => {
                            const tags = prev.notes.split(', ').filter(Boolean);
                            const updatedTags = isSelected
                              ? tags.filter((t) => t !== tag)
                              : [...tags, tag];
                            return { ...prev, notes: updatedTags.join(', ') };
                          });
                        }}
                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                          isSelected
                            ? 'bg-primary text-white border-primary'
                            : 'bg-surface text-secondary border-primary/10 hover:border-primary/30'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                <textarea 
                  rows="3" 
                  value={reservation.notes}
                  onChange={(e) => setReservation({ ...reservation, notes: e.target.value })}
                  className="w-full bg-surface p-4 rounded-2xl border border-primary/5 outline-none focus:ring-2 focus:ring-primary/10" 
                  placeholder="Tap an option above, or type anything else here..."
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-primary text-white py-5 rounded-2xl font-bold hover:shadow-xl active:scale-[0.98] transition-all">
                Confirm Reservation
              </button>
            </form>

            <AnimatePresence>
              {reservationStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mt-4 p-4 rounded-2xl flex items-center gap-2 text-sm font-bold ${reservationStatus === 'success' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-error-container text-on-error-container'}`}
                >
                  {reservationStatus === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  {reservationStatus === 'success' ? 'Reservation confirmed! We look forward to seeing you.' : reservationError}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact Section */}
          <div className="space-y-12">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-surface-container-low p-6 sm:p-10 rounded-[32px] sm:rounded-[40px]"
            >
              <h3 className="font-headline-md text-3xl text-primary mb-6">Get in Touch</h3>

              {(showCall || showWhatsApp) && (
                <div className="flex flex-wrap gap-3 mb-8">
                  {showCall && (
                    <a
                      href={`tel:${callDigits}`}
                      className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 bg-primary text-white py-3 px-5 rounded-2xl font-bold hover:shadow-lg active:scale-[0.98] transition-all"
                    >
                      <Phone size={18} /> Call Us
                    </a>
                  )}
                  {showWhatsApp && (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 px-5 rounded-2xl font-bold hover:shadow-lg active:scale-[0.98] transition-all"
                    >
                      <MessageCircle size={18} /> WhatsApp
                    </a>
                  )}
                </div>
              )}
              <form className="space-y-6" onSubmit={handleContactSubmit} noValidate>
                <input 
                  type="text" 
                  required
                  minLength={2}
                  placeholder="Your Name" 
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  className="w-full bg-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/10" 
                />
                <input 
                  type="email" 
                  required
                  placeholder="Email Address" 
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  className="w-full bg-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/10" 
                />
                <select
                  required
                  value={contact.subject}
                  onChange={(e) => setContact({ ...contact, subject: e.target.value })}
                  className="w-full bg-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/10 text-secondary"
                >
                  <option value="" disabled>Select Subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="events">Private Events</option>
                  <option value="feedback">Feedback</option>
                </select>
                <textarea 
                  placeholder="Your Message" 
                  required
                  rows="4" 
                  value={contact.message}
                  onChange={(e) => setContact({ ...contact, message: e.target.value })}
                  className="w-full bg-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/10"
                ></textarea>
                <button type="submit" className="w-full border border-primary text-primary py-4 rounded-2xl font-bold hover:bg-primary/5 transition-all">
                  Send Message
                </button>
              </form>

              <AnimatePresence>
                {contactStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mt-4 p-4 rounded-2xl flex items-center gap-2 text-sm font-bold ${contactStatus === 'success' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-error-container text-on-error-container'}`}
                  >
                    {contactStatus === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {contactStatus === 'success' ? 'Message sent! We will get back to you soon.' : contactError}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Map Preview */}
            <motion.a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="block rounded-[40px] overflow-hidden aspect-video relative group bg-secondary-container cursor-pointer"
            >
              <svg viewBox="0 0 600 340" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                <rect width="600" height="340" fill="#ece0dc" />
                <rect x="0" y="0" width="600" height="340" fill="#f5f3ef" opacity="0.6" />
                {/* Parks */}
                <rect x="40" y="40" width="130" height="90" rx="8" fill="#cfe0cf" />
                <rect x="420" y="200" width="140" height="110" rx="8" fill="#cfe0cf" />
                {/* Roads */}
                <rect x="0" y="150" width="600" height="14" fill="#d3c3c0" />
                <rect x="0" y="230" width="600" height="10" fill="#d3c3c0" />
                <rect x="180" y="0" width="12" height="340" fill="#d3c3c0" />
                <rect x="380" y="0" width="10" height="340" fill="#d3c3c0" />
                <rect x="290" y="0" width="8" height="340" fill="#e4dcd9" />
                {/* Buildings */}
                <rect x="220" y="60" width="40" height="40" rx="4" fill="#e4e2de" />
                <rect x="270" y="70" width="30" height="30" rx="4" fill="#e4e2de" />
                <rect x="450" y="40" width="50" height="60" rx="4" fill="#e4e2de" />
                <rect x="60" y="200" width="60" height="40" rx="4" fill="#e4e2de" />
                {/* Pin */}
                <g transform="translate(300, 175)">
                  <circle cx="0" cy="0" r="26" fill="#271310" opacity="0.15" />
                  <path d="M0 -34 C14 -34 24 -24 24 -10 C24 8 0 30 0 30 C0 30 -24 8 -24 -10 C-24 -24 -14 -34 0 -34 Z" fill="#271310" />
                  <circle cx="0" cy="-10" r="8" fill="#fbf9f5" />
                </g>
              </svg>
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/5 transition-colors" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-10 bg-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-2 group-hover:scale-105 transition-transform">
                <MapPin className="text-primary" size={20} />
                <span className="font-bold text-primary">Open in Google Maps</span>
              </div>
            </motion.a>
          </div>
        </div>

        {/* Review Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 max-w-2xl mx-auto bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] shadow-sm border border-primary/5"
        >
          <div className="flex items-center gap-3 mb-2">
            <Star className="text-primary" />
            <h2 className="font-headline-md text-3xl text-primary">Share Your Experience</h2>
          </div>
          <p className="text-secondary/70 text-sm mb-8">Visited us? Leave a review. It will appear on our home page after approval.</p>

          <form className="space-y-6" onSubmit={handleReviewSubmit} noValidate>
            <input
              type="text"
              placeholder="Your Name"
              maxLength={60}
              value={review.name}
              onChange={(e) => setReview({ ...review, name: e.target.value })}
              className="w-full bg-surface p-4 rounded-2xl border border-primary/5 outline-none focus:ring-2 focus:ring-primary/10"
            />
            <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={review.rating === n}
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  onClick={() => setReview({ ...review, rating: n })}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star size={30} className={n <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-secondary/25'} />
                </button>
              ))}
            </div>
            <textarea
              rows="4"
              placeholder="Tell us about your visit..."
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              className="w-full bg-surface p-4 rounded-2xl border border-primary/5 outline-none focus:ring-2 focus:ring-primary/10"
            ></textarea>
            <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:shadow-xl active:scale-[0.98] transition-all">
              Submit Review
            </button>
          </form>

          <AnimatePresence>
            {reviewStatus && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-4 p-4 rounded-2xl flex items-center gap-2 text-sm font-bold ${reviewStatus === 'success' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-error-container text-on-error-container'}`}
              >
                {reviewStatus === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {reviewStatus === 'success' ? 'Thank you! Your review will appear after approval.' : reviewError}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </div>
    </div>
  );
};

export default Reservations;