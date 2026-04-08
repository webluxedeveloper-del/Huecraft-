import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

const INFO_ITEMS = [
  { icon: Phone, label: "Phone", value: "+1 (437) 992-8442", href: "tel:+14379928442" },
  { icon: Mail, label: "Email", value: "Huecrafthomes@gmail.com", href: "mailto:Huecrafthomes@gmail.com" },
  { icon: MapPin, label: "Location", value: "Calgary, AB, Canada", href: "#" },
  { icon: Clock, label: "Working Hours", value: "Mon - Fri, 9am - 6pm", href: "#" },
];

export const InfoPanel: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[400px] glass-panel p-8 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <h4 className="text-lg font-bold text-text-primary">Contact Information</h4>
          <p className="text-sm text-text-secondary">Quick response within 24 hours</p>
        </div>

        <div className="space-y-6">
          {INFO_ITEMS.map((item, idx) => (
            <motion.a
              key={idx}
              href={item.href}
              whileHover={{ x: 4 }}
              className="flex items-start gap-4 group"
            >
              <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center shadow-sm group-hover:bg-gold-start group-hover:text-white transition-all duration-300">
                <item.icon className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary/60">{item.label}</span>
                <p className="text-sm font-medium text-text-primary group-hover:text-gold-start transition-colors">{item.value}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="pt-8 border-t border-white/40">
          <div className="p-4 rounded-xl bg-gold-start/5 border border-gold-start/10">
            <p className="text-[13px] text-text-primary font-medium mb-3">
              Looking for a faster response?
            </p>
            <button className="flex items-center gap-2 text-sm font-bold text-gold-start hover:text-gold-end transition-colors group">
              Chat with our experts
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
