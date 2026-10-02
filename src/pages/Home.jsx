
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { apiCall } from '../api';

const testimonials = [
  { quote: "The perfect synthesis of a meticulous coffee program and an environment that instantly lowers your cortisol. It's my daily sanctuary.", author: '— Sarah T., Designer' },
  { quote: "I appreciate the restraint in their menu. Every item is considered, executed perfectly, and served in beautiful ceramics. A true minimalist's dream.", author: '— Marcus K., Architect' },
  { quote: "The Smoked Mocha changed how I view flavored coffee. Not too sweet, incredibly complex. The space itself is just as thoughtfully crafted.", author: '— Elena R., Writer' }
];

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const { siteSettings } = useAdmin();
  const brandName = siteSettings?.websiteName || 'Brew & Hearth';
  const [approvedReviews, setApprovedReviews] = useState([]);

  // Approved customer reviews (managed from Admin > Reviews). Falls back to the sample quotes if none yet.
  useEffect(() => {
    apiCall('/reviews')
      .then((data) => Array.isArray(data) && setApprovedReviews(data))
      .catch(() => {});
  }, []);

  const slides = approvedReviews.length > 0
    ? approvedReviews.map((r) => ({ quote: r.comment, author: `— ${r.name}`, rating: r.rating }))
    : testimonials;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const current = slides[activeSlide % slides.length];

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="min-h-screen relative flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIGUirKF9592Q7qIY0ACK93vmB-cwYnC_aYf36U81Bod2cJ30xMZbZwxe16YuLde6Db9I59gKsRo2DPd0YYI0lJgXLomAeDyDO477OfxZsv3WSQbitn84dpLkkJu5SHBWq05MHTp6upAUKaok9vuDy1svH3VE5kcERZrrIabaUzQ3uCf2DhB1AydBF7oZHlzZgdXgVGmTwC-f1NeukWXcaZPxn41b1nEt8sRQCQ96Fu5bYLnVU4X9J" 
            alt="Coffee" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-surface/40 backdrop-blur-[2px]" />
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
      </section>

      {/* Featured Items */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-headline-md text-4xl text-primary mb-4">Signature Serves</h2>
            <p className="text-secondary">Curated experiences in every cup.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { name: 'Lavender Latte', price: '₹250', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzZ_iKfZ_J1tt1iWLH_IZJ-6CyqErAhV87e2Lk7KEeLaWFx7ELPeRJw778EvVLFyH8Kh4sD2iQLiDaurO1PdTnqRZZ9K2_hwSOmrZLuvElSdmx-2JIc3dXbuNkk7Sl73Ux_l7N-tUnOZAiuUZU3dIki4bkk-XLA_E301VqirBwPxUHyGPqvNJxTiLL221OesNy4HiDVmgDYxcmp_cnS82Qb-RfFTJZLqsuGEQnE6H5aLGv-a-0D1-d' },
              { name: 'Smoked Mocha', price: '₹280', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC52rFZiqVnhDOPLU3I0p-GYssiCQzPXWQPNIh5_qgZI80Y5ReyCEpvxGmiwos0BQll4l9e86kYqgG3Cfo7AqE_612yNL8f19kXvPnI5aHuH6s48MYubaakVR4AGg_fjBbGUZGw6bgx9I3My4IqY7yaqYGoQrsEEWrt0UGDtCv43hfafeLiVTrRciyW5C_cwlE3kCOanCD4EKgCPD2c3OFtc6BR0cPkw4Y4G7bHD3LOyuwyFP5lR5e' },
              { name: 'Matcha Rose', price: '₹260', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5U6PR1QCkvU-igfu9PpIq8BNBRGZIHDsGXhnsVOZ1Mr4YJJEjvdtnTi8stcI9ZhRdc5QDcLVX108DYMnU9KgoEo7q1qzZyqXzdtvUL-gkfKcIiYj78wqmUxcipa90p-TvAZK3TRNnrjMAbgv4hnROEab91cs_UeI9Is4S7c-slx8NO2Gn8U-0tMGrhYkl5GJ3Bzz1CQqhJholLEKjWV-fTSIZGsVJzVHayOQnrXkGb1W5As3qe9hT' }
            ].map((item, i) => (
              <motion.div 
                key={i}
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
                    <p className="text-secondary/60 text-sm">Artisanal {brandName}</p>
                  </div>
                  <span className="bg-primary/5 text-primary px-4 py-1 rounded-full font-bold">{item.price}</span>
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

      {/* About Section */}
      <section className="py-32 bg-surface-container-low px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-[40px] overflow-hidden shadow-2xl"
          >
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgWHFEsgHrEou5Sj5ixEiv07587PhkkXV1h2F0OMQBHqvOE8wglJ1ecZQHgVG0kFArYImQDg51Fi0KVvThfzw09SRnVNZEzOgJ3Bx2jLrW5x3CaiPFk3AyoPBgEi90mEgOUP0jzULKLi2HWJYeJ7U2hj_r31gh30fRwVxgOgSxZLRJWPGrU9kPAnXhUXEMgWEL85iNprLG6zGMXOsrMaZ3WAAhTZIQ40XbvgcTJ8LgzKGEDh-dRdlN" alt="Cafe Interior" />
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

      {/* Testimonials Carousel */}
      <section className="py-24 px-6 bg-surface-container-highest overflow-hidden">
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
                <p className="font-headline-md text-2xl md:text-3xl text-primary mb-6 leading-snug">
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
      </section>
    </div>
  );
};

export default Home;