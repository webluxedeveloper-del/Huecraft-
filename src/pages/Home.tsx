import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  Paintbrush, 
  Droplets, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Award, 
  Hammer, 
  Ruler, 
  Users, 
  MapPin,
  ChevronRight, 
  ChevronLeft, 
  Quote, 
  Star,
  MousePointer2,
  CheckCircle2,
  Phone,
  MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import ProcessRoadmap from '../components/ProcessRoadmap';
import { FinalCTA } from '../components/FinalCTA';
import PremiumBackground from '../components/PremiumBackground';

const Home = () => {
  useEffect(() => {
    document.title = 'Huecraft | Premium Painting & Construction';
  }, []);

  // Testimonial Carousel State
  const testimonials = [
    {
      name: "Sarah Jenkins",
      message: "The attention to detail was absolutely incredible. Our home feels completely transformed and the finish is flawless.",
      rating: 4.8,
      image: "https://ik.imagekit.io/jabzmiuta/file_000000006338720b8c3a304fe31dec75.png?tr=q-100",
      position: "15% 20%"
    },
    {
      name: "Marcus Thorne",
      message: "Huecraft delivered on time and with a level of professionalism that is rare in the industry. Highly recommended.",
      rating: 4.5,
      image: "https://ik.imagekit.io/jabzmiuta/file_000000006338720b8c3a304fe31dec75.png?tr=q-100",
      position: "50% 20%"
    },
    {
      name: "Elena Rodriguez",
      message: "As a designer, I'm very picky about finishes. Huecraft exceeded my expectations in every single room.",
      rating: 4.7,
      image: "https://ik.imagekit.io/jabzmiuta/file_000000006338720b8c3a304fe31dec75.png?tr=q-100",
      position: "85% 20%"
    },
    {
      name: "Robert MacLeod",
      message: "Exceptional craftsmanship. They handled our heritage home restoration with extreme care and precision.",
      rating: 4.6,
      image: "https://ik.imagekit.io/jabzmiuta/file_000000006338720b8c3a304fe31dec75.png?tr=q-100",
      position: "15% 50%"
    },
    {
      name: "Jennifer Wong",
      message: "Professional from start to finish. The team was respectful of our space and the results are stunning.",
      rating: 4.9,
      image: "https://ik.imagekit.io/jabzmiuta/file_000000006338720b8c3a304fe31dec75.png?tr=q-100",
      position: "50% 50%"
    },
    {
      name: "David Gauthier",
      message: "The best architectural finishing company we've worked with. Their technical knowledge is unmatched.",
      rating: 4.4,
      image: "https://ik.imagekit.io/jabzmiuta/file_000000006338720b8c3a304fe31dec75.png?tr=q-100",
      position: "85% 50%"
    },
    {
      name: "James Richardson",
      message: "Their ability to blend modern techniques with traditional aesthetics is what sets them apart.",
      rating: 4.7,
      image: "https://ik.imagekit.io/jabzmiuta/file_000000006338720b8c3a304fe31dec75.png?tr=q-100",
      position: "15% 80%"
    },
    {
      name: "Sophie Tremblay",
      message: "A truly premium experience. From the initial transformation to the final reveal, everything was perfect.",
      rating: 4.8,
      image: "https://ik.imagekit.io/jabzmiuta/file_000000006338720b8c3a304fe31dec75.png?tr=q-100",
      position: "50% 80%"
    }
  ];

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const heroY = useTransform(scrollY, [0, 300], [0, 50]);

  return (
    <div className="bg-white selection:bg-luxury-gold/20 selection:text-luxury-gold overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[75dvh] lg:min-h-[85dvh] pt-28 lg:pt-32 pb-12 lg:pb-16 flex flex-col items-center justify-center px-6 overflow-hidden bg-white gpu-accelerate">
        <PremiumBackground variant="home" />
        {/* Subtle Premium Design Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none will-change-transform">
          {/* Noise Texture Overlay for Premium Feel */}
          <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay z-50" 
               style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

          {/* Subtle Background Image - Minimalist Architecture with Cinematic Zoom */}
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute inset-0 grayscale"
          >
            <img 
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2000" 
              alt="" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Enhanced Mesh Gradient - Optimized for Performance */}
          <div 
            className="absolute top-0 left-0 w-full h-full opacity-[0.15]" 
            style={{ 
              backgroundImage: 'radial-gradient(at 0% 0%, #d4af37 0px, transparent 50%), radial-gradient(at 100% 0%, #1a2e47 0px, transparent 50%), radial-gradient(at 100% 100%, #fdfbf7 0px, transparent 50%), radial-gradient(at 0% 100%, #c5943f 0px, transparent 50%)'
            }} 
          />
          
          {/* Cinematic Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_100%)] opacity-40 pointer-events-none" />

          {/* Refined Minimalist Grid */}
          <div className="absolute inset-0 opacity-[0.025]" 
               style={{ 
                 backgroundImage: 'linear-gradient(#1a2e47 0.5px, transparent 0.5px), linear-gradient(90deg, #1a2e47 0.5px, transparent 0.5px)',
                 backgroundSize: 'clamp(40px, 6vw, 80px) clamp(40px, 6vw, 80px)'
               }} />
          
          {/* Cinematic Floating Particles - Optimized with Transforms */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0,
                x: `${Math.random() * 100}vw`,
                y: "110vh"
              }}
              animate={{ 
                opacity: [0, 0.15, 0],
                y: ["110vh", "-10vh"],
                x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`]
              }}
              transition={{ 
                duration: 25 + Math.random() * 15,
                repeat: Infinity,
                delay: Math.random() * 10,
                ease: "linear"
              }}
              className="absolute w-1 h-1 bg-luxury-gold rounded-full z-10 will-change-transform"
            />
          ))}
          
          {/* Floating Luxury Accents - Optimized Blurs & Static Positions */}
          <div className="absolute top-[10%] right-[15%] w-[30rem] h-[30rem] bg-luxury-gold/5 rounded-full pointer-events-none" />
          <div className="absolute bottom-[10%] left-[10%] w-[35rem] h-[35rem] bg-luxury-blue-ultra/10 rounded-full pointer-events-none" />
        </div>

        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center will-change-[opacity,transform]"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.4
                }
              }
            }}
            className="flex flex-col items-center gap-12 md:gap-16"
          >
            {/* TOP BADGE - More Professional & Inclusive */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 20 },
                visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
              }}
              className="flex justify-center"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/80 border border-luxury-divider/30 shadow-[0_8px_32px_rgba(26,46,71,0.05)]">
                <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.5em] text-luxury-ink/60">
                  Mastery in Every Detail
                </span>
              </div>
            </motion.div>
            
            {/* MAIN HEADLINE - More Stately & Inclusive */}
            <div className="space-y-6 md:space-y-10 lg:space-y-12">
              <motion.h1 
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                }}
                className="font-serif text-[3rem] sm:text-7xl md:text-8xl lg:text-6xl xl:text-7xl font-bold tracking-tighter text-luxury-ink leading-[0.95] md:leading-[0.9] lg:leading-[0.85] will-change-[opacity,transform]"
              >
                Elevating <br />
                <span className="text-luxury-gold italic font-light">Spaces.</span>
              </motion.h1>
              
              {/* SUBTITLE - Simplified & Elegant */}
              <motion.p 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] } }
                }}
                className="max-w-xl lg:max-w-2xl mx-auto text-sm md:text-lg lg:text-lg font-light text-luxury-gray/70 leading-relaxed lg:leading-loose tracking-wide px-8 lg:px-0 will-change-[opacity,transform]"
              >
                Bespoke architectural finishes and premium painting <br className="hidden md:block" />
                for residential and commercial properties.
              </motion.p>
            </div>
            
            {/* CTAs - Refined Micro-interactions */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] } }
              }}
              className="flex flex-col items-center gap-5 lg:gap-8 w-full will-change-[opacity,transform]"
            >
              <motion.div
                whileHover={{ 
                  y: -10,
                  rotateX: 15,
                  scale: 1.05,
                  transition: { duration: 0.4, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
                className="perspective-1000 w-full flex justify-center"
              >
                <Link
                  to="/request-proposal"
                  className="group relative flex items-center justify-center gap-4 rounded-full btn-premium-navy px-10 md:px-14 lg:px-16 py-4 md:py-5 lg:py-6 text-[10px] md:text-[11px] lg:text-xs font-bold uppercase tracking-[0.3em] overflow-hidden w-full max-w-md"
                >
                  {/* Refined Shine Effect */}
                  <motion.div 
                    animate={{ x: ['-150%', '250%'] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                    className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-20"
                  />
                  
                  <span className="relative z-10">Get Quote</span>
                  <ArrowRight className="relative z-10 w-4 h-4 lg:w-5 lg:h-5 transition-transform duration-700 group-hover:translate-x-2" />
                </Link>
              </motion.div>

              <div className="flex flex-col items-center gap-4 lg:gap-6">
                <motion.div
                  whileHover={{ 
                    y: -4,
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto flex justify-center"
                >
                  <Link
                    to="/services"
                    className="group relative flex items-center justify-center gap-4 rounded-full bg-white border border-luxury-divider/40 text-luxury-ink px-10 md:px-14 lg:px-12 py-4 md:py-5 lg:py-4 text-[10px] md:text-[11px] lg:text-[11px] font-bold uppercase tracking-[0.3em] overflow-hidden w-full max-w-md sm:max-w-none hover:border-luxury-gold/30 hover:text-luxury-gold transition-all duration-300"
                  >
                    <span className="relative z-10">View Services</span>
                  </Link>
                </motion.div>

                {/* Quick Contact Inline Buttons - Positioned Below View Services */}
                <div className="flex items-center justify-center gap-3 lg:gap-4">
                  <motion.a
                    href="tel:+14379928442"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative flex items-center justify-center gap-2 px-4 py-2 lg:px-5 lg:py-2.5 rounded-full bg-white border border-luxury-divider/40 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-luxury-ink hover:border-luxury-gold/30 transition-all duration-300 overflow-hidden w-32 lg:w-36"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="flex h-5 w-5 lg:h-6 lg:w-6 items-center justify-center rounded-full bg-luxury-blue-ultra text-luxury-gold">
                      <Phone className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                    </div>
                    <span className="relative z-10">Call</span>
                    
                    {/* Continuous Pulse Effect */}
                    <div className="absolute inset-0 rounded-full border border-luxury-gold/20 animate-ping opacity-20 pointer-events-none" />
                  </motion.a>

                  <motion.a
                    href="https://wa.me/14379928442"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative flex items-center justify-center gap-2 px-4 py-2 lg:px-5 lg:py-2.5 rounded-full bg-white border border-luxury-divider/40 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-luxury-ink hover:border-[#25D366]/30 transition-all duration-300 overflow-hidden w-32 lg:w-36"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#25D366]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="flex h-5 w-5 lg:h-6 lg:w-6 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                      <MessageCircle className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                    </div>
                    <span className="relative z-10">WhatsApp</span>

                    {/* Continuous Pulse Effect */}
                    <div className="absolute inset-0 rounded-full border border-[#25D366]/20 animate-ping opacity-20 pointer-events-none" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* SCROLL INDICATOR - More Minimalist */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 2 }}
          className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <div className="relative w-[1px] h-16 bg-luxury-divider/20 overflow-hidden rounded-full">
            <motion.div 
              animate={{ 
                y: [-64, 64],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-luxury-gold to-transparent" 
            />
          </div>
        </motion.div>
      </section>

      {/* SERVICES PREVIEW SECTION */}
      <section className="relative py-16 lg:py-20 px-4 bg-white overflow-hidden gpu-accelerate">
        <PremiumBackground variant="services" />
        <div className="max-w-4xl lg:max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-8 lg:mb-12"
          >
            <span className="text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.5em] text-luxury-blue-mid mb-3 lg:mb-4 block">Our Expertise</span>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-6xl font-bold text-luxury-ink tracking-tighter">Curated Services.</h2>
          </motion.div>

          <div className="max-w-4xl lg:max-w-7xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-20 lg:items-center text-left">
              {/* Desktop Left Side: Text Content */}
              <div className="hidden lg:flex flex-col order-1 lg:order-1">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="mb-10"
                >
                  <span className="text-xs font-bold uppercase tracking-[0.5em] text-luxury-gold flex items-center gap-3">
                    <div className="w-12 h-[1px] bg-luxury-gold/30" />
                    Service 01
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-6 mb-12 w-full"
                >
                  <div className="space-y-3">
                    <h3 className="font-serif text-5xl lg:text-4xl xl:text-5xl font-bold text-luxury-ink tracking-tight leading-[1.1]">Interior<br/>Painting</h3>
                    <p className="text-xl xl:text-xl font-medium text-luxury-gold max-w-xl leading-relaxed italic tracking-wide">
                      Elevated living spaces
                    </p>
                  </div>
                  
                  <p className="text-luxury-gray font-light leading-loose max-w-lg text-base">
                    Transform your interior spaces with our premium painting services. We use only the finest materials and masterful techniques to ensure a flawless, enduring finish that elevates your home's aesthetic.
                  </p>
                  
                  <div className="pt-8">
                    <Link
                      to="/services"
                      className="group relative inline-flex items-center justify-center px-10 py-4 rounded-full bg-luxury-ink text-white text-[10px] font-bold uppercase tracking-[0.4em] transition-all duration-700 hover:-translate-y-2 active:translate-y-0 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/20 via-transparent to-luxury-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <span className="relative z-10">View All Services</span>
                      <ArrowRight className="relative z-10 w-5 h-5 ml-4 transition-transform duration-500 group-hover:translate-x-2" />
                      
                      <motion.div 
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                        className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
                      />
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Desktop Right Side: Image */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:block relative w-full aspect-[16/9] group/service perspective-2000 will-change-[opacity,transform] order-2 lg:order-2"
              >
                <motion.div 
                  whileHover={{ 
                    rotateX: 2, 
                    rotateY: -2, 
                    scale: 1.02,
                    translateZ: 50
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full h-full relative rounded-[3rem] overflow-hidden shadow-[0_30px_70px_-20px_rgba(26,46,71,0.15)] border border-luxury-divider bg-white"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=1200"
                    alt="Interior Painting"
                    className="w-full h-full object-cover transition-transform duration-1200 group-hover/service:scale-110"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-ink/20 to-transparent opacity-0 group-hover/service:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover/service:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </motion.div>
                
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] h-12 bg-luxury-ink/5 blur-3xl rounded-full opacity-0 group-hover/service:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </motion.div>

              {/* Mobile Layout (Unchanged) */}
              <div className="flex flex-col lg:hidden w-full">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="mb-8 ml-1 md:ml-2"
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-luxury-gold flex items-center gap-3">
                    <div className="w-8 h-[1px] bg-luxury-gold/30" />
                    Service 01
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full aspect-[16/9] md:aspect-[16/9] mb-12 group/service perspective-2000 will-change-[opacity,transform]"
                >
                  <motion.div 
                    className="w-full h-full relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_30px_70px_-20px_rgba(26,46,71,0.15)] border border-luxury-divider bg-white"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=1200"
                      alt="Interior Painting"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-6 mb-10 w-full ml-1 md:ml-2"
                >
                  <div className="space-y-3">
                    <h3 className="font-serif text-4xl md:text-6xl font-bold text-luxury-ink tracking-tight leading-tight">Interior Painting</h3>
                    <p className="text-base md:text-xl font-medium text-luxury-gold max-w-2xl leading-relaxed italic tracking-wide">
                      Elevated living spaces
                    </p>
                  </div>
                  
                  <p className="text-luxury-gray font-light leading-relaxed max-w-xl text-sm md:text-base">
                    Transform your interior spaces with our premium painting services. We use only the finest materials and masterful techniques to ensure a flawless, enduring finish that elevates your home's aesthetic.
                  </p>
                  
                  <div className="pt-6">
                    <Link
                      to="/services"
                      className="group relative inline-flex items-center justify-center px-10 py-4 rounded-full bg-luxury-ink text-white text-[10px] font-bold uppercase tracking-[0.4em] shadow-premium-lg overflow-hidden"
                    >
                      <span className="relative z-10">View All Services</span>
                      <ArrowRight className="relative z-10 w-4 h-4 ml-4" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT PREVIEW SECTION */}
      <section className="relative py-10 lg:py-10 px-4 bg-white overflow-hidden gpu-accelerate">
        <PremiumBackground variant="projects" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 lg:mb-12 text-center lg:text-right lg:pr-20"
          >
            <span className="text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.5em] text-luxury-blue-mid mb-[7px] lg:mb-4 block">Recent Work</span>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-6xl font-bold text-luxury-ink tracking-tighter">Visual Excellence.</h2>
          </motion.div>

          <div className="max-w-4xl lg:max-w-7xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-20 lg:items-center text-left">
              {/* Desktop Left Side: Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:block relative w-full group will-change-[opacity,transform] order-1 lg:order-1"
              >
                <div className="w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[450px] rounded-[1.5rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] transition-shadow duration-700 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)]">
                  <BeforeAfterSlider
                    beforeImage="https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=1200&fm=webp"
                    afterImage="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200&fm=webp"
                    className="w-full h-full rounded-[1.5rem]"
                    priority
                  />
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-10 bg-luxury-ink/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </motion.div>

              {/* Desktop Right Side: Text Content */}
              <div className="hidden lg:flex flex-col order-2 lg:order-2">
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="mb-10"
                >
                  <span className="text-xs font-bold uppercase tracking-[0.4em] text-luxury-gold flex items-center gap-3">
                    <div className="w-12 h-[1px] bg-luxury-gold/30" />
                    Project 01
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-6 mb-12 w-full"
                >
                  <div className="space-y-3">
                    <h3 className="font-serif text-5xl lg:text-4xl xl:text-5xl font-bold text-luxury-ink tracking-tight leading-[1.1]">Modern Interior<br/>Transformation</h3>
                    <p className="text-xl xl:text-xl font-medium text-luxury-gold max-w-xl leading-relaxed italic tracking-wide">
                      "Client wanted a modern and durable finish for their open concept living area"
                    </p>
                  </div>
                  
                  <div className="pt-8">
                    <Link
                      to="/projects"
                      className="group relative inline-flex items-center justify-center px-10 py-4 rounded-full bg-luxury-ink text-white text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 hover:-translate-y-1.5 active:translate-y-0 overflow-hidden edge-highlight"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-luxury-blue-mid/30 via-transparent to-luxury-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="relative z-10">View All Projects</span>
                      <ArrowRight className="relative z-10 w-5 h-5 ml-4 transition-transform duration-500 group-hover:translate-x-1.5" />
                      <motion.div 
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                        className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                      />
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Mobile Layout (Unchanged) */}
              <div className="flex flex-col lg:hidden w-full">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="mb-6 ml-1 md:ml-2"
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-luxury-gold">Project 01</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full mb-10 group will-change-[opacity,transform]"
                >
                  <div className="w-full h-[250px] sm:h-[300px] md:h-[400px] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] transition-shadow duration-700 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)]">
                    <BeforeAfterSlider
                      beforeImage="https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=1200&fm=webp"
                      afterImage="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200&fm=webp"
                      className="w-full h-full rounded-[1.5rem]"
                      priority
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-4 mb-8 w-full ml-1 md:ml-2"
                >
                  <h3 className="font-serif text-3xl md:text-5xl font-bold text-luxury-ink tracking-tight leading-tight">Modern Interior Transformation</h3>
                  <p className="text-sm md:text-lg font-medium text-luxury-gold max-w-2xl leading-relaxed italic tracking-wide">
                    "Client wanted a modern and durable finish for their open concept living area"
                  </p>
                  
                  <div className="pt-4">
                    <Link
                      to="/projects"
                      className="group relative inline-flex items-center justify-center px-10 py-4 rounded-full bg-luxury-ink text-white text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 overflow-hidden edge-highlight"
                    >
                      <span className="relative z-10">View All Projects</span>
                      <ArrowRight className="relative z-10 w-3.5 h-3.5 ml-3" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE AREA – COMPACT HOME VERSION */}
      <section className="py-6 lg:py-24 bg-white relative overflow-hidden gpu-accelerate">
        <PremiumBackground variant="about" />
        <div className="mx-auto max-w-xl lg:max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* SERVICE REGIONS PANEL */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="relative panel-premium-navy rounded-[3rem] p-8 lg:p-12 overflow-hidden group perspective-2000 will-change-transform aspect-square lg:aspect-auto lg:h-[450px] flex flex-col justify-center"
            >
              {/* Continuous Lighting Effect */}
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none z-0"
              />
              <div className="relative z-10 flex flex-col items-center lg:items-start gap-6 lg:gap-10">
                <div className="flex-shrink-0 w-16 h-16 lg:w-24 lg:h-24 rounded-2xl lg:rounded-3xl bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-premium-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700">
                  <MapPin className="w-8 h-8 lg:w-12 lg:h-12 text-luxury-gold" strokeWidth={1.5} />
                  <div className="absolute inset-0 bg-luxury-gold/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                
                <div className="text-center lg:text-left">
                  <h2 className="font-serif text-3xl lg:text-5xl font-bold text-white mb-2 lg:mb-4 tracking-tight group-hover:text-luxury-gold transition-colors duration-500">
                    Service Regions
                  </h2>
                  <p className="text-sm lg:text-lg text-white/70 font-light mb-6 lg:mb-10 leading-relaxed max-w-md">
                    Delivering master-level craftsmanship across the greater region.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-y-4 lg:gap-y-8 gap-x-6 lg:gap-x-16 text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] text-luxury-gold">
                    {[
                      { name: "Calgary" },
                      { name: "Airdrie" },
                      { name: "Chestermere" },
                      { name: "Greater Region" }
                    ].map((region) => (
                      <div key={region.name} className="flex items-center gap-3 lg:gap-5 group/item">
                        <div className="flex h-6 w-6 lg:h-10 lg:w-10 shrink-0 items-center justify-center rounded-full bg-white/10 border border-white/20 text-luxury-gold group-hover/item:bg-luxury-gold group-hover/item:text-white group-hover/item:border-luxury-gold transition-all duration-500 shadow-premium-sm">
                          <MapPin className="h-3 w-3 lg:h-5 lg:w-5" strokeWidth={2.5} />
                        </div>
                        <span className="truncate text-white lg:text-xl group-hover/item:translate-x-1 transition-transform duration-300">{region.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* SAFETY & CERTIFICATIONS PANEL */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="relative panel-premium-navy rounded-[3rem] p-8 lg:p-12 overflow-hidden group perspective-2000 will-change-transform aspect-square lg:aspect-auto lg:h-[450px] flex flex-col justify-center"
            >
              {/* Continuous Lighting Effect */}
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none z-0"
              />
              <div className="relative z-10 flex flex-col items-center lg:items-start gap-6 lg:gap-10">
                <div className="flex-shrink-0 w-16 h-16 lg:w-24 lg:h-24 rounded-2xl lg:rounded-3xl bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-premium-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700">
                  <ShieldCheck className="w-8 h-8 lg:w-12 lg:h-12 text-luxury-gold" strokeWidth={1.5} />
                  <div className="absolute inset-0 bg-luxury-gold/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                
                <div className="text-center lg:text-left w-full">
                  <h2 className="font-serif text-3xl lg:text-5xl text-white font-bold mb-2 lg:mb-4 tracking-tight leading-tight group-hover:text-luxury-gold transition-colors duration-500">Safety & Trust</h2>
                  <p className="text-luxury-gold text-[10px] lg:text-sm tracking-[0.3em] uppercase font-bold mb-8 lg:mb-12">Your Trust is Our Priority</p>
                  
                  <div className="grid grid-cols-2 gap-6 lg:gap-12">
                    {[
                      { name: 'WCB', icon: ShieldCheck },
                      { name: 'Insurance', icon: ShieldCheck },
                      { name: 'Fall Protection', icon: ShieldCheck },
                      { name: 'CPR', icon: ShieldCheck }
                    ].map((cert) => (
                      <div key={cert.name} className="flex items-center gap-4 group/cert">
                        <div className="w-10 h-10 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-premium-sm transition-all duration-500 group-hover/cert:border-luxury-gold/40 relative overflow-hidden">
                          <cert.icon className="w-5 h-5 lg:w-8 lg:h-8 text-white group-hover/cert:text-luxury-gold transition-colors duration-500 relative z-10" strokeWidth={1.2} />
                        </div>
                        <span className="text-[10px] lg:text-sm font-bold uppercase tracking-[0.15em] text-white/70 group-hover/cert:text-white transition-colors duration-500 leading-tight">{cert.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION - CLEAN PREMIUM SCROLL */}
      <section className="py-16 lg:py-20 px-4 bg-white overflow-hidden gpu-accelerate">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 lg:mb-12 px-4">
            <span className="text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.5em] text-luxury-blue-mid mb-4 lg:mb-5 block">
              The Advantage
            </span>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-5xl font-bold text-luxury-ink tracking-tighter">
              Why Huecraft.
            </h2>
          </div>

          {/* Horizontal Scroll Container (Mobile) / Grid (Desktop) */}
          <div className="relative -mx-4 px-4 lg:mx-0 lg:px-0">
            <div 
              className="flex lg:grid lg:grid-cols-4 gap-5 lg:gap-8 overflow-x-auto lg:overflow-visible pb-12 lg:pb-0 no-scrollbar snap-x snap-mandatory lg:snap-none cursor-grab active:cursor-grabbing lg:cursor-auto"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {[
                { 
                  icon: ShieldCheck, 
                  title: "Climate Ready", 
                  desc: "Engineered to withstand extreme temperature fluctuations and high humidity."
                },
                { 
                  icon: Award, 
                  title: "Premium Materials", 
                  desc: "Exclusively sourced architectural-grade pigments for superior finish depth."
                },
                { 
                  icon: Users, 
                  title: "Master Artisans", 
                  desc: "Career professionals with decades of experience in high-end finishing."
                },
                { 
                  icon: Clock, 
                  title: "Precision Timelines", 
                  desc: "Advanced systems ensuring project milestones are met with surgical precision."
                }
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex-none w-[60vw] md:w-[280px] lg:w-auto snap-start lg:snap-align-none"
                >
                  <motion.div
                    whileHover={{ 
                      y: -12,
                      rotateX: 5,
                      rotateY: 5,
                      scale: 1.05,
                      z: 20
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="relative aspect-square p-8 md:p-10 lg:p-8 rounded-[2rem] lg:rounded-[2rem] bg-white border border-luxury-divider shadow-premium-md flex flex-col items-start justify-center text-left group transition-all duration-500 overflow-hidden will-change-[transform,box-shadow] perspective-1000"
                  >
                    {/* Subtle Golden Gradient Background Layer */}
                    <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {/* Premium Icon Container */}
                    <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 rounded-2xl bg-luxury-blue-ultra shadow-premium-sm flex items-center justify-center mb-6 lg:mb-6 group-hover:shadow-premium-md group-hover:bg-white transition-all duration-500 border border-luxury-divider/20">
                      <item.icon className="w-7 h-7 md:w-8 md:h-8 lg:w-8 lg:h-8 text-luxury-gold drop-shadow-sm" />
                      
                      {/* Subtle Glow */}
                      <div className="absolute inset-0 bg-luxury-gold/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    <h3 className="relative z-10 font-serif text-xl md:text-2xl lg:text-2xl font-bold text-luxury-ink mb-3 lg:mb-3 tracking-tight group-hover:text-luxury-blue-mid transition-colors duration-500">
                      {item.title}
                    </h3>
                    
                    <p className="relative z-10 text-xs md:text-sm lg:text-sm font-medium text-luxury-gray leading-relaxed lg:leading-relaxed group-hover:text-luxury-gray-deep transition-colors duration-500">
                      {item.desc}
                    </p>

                    {/* Golden Accent Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    
                    {/* Top Corner Reflection */}
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-luxury-gold/5 rounded-full blur-2xl group-hover:bg-luxury-gold/10 transition-all duration-700" />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS SECTION (VERTICAL ROADMAP) */}
      <section className="py-16 lg:py-20 px-4 bg-white -mt-6 lg:-mt-12">
        <div className="max-w-4xl lg:max-w-6xl mx-auto">
          <div className="text-center mb-8 lg:mb-12">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.5em] text-luxury-blue-mid mb-4 lg:mb-5 block"
            >
              Our Method
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-4xl md:text-6xl lg:text-5xl font-bold text-luxury-ink tracking-tighter"
            >
              The Process.
            </motion.h2>
          </div>

          <ProcessRoadmap steps={[
            { title: "Consultation", icon: Users },
            { title: "Planning", icon: Ruler },
            { title: "Execution", icon: Paintbrush },
            { title: "Final Finishing", icon: CheckCircle2 }
          ]} />
        </div>
      </section>

      {/* TESTIMONIALS SECTION - PREMIUM HORIZONTAL CAROUSEL */}
      <section className="py-16 lg:py-20 px-4 bg-white overflow-hidden gpu-accelerate">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 lg:mb-12 px-4">
            <span className="text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.5em] text-luxury-blue-mid mb-4 lg:mb-5 block">Client Voices</span>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-5xl font-bold text-luxury-ink tracking-tighter">Trusted Results.</h2>
          </div>

          <div className="relative -mx-4 px-4 lg:mx-0 lg:px-0">
            <div 
              className="flex gap-6 lg:gap-6 overflow-x-auto pb-16 lg:pb-20 no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              {/* Duplicating array for a pseudo-infinite loop feel */}
              {[...testimonials, ...testimonials].map((testimonial, i) => (
                <div
                  key={i}
                  className="flex-none w-[68vw] md:w-[300px] lg:w-[320px] snap-start"
                >
                  <motion.div
                    whileHover={{ 
                      y: -15,
                      rotateX: 5,
                      rotateY: 5,
                      scale: 1.05,
                      z: 20
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="relative p-6 md:p-8 lg:p-8 rounded-[2.5rem] lg:rounded-[2.5rem] bg-white border border-luxury-divider flex flex-col group overflow-hidden h-full min-h-[300px] lg:min-h-[300px] perspective-1000 will-change-transform"
                  >
                    {/* Premium Shade Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-luxury-blue-ultra/30 via-transparent to-luxury-gold/5 opacity-50" />
                    
                    {/* Subtle Background Accent on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <Quote className="absolute top-6 right-6 w-10 h-10 text-luxury-blue-ultra/30 -z-0 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12" />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Rating Header - Compact & Professional */}
                      <div 
                        className="flex flex-col items-start mb-5"
                      >
                        <div className="flex gap-0.5 mb-1.5">
                          {[...Array(5)].map((_, starIndex) => {
                            const rating = testimonial.rating;
                            const fillAmount = Math.max(0, Math.min(1, rating - starIndex));
                            
                            return (
                              <div key={starIndex} className="relative w-4 h-4">
                                <Star className="absolute inset-0 w-4 h-4 text-luxury-divider" />
                                <div 
                                  className="absolute inset-0 overflow-hidden" 
                                  style={{ width: `${fillAmount * 100}%` }}
                                >
                                  <Star className="w-4 h-4 fill-luxury-gold text-luxury-gold" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <span className="text-[12px] font-black text-luxury-gold tracking-tight">{testimonial.rating} Rating</span>
                      </div>

                      {/* Message - Increased Size & Clarity */}
                      <p 
                        className="font-serif text-base md:text-lg lg:text-lg italic text-luxury-ink leading-relaxed lg:leading-relaxed mb-8 text-left line-clamp-6"
                      >
                        "{testimonial.message}"
                      </p>

                      {/* User Info - Ultra Compact with smaller avatar */}
                      <div 
                        className="mt-auto flex items-center gap-3 lg:gap-3 text-left"
                      >
                        <div className="w-10 h-10 lg:w-10 lg:h-10 rounded-full overflow-hidden border border-luxury-divider shadow-premium-sm group-hover:border-luxury-gold transition-all duration-500 flex-shrink-0 group-hover:scale-110 relative">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name} 
                            className="w-full h-full object-cover scale-150"
                            style={{ objectPosition: (testimonial as any).position }}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-[11px] lg:text-xs font-bold uppercase tracking-[0.15em] text-luxury-ink leading-none">{testimonial.name}</h4>
                        </div>
                      </div>
                    </div>

                    {/* Corner Accent - 3D Glow */}
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-luxury-gold/10 rounded-full blur-3xl group-hover:bg-luxury-gold/20 transition-all duration-700" />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA PANEL */}
      <FinalCTA />

    </div>
  );
};

export default Home;
