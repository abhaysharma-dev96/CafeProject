
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { apiCall } from '../api';
import { formatPrice } from '../utils/formatPrice';
import ContactButtons from '../components/ContactButtons';


const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const { siteSettings, menuItems } = useAdmin();
  const brandName = siteSettings?.websiteName || 'Brew & Hearth';
  const [approvedReviews, setApprovedReviews] = useState([]);

  // Approved customer reviews (managed from Admin > Reviews)
  useEffect(() => {
    apiCall('/reviews')
      .then((data) => Array.isArray(data) && setApprovedReviews(data))
      .catch(() => {});
  }, []);

  const slides = approvedReviews.map((r) => ({ quote: r.comment, author: `— ${r.name}`, rating: r.rating }));

  // "Signature Serves" always shows 3 items: the ones ticked "Show on Home page" in Admin > Menu first,
  // then the oldest menu items fill the remaining slots. A newly added item never pushes out existing ones
  // unless it is ticked.
  const oldestFirst = [...menuItems].sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
  const featuredItems = [
    ...oldestFirst.filter((item) => item.featured),
    ...oldestFirst.filter((item) => !item.featured)
  ].slice(0, 3);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (slides.length ? (prev + 1) % slides.length : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const current = slides.length ? slides[activeSlide % slides.length] : null;

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="min-h-screen relative flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIGUirKF9592Q7qIY0ACK93vmB-cwYnC_aYf36U81Bod2cJ30xMZbZwxe16YuLde6Db9I59gKsRo2DPd0YYI0lJgXLomAeDyDO477OfxZsv3WSQbitn84dpLkkJu5SHBWq05MHTp6upAUKaok9vuDy1svH3VE5kcERZrrIabaUzQ3uCf2DhB1AydBF7oZHlzZgdXgVGmTwC-f1NeukWXcaZPxn41b1nEt8sRQCQ96Fu5bYLnVU4X9J" 
            alt="Coffee" 
            className="w-full h-full object-cover scale-[1.2]"
          />
          <div className="absolute inset-0 bg-surface/45" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-headline-lg text-6xl md:text-8xl text-primary mb-8"
          >
            Crafting Moments, One Brew at a Time
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-secondary text-xl mb-12 max-w-2xl mx-auto"
          >
            Experience the harmony of artisanal roasting and mindful spaces. A warm minimalist haven for coffee enthusiasts.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link to="/menu" className="bg-primary text-white px-10 py-4 rounded-full font-bold hover:shadow-xl transition-all">
              View Menu
            </Link>
            <Link to="/reservations" className="border border-primary text-primary px-10 py-4 rounded-full font-bold hover:bg-primary/5 transition-all">
              Reserve Table
            </Link>
          </motion.div>
        </div>

        {/* Call / WhatsApp: bottom-right corner of the hero (managed in Admin > Settings) */}
        <ContactButtons className="absolute z-20 bottom-5 right-5 sm:bottom-6 sm:right-6" />
      </section>

      {/* Featured Items (from the menu, managed in Admin > Menu) */}
      {featuredItems.length > 0 && (
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-headline-md text-4xl text-primary mb-4">Signature Serves</h2>
            <p className="text-secondary">Curated experiences in every cup.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {featuredItems.map((item, i) => (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-3xl mb-6 shadow-sm">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex justify-between items-center px-2">
                  <div>
                    <h3 className="font-headline-md text-2xl text-primary">{item.name}</h3>
                    <p className="text-secondary/60 text-sm">{item.category}</p>
                  </div>
                  <span className="bg-primary/5 text-primary px-4 py-1 rounded-full font-bold">{formatPrice(item.price)}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/menu" className="inline-block bg-transparent text-primary border-b border-primary pb-1 font-bold uppercase tracking-wider text-sm hover:text-secondary hover:border-secondary transition-colors">
              Explore Full Menu
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* About Section */}
      <section className="py-32 bg-surface-container-low px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[32px] overflow-hidden shadow-xl w-full max-w-[440px] aspect-[4/5] mx-auto md:justify-self-center"
          >
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgWHFEsgHrEou5Sj5ixEiv07587PhkkXV1h2F0OMQBHqvOE8wglJ1ecZQHgVG0kFArYImQDg51Fi0KVvThfzw09SRnVNZEzOgJ3Bx2jLrW5x3CaiPFk3AyoPBgEi90mEgOUP0jzULKLi2HWJYeJ7U2hj_r31gh30fRwVxgOgSxZLRJWPGrU9kPAnXhUXEMgWEL85iNprLG6zGMXOsrMaZ3WAAhTZIQ40XbvgcTJ8LgzKGEDh-dRdlN" alt="Cafe Interior" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary/60 font-bold tracking-widest text-sm uppercase mb-4 block">Our Story</span>
            <h2 className="font-headline-md text-5xl text-primary mb-8 leading-tight">Rooted in Craft, Designed for Connection</h2>
            <p className="text-secondary text-lg mb-10 leading-relaxed">
              {brandName} was born from a simple desire: to create a space that feels like a deep breath. We believe coffee is more than a beverage; it's a ritual, a pause in the momentum of the day.
            </p>
            <Link to="/about" className="flex items-center gap-2 font-bold text-primary group w-fit">
              Read Our Manifesto <span className="group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Customer reviews (approved in Admin > Reviews) */}
      <section className="py-24 px-6 bg-surface-container-highest overflow-hidden">
        {current ? (
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-5xl text-primary/20 font-headline-lg mb-4 block">"</span>
          <div className="relative min-h-[180px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <p className={`font-headline-md text-primary mb-6 leading-snug break-words ${current.quote.length > 220 ? 'text-lg md:text-xl' : 'text-2xl md:text-3xl'}`}>
                  "{current.quote}"
                </p>
                {current.rating ? (
                  <div className="flex justify-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} size={18} className={n <= current.rating ? 'fill-amber-400 text-amber-400' : 'text-primary/20'} />
                    ))}
                  </div>
                ) : null}
                <div className="text-secondary text-sm uppercase tracking-wider font-bold">
                  {current.author}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-center gap-2 mt-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-2 rounded-full transition-all ${activeSlide === i ? 'w-8 bg-primary' : 'w-2 bg-primary/20'}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
        ) : (
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-headline-md text-3xl text-primary mb-3">Loved your visit?</h2>
          <p className="text-secondary mb-6">Be the first to share your experience with us.</p>
          <Link to="/reservations" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all">Write a Review</Link>
        </div>
        )}
      </section>
    </div>
  );
};

export default Home;