import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Phone, ArrowUpRight, Sparkles, Instagram } from 'lucide-react';
import PremiumBackground from './PremiumBackground';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const utilityLinks = [
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms of Service', path: '/terms-of-service' },
    { name: 'Support', path: '/contact' },
  ];

  return (
    <footer className="relative bg-white text-luxury-ink overflow-hidden border-t border-luxury-divider gpu-accelerate">
      <PremiumBackground variant="footer" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* 1. Brand Section */}
          <div className="lg:col-span-5 space-y-8 lg:space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Link to="/" className="inline-flex items-center gap-4 group mb-8 lg:mb-10">
                <div className="relative">
                  <img 
                    src="https://ik.imagekit.io/jabzmiuta/Gemini_Generated_Image_6tlhjt6tlhjt6tlh-removebg-preview.png" 
                    alt="Huecraft Logo" 
                    className="h-12 lg:h-16 w-auto object-contain transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3"
                    referrerPolicy="no-referrer"
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -inset-2 bg-luxury-gold/20 blur-xl rounded-full -z-10"
                  />
                </div>
                <span className="text-3xl lg:text-5xl font-serif font-bold tracking-tighter text-luxury-blue-mid group-hover:text-luxury-gold transition-colors duration-500">
                  HUECRAFT
                </span>
              </Link>
              <p className="text-base lg:text-xl font-light text-luxury-gray tracking-tight max-w-sm lg:max-w-md leading-relaxed lg:leading-loose">
                Precision in every stroke, luxury in every detail. Elevating spaces through master-level craftsmanship and refined aesthetics.
              </p>
              
              <div className="pt-8 flex items-center gap-4">
                <div className="h-[1px] w-12 bg-luxury-gold/30" />
                <span className="text-[10px] lg:text-xs font-bold uppercase tracking-[0.4em] text-luxury-gold">Master Artisans</span>
              </div>
            </motion.div>
          </div>

          {/* 2. Navigation & 3. Quick Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-12 lg:gap-16">
            <div className="space-y-6 lg:space-y-8">
              <h4 className="text-[10px] lg:text-xs font-black uppercase tracking-[0.4em] text-luxury-blue-mid flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-luxury-gold" />
                Navigation
              </h4>
              <ul className="space-y-4 lg:space-y-6">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path}
                      className="group flex items-center gap-3 text-sm lg:text-lg font-light text-luxury-gray hover:text-luxury-blue-mid transition-all duration-300"
                    >
                      <span className="relative overflow-hidden">
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-luxury-gold/40 group-hover:w-full transition-all duration-500" />
                      </span>
                      <ArrowUpRight className="w-3 lg:w-5 h-3 lg:h-5 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-luxury-gold" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 lg:space-y-8">
              <h4 className="text-[10px] lg:text-xs font-black uppercase tracking-[0.4em] text-luxury-blue-mid">Utility</h4>
              <ul className="space-y-4 lg:space-y-6">
                {utilityLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path}
                      className="group text-sm lg:text-lg font-light text-luxury-gray hover:text-luxury-blue-mid transition-all duration-300"
                    >
                      <span className="relative overflow-hidden">
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-luxury-gold/40 group-hover:w-full transition-all duration-500" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Contact Section */}
          <div className="lg:col-span-3 space-y-6 lg:space-y-8">
            <h4 className="text-[10px] lg:text-xs font-black uppercase tracking-[0.4em] text-luxury-blue-mid">Get in Touch</h4>
            <div className="space-y-6 lg:space-y-8">
              <motion.a 
                href="mailto:Huecrafthomes@gmail.com"
                whileHover={{ x: 8 }}
                className="flex items-center gap-5 lg:gap-6 group"
              >
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-luxury-blue-ultra border border-luxury-divider flex items-center justify-center group-hover:border-luxury-gold/50 group-hover:bg-white transition-all duration-500 inner-highlight shrink-0 shadow-premium-sm">
                  <Mail className="w-5 h-5 lg:w-7 lg:h-7 text-luxury-blue-mid group-hover:text-luxury-gold transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] lg:text-[11px] uppercase tracking-widest text-luxury-gold font-bold">Email</span>
                  <span className="text-sm lg:text-lg font-light text-luxury-gray group-hover:text-luxury-blue-mid transition-colors">Huecrafthomes@gmail.com</span>
                </div>
              </motion.a>

              <motion.a 
                href="tel:+14379928442"
                whileHover={{ x: 8 }}
                className="flex items-center gap-5 lg:gap-6 group"
              >
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-luxury-blue-ultra border border-luxury-divider flex items-center justify-center group-hover:border-luxury-gold/50 group-hover:bg-white transition-all duration-500 inner-highlight shrink-0 shadow-premium-sm">
                  <Phone className="w-5 h-5 lg:w-7 lg:h-7 text-luxury-blue-mid group-hover:text-luxury-gold transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] lg:text-[11px] uppercase tracking-widest text-luxury-gold font-bold">Phone</span>
                  <span className="text-sm lg:text-lg font-light text-luxury-gray group-hover:text-luxury-blue-mid transition-colors">+1 (437) 992-8442</span>
                </div>
              </motion.a>

              <motion.a 
                href="https://www.instagram.com/_huecraft?igsh=cmtvd2s3dDIxb3dz&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 8 }}
                className="flex items-center gap-5 lg:gap-6 group"
              >
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-luxury-blue-ultra border border-luxury-divider flex items-center justify-center group-hover:border-luxury-gold/50 group-hover:bg-white transition-all duration-500 inner-highlight shrink-0 shadow-premium-sm">
                  <Instagram className="w-5 h-5 lg:w-7 lg:h-7 text-luxury-blue-mid group-hover:text-luxury-gold transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] lg:text-[11px] uppercase tracking-widest text-luxury-gold font-bold">Instagram</span>
                  <span className="text-sm lg:text-lg font-light text-luxury-gray group-hover:text-luxury-blue-mid transition-colors">@_huecraft</span>
                </div>
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 lg:mt-32 pt-10 lg:pt-12 border-t border-luxury-divider flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs lg:text-base text-luxury-gray font-light">
            &copy; {currentYear} Huecraft Corp. All rights reserved. <span className="mx-2 text-luxury-gold/30">|</span> <span className="text-luxury-gold/60 italic">Precision in Every Stroke.</span>
          </p>
          <div className="flex items-center gap-8 lg:gap-12">
            <Link to="/privacy-policy" className="text-xs lg:text-base text-luxury-gray hover:text-luxury-gold transition-colors tracking-widest uppercase font-bold">Privacy</Link>
            <Link to="/terms-of-service" className="text-xs lg:text-base text-luxury-gray hover:text-luxury-gold transition-colors tracking-widest uppercase font-bold">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
