import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface ServiceDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export const ServiceDropdown: React.FC<ServiceDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasValue = value !== '';

  return (
    <div className="relative w-full group" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative h-12 w-full rounded-xl border transition-all duration-300 ease-in-out bg-gray-50/50 overflow-hidden cursor-pointer",
          isOpen ? "border-luxury-gold ring-2 ring-luxury-gold/5" : "border-gray-100",
          error ? "border-red-500 ring-red-500/10" : "group-hover:border-gray-200",
          className
        )}
      >
        <label
          className={cn(
            "absolute left-4 transition-all duration-300 ease-out pointer-events-none select-none",
            (isOpen || hasValue)
              ? "top-1.5 text-[8px] font-bold uppercase tracking-widest text-luxury-gold"
              : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
          )}
        >
          {label}
        </label>
        <div className={cn(
          "w-full h-full px-4 pt-4 pb-1 flex items-center justify-between text-luxury-ink text-sm",
          (isOpen || hasValue) ? "opacity-100" : "opacity-0"
        )}>
          <span className="truncate">{value || "Select a service"}</span>
          <ChevronDown className={cn("w-3.5 h-3.5 text-gray-400 transition-transform duration-300", isOpen && "rotate-180")} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.99 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 overflow-hidden"
          >
            <div className="p-2 border-b border-gray-50 bg-gray-50/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-9 pl-9 pr-4 bg-white border border-gray-100 rounded-xl text-xs outline-none focus:border-luxury-gold transition-colors"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(option);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={cn(
                      "px-4 py-2.5 text-xs cursor-pointer flex items-center justify-between transition-colors",
                      value === option ? "bg-luxury-gold/5 text-luxury-gold font-bold" : "text-luxury-ink/70 hover:bg-gray-50 hover:text-luxury-gold"
                    )}
                  >
                    {option}
                    {value === option && <Check className="w-3.5 h-3.5" />}
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-xs text-gray-400">
                  No services found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            className="absolute -bottom-5 left-1 text-[11px] font-medium text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
