import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Plus, Minus, X, Maximize2, UtensilsCrossed } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import { formatPrice } from '../utils/formatPrice';

const Menu = () => {
  const [activeTab, setActiveTab] = useState('Coffee');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [selectedImage, setSelectedImage] = useState(null);
  const { addToCart, removeFromCart, getQuantity, tableId, setTableId } = useCart();
  const { menuItems, menuLoading, menuError, refreshMenu } = useAdmin();
  const [searchParams] = useSearchParams();
  const categories = ['Coffee', 'Tea', 'Snacks', 'Desserts'];

  useEffect(() => {
    const tableParam = searchParams.get('table');
    if (tableParam) setTableId(tableParam);
  }, [searchParams, setTableId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedImage ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedImage]);

  useEffect(() => {
    setSelectedImage(null);
  }, [activeTab]);

  let filteredItems = menuItems
    .filter(item => item.category === activeTab)
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (sortBy === 'price-low') filteredItems = [...filteredItems].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-high') filteredItems = [...filteredItems].sort((a, b) => b.price - a.price);

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-headline-lg text-6xl text-primary mb-6"
          >
            Our Menu
          </motion.h1>
          <p className="text-secondary max-w-xl mx-auto">Sourced globally, crafted locally. Explore our selection of artisanal beverages.</p>
          {tableId && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full text-sm font-bold mt-6"
            >
              <UtensilsCrossed size={16} /> Ordering for Table {tableId}
            </motion.div>
          )}
        </header>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          <div className="flex gap-8 border-b border-primary/10 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`pb-4 px-2 relative transition-all ${activeTab === cat ? 'text-primary font-bold' : 'text-secondary hover:text-primary'}`}
              >
                {cat}
                {activeTab === cat && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto relative">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search menu..." 
                className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-primary/10 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 border rounded-full transition-all ${showFilters ? 'bg-primary text-white border-primary' : 'border-primary/10 text-secondary hover:bg-primary/5'}`}
            >
              <SlidersHorizontal size={20} />
            </button>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-xl border border-primary/5 p-5 w-64 z-20"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-secondary/60">Sort By</span>
                    <button onClick={() => setShowFilters(false)}><X size={16} className="text-secondary/40" /></button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      { key: 'default', label: 'Featured' },
                      { key: 'price-low', label: 'Price: Low to High' },
                      { key: 'price-high', label: 'Price: High to Low' }
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => { setSortBy(opt.key); setShowFilters(false); }}
                        className={`text-left px-4 py-2 rounded-xl text-sm transition-all ${sortBy === opt.key ? 'bg-primary text-white font-bold' : 'hover:bg-surface text-secondary'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Menu Grid */}
        {menuLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-secondary/50">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <p>Loading menu...</p>
          </div>
        ) : menuError ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-error font-bold mb-4">{menuError}</p>
            <p className="text-secondary/60 text-sm mb-6">
              The server may be waking up from sleep — this can take up to a minute on the first visit.
            </p>
            <button
              onClick={refreshMenu}
              className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </div>
        ) : (
        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.length === 0 && (
              <p className="text-secondary col-span-full text-center py-12">No items match your search.</p>
            )}
            {filteredItems.map((item) => {
              const qty = getQuantity(item.name);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={item.name}
                  className="bg-white rounded-[32px] p-4 shadow-sm border border-primary/5 group"
                >
                  <div 
                    className="aspect-video rounded-2xl overflow-hidden mb-6 relative cursor-pointer"
                    onClick={() => setSelectedImage(item)}
                  >
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white">
                        <Maximize2 size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="px-2">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-headline-md text-2xl text-primary">{item.name}</h3>
                      <span className="font-bold text-primary">{formatPrice(item.price)}</span>
                    </div>
                    <p className="text-secondary/70 text-sm mb-6 leading-relaxed">{item.desc}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {item.tags.map(tag => (
                          <span key={tag} className="text-[10px] uppercase tracking-wider font-bold bg-secondary-container/30 text-secondary px-3 py-1 rounded-full">{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 bg-surface p-1 rounded-full border border-primary/5">
                        <button
                          onClick={() => removeFromCart(item.name)}
                          disabled={qty === 0}
                          className="p-1 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{qty}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="p-1 bg-primary text-white rounded-full hover:scale-110 transition-transform"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-primary/95 backdrop-blur-sm flex items-center justify-center p-6 md:p-12"
              onClick={() => setSelectedImage(null)}
            >
              <button 
                className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <X size={32} />
              </button>

              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative max-w-5xl w-full aspect-video md:aspect-[16/9] rounded-[40px] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={selectedImage.image} 
                  alt={selectedImage.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
                  <h4 className="font-headline-md text-3xl text-white">{selectedImage.name}</h4>
                  <p className="text-white/70 mt-1">{formatPrice(selectedImage.price)}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Menu;