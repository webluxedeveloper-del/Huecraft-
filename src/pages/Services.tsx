import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProcessRoadmap from '../components/ProcessRoadmap';
import { FinalCTA } from '../components/FinalCTA';
import { cn } from '../lib/utils';
import PremiumBackground from '../components/PremiumBackground';
import { 
  Paintbrush, 
  Home as HomeIcon, 
  Layout, 
  Droplets, 
  CheckCircle2, 
  ArrowRight,
  Search,
  ClipboardList,
  Hammer,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const huecraftServices = [
  {
    id: 'interior-painting',
    title: 'Interior Painting',
    subtitle: 'Elevated living spaces',
    description: 'Premium interior solutions designed for durability and aesthetic excellence.',
    images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1562663474-6cbb3fee1c77?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1615873968403-89e068628265?auto=format&fit=crop&q=80&w=1200'
    ],
    points: ['Precision application', 'Long-lasting durability', 'Low-VOC materials', 'Clean execution']
  },
  {
    id: 'exterior-painting',
    title: 'Exterior Painting',
    subtitle: 'Weather-resistant elegance',
    description: 'Protect and beautify your home’s exterior with our professional coatings.',
    images: [
      'https://images.unsplash.com/photo-1518605336347-fb8396099d22?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&q=80&w=1200'
    ],
    points: ['Weather resistance', 'Surface protection', 'Climate-resistant solutions', 'Curb appeal enhancement']
  },
  {
    id: 'siding-installation',
    title: 'Siding Installation',
    subtitle: 'Structural integrity & design',
    description: 'Premium siding solutions that combine durability with modern architectural design.',
    images: [
      'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21ef45?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1513584684374-8bdb7489feef?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?auto=format&fit=crop&q=80&w=1200'
    ],
    points: ['Structural integrity', 'Modern aesthetics', 'Expert installation', 'Energy efficiency']
  },
  {
    id: 'gutter-systems',
    title: 'Gutter Systems',
    subtitle: 'Advanced water management',
    description: 'Custom water management systems designed to protect your foundation and landscaping.',
    images: [
      'https://images.unsplash.com/photo-1635339001338-30394e3d6c8e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?auto=format&fit=crop&q=80&w=1200'
    ],
    points: ['Seamless design', 'Efficient drainage', 'Foundation protection', 'Custom color matching']
  }
];

const processSteps = [
  { title: 'Discovery & Consultation', icon: Search },
  { title: 'Strategic Planning', icon: ClipboardList },
  { title: 'Masterful Execution', icon: Hammer },
  { title: 'Quality Assurance', icon: Sparkles }
];

