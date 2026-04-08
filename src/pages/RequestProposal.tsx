import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone, ClipboardList, MessageCircle } from 'lucide-react';

const RequestProposal = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  
  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    document.title = 'Get Quote | Huecraft Luxury Services';
  }, []);

  return (
    <div className="relative min-h-screen bg-white overflow-hidden selection:bg-luxury-gold/20 flex flex-col items-center justify-center pt-24 pb-16 gpu-accelerate">
      <div className="relative z-10 mx-auto w-full max-w-2xl lg:max-w-4xl px-6 lg:px-8">
        
        {/* PREMIUM ENTRY PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative group rounded-[2.5rem] md:rounded-[3rem] border border-luxury-divider bg-white p-8 md:p-12 lg:p-20 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] text-center transition-all duration-500 overflow-hidden lg:min-h-[500px] flex flex-col justify-center will-change-[opacity,transform,box-shadow]"
        >
          {/* Subtle top reflection */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent opacity-80" />
          
          <div className="relative z-10">
            <span className="text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.5em] text-luxury-gold mb-6 block">
              Bespoke Solutions
            </span>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-luxury-ink leading-[1] mb-8">
              Get <span className="text-luxury-gold italic font-light">Quote</span>
            </h1>
            
            <p className="mt-4 font-sans text-sm md:text-base lg:text-lg font-light leading-relaxed text-luxury-gray max-w-md lg:max-w-xl mx-auto">
              Share your project details and our team will guide you with the best solution.
            </p>
            
            <div className="mt-8 mb-12">
              <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white border border-luxury-divider shadow-premium-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-luxury-gold animate-pulse shadow-[0_0_8px_rgba(197,148,63,0.4)]" />
                <p className="text-[8px] lg:text-[9px] font-bold uppercase tracking-[0.15em] text-luxury-ink/70">
                  Quick Response Within 24 Hours
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/proposal-form"
                className="group relative inline-flex w-full sm:w-auto items-center justify-center px-12 py-5 overflow-hidden rounded-full btn-premium-navy active:scale-[0.97] tap-interaction border-b-[4px] border-black/80 hover:border-b-[6px] active:border-b-[1px] transition-all duration-300"
              >
                {/* Intense Sparkle/Shimmer Effect */}
                <motion.div 
                  className="absolute top-0 bottom-0 w-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 z-0"
                  animate={{ left: ["-200%", "200%"] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
                
                <span className="relative z-10 flex items-center gap-3 text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.2em] drop-shadow-md">
                  Get Quote
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
              
              <Link
                to="/contact"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full border-2 border-luxury-gold px-12 py-5 text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.2em] text-luxury-gold transition-all duration-300 hover:bg-luxury-gold hover:text-white shadow-premium-sm hover:shadow-premium-md active:scale-95 tap-interaction"
              >
                <Mail className="h-4 w-4" />
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>

        {/* QUICK CONNECT PANEL: Compact Premium Decision Card */}
        <div className="mt-16 lg:mt-24 perspective-1000 w-full">
          <motion.div
            ref={panelRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              boxShadow: [
                "0 10px 40px rgba(0,0,0,0.04)",
                "0 15px 50px rgba(0,0,0,0.08)",
                "0 10px 40px rgba(0,0,0,0.04)"
              ]
            }}
            transition={{ 
              initial: { delay: 0.2, duration: 0.8 },
              boxShadow: { repeat: Infinity, duration: 5, ease: "easeInOut" }
            }}
            className="max-w-[340px] md:max-w-sm lg:max-w-2xl mx-auto will-change-[opacity,transform,box-shadow] transform-gpu rounded-[2.5rem] md:rounded-[3rem]"
          >
          <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border border-luxury-divider/30 bg-white p-8 md:p-10 lg:p-16 text-center shadow-premium-xl">
            
            <div className="relative z-10">
              <h2 className="text-xl md:text-2xl lg:text-4xl font-serif font-bold text-luxury-ink tracking-tight mb-10 lg:mb-16">
                Get in Touch
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* CALL BUTTON */}
                <motion.a
                  href="tel:+14379928442"
                  whileHover={{ scale: 1.02, y: -2, boxShadow: "0 12px 24px -5px rgba(197,148,63,0.15)" }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex items-center justify-between p-6 md:p-8 rounded-[2rem] bg-white border border-luxury-divider/60 hover:border-luxury-gold/30 transition-all duration-300 overflow-hidden shadow-premium-md"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="h-14 w-14 lg:h-20 lg:w-20 rounded-2xl bg-luxury-gold/10 flex items-center justify-center relative">
                      <Phone className="h-6 w-6 lg:h-10 lg:w-10 text-luxury-gold" />
                      <div className="absolute inset-0 rounded-xl border border-luxury-gold/20 animate-ping opacity-10" />
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] md:text-[12px] lg:text-[14px] font-bold uppercase tracking-[0.15em] text-luxury-ink">Call</p>
                      <p className="text-[10px] md:text-[11px] lg:text-[13px] text-luxury-gray/60 font-medium">Direct call with expert</p>
                    </div>
                  </div>
                  
                  <ArrowRight className="h-5 w-5 text-luxury-gold/40 group-hover:text-luxury-gold transition-all duration-300 group-hover:translate-x-1" />
                </motion.a>

                {/* WHATSAPP BUTTON */}
                <motion.a
                  href="https://wa.me/14379928442"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -2, boxShadow: "0 12px 24px -5px rgba(37,211,102,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex items-center justify-between p-6 md:p-8 rounded-[2rem] bg-white border border-luxury-divider/60 hover:border-[#25D366]/30 transition-all duration-300 overflow-hidden shadow-premium-md"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#25D366]/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="h-14 w-14 lg:h-20 lg:w-20 rounded-2xl bg-[#25D366]/5 flex items-center justify-center relative">
                      <MessageCircle className="h-6 w-6 lg:h-10 lg:w-10 text-[#25D366]/70" />
                      <div className="absolute inset-0 rounded-xl border border-[#25D366]/10 animate-ping opacity-10" />
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] md:text-[12px] lg:text-[14px] font-bold uppercase tracking-[0.15em] text-luxury-ink">WhatsApp</p>
                      <p className="text-[10px] md:text-[11px] lg:text-[13px] text-luxury-gray/60 font-medium">Connect on WhatsApp</p>
                    </div>
                  </div>
                  
                  <ArrowRight className="h-5 w-5 text-[#25D366]/20 group-hover:text-[#25D366]/70 transition-all duration-300 group-hover:translate-x-1" />
                </motion.a>
              </div>
            </div>
            
            {/* Subtle Bottom Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/20 to-transparent opacity-30" />
          </div>
        </motion.div>
      </div>
    </div>
  </div>
  );
};

export default RequestProposal;
