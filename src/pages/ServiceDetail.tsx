import React, { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Ruler, Paintbrush, Search, ClipboardList, Hammer, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FinalCTA } from '../components/FinalCTA';
import ProcessRoadmap from '../components/ProcessRoadmap';

const serviceData = {
  'interior-painting': {
    title: 'Interior Painting',
    subtitle: 'Bespoke interior finishes for modern living.',
    description: 'Our interior painting services are meticulously crafted to transform your living spaces into works of art. We utilize high-performance, low-VOC coatings that provide a flawless, durable finish while ensuring a healthy indoor environment for your family. From intricate trim work to expansive wall surfaces, our master painters deliver precision in every stroke. We prioritize surface preparation as the foundation of excellence, ensuring long-lasting beauty and value for your home.',
    points: [
      'Master-grade surface preparation',
      'High-performance low-VOC finishes',
      'Precision edging & architectural trim',
      'Complete protection of furnishings',
      'Daily site management & cleanup',
      'Final multi-point quality inspection'
    ],
    features: [
      { title: 'Surface Prep', desc: 'Meticulous sanding, patching, and priming for a flawless foundation.' },
      { title: 'Color Matching', desc: 'Expert color consultation and precision matching for your unique space.' },
      { title: 'Trim Detail', desc: 'Sharp, clean lines on baseboards, crown molding, and window casings.' }
    ],
    pricing: [
      { label: 'Standard Interior', price: '$3.65', unit: 'per sq ft' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1562663474-6cbb3fee1c77?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1615873968403-89e068628265?auto=format&fit=crop&q=80&w=1200'
    ]
  },
  'exterior-painting': {
    title: 'Exterior Painting',
    subtitle: 'Resilient protection with architectural elegance.',
    description: 'Protect your home\'s exterior with our advanced coating systems designed to withstand the harshest elements. We specialize in high-durability finishes that resist UV degradation, moisture, and temperature fluctuations, ensuring your property maintains its curb appeal for years. Our comprehensive process includes power washing, surface repair, and specialized priming to guarantee maximum adhesion. We combine structural protection with aesthetic mastery to deliver a finish that is as resilient as it is beautiful.',
    points: [
      'Climate-engineered coating systems',
      'Thorough power washing & prep',
      'Specialized masonry & wood priming',
      'UV-resistant color technology',
      'Structural moisture barrier sealing',
      '5-year comprehensive durability warranty'
    ],
    features: [
      { title: 'Weather Shield', desc: 'Advanced polymers that resist fading, peeling, and moisture ingress.' },
      { title: 'Surface Repair', desc: 'Expert patching of stucco, wood, and masonry before application.' },
      { title: 'Curb Appeal', desc: 'Strategic color placement to enhance architectural features.' }
    ],
    pricing: [
      { label: 'Trim Work', price: '$2.00', unit: 'per linear foot' },
      { label: 'Wall Panels', price: '$2.30', unit: 'per sq ft' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1518605336347-fb8396099d22?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&q=80&w=1200'
    ]
  },
  'siding-installation': {
    title: 'Siding Installation',
    subtitle: 'Structural integrity meets modern design.',
    description: 'Upgrade your home’s envelope with our premium siding services. We offer a wide range of materials, including vinyl, fiber cement, and wood, installed with precision to ensure maximum insulation and protection. Our siding solutions are designed for both beauty and structural integrity, providing a modern look that reflects your personal style and enhances your home’s value.',
    points: [
      'Fiber Cement & Vinyl Options',
      'Energy-Efficient Insulation',
      'Custom Trim and Accents',
      'Seamless Corner Details',
      'Moisture Barrier Installation',
      'Expert Repair Services'
    ],
    features: [
      { title: 'Structural Integrity', desc: 'Thorough inspection of the underlying structure for maximum protection.' },
      { title: 'Modern Aesthetics', desc: 'Variety of textures and colors to create a modern architectural look.' },
      { title: 'Insulation', desc: 'Advanced backing materials for improved thermal performance.' }
    ],
    pricing: [
      { label: 'Full Installation', price: 'Custom', unit: 'per project' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21ef45?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1513584684374-8bdb7489feef?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?auto=format&fit=crop&q=80&w=1200'
    ]
  },
  'gutter-systems': {
    title: 'Gutter Systems',
    subtitle: 'Advanced water management for foundation safety.',
    description: 'Ensure proper water management with our custom eavestrough and gutter systems. We design and install seamless solutions that protect your foundation and landscaping from water damage. Our systems are built to last and require minimal maintenance, utilizing high-grade aluminum and precision pitch alignment for maximum efficiency.',
    points: [
      'Seamless Aluminum Gutters',
      'Large Capacity Downspouts',
      'Leaf Guard Protection',
      'Custom Color Matching',
      'Precision Pitch Alignment',
      'Leak-Proof Sealants'
    ],
    features: [
      { title: 'Efficient Drainage', desc: 'Custom-fit systems to ensure maximum water flow and prevent leaks.' },
      { title: 'Foundation Protection', desc: 'Directing water away from your foundation to prevent structural damage.' },
      { title: 'Low Maintenance', desc: 'Durable materials and leaf guards to reduce cleaning frequency.' }
    ],
    pricing: [
      { label: 'Standard Install', price: 'Custom', unit: 'per linear foot' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1635339001338-30394e3d6c8e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?auto=format&fit=crop&q=80&w=1200'
    ]
  }
};

const processSteps = [
  { title: 'Consultation', desc: 'Initial site visit and detailed requirement analysis.', icon: Search },
  { title: 'Planning & Preparation', desc: 'Detailed estimation and meticulous surface preparation.', icon: ClipboardList },
  { title: 'Execution', desc: 'Professional application by our expert craftsmen.', icon: Hammer },
  { title: 'Final Finish', desc: 'Quality inspection and final walkthrough for perfection.', icon: Sparkles }
];

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  const paginate = (newDirection: number) => {
    if (!service || !service.gallery) return;
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + service.gallery.length) % service.gallery.length);
  };

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          // Transform database fields to match component expectations
          const transformedService = {
            ...data,
            gallery: data.images || [data.image_url],
            features: data.core_features || [],
            pricing: data.pricing || []
          };
          setService(transformedService);
        } else {
          // Check fallback
          const fallback = serviceData[id as keyof typeof serviceData];
          if (fallback) {
            setService(fallback);
          } else {
            navigate('/services');
          }
        }
      } catch (error) {
        console.error('Error fetching service detail:', error);
        const fallback = serviceData[id as keyof typeof serviceData];
        if (fallback) {
          setService(fallback);
        } else {
          navigate('/services');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-luxury-gold" />
      </div>
    );
  }

  if (!service) return null;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="min-h-screen bg-white selection:bg-luxury-gold/20 overflow-x-hidden pt-24">
      {/* Title Section: Compact & Refined */}
      <section className="py-6 md:py-10 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3"
          >
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.4em] text-luxury-gold hover:text-luxury-ink transition-colors"
            >
              <ArrowLeft className="h-2.5 w-2.5 transition-transform group-hover:-translate-x-1" />
              Back to Services
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="font-serif text-3xl md:text-6xl font-bold tracking-tight text-luxury-ink mb-3"
          >
            {service.title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="text-luxury-gray text-[9px] md:text-xs font-bold tracking-[0.4em] uppercase max-w-2xl mx-auto"
          >
            {service.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Image Carousel Section: Premium Swipeable Gallery */}
      <section className="py-6 md:py-10 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="relative flex flex-col items-center">
            <div className="relative w-full max-w-[90vw] md:max-w-[800px] aspect-[4/3] overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] bg-white group">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.4 },
                    scale: { duration: 0.4 }
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
                  className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing will-change-transform"
                >
                  <img
                    src={service.gallery[currentIndex]}
                    alt={`${service.title} Gallery ${currentIndex}`}
                    className="h-full w-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Premium Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-ink/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[2.5rem] md:rounded-[3.5rem]" />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={() => paginate(-1)}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-luxury-gold"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => paginate(1)}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-luxury-gold"
              >
                <ArrowRight className="h-6 w-6" />
              </button>
            </div>
            
            {/* Dots Nearby Images */}
            <div className="flex justify-center gap-2 mt-8">
              {service.gallery.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === currentIndex ? "w-8 bg-luxury-gold" : "w-2 bg-luxury-gold/20 hover:bg-luxury-gold/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Overview & Highlights: Professional Layout */}
      <section className="py-6 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Overview */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="lg:col-span-3 space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-luxury-gold/5 border border-luxury-gold/10">
                <span className="w-1 h-1 rounded-full bg-luxury-gold" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-luxury-gold">Overview</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-luxury-ink">The Huecraft Standard</h2>
              <p className="text-sm md:text-lg font-light leading-relaxed text-luxury-gray">
                {service.description}
              </p>
            </motion.div>

            {/* Key Highlights: 3D Floating Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ 
                y: -10,
                rotateX: 1,
                rotateY: -1,
                transition: { duration: 0.4 }
              }}
              className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[2.5rem] border border-luxury-divider/40 space-y-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_80px_-20px_rgba(197,160,89,0.2)] transition-all duration-500 transform-gpu"
              style={{ perspective: 1000 }}
            >
              <h3 className="text-[9px] font-bold uppercase tracking-[0.4em] text-luxury-gold">Key Highlights</h3>
              <div className="space-y-3">
                {service.points.map((point, i) => (
                  <div key={i} className="flex items-center gap-3 group/item">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white border border-luxury-divider text-luxury-gold shadow-premium-sm group-hover/item:bg-luxury-gold group-hover/item:text-white transition-colors duration-300">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-blue-mid/80">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Features: Panel Layout */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-luxury-gold mb-2 inline-block">The Details</span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-luxury-ink tracking-tight">Core Features</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
            {service.features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="group p-4 bg-white rounded-xl border border-luxury-divider shadow-premium-sm hover:shadow-premium-md transition-all duration-500"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-luxury-gold/5 flex items-center justify-center group-hover:bg-luxury-gold group-hover:text-white transition-colors duration-500">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h4 className="text-base font-bold text-luxury-ink tracking-tight">{feature.title}</h4>
                </div>
                <p className="text-sm font-light text-luxury-gray leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section: Premium 3D Panel with CTA */}
      <section className="py-12 md:py-20 bg-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="relative bg-white rounded-[2rem] p-6 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.08),0_20px_40px_rgba(0,0,0,0.04)] border border-gray-50 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white" />
            
            <div className="relative z-10">
              <div className="text-center mb-10">
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-luxury-gold mb-3 inline-block">Investment</span>
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-luxury-ink">Pricing Structure</h2>
              </div>

              <div className="space-y-3 mb-10">
                {service.pricing.map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.01, borderColor: "rgba(197,160,89,0.2)" }}
                    className="flex items-center justify-between p-5 bg-white rounded-xl border border-luxury-divider/30 group/item transition-all duration-300"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-gray">{item.label}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-serif font-bold text-luxury-gold">{item.price}</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-luxury-gray/60">{item.unit}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  to="/request-proposal"
                  className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden rounded-full transition-all duration-500 hover:scale-105 hover:-translate-y-1.5 active:scale-95 shadow-[0_20px_40px_rgba(197,160,89,0.35)] hover:shadow-[0_30_60px_rgba(197,160,89,0.45)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold to-luxury-gold-dark" />
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.4em] text-white">
                    Get Quote
                  </span>
                  <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(255,255,255,0.2)]" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Roadmap: Animated Layout */}
      <section className="py-12 md:py-20 bg-white overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-luxury-gold mb-3 inline-block">The Methodology</span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-luxury-ink [text-shadow:0_2px_4px_rgba(0,0,0,0.05)]">Our Process</h2>
          </div>

          <ProcessRoadmap steps={processSteps} />
        </div>
      </section>

      {/* Final CTA Section */}
      <FinalCTA />
    </div>
  );
};

export default ServiceDetail;
