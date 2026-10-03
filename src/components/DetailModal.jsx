import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

// Small popup used by the admin "View" buttons
const DetailModal = ({ title, onClose, children }) => {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-[32px] p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline-md text-2xl text-primary">{title}</h2>
          <button onClick={onClose} aria-label="Close"><X size={22} className="text-secondary" /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
};

export const DetailRow = ({ label, children }) => (
  <div className="py-3 border-b border-primary/5 last:border-0">
    <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/50 mb-1">{label}</p>
    <div className="text-secondary break-words whitespace-pre-wrap">{children}</div>
  </div>
);

export default DetailModal;
