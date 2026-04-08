import React from 'react';
import { motion } from 'framer-motion';

interface PremiumBackgroundProps {
  variant?: 'home' | 'services' | 'projects' | 'contact' | 'about' | 'footer';
}

const PremiumBackground: React.FC<PremiumBackgroundProps> = ({ variant = 'home' }) => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden lg:block select-none">
      {/* Global Noise Texture */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay z-50 pointer-events-none" 
           style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

      {/* Variant Specific Elements */}
      {variant === 'home' && (
        <>
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-luxury-gold/5 rounded-full blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-luxury-blue-mid/5 rounded-full blur-[100px] animate-float-slow" />
          <div className="absolute top-[20%] right-[10%] w-[1px] h-[40%] bg-gradient-to-b from-transparent via-luxury-gold/20 to-transparent" />
          <div className="absolute bottom-[20%] left-[10%] w-[1px] h-[30%] bg-gradient-to-b from-transparent via-luxury-blue-mid/20 to-transparent" />
          {/* Abstract Paint Drips */}
          <div className="absolute top-0 left-[20%] w-[2px] h-[150px] bg-gradient-to-b from-luxury-gold/30 to-transparent rounded-full animate-float-slow" />
          <div className="absolute top-0 left-[25%] w-[2px] h-[100px] bg-gradient-to-b from-luxury-gold/20 to-transparent rounded-full animate-float-slow" style={{ animationDelay: '1.5s' }} />
        </>
      )}

      {variant === 'services' && (
        <>
          <div className="absolute top-[5%] right-[5%] w-[30%] h-[30%] bg-luxury-gold/5 rounded-full blur-[100px] animate-float-slow" />
          <div className="absolute bottom-[5%] left-[5%] w-[25%] h-[25%] bg-luxury-blue-mid/5 rounded-full blur-[80px] animate-pulse-soft" />
          {/* Abstract SVG Shapes */}
          <svg className="absolute top-[15%] left-[10%] w-64 h-64 opacity-[0.03] text-luxury-gold animate-float-slow" viewBox="0 0 200 200">
            <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.5C87.4,-33.9,90,-16.9,89.1,-0.5C88.2,15.9,83.8,31.8,75.4,45.2C67,58.6,54.7,69.5,40.6,76.3C26.5,83.1,10.6,85.8,-4.4,93.4C-19.4,101,-33.5,113.5,-45.8,111.9C-58.1,110.3,-68.6,94.6,-76.3,79.3C-84,64,-88.9,49.1,-92.4,34.2C-95.9,19.3,-98,4.4,-95.8,-9.7C-93.6,-23.8,-87.1,-37.1,-78.2,-48.8C-69.3,-60.5,-58,-70.6,-45.3,-78.5C-32.6,-86.4,-18.5,-92.1,-2.4,-88C13.7,-83.9,27.4,-70,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
          {/* Geometric Construction Lines */}
          <div className="absolute inset-0 opacity-[0.02]" 
               style={{ 
                 backgroundImage: 'linear-gradient(45deg, #d4a24c 0.5px, transparent 0.5px), linear-gradient(-45deg, #d4a24c 0.5px, transparent 0.5px)',
                 backgroundSize: '100px 100px'
               }} />
        </>
      )}

      {variant === 'projects' && (
        <>
          <div className="absolute inset-0 bg-mesh-premium opacity-[0.1] animate-mesh" />
          <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-luxury-gold/5 rounded-full blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-luxury-blue-mid/5 rounded-full blur-[100px] animate-float-slow" />
          {/* Floating Geometric Elements */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-[20%] right-[15%] w-96 h-96 border border-luxury-gold/10 rounded-full opacity-20"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[15%] left-[10%] w-[500px] h-[500px] border border-luxury-blue-mid/10 rounded-full opacity-10"
          />
        </>
      )}

      {variant === 'contact' && (
        <>
          {/* Continuous Moving Abstract Strokes */}
          <motion.div 
            animate={{ 
              x: [-100, 100, -100],
              y: [-50, 50, -50],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[20%] left-[10%] w-[60%] h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent -skew-y-12"
          />
          <motion.div 
            animate={{ 
              x: [100, -100, 100],
              y: [50, -50, 50],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[30%] right-[10%] w-[50%] h-[1px] bg-gradient-to-r from-transparent via-luxury-blue-mid/30 to-transparent skew-y-12"
          />
          
          {/* Paint Brush Stroke Abstract */}
          <div className="absolute top-[10%] right-[5%] w-[300px] h-[100px] bg-luxury-gold/10 blur-3xl rounded-full -rotate-12 animate-brush" />
          <div className="absolute bottom-[15%] left-[5%] w-[400px] h-[120px] bg-luxury-blue-mid/10 blur-3xl rounded-full rotate-12 animate-brush" style={{ animationDelay: '1s' }} />
          
          {/* Abstract Paint Splatters (SVG) */}
          <svg className="absolute top-[40%] right-[15%] w-32 h-32 opacity-[0.05] text-luxury-gold" viewBox="0 0 100 100">
            <circle cx="20" cy="20" r="5" fill="currentColor" />
            <circle cx="50" cy="40" r="8" fill="currentColor" />
            <circle cx="80" cy="20" r="4" fill="currentColor" />
            <circle cx="30" cy="70" r="6" fill="currentColor" />
            <circle cx="70" cy="80" r="10" fill="currentColor" />
          </svg>
        </>
      )}

      {variant === 'about' && (
        <>
          {/* Blueprint Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.04]" 
               style={{ 
                 backgroundImage: `
                   linear-gradient(to right, #1a2e47 1px, transparent 1px),
                   linear-gradient(to bottom, #1a2e47 1px, transparent 1px)
                 `,
                 backgroundSize: '60px 60px'
               }} />
          <div className="absolute inset-0 opacity-[0.02]" 
               style={{ 
                 backgroundImage: `
                   linear-gradient(to right, #1a2e47 1px, transparent 1px),
                   linear-gradient(to bottom, #1a2e47 1px, transparent 1px)
                 `,
                 backgroundSize: '12px 12px'
               }} />
          <div className="absolute top-[15%] left-[-10%] w-[50%] h-[50%] bg-luxury-gold/5 rounded-full blur-[150px] animate-float-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-luxury-blue-mid/5 rounded-full blur-[120px] animate-pulse-soft" />
        </>
      )}
      
      {variant === 'footer' && (
        <>
          {/* Organic Flowing Shapes */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
              x: [-20, 20, -20]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[80%] bg-luxury-gold/5 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-[100px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, -5, 0],
              x: [20, -20, 20]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[20%] -right-[10%] w-[50%] h-[70%] bg-luxury-blue-mid/5 rounded-[60%_40%_30%_70%/50%_60%_40%_60%] blur-[80px]"
          />
          
          {/* Subtle Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -100, 0],
                  opacity: [0, 0.3, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 10 + i * 2, 
                  repeat: Infinity, 
                  delay: i * 1.5,
                  ease: "easeInOut" 
                }}
                className="absolute w-1 h-1 bg-luxury-gold rounded-full blur-[1px]"
                style={{ 
                  left: `${15 + i * 15}%`, 
                  top: `${20 + (i % 3) * 20}%` 
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PremiumBackground;
