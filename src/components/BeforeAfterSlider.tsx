import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, animate, useInView, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
  priority?: boolean;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage, className = "", priority = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const isDraggingRef = useRef(false);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  // Motion values for interaction
  const sliderX = useMotionValue(50);
  const sliderXSpring = useSpring(sliderX, { stiffness: 300, damping: 30, mass: 0.5 });
  const sliderPosPercent = useTransform(sliderXSpring, (v) => `${v}%`);
  
  // Tilt effect values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["2deg", "-2deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-2deg", "2deg"]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-swipe animation when entering viewport
  useEffect(() => {
    if (isInView && !hasInteracted) {
      const timer = setTimeout(() => {
        animate(sliderX, 100, { duration: 0 });
        animate(sliderX, 0, { 
          duration: 1.2, 
          ease: [0.45, 0, 0.55, 1],
          delay: 0.2
        }).then(() => {
          animate(sliderX, 50, { duration: 0.8, ease: "easeOut" });
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasInteracted]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    sliderX.stop();
    isDraggingRef.current = true;
    setHasInteracted(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') {
      updateTilt(e);
    }
    if (isDraggingRef.current) {
      updateSlider(e);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    isDraggingRef.current = false;
  };

  const updateSlider = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    sliderX.set(Math.min(Math.max(position, 0), 100));
  };

  const updateTilt = (e: React.PointerEvent | React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      ref={containerRef}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative overflow-hidden select-none cursor-col-resize touch-pan-y gpu-accelerate will-change-transform ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* After Image (Base) */}
      <div className="absolute inset-0 h-full w-full transform-gpu">
        <img 
          src={afterImage} 
          alt="After" 
          className="h-full w-full object-cover pointer-events-none will-change-transform transform-gpu"
          loading={priority ? "eager" : "lazy"}
        />
      </div>
      
      {/* Before Image (Overlay) */}
      <motion.div 
        className="absolute inset-0 h-full overflow-hidden border-r-2 border-white/60 z-10 transform-gpu"
        style={{ width: sliderPosPercent }}
      >
        <div 
          className="absolute top-0 left-0 h-full transform-gpu"
          style={{ width: containerWidth || '100%' }}
        >
          <img 
            src={beforeImage} 
            alt="Before" 
            className="h-full w-full object-cover pointer-events-none will-change-transform transform-gpu"
            loading={priority ? "eager" : "lazy"}
          />
        </div>
      </motion.div>

      {/* Slider Handle */}
      <motion.div 
        className="absolute top-0 bottom-0 w-[2px] bg-white/80 shadow-premium-sm z-20 pointer-events-none"
        style={{ left: sliderPosPercent }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-premium-md flex items-center justify-center border border-luxury-divider/50">
          <div className="flex gap-1">
            <ChevronLeft className="w-3 h-3 md:w-4 md:h-4 text-luxury-gold" />
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-luxury-gold" />
          </div>
        </div>
      </motion.div>

      {/* Labels */}
      <motion.div 
        className="absolute bottom-6 left-6 z-30 pointer-events-none" 
        style={{ transform: "translateZ(20px)", opacity: useTransform(sliderX, [10, 20], [0, 1]) }}
      >
        <span className="bg-black/60 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-white/20">Before</span>
      </motion.div>
      <motion.div 
        className="absolute bottom-6 right-6 z-30 pointer-events-none" 
        style={{ transform: "translateZ(20px)", opacity: useTransform(sliderX, [80, 90], [1, 0]) }}
      >
        <span className="bg-luxury-gold text-white text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-white/20">After</span>
      </motion.div>

      {/* Hint */}
      <AnimatePresence>
        {!hasInteracted && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-12 z-40 pointer-events-none"
          >
            <span className="bg-white/20 text-white text-[8px] md:text-[9px] font-medium uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-white/10">Swipe to compare</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BeforeAfterSlider;
