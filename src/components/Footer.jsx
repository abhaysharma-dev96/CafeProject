import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-primary/10 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-center md:text-left">
          <div className="col-span-1 md:col-span-1">
            <h2 className="font-headline-md text-2xl text-primary mb-6">Brew & Hearth</h2>
            <p className="text-secondary/60 text-sm leading-relaxed">
              A space for mindful consumption and deliberate pauses. Crafting moments since 2024.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-primary mb-6 uppercase text-xs tracking-widest">Connect</h4>
            <div className="flex flex-col items-center md:items-start gap-4 text-secondary/70 text-sm">
              <a href="#" className="hover:text-primary transition-colors">Instagram</a>
              <a href="#" className="hover:text-primary transition-colors">Facebook</a>
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-6 uppercase text-xs tracking-widest">Company</h4>
            <div className="flex flex-col items-center md:items-start gap-4 text-secondary/70 text-sm">
              <a href="#" className="hover:text-primary transition-colors">Careers</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-6 uppercase text-xs tracking-widest">Location</h4>
            <address className="not-italic text-secondary/70 text-sm leading-loose">
              123 Artisan Alley<br />
              Portland, OR 97209<br />
              <span className="text-primary mt-4 block">(555) 123-4567</span>
            </address>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-primary/5 text-secondary/40 text-xs text-center">
          <p>© 2024 Artisanal Brew & Hearth. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-4 md:mt-0">
            <span>Designed with Intention</span>
            <span>Est. 2024</span>
            {/* <Link to="/admin" className="hover:text-primary transition-colors underline">Admin</Link>
            <Link to="/kitchen" className="hover:text-primary transition-colors underline">Kitchen</Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;