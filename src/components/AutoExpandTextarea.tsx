import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface AutoExpandTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const AutoExpandTextarea: React.FC<AutoExpandTextareaProps> = ({
  label,
  error,
  className,
  onFocus,
  onBlur,
  onChange,
  value,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(56, textarea.scrollHeight)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const hasValue = value !== undefined && value !== '';

  return (
    <div className="relative w-full group">
      <div
        className={cn(
          "relative min-h-12 w-full rounded-xl border transition-all duration-300 ease-in-out bg-gray-50/50 overflow-hidden",
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
        <textarea
          {...props}
          ref={textareaRef}
          value={value}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onChange={(e) => {
            adjustHeight();
            onChange?.(e);
          }}
          className={cn(
            "w-full min-h-[48px] px-4 pt-4 pb-2 bg-transparent outline-none text-luxury-ink text-sm resize-none overflow-hidden",
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