const ServiceCarousel = ({ images, title }: { images: string[], title: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + images.length) % images.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.1
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] group touch-pan-y bg-white">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.6 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute h-full w-full object-cover cursor-grab active:cursor-grabbing will-change-transform"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </AnimatePresence>
      
      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-6 bg-luxury-gold" : "w-1.5 bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

  const Services = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      document.title = 'Services | Huecraft Corp';
      fetchServices();
    }, []);

    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setServices(data);
        } else {
          setServices(huecraftServices);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices(huecraftServices);
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      return (
        <div className="flex h-screen items-center justify-center bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-luxury-gold" />
        </div>
      );
    }

    return (
      <div className="bg-white min-h-screen selection:bg-luxury-gold/20 overflow-x-hidden relative">
        <PremiumBackground variant="services" />
        {/* Hero Section: Tightened and Refined */}
        <section className="relative pt-32 pb-8 md:pt-44 md:pb-12 overflow-hidden bg-white border-b border-luxury-divider gpu-accelerate">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="mb-3"
              >
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-luxury-blue-mid bg-white px-5 py-2 rounded-full border-x border-t border-luxury-divider border-b-2 border-luxury-divider/50 inner-highlight">
                  Our Expertise
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="mb-4 font-serif text-4xl md:text-7xl font-bold tracking-tighter text-luxury-blue-mid leading-[0.9]"
              >
                Curated Expertise. <br />
                <span className="text-luxury-gold italic font-light">Precision-Driven.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="mx-auto max-w-lg text-sm md:text-base font-light leading-relaxed text-luxury-gray"
              >
                Premium interior and exterior solutions designed to elevate durability and aesthetics.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Services Showcase: Improved Identification and Spacing */}
        <section className="pt-6 pb-24 bg-white gpu-accelerate">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            
            {/* Mobile View (Unchanged) */}
            <div className="lg:hidden grid grid-cols-1 gap-16">
              {services.map((service, index) => (
                <motion.div 
                  key={service.id} 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-2 group/service-card"
                >
                  {/* Service Label Above Image */}
                  <div className="flex items-center gap-4 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-luxury-gold/70">Service 0{index + 1}</span>
                    <div className="h-[1px] w-20 bg-luxury-gold/20" />
                  </div>

                  {/* Carousel Block */}
                  <div className="relative overflow-hidden rounded-[2rem] transition-transform duration-700 group-hover/service-card:scale-[1.02]">
                    <ServiceCarousel images={service.images || [service.image_url]} title={service.title} />
                  </div>

                  {/* Text Block */}
                  <div className="flex flex-col flex-grow mt-2">
                    <div className="space-y-2 mb-6">
                      <h2 className="text-4xl font-serif font-bold text-luxury-blue-mid tracking-tighter leading-tight group-hover/service-card:text-luxury-gold transition-colors duration-500">
                        {service.title}
                      </h2>
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold-muted leading-none">
                        {service.subtitle || service.short_description}
                      </p>
                    </div>
                    
                    <p className="text-base font-light leading-relaxed text-luxury-gray mb-8 line-clamp-3">
                      {service.description}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-10 flex-grow">
                      {(service.points || []).map((point: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 group/point">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-luxury-divider text-luxury-blue-mid group-hover/point:bg-luxury-gold group-hover/point:text-white group-hover/point:border-luxury-gold transition-all duration-500 shadow-premium-sm">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-widest text-luxury-blue-mid/80">{point}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-luxury-divider/50">
                      <Link
                        to={`/services/${service.id}`}
                        className="relative group/btn flex items-center justify-center gap-4 overflow-hidden rounded-full btn-premium-lighting px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.4em] w-fit transition-all duration-500 hover:shadow-2xl"
                      >
                        <span className="relative z-10">Explore Details</span>
                        <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Desktop View (Alternating Layout) */}
            <div className="hidden lg:flex flex-col gap-40">
              {services.map((service, index) => (
                <div 
                  key={service.id} 
                  className={cn(
                    "flex items-center gap-12 xl:gap-16 group/service-card",
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  )}
                >
                  {/* Image Side */}
                  <motion.div 
                    initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-1/2 relative overflow-hidden rounded-[2rem] transition-transform duration-700 group-hover/service-card:scale-[1.02] will-change-[opacity,transform]"
                  >
                    <ServiceCarousel images={service.images || [service.image_url]} title={service.title} />
                  </motion.div>

                  {/* Text Side */}
                  <motion.div 
                    initial={{ opacity: 0, x: index % 2 === 0 ? 60 : -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="w-1/2 flex flex-col will-change-[opacity,transform]"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-luxury-gold/70">Service 0{index + 1}</span>
                      <div className="h-[1px] w-20 bg-luxury-gold/20" />
                    </div>

                    <div className="space-y-3 mb-8">
                      <h2 className="text-5xl xl:text-6xl font-serif font-bold text-luxury-blue-mid tracking-tighter leading-tight group-hover/service-card:text-luxury-gold transition-colors duration-500">
                        {service.title}
                      </h2>
                      <p className="text-sm font-bold uppercase tracking-[0.3em] text-luxury-gold-muted leading-none">
                        {service.subtitle || service.short_description}
                      </p>
                    </div>
                    
                    <p className="text-lg font-light leading-relaxed text-luxury-gray mb-10">
                      {service.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-x-8 gap-y-5 mb-12">
                      {(service.points || []).map((point: string, i: number) => (
                        <div key={i} className="flex items-center gap-4 group/point">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-luxury-divider text-luxury-blue-mid group-hover/point:bg-luxury-gold group-hover/point:text-white group-hover/point:border-luxury-gold transition-all duration-500 shadow-premium-sm">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-widest text-luxury-blue-mid/80">{point}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-8 border-t border-luxury-divider/50">
                      <Link
                        to={`/services/${service.id}`}
                        className="relative group/btn flex items-center justify-center gap-4 overflow-hidden rounded-full btn-premium-lighting px-10 py-4 text-xs font-bold uppercase tracking-[0.4em] w-fit transition-all duration-500 hover:shadow-2xl"
                      >
                        <span className="relative z-10">Explore Details</span>
                        <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

          </div>
        </section>

      {/* Our Process Section: Enhanced Vertical Roadmap Animation */}
      <section className="pt-24 md:pt-32 pb-8 bg-white border-t border-luxury-divider overflow-hidden -mt-[94px] gpu-accelerate">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-luxury-blue-mid">Our Process</h2>
          </div>

          <ProcessRoadmap steps={processSteps} />
        </div>
      </section>

      {/* CTA Section */}
      <FinalCTA />
    </div>
  );
};

export default Services;
