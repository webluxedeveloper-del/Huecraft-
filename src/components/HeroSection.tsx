import React from 'react';
import { motion } from 'motion/react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary tracking-tight leading-tight">
            Start Your Transformation
          </h1>
          <p className="text-lg md:text-xl text-text-secondary font-medium leading-relaxed">
            Not sure what you need? Share your requirements and our team will guide you with the right solution.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
