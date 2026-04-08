import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, ArrowRight, ChevronDown, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { FinalCTA } from '../components/FinalCTA';
import PremiumBackground from '../components/PremiumBackground';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  serviceType: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Project details must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

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

const services = [
  "Interior Painting",
  "Exterior Painting",
  "Commercial Renovation",
  "Residential Construction",
  "Custom Cabinetry",
  "Other"
];

const PremiumInput = ({ 
  label, 
  name, 
  register, 
  error, 
  type = "text", 
  isTextArea = false,
  isSelect = false,
  options = []
}: { 
  label: string; 
  name: keyof ContactForm; 
  register: any; 
  error?: string; 
  type?: string;
  isTextArea?: boolean;
  isSelect?: boolean;
  options?: string[];
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full group">
      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-ink/60 mb-2 ml-1">
        {label}
      </label>
      <motion.div
        animate={{
          y: isFocused ? -4 : 0,
          scale: isFocused ? 1.01 : 1,
          boxShadow: isFocused 
            ? "0 10px 25px -5px rgba(197,148,63,0.15), 0 8px 10px -6px rgba(197,148,63,0.1)" 
            : "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)"
        }}
        className={cn(
          "relative rounded-2xl border transition-all duration-500 luxury-easing bg-white/30 will-change-[transform,box-shadow]",
          isFocused ? "border-luxury-gold ring-4 ring-luxury-gold/5 bg-white" : "border-luxury-divider/50",
          error ? "border-red-400/50 ring-red-400/5" : ""
        )}
      >
        {isSelect ? (
          <div className="relative">
            <select
              {...register(name)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full bg-transparent px-4 py-2.5 text-[13px] text-luxury-ink outline-none appearance-none cursor-pointer"
            >
              <option value="" disabled>Select a service</option>
              {options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-luxury-gold pointer-events-none" />
          </div>
        ) : isTextArea ? (
          <textarea
            {...register(name)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent px-4 py-2.5 text-[13px] text-luxury-ink outline-none min-h-[80px] resize-none placeholder:text-luxury-gray/30"
            placeholder={`Tell us about your project...`}
          />
        ) : (
          <input
            {...register(name)}
            type={type}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent px-4 py-2.5 text-[13px] text-luxury-ink outline-none placeholder:text-luxury-gray/30"
            placeholder={label}
          />
        )}
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute -bottom-5 left-1 text-[9px] font-bold uppercase tracking-widest text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formCardRef = useRef<HTMLDivElement>(null);
  const infoPanelRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Effect for Form
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  const shadowX = useTransform(mouseXSpring, [-0.5, 0.5], [20, -20]);
  const shadowY = useTransform(mouseYSpring, [-0.5, 0.5], [20, -20]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!formCardRef.current) return;
    const rect = formCardRef.current.getBoundingClientRect();
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
    document.title = 'Contact | Huecraft Luxury Services';
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      serviceType: ""
    }
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert([{
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: `[Service: ${data.serviceType}] ${data.message}`,
        status: 'new'
      }]);
      if (error) throw error;
      setIsSuccess(true);
      toast.success('Consultation request received.');
      reset();
    } catch (error: any) {
      console.error('Error submitting lead:', error);
      toast.error(error.message || 'Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden selection:bg-luxury-gold/20 gpu-accelerate">
      <PremiumBackground variant="contact" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24 pb-20 lg:px-8">
        
        {/* HERO SECTION */}
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <span className="text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold bg-white/80 px-5 py-2 rounded-full border border-luxury-divider/40 edge-highlight mb-5 inline-block">
              Connect With Us
            </span>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-7xl font-bold tracking-tighter text-luxury-ink leading-[1] mb-5">
              Let's Start Your <br className="hidden sm:block" />
              <span className="text-luxury-gold italic font-light">Transformation.</span>
            </h1>
            <p className="mt-4 font-sans text-sm md:text-base lg:text-xl font-light leading-relaxed text-luxury-gray/80 max-w-xl lg:max-w-3xl mx-auto">
              Whether you have a specific project in mind or need expert guidance, 
              our team is ready to deliver excellence.
            </p>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto">
          
          {/* MAIN FORM (CENTERPIECE) */}
          <div className="mb-40 md:mb-64">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              ref={formCardRef}
              className="relative transform-gpu will-change-transform"
            >
              <div className="relative z-10 overflow-hidden rounded-[3rem] md:rounded-[5rem] border border-luxury-divider/40 bg-white p-8 md:p-16 transition-all duration-700 luxury-easing shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] hover:shadow-[0_60px_150px_-30px_rgba(0,0,0,0.18)] edge-highlight">
                {/* Subtle internal glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-blue-ultra/5 via-transparent to-luxury-gold/5 pointer-events-none" />
                
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 15, stiffness: 200 }}
                        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500 shadow-inner"
                      >
                        <CheckCircle2 className="h-10 w-10" />
                      </motion.div>
                      <h3 className="font-serif text-2xl md:text-4xl font-bold text-luxury-ink mb-3">Transformation Request Received</h3>
                      <p className="text-base text-luxury-gray font-light max-w-md leading-relaxed">
                        Your transformation journey has begun. Our specialists will contact you within 24 hours.
                      </p>
                      <button 
                        onClick={() => setIsSuccess(false)}
                        className="mt-8 group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold hover:text-luxury-ink transition-all"
                      >
                        Send Another Request
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                      </button>
                    </motion.div>
                  ) : (
                    <form key="form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                      <div className="grid gap-6 md:gap-8 sm:grid-cols-2">
                        <PremiumInput 
                          label="Full Name" 
                          name="name" 
                          register={register} 
                          error={errors.name?.message} 
                        />
                        <PremiumInput 
                          label="Phone Number" 
                          name="phone" 
                          type="tel"
                          register={register} 
                          error={errors.phone?.message} 
                        />
                      </div>

                      <div className="grid gap-6 md:gap-8 sm:grid-cols-2">
                        <PremiumInput 
                          label="Email Address" 
                          name="email" 
                          type="email"
                          register={register} 
                          error={errors.email?.message} 
                        />
                        <PremiumInput 
                          label="Service Type" 
                          name="serviceType" 
                          isSelect
                          options={services}
                          register={register} 
                          error={errors.serviceType?.message} 
                        />
                      </div>

                      <PremiumInput 
                        label="Project Details" 
                        name="message" 
                        isTextArea
                        register={register} 
                        error={errors.message?.message} 
                      />

                      <div className="pt-4">
                        <motion.button
                          whileHover={{ scale: 1.01, y: -1 }}
                          whileTap={{ scale: 0.99 }}
                          type="submit"
                          disabled={isSubmitting}
                          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl btn-premium-navy py-4 md:py-5 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] disabled:opacity-50 tap-interaction"
                        >
                          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                          {isSubmitting ? (
                            <Loader2 className="relative z-10 h-5 w-5 animate-spin" />
                          ) : (
                            <>
                              <span className="relative z-10">Get Quote</span>
                              <Send className="relative z-10 h-4 w-4 transition-transform duration-700 luxury-easing group-hover:translate-x-1.5 group-hover:-translate-y-1.5" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* SIDE INFO PANEL - Now below the form */}
          <div className="flex flex-col gap-32 md:gap-56 mb-2 md:mb-4 max-w-2xl lg:max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              ref={infoPanelRef}
              className="relative group/panel w-full"
            >
              <div className="relative z-10 overflow-hidden rounded-[2.5rem] border border-luxury-divider/20 bg-white p-6 md:p-8 lg:p-16 transition-all duration-700 luxury-easing edge-highlight shadow-premium-lg">
                <div className="relative z-10 space-y-6 lg:space-y-12 flex flex-col h-full">
                  <div className="flex-grow">
                    <span className="text-[9px] lg:text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold mb-6 lg:mb-10 block">
                      Immediate Assistance
                    </span>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                      {/* PHONE CARD */}
                      <motion.a
                        href="tel:+14379928442"
                        whileHover={{ x: 4, scale: 1.01 }}
                        className="flex items-center justify-between p-3.5 lg:p-6 rounded-xl lg:rounded-2xl bg-luxury-blue-ultra/5 border border-luxury-divider/30 group transition-all duration-500 hover:bg-white hover:border-luxury-gold/30 hover:shadow-premium-sm relative overflow-hidden"
                      >
                        {/* Thin Dark Line Highlight */}
                        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-luxury-ink/20 group-hover:bg-luxury-gold transition-colors duration-500" />
                        
                        <div className="flex items-center gap-4 lg:gap-6">
                          <div className="flex h-10 w-10 lg:h-14 lg:w-14 shrink-0 items-center justify-center rounded-lg lg:rounded-xl bg-white border border-luxury-divider/40 transition-all duration-700 luxury-easing group-hover:bg-luxury-gold group-hover:text-white group-hover:-translate-y-0.5 shadow-sm">
                            <Phone className="h-4 w-4 lg:h-6 lg:w-6 text-luxury-gold group-hover:text-white transition-colors duration-700" />
                          </div>
                          <div>
                            <p className="text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.15em] text-luxury-gray mb-0.5">Phone</p>
                            <p className="text-sm lg:text-lg font-bold text-luxury-ink font-serif">+1 (437) 992-8442</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 lg:h-6 lg:w-6 text-luxury-gold/40 group-hover:text-luxury-gold transition-all duration-500 group-hover:translate-x-1" />
                      </motion.a>

                      {/* WHATSAPP CARD */}
                      <motion.a 
                        href="https://wa.me/14379928442" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        whileHover={{ x: 4, scale: 1.01 }}
                        className="flex items-center justify-between p-3.5 lg:p-6 rounded-xl lg:rounded-2xl bg-luxury-blue-ultra/5 border border-luxury-divider/30 group transition-all duration-500 hover:bg-white hover:border-[#25D366]/30 hover:shadow-premium-sm relative overflow-hidden"
                      >
                        {/* Thin Dark Line Highlight */}
                        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-luxury-ink/20 group-hover:bg-[#25D366] transition-colors duration-500" />

                        <div className="flex items-center gap-4 lg:gap-6">
                          <div className="flex h-10 w-10 lg:h-14 lg:w-14 shrink-0 items-center justify-center rounded-lg lg:rounded-xl bg-white border border-luxury-divider/40 transition-all duration-700 luxury-easing group-hover:bg-[#25D366] group-hover:text-white group-hover:-translate-y-0.5 shadow-sm">
                            <MessageCircle className="h-4 w-4 lg:h-6 lg:w-6 text-[#25D366] group-hover:text-white transition-colors duration-700" />
                          </div>
                          <div>
                            <p className="text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.15em] text-luxury-gray mb-0.5">WhatsApp</p>
                            <p className="text-sm lg:text-lg font-bold text-luxury-ink font-serif">Instant Chat</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 lg:h-6 lg:w-6 text-[#25D366]/40 group-hover:text-[#25D366] transition-all duration-500 group-hover:translate-x-1" />
                      </motion.a>

                      {/* EMAIL CARD */}
                      <motion.a
                        href="mailto:Huecrafthomes@gmail.com"
                        whileHover={{ x: 4, scale: 1.01 }}
                        className="flex items-center justify-between p-3.5 lg:p-6 rounded-xl lg:rounded-2xl bg-luxury-blue-ultra/5 border border-luxury-divider/30 group transition-all duration-500 hover:bg-white hover:border-luxury-gold/30 hover:shadow-premium-sm relative overflow-hidden"
                      >
                        {/* Thin Dark Line Highlight */}
                        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-luxury-ink/20 group-hover:bg-luxury-gold transition-colors duration-500" />

                        <div className="flex items-center gap-4 lg:gap-6">
                          <div className="flex h-10 w-10 lg:h-14 lg:w-14 shrink-0 items-center justify-center rounded-lg lg:rounded-xl bg-white border border-luxury-divider/40 transition-all duration-700 luxury-easing group-hover:bg-luxury-gold group-hover:text-white group-hover:-translate-y-0.5 shadow-sm">
                            <Mail className="h-4 w-4 lg:h-6 lg:w-6 text-luxury-gold group-hover:text-white transition-colors duration-700" />
                          </div>
                          <div>
                            <p className="text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.15em] text-luxury-gray mb-0.5">Email</p>
                            <p className="text-sm lg:text-lg font-bold text-luxury-ink font-serif">Huecrafthomes@gmail.com</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 lg:h-6 lg:w-6 text-luxury-gold/40 group-hover:text-luxury-gold transition-all duration-500 group-hover:translate-x-1" />
                      </motion.a>

                      {/* LOCATION CARD */}
                      <motion.div
                        whileHover={{ x: 4, scale: 1.01 }}
                        className="flex items-center justify-between p-3.5 lg:p-6 rounded-xl lg:rounded-2xl bg-luxury-blue-ultra/5 border border-luxury-divider/30 group transition-all duration-500 hover:bg-white hover:border-luxury-gold/30 hover:shadow-premium-sm cursor-default relative overflow-hidden"
                      >
                        {/* Thin Dark Line Highlight */}
                        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-luxury-ink/20 group-hover:bg-luxury-gold transition-colors duration-500" />

                        <div className="flex items-center gap-4 lg:gap-6">
                          <div className="flex h-10 w-10 lg:h-14 lg:w-14 shrink-0 items-center justify-center rounded-lg lg:rounded-xl bg-white border border-luxury-divider/40 transition-all duration-700 luxury-easing group-hover:bg-luxury-gold group-hover:text-white group-hover:-translate-y-0.5 shadow-sm">
                            <MapPin className="h-4 w-4 lg:h-6 lg:w-6 text-luxury-gold group-hover:text-white transition-colors duration-700" />
                          </div>
                          <div>
                            <p className="text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.15em] text-luxury-gray mb-0.5">Location</p>
                            <p className="text-sm lg:text-lg font-bold text-luxury-ink font-serif">Calgary, AB, Canada</p>
                          </div>
                        </div>
                        <MapPin className="h-4 w-4 lg:h-6 lg:w-6 text-luxury-gold/40 group-hover:text-luxury-gold transition-all duration-500" />
                      </motion.div>
                    </div>
                  </div>
 
                  <div className="pt-6 lg:pt-10 border-t border-luxury-divider/10 mt-auto">
                    <div className="flex items-center gap-3 text-luxury-gold">
                      <div className="h-1.5 w-1.5 lg:h-2.5 lg:w-2.5 rounded-full bg-luxury-gold animate-pulse shadow-[0_0_8px_rgba(197,148,63,0.4)]" />
                      <p className="text-[9px] lg:text-xs font-bold uppercase tracking-[0.15em]">Response within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* SERVICE REGIONS PANEL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative panel-premium-navy rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 lg:p-16 overflow-hidden group flex flex-col perspective-1000 transform-gpu will-change-transform w-full"
            >
              {/* Continuous Lighting Effect */}
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none z-0"
              />
              {/* Subtle top reflection */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-90" />
              
              <div className="flex flex-col items-center sm:items-start gap-5 lg:gap-10 flex-grow relative z-10">
                <div className="flex-shrink-0 w-12 h-12 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-premium-sm group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700">
                  <MapPin className="w-6 h-6 lg:w-10 lg:h-10 text-luxury-gold" strokeWidth={1.5} />
                  <div className="absolute inset-0 bg-luxury-gold/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                
                <div className="text-center sm:text-left w-full flex-grow flex flex-col">
                  <h2 className="font-serif text-lg md:text-xl lg:text-4xl font-bold text-white mb-2 lg:mb-4 tracking-tight group-hover:text-luxury-gold transition-colors duration-500">
                    Service Regions
                  </h2>
                  <p className="text-[12px] md:text-[13px] lg:text-lg text-white/70 font-light mb-6 lg:mb-10 leading-relaxed max-w-[240px] lg:max-w-xl mx-auto sm:mx-0">
                    Delivering master-level craftsmanship across the greater region.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-y-4 lg:gap-y-8 gap-x-4 lg:gap-x-16 text-[10px] md:text-[11px] lg:text-sm font-bold uppercase tracking-[0.15em] text-luxury-gold mt-auto">
                    {[
                      { name: "Calgary" },
                      { name: "Airdrie" },
                      { name: "Chestermere" },
                      { name: "Greater Region" }
                    ].map((region) => (
                      <div key={region.name} className="flex items-center gap-3 lg:gap-5 group/item">
                        <div className="flex h-6 w-6 lg:h-9 lg:w-9 shrink-0 items-center justify-center rounded-full bg-white/10 border border-white/20 text-luxury-gold group-hover/item:bg-luxury-gold group-hover/item:text-white group-hover/item:border-luxury-gold transition-all duration-500 shadow-premium-sm">
                          <MapPin className="h-3 w-3 lg:h-5 lg:w-5" strokeWidth={2.5} />
                        </div>
                        <span className="truncate text-white lg:text-lg group-hover/item:translate-x-1 transition-transform duration-300">{region.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* FINAL CTA PANEL */}
      <FinalCTA />
    </div>
  );
};

export default Contact;
