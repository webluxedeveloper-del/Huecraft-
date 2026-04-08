import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '../lib/utils';

export const FinalCTA: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <section className={cn("py-16 md:py-20 lg:py-32 bg-white relative overflow-hidden", className)}>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl lg:max-w-5xl mx-auto perspective-2000"
        >
          <div className="relative group">
            {/* 3D Floating Base Panel (The "Below Side") */}
            <motion.div 
              animate={{ 
                y: [0, 12, 0],
                rotateX: [5, 8, 5],
                scale: [0.92, 0.95, 0.92]
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-12 left-[8%] right-[8%] h-28 bg-luxury-gold/5 rounded-[4rem] blur-3xl -z-10 border border-luxury-gold/10"
            />
            
            {/* Main Panel - 3D Floating */}
            <motion.div 
              animate={{ 
                y: [0, -25, 0],
                rotateX: [0, 4, 0],
                rotateY: [0, 2, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative bg-white rounded-[3rem] md:rounded-[4rem] lg:rounded-[4rem] p-6 md:p-10 lg:p-12 border border-luxury-divider shadow-[0_80px_200px_-40px_rgba(26,46,71,0.2)] hover:shadow-[0_100px_250px_-50px_rgba(26,46,71,0.3)] overflow-hidden flex flex-col items-center text-center transition-all duration-700 luxury-easing gpu-accelerate will-change-[transform,box-shadow]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Subtle top reflection */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/40 to-transparent opacity-80" />
              
              <div className="relative z-10 space-y-6 md:space-y-8 lg:space-y-10 max-w-2xl lg:max-w-3xl" style={{ transform: "translateZ(40px)" }}>
                {/* Badge - Professional & Compact */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-white border border-luxury-divider shadow-premium-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse shadow-[0_0_10px_rgba(197,148,63,0.5)]" />
                  <span className="text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold">Consultation & Design</span>
                </motion.div>

                {/* Heading - Cinematic & Balanced */}
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-luxury-ink tracking-tighter leading-[0.95]">
                  Ready to Elevate <br className="hidden sm:block" />
                  <span className="text-luxury-gold italic font-light">Your Property Value?</span>
                </h2>
                
                {/* Description - Elegant & Compact */}
                <p className="text-sm md:text-base lg:text-lg text-luxury-gray font-light leading-relaxed lg:leading-relaxed max-w-md lg:max-w-xl mx-auto">
                  Calgary's premier finishing specialists. Excellence for residential and commercial properties.
                </p>

                {/* CTA Actions - Modern, Cinematic, Professional */}
                <div className="pt-4 md:pt-6 lg:pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-6">
                  <motion.div
                    whileHover={{ 
                      y: -10,
                      rotateX: 15,
                      scale: 1.05,
                      transition: { duration: 0.4, ease: "easeOut" }
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="perspective-1000"
                  >
                    <Link
                      to="/request-proposal"
                      className="group relative inline-flex items-center justify-center px-8 md:px-10 lg:px-14 py-3.5 md:py-4 lg:py-5 rounded-full btn-premium-lighting overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-3 text-[10px] md:text-[11px] lg:text-xs font-bold uppercase tracking-[0.2em]">
                        Get Quote
                        <ArrowRight className="h-3.5 md:h-4 lg:h-5 w-3.5 md:w-4 lg:w-5 transition-transform duration-500 group-hover:translate-x-1.5" />
                      </span>
                    </Link>
                  </motion.div>
                  
                  <Link
                    to="/services"
                    className="group inline-flex items-center justify-center px-8 md:px-10 lg:px-14 py-3.5 md:py-4 lg:py-5 rounded-full border-x border-t border-luxury-divider border-b-4 border-luxury-divider/50 bg-white text-[10px] md:text-[11px] lg:text-xs font-bold uppercase tracking-[0.2em] text-luxury-ink transition-all duration-200 hover:border-luxury-gold hover:text-luxury-gold hover:-translate-y-0.5 hover:border-b-[5px] active:translate-y-1 active:border-b-[1px]"
                  >
                    View Our Services
                  </Link>
                </div>
              </div>
              
              {/* Subtle Decorative Elements */}
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-luxury-gold/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-luxury-blue-soft/5 rounded-full blur-[100px] pointer-events-none" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
