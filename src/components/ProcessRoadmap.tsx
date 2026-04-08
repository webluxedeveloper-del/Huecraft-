import React, { useRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';
import { cn } from '../lib/utils';

interface Step {
  id?: string;
  title: string;
  desc?: string;
  icon: LucideIcon;
}

interface ProcessRoadmapProps {
  steps: Step[];
}

export default function ProcessRoadmap({ steps }: ProcessRoadmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  
  return (
    <div className="pt-4 pb-0 px-4 sm:px-6">
      <div className="relative mx-auto max-w-lg lg:max-w-none" ref={containerRef}>
        {/* Mobile Background Line (Vertical) */}
        <div className="absolute left-1/2 top-6 bottom-6 w-[2px] -translate-x-1/2 bg-luxury-divider rounded-full lg:hidden" />
        
        {/* Mobile Active Line (Vertical) */}
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="absolute left-1/2 top-6 bottom-6 w-[2px] -translate-x-1/2 bg-luxury-gold origin-top shadow-[0_0_15px_rgba(197,148,63,0.3)] lg:hidden"
        />

        {/* Desktop Background Line (Horizontal) */}
        <div className="hidden lg:block absolute top-5 left-10 right-10 h-[2px] bg-luxury-divider rounded-full" />
        
        {/* Desktop Active Line (Horizontal) */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="hidden lg:block absolute top-5 left-10 right-10 h-[2px] bg-luxury-gold origin-left shadow-[0_0_15px_rgba(197,148,63,0.3)]"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between gap-12 lg:gap-4">
          {steps.map((step, index) => (
            <StepItem key={step.id || index} step={step} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

const StepItem: React.FC<{ step: Step; index: number }> = ({ step, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-15% 0px -15% 0px", once: true });
  const Icon = step.icon;

  return (
    <div 
      ref={ref}
      className="relative flex flex-col items-center text-center lg:flex-1"
    >
      {/* Node (Circle) - Compact */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={isInView ? { 
          backgroundColor: "var(--color-luxury-gold)", 
          borderColor: "var(--color-luxury-gold)",
          scale: 1,
          opacity: 1,
          boxShadow: "0 4px 15px rgba(212,162,76,0.4)"
        } : { 
          backgroundColor: "#ffffff", 
          borderColor: "var(--color-luxury-divider)",
          scale: 0.8,
          opacity: 0,
          boxShadow: "0 0 0 rgba(0,0,0,0)"
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-3 lg:mb-6 flex h-10 w-10 items-center justify-center rounded-full border z-10 shadow-premium-sm inner-highlight"
      >
        <Icon className={cn(
          "h-4 w-4 transition-colors duration-500",
          isInView ? "text-white" : "text-luxury-gray"
        )} />
      </motion.div>

      {/* Card - Compact, Cinematic, Pill-shaped */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
        transition={{ duration: 0.8, delay: 0.2 + (index * 0.1), ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[220px] lg:max-w-full rounded-full bg-white px-6 py-3 lg:py-4 shadow-premium-md border border-luxury-divider group inner-highlight-dark hover:shadow-premium-lg hover:-translate-y-1 transition-all duration-500"
      >
        <div className="flex flex-col items-center justify-center gap-0.5 lg:gap-1">
          <div className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold/80 group-hover:text-luxury-gold transition-colors">
            Phase 0{index + 1}
          </div>
          <h3 className="font-serif text-base lg:text-lg font-bold text-luxury-ink leading-tight">
            {step.title}
          </h3>
        </div>
      </motion.div>
    </div>
  );
}


