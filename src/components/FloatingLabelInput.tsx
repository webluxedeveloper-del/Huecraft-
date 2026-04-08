import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  error,
  className,
  onFocus,
  onBlur,
  value,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== '';

  return (
    <div className="relative w-full group">
      <div
        className={cn(
          "relative h-12 w-full rounded-xl border transition-all duration-300 ease-in-out bg-gray-50/50 overflow-hidden",
          isFocused ? "border-luxury-blue-mid ring-2 ring-luxury-blue-mid/5" : "border-gray-100",
          error ? "border-red-500 ring-red-500/10" : "group-hover:border-gray-200",
          className
        )}
      >
        <label
          className={cn(
            "absolute left-4 transition-all duration-300 ease-out pointer-events-none select-none",
            (isFocused || hasValue)
              ? "top-1.5 text-[8px] font-bold uppercase tracking-widest text-luxury-blue-mid"
              : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
          )}
        >
          {label}
        </label>
        <input
          {...props}
          value={value}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          className={cn(
            "w-full h-full px-4 pt-4 pb-1 bg-transparent outline-none text-luxury-ink text-sm",
            (isFocused || hasValue) ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
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
