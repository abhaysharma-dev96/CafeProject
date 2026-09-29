import React from 'react';
import { motion } from 'framer-motion';

const Hero = ({ title, subtitle, primaryCTA, secondaryCTA, backgroundImage }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with Parallax effect simulation */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={backgroundImage} 
          alt="Atmospheric cafe interior" 
          className="w-full h-full object-cover "
        />
       
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface" />
      </motion.div>

      <div className="relative z-10 text-center max-w-4xl px-6">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-headline-lg text-5xl md:text-7xl lg:text-8xl text-primary leading-tight mb-6"
        >
          {title}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-body-lg text-lg md:text-xl text-secondary mb-10 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button className="bg-primary-container text-on-primary-container px-10 py-4 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all duration-300">
            {primaryCTA}
          </button>
          <button className="border border-primary text-primary px-10 py-4 rounded-full font-bold hover:bg-primary/5 hover:scale-105 transition-all duration-300">
            {secondaryCTA}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero ;
