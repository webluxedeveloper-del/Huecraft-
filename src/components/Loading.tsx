import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="relative">
        <div className="h-24 w-24 animate-spin rounded-full border border-luxury-gold/20 border-t-luxury-gold"></div>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 flex items-center justify-center font-serif text-xl font-light tracking-widest text-luxury-gold"
        >
          EP
        </motion.div>
      </div>
    </div>
  );
};

export default Loading;
