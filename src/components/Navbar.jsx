import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems, setIsCartOpen, isCartOpen } = useCart();
  const { siteSettings } = useAdmin();
  const brandName = siteSettings?.websiteName || 'Brew & Hearth';
  const logoUrl = typeof siteSettings?.logoUrl === 'string' ? siteSettings.logoUrl.trim() : '';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (isMobileMenuOpen || isCartOpen) ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen, isCartOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Reservations', path: '/reservations' },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 bg-surface/80 backdrop-blur-lg border-b border-primary/10 ${isScrolled ? 'py-4 shadow-sm' : 'py-6'}`}>
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link to="/" className="font-headline-md text-2xl font-bold text-primary tracking-tight flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={brandName} className="h-10 w-10 rounded-full object-cover border border-primary/10" />
            ) : null}
            <span>{brandName}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-body-md text-sm tracking-wide transition-all relative py-1 ${location.pathname === link.path ? 'text-primary font-bold' : 'text-secondary hover:text-primary'}`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div layoutId="navUnderline" className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                )}
              </Link>
            ))}
            <button onClick={() => setIsCartOpen(true)} className="p-2 hover:scale-110 transition-transform text-primary relative">
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{totalItems}</span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className="p-2 text-primary relative">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{totalItems}</span>
              )}
            </button>
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-primary">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — rendered OUTSIDE <nav> so it isn't affected by nav's
          backdrop-blur, which otherwise breaks position:fixed to only cover
          the navbar's own box instead of the full viewport. */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-surface z-[60] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <img src={logoUrl} alt={brandName} className="h-10 w-10 rounded-full object-cover border border-primary/10" />
                ) : null}
                <span className="font-headline-md text-2xl font-bold text-primary">{brandName}</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-primary">
                <X size={28} />
              </button>
            </div>
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-3xl font-headline-md ${location.pathname === link.path ? 'text-primary font-bold' : 'text-secondary'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="mt-auto pt-12 border-t border-primary/10">
              <Link to="/reservations" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-primary text-white py-4 rounded-full flex justify-center items-center font-bold">
                Reserve a Table
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;