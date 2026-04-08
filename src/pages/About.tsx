import React from 'react';
import { motion } from 'framer-motion';
import { 
  Paintbrush, 
  Layers, 
  Droplets, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  ArrowRight,
  Award,
  Users,
  Clock,
  Zap,
  Hammer,
  Wind,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { FinalCTA } from '../components/FinalCTA';
import PremiumBackground from '../components/PremiumBackground';

const FadeInWhenVisible: React.FC<{ children: React.ReactNode; delay?: number; direction?: 'up' | 'down' | 'left' | 'right' }> = ({ 
  children, 
  delay = 0, 
  direction = 'up' 
}) => {
  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === 'up' ? 10 : direction === 'down' ? -10 : 0,
      x: direction === 'left' ? 10 : direction === 'right' ? -10 : 0
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      className="will-change-[opacity,transform] transform-gpu"
    >
      {children}
    </motion.div>
  );
};

const About = () => {
  React.useEffect(() => {
    document.title = 'About | Huecraft';
  }, []);

  const expertise = [
    {
      title: 'Painting',
      icon: Paintbrush,
      desc: 'Expert interior and exterior painting with premium finishes that last.',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&h=400&auto=format&fit=crop'
    },
    {
      title: 'Siding',
      icon: Layers,
      desc: 'Durable siding solutions designed for the Calgary climate and aesthetics.',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&h=400&auto=format&fit=crop'
    },
    {
      title: 'Gutter Systems',
      icon: Droplets,
      desc: 'High-performance gutter installations to protect your property structure.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&h=400&auto=format&fit=crop'
    }
  ];

  const processSteps = [
    { title: 'Consultation', desc: 'We begin with a detailed assessment of your needs and vision.' },
    { title: 'Preparation', desc: 'Meticulous surface prep ensures the longevity of every finish.' },
    { title: 'Execution', desc: 'Our certified professionals deliver excellence with precision.' }
  ];

  const advantages = [
    {
      title: 'Turnkey Solutions',
      desc: 'End-to-end project management.',
      icon: Layers
    },
    {
      title: 'Climate Ready',
      desc: 'Engineered for Calgary weather.',
      icon: Wind
    },
    {
      title: 'Premium Materials',
      desc: 'Top-tier supplier partnerships.',
      icon: Award
    },
    {
      title: 'Clean Execution',
      desc: 'Dustless sanding & site protection.',
      icon: Zap
    },
    {
      title: 'Strict Workflow',
      desc: 'Transparent, timely delivery.',
      icon: Clock
    },
    {
      title: 'Certified Experts',
      desc: 'Rigorous safety & craft training.',
      icon: Users
    }
  ];

  const certifications = [
    { name: 'WCB', icon: ShieldCheck },
    { name: 'Insurance', icon: ShieldCheck },
    { name: 'Fall Protection', icon: ShieldCheck },
    { name: 'CPR', icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-luxury-gold/20 overflow-x-hidden relative gpu-accelerate">
      <PremiumBackground variant="about" />
      {/* [1] HERO – IMMERSIVE ENTRY */}
      <section className="relative flex flex-col justify-center pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden bg-white border-b border-luxury-divider gpu-accelerate">
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="relative z-10 text-left">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-luxury-divider mb-8 shadow-premium-sm inner-highlight"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse shadow-[0_0_8px_rgba(212,162,76,0.5)]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-luxury-blue-mid">
                Established in Calgary
              </span>
            </motion.div>
 
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-luxury-blue-mid leading-[0.9] mb-8 will-change-transform"
            >
              Crafting Durable, <br />
              <span className="text-luxury-gold italic font-light">High-End Finishes.</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="text-lg font-light text-luxury-gray max-w-lg leading-relaxed mb-10"
            >
              Premium residential and commercial painting, siding, and exterior solutions built for performance and aesthetics.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/request-proposal"
                className="group relative flex items-center gap-2 overflow-hidden rounded-xl btn-premium-navy px-8 py-4 text-[13px] font-bold uppercase tracking-[0.2em] tap-interaction"
              >
                Get Quote
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          <div className="relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative aspect-square"
            >
              {/* Abstract 3D shape / blurred texture */}
              <motion.div 
                animate={{ 
                  y: [0, -30, 0],
                  rotate: [0, 10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute inset-0 bg-gradient-to-tr from-luxury-gold/20 via-luxury-ink/5 to-transparent rounded-[40%] opacity-50 will-change-transform"
              />
              
              {/* Floating Glass Panel */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 right-1/4 w-64 h-64 bg-white border border-luxury-divider rounded-[2.5rem] shadow-premium-lg z-20 flex items-center justify-center p-8 inner-highlight"
              >
                <div className="text-center">
                  <div className="text-5xl font-serif font-bold text-luxury-blue-mid mb-2">5+</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold">Years of Excellence</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-white border-x border-t border-luxury-divider border-b-4 border-luxury-divider/50 rounded-[2rem] z-10 flex items-center justify-center p-6 inner-highlight"
              >
                <div className="text-center">
                  <Award className="w-10 h-10 text-luxury-gold mx-auto mb-3" />
                  <div className="text-[10px] font-bold uppercase tracking-widest text-luxury-blue-mid">Certified Quality</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* [2] WHO WE ARE – SPLIT CINEMATIC */}
      <section className="py-24 md:py-32 bg-white border-b border-luxury-divider gpu-accelerate">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-2 gap-20 items-center">
          <FadeInWhenVisible direction="right">
            <div className="space-y-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-luxury-blue-mid mb-4 block">Our Story</span>
                <h2 className="font-serif text-4xl md:text-6xl font-bold text-luxury-blue-mid tracking-tighter">
                  Who We <span className="text-luxury-gold italic font-light">Are.</span>
                </h2>
              </div>
              <div className="space-y-6 text-base text-luxury-gray font-light leading-relaxed">
                <p>
                  At Huecraft Corp, we believe that a finish is only as good as the foundation it's built upon. Founded in Calgary, we've dedicated ourselves to the intersection of structural performance and high-end aesthetics.
                </p>
                <p>
                  Our team consists of certified professionals who understand the unique challenges of the Albertan climate, ensuring that every project we touch remains beautiful and durable for years to come.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-8">
                <div>
                  <div className="text-3xl font-serif font-bold text-luxury-blue-mid mb-1">100%</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-luxury-gray/60">Client Satisfaction</div>
                </div>
                <div>
                  <div className="text-3xl font-serif font-bold text-luxury-blue-mid mb-1">500+</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-luxury-gray/60">Projects Completed</div>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible direction="left" delay={0.2}>
            <div className="relative">
              <div className="absolute -inset-4 bg-white/30 rounded-[3rem]" />
              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-premium-lg group border border-luxury-divider inner-highlight-dark"
              >
                <img 
                  src="https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=800&h=1000&auto=format&fit=crop" 
                  alt="Huecraft Professionals" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-ink/40 via-transparent to-transparent opacity-60" />
              </motion.div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* [3] EXPERTISE – FLOATING CARDS GRID */}
      <section className="py-24 md:py-32 bg-white border-b border-luxury-divider gpu-accelerate">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-20">
              <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-luxury-blue-mid mb-4 block">Specializations</span>
              <h2 className="font-serif text-4xl md:text-6xl font-bold text-luxury-blue-mid tracking-tighter">
                Our <span className="text-luxury-gold italic font-light">Expertise.</span>
              </h2>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {expertise.map((item, index) => (
              <FadeInWhenVisible key={item.title} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative rounded-[3.5rem] overflow-hidden border-x border-t border-luxury-divider border-b-4 border-luxury-divider/50 transition-all duration-200 hover:-translate-y-1 hover:border-b-[6px] h-[320px] md:h-[380px] flex flex-col justify-end will-change-transform transform-gpu"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    {/* Cinematic Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-ink via-luxury-ink/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-6 md:p-8 flex flex-col gap-4 transform transition-transform duration-500 group-hover:-translate-y-2">
                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-luxury-gold shadow-premium-sm">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-white/80 font-light text-sm leading-relaxed line-clamp-3">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  
                  {/* Animated Border/Line */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-luxury-gold to-luxury-blue-mid scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left z-20" />
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* [4] PROCESS – ROADMAP EXPERIENCE */}
      <section className="py-24 md:py-32 bg-white border-b border-luxury-divider overflow-hidden gpu-accelerate">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-24">
              <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-luxury-blue-mid mb-4 block">Our Systematic Process</span>
              <h2 className="font-serif text-4xl md:text-7xl font-bold tracking-tighter text-luxury-blue-mid">
                Precision <span className="text-luxury-gold italic font-light">Workflow.</span>
              </h2>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {processSteps.map((step, index) => (
              <FadeInWhenVisible key={step.title} delay={index * 0.15} direction="up">
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative group p-8 md:p-10 rounded-[3.5rem] bg-gradient-to-br from-luxury-blue-mid to-luxury-ink border border-white/10 shadow-premium-lg overflow-hidden h-full flex flex-col justify-between will-change-transform transform-gpu"
                >
                  {/* Ambient Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/20 blur-[50px] rounded-full pointer-events-none group-hover:bg-luxury-gold/30 transition-colors duration-500" />
                  
                  {/* Step Number */}
                  <div className="relative z-10 flex justify-between items-start mb-8">
                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
                      <span className="text-luxury-gold font-bold text-lg">0{index + 1}</span>
                    </div>
                    {/* Decorative Line */}
                    <div className="w-12 h-[1px] bg-luxury-gold/30 mt-6 hidden md:block" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="font-serif text-2xl font-bold text-white mb-3 group-hover:text-luxury-gold transition-colors duration-300">{step.title}</h3>
                    <p className="text-white/70 font-light text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Hover Sparkle */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION - CLEAN PREMIUM SCROLL (Duplicated from Home) */}
      <section className="py-16 lg:py-20 px-4 bg-white overflow-hidden gpu-accelerate border-b border-luxury-divider">
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

      {/* [6] SERVICE AREA & SAFETY – HORIZONTAL & PREMIUM FOR ABOUT PAGE */}
      <section className="py-12 lg:py-32 bg-white relative overflow-hidden gpu-accelerate">
        <div className="mx-auto max-w-xl lg:max-w-6xl px-6 lg:px-8 relative z-10">
          <div className="flex flex-col gap-8 lg:gap-12 items-center">
            {/* SERVICE REGIONS PANEL */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -8, scale: 1.005 }}
              className="relative panel-premium-navy rounded-[2.5rem] p-8 lg:p-12 overflow-hidden group perspective-2000 w-full lg:max-w-5xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16 transition-all duration-500 will-change-transform shadow-premium-lg min-h-[300px]"
            >
              {/* Continuous Lighting Effect */}
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none z-0"
              />
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-12 flex-grow">
                <div className="flex-shrink-0 w-20 h-20 lg:w-32 lg:h-32 rounded-3xl lg:rounded-[2.5rem] bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-premium-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700">
                  <MapPin className="w-10 h-10 lg:w-16 lg:h-16 text-luxury-gold" strokeWidth={1.5} />
                  <div className="absolute inset-0 bg-luxury-gold/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                
                <div className="text-center lg:text-left">
                  <h2 className="font-serif text-3xl lg:text-6xl font-bold text-white mb-3 lg:mb-4 tracking-tight group-hover:text-luxury-gold transition-colors duration-500 leading-none">
                    Service Regions
                  </h2>
                  <p className="text-sm lg:text-lg text-white/70 font-light leading-relaxed max-w-md">
                    Delivering master-level craftsmanship across the greater region with surgical precision and unmatched reliability.
                  </p>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-y-4 lg:gap-y-6 gap-x-8 lg:gap-x-12 text-[10px] lg:text-xs font-bold uppercase tracking-[0.25em] text-luxury-gold min-w-[280px] lg:min-w-[400px]">
                {[
                  { name: "Calgary" },
                  { name: "Airdrie" },
                  { name: "Chestermere" },
                  { name: "Greater Region" }
                ].map((region) => (
                  <div key={region.name} className="flex items-center gap-3 lg:gap-5 group/item">
                    <div className="flex h-8 w-8 lg:h-11 lg:w-11 shrink-0 items-center justify-center rounded-full bg-white/10 border border-white/20 text-luxury-gold group-hover/item:bg-luxury-gold group-hover/item:text-white group-hover/item:border-luxury-gold transition-all duration-500 shadow-premium-sm">
                      <MapPin className="h-4 w-4 lg:h-5.5 lg:w-5.5" strokeWidth={2.5} />
                    </div>
                    <span className="text-white lg:text-xl group-hover/item:translate-x-2 transition-transform duration-300 font-serif">{region.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* SAFETY & CERTIFICATIONS PANEL */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -8, scale: 1.005 }}
              className="relative panel-premium-navy rounded-[2.5rem] p-8 lg:p-12 overflow-hidden group perspective-2000 w-full lg:max-w-5xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16 transition-all duration-500 will-change-transform shadow-premium-lg min-h-[300px]"
            >
              {/* Continuous Lighting Effect */}
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none z-0"
              />
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-12 flex-grow">
                <div className="flex-shrink-0 w-20 h-20 lg:w-32 lg:h-32 rounded-3xl lg:rounded-[2.5rem] bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-premium-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700">
                  <ShieldCheck className="w-10 h-10 lg:w-16 lg:h-16 text-luxury-gold" strokeWidth={1.5} />
                  <div className="absolute inset-0 bg-luxury-gold/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                
                <div className="text-center lg:text-left">
                  <h2 className="font-serif text-3xl lg:text-6xl text-white font-bold mb-3 lg:mb-4 tracking-tight leading-none group-hover:text-luxury-gold transition-colors duration-500">Safety & Trust</h2>
                  <p className="text-luxury-gold text-[10px] lg:text-sm tracking-[0.4em] uppercase font-bold mb-2 lg:mb-4">Your Trust is Our Priority</p>
                  <p className="text-sm lg:text-lg text-white/70 font-light leading-relaxed max-w-md">
                    Fully certified and insured professionals dedicated to the highest safety standards in the industry.
                  </p>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-6 lg:gap-10 min-w-[280px] lg:min-w-[400px]">
                {[
                  { name: 'WCB', icon: ShieldCheck },
                  { name: 'Insurance', icon: ShieldCheck },
                  { name: 'Fall Protection', icon: ShieldCheck },
                  { name: 'CPR', icon: ShieldCheck }
                ].map((cert) => (
                  <div key={cert.name} className="flex items-center gap-4 lg:gap-6 group/cert">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl lg:rounded-[1.5rem] bg-white/10 flex items-center justify-center border border-white/20 shadow-premium-sm transition-all duration-500 group-hover/cert:border-luxury-gold/40 relative overflow-hidden">
                      <cert.icon className="w-6 h-6 lg:w-9 lg:h-9 text-white group-hover/cert:text-luxury-gold transition-colors duration-500 relative z-10" strokeWidth={1.2} />
                    </div>
                    <span className="text-[10px] lg:text-base font-bold uppercase tracking-[0.2em] text-white/70 group-hover/cert:text-white transition-colors duration-500 leading-tight">{cert.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FINAL CTA – USING GLOBAL COMPONENT */}
      <FinalCTA />
    </div>
  );
};

export default About;

