import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();

  useEffect(() => {
    // Scroll handled by ScrollToTop in App.tsx
  }, []);

  // In a real app, we would fetch project data by ID
  // For now, we'll just show a placeholder
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link 
          to="/projects" 
          className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-luxury-gray hover:text-luxury-ink mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Portfolio
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="space-y-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-luxury-gold">
                Project Detail
              </span>
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-luxury-ink tracking-tight">
                Case Study {id}
              </h1>
              <p className="text-lg font-light leading-relaxed text-luxury-gray">
                This project involved a comprehensive approach to modernizing the space while maintaining its original character. Our team focused on precision, high-quality materials, and a seamless finish that exceeds expectations.
              </p>

              <div className="pt-8 space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-luxury-ink">Key Transformations</h3>
                <ul className="space-y-4">
                  {[
                    'Full surface restoration and preparation',
                    'Custom color palette selection',
                    'Premium weather-resistant coatings',
                    'Precision architectural detailing'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-luxury-gray">
                      <CheckCircle2 className="w-5 h-5 text-luxury-gold shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="space-y-8"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80" 
                alt="Project Result" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80" alt="Detail 1" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80" alt="Detail 2" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
