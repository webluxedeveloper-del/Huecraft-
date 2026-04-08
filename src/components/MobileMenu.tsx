import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Home, 
  Briefcase, 
  Layout, 
  Sparkles, 
  Phone, 
  Mail,
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

    const menuItems = [
      { name: 'Home', path: '/', icon: Home },
      { name: 'Services', path: '/services', icon: Briefcase },
      { name: 'Projects', path: '/projects', icon: Layout },
      { name: 'Get Quote', path: '/request-proposal', icon: Sparkles },
      { name: 'Contact', path: '/contact', icon: Phone },
      { name: 'About', path: '/about', icon: Info },
    ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay - Removed blur for performance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="fixed right-0 top-0 z-[70] h-full w-[88%] sm:w-[82%] max-w-[480px] bg-white rounded-l-[3rem] overflow-hidden flex flex-col border-l border-luxury-divider gpu-accelerate"
          >
            {/* Header / Branding - Premium Layout */}
            <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-luxury-divider">
              <div className="flex items-center gap-3">
                <span className="text-xl font-serif font-black tracking-[0.25em] text-luxury-blue-mid uppercase leading-none">
                  HUECRAFT
                </span>
                <img 
                  src="https://ik.imagekit.io/jabzmiuta/Gemini_Generated_Image_6tlhjt6tlhjt6tlh-removebg-preview.png" 
                  alt="Huecraft Logo" 
                  className="h-7 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.05, x: 2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="group relative flex h-8 w-8 items-center justify-center rounded-full bg-luxury-blue-ultra/30 border border-luxury-divider text-luxury-blue-mid transition-all duration-300 hover:border-luxury-gold/40 hover:bg-white hover:text-luxury-gold"
                aria-label="Go Back"
              >
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                <div className="absolute inset-0 rounded-full border border-luxury-gold/0 transition-all duration-300 group-hover:border-luxury-gold/20 group-hover:scale-110" />
              </motion.button>
            </div>

            {/* Navigation Items - Optimized for performance */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.01, x: -2 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={cn(
                        "group relative flex items-center gap-4 p-4 rounded-[2rem] bg-white border-x border-t border-luxury-divider border-b-4 border-luxury-divider/50 transition-all duration-200",
                        "hover:bg-luxury-blue-ultra hover:border-luxury-gold/20 hover:-translate-y-0.5 hover:border-b-[5px] active:translate-y-1 active:border-b-[1px]",
                        isActive && "border-luxury-gold/30 bg-luxury-blue-ultra"
                      )}
                    >
                      <div className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300",
                        isActive ? "bg-luxury-blue-mid text-white" : "bg-luxury-blue-ultra text-luxury-blue-mid group-hover:bg-luxury-blue-mid group-hover:text-white"
                      )}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      
                      <div className="flex-1">
                        <span className={cn(
                          "text-[11px] font-bold uppercase tracking-[0.15em] transition-colors",
                          isActive ? "text-luxury-blue-mid" : "text-luxury-gray group-hover:text-luxury-blue-mid"
                        )}>
                          {item.name}
                        </span>
                      </div>
 
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-all duration-300",
                        isActive ? "text-luxury-blue-mid translate-x-0" : "text-luxury-gold/20 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                      )} />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer - Small & Minimal */}
            <div className="p-6 border-t border-luxury-divider flex justify-between items-center">
              <span className="text-[8px] font-bold uppercase tracking-widest text-luxury-blue-soft/40">
                © 2026 Huecraft Corp
              </span>
              <div className="flex gap-2">
                <div className="w-1 h-1 rounded-full bg-luxury-gold/20" />
                <div className="w-1 h-1 rounded-full bg-luxury-gold/20" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
