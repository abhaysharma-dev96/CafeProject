import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { siteSettings, galleryItems } = useAdmin();
  const brandName = siteSettings?.websiteName || 'Brew & Hearth';

  const categories = ['All', 'Interior', 'Food & Drink', 'Events'];

  const filteredItems = activeFilter === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  const selectedImage = selectedIndex !== null ? filteredItems[selectedIndex] : null;

  const closeLightbox = () => setSelectedIndex(null);
  const showNext = () => setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
  const showPrev = () => setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredItems.length]);

  // Lock background scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = selectedIndex !== null ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedIndex]);

  // Reset lightbox if filter changes
  useEffect(() => {
    setSelectedIndex(null);
  }, [activeFilter]);

  return (
    <div className="pt-32 pb-24 px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-headline-lg text-6xl text-primary mb-6"
          >
            Our Visual Story
          </motion.h1>
          <p className="text-secondary/70 max-w-2xl mx-auto leading-relaxed">
            Explore the warmth, craftsmanship, and community that make up the essence of Artisanal {brandName}.
          </p>
        </header>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-8 py-2 rounded-full border transition-all text-sm font-bold tracking-wide ${
                activeFilter === cat 
                  ? 'bg-primary text-white border-primary shadow-lg scale-105' 
                  : 'bg-white text-secondary border-primary/10 hover:border-primary/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative aspect-[4/3] rounded-[40px] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow"
                onClick={() => setSelectedIndex(index)}
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-8 text-center">
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-full mb-4 text-white">
                    <Maximize2 size={24} />
                  </div>
                  <h3 className="font-headline-md text-2xl text-white mb-2">{item.title}</h3>
                  <span className="text-white/70 text-xs font-bold uppercase tracking-widest">{item.category}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <p className="text-secondary text-center py-12">No images in this category yet.</p>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-primary/95 backdrop-blur-sm flex items-center justify-center p-6 md:p-12"
              onClick={closeLightbox}
            >
              <button 
                className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                onClick={closeLightbox}
                aria-label="Close"
              >
                <X size={32} />
              </button>

              <span className="absolute top-8 left-8 text-white/50 text-sm font-bold tracking-widest">
                {selectedIndex + 1} / {filteredItems.length}
              </span>

              {filteredItems.length > 1 && (
                <>
                  <button
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2"
                    onClick={(e) => { e.stopPropagation(); showPrev(); }}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={36} />
                  </button>
                  <button
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2"
                    onClick={(e) => { e.stopPropagation(); showNext(); }}
                    aria-label="Next image"
                  >
                    <ChevronRight size={36} />
                  </button>
                </>
              )}
              
              <motion.div 
                key={selectedIndex}
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-5xl w-full aspect-video md:aspect-[16/9] rounded-[40px] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={selectedImage.image} 
                  alt={selectedImage.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
                  <h4 className="font-headline-md text-3xl text-white">{selectedImage.title}</h4>
                  <p className="text-white/70 mt-1">{selectedImage.category}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Gallery;