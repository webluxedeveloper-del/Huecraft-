import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FloatingLabelInput } from './FloatingLabelInput';
import { PhoneInput } from './PhoneInput';
import { ServiceDropdown } from './ServiceDropdown';
import { AutoExpandTextarea } from './AutoExpandTextarea';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Honeypot } from './Honeypot';
import { 
  validateFormInput, 
  sanitizeInput, 
  checkRateLimit, 
  setRateLimit, 
  secureError,
  secureLog 
} from '../lib/security';

const SERVICES = [
  "Interior Design",
  "Exterior Renovation",
  "Custom Furniture",
  "Lighting Consultation",
  "Color Consultation",
  "Space Planning",
  "Full Home Transformation"
];

export const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    service: '',
    details: '',
    website_url: '' // Honeypot field
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    // Use advanced validation utility
    const nameVal = validateFormInput('name', formData.fullName);
    if (!nameVal.isValid) newErrors.fullName = nameVal.error!;

    const emailVal = validateFormInput('email', formData.email);
    if (!emailVal.isValid) newErrors.email = emailVal.error!;

    const phoneVal = validateFormInput('phone', formData.phone);
    if (!phoneVal.isValid) newErrors.phone = phoneVal.error!;

    if (!formData.service) newErrors.service = "Please select a service";
    
    const detailsVal = validateFormInput('message', formData.details);
    if (!detailsVal.isValid) newErrors.details = detailsVal.error!;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // 1. Bot Protection (Honeypot)
    if (formData.website_url) {
      secureLog('Bot detected via honeypot');
      setIsSuccess(true); // Silently fail to confuse the bot
      return;
    }

    // 2. Rate Limiting
    const rateLimit = checkRateLimit();
    if (!rateLimit.canSubmit) {
      setSubmitError(`Please wait ${rateLimit.remainingSeconds} seconds before sending another request.`);
      return;
    }

    // 3. Validation
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // 4. Input Sanitization before API call
      const sanitizedData = {
        full_name: sanitizeInput(formData.fullName),
        phone: sanitizeInput(formData.phone),
        email: sanitizeInput(formData.email),
        service: sanitizeInput(formData.service),
        details: sanitizeInput(formData.details)
      };

      secureLog('Submitting sanitized data', sanitizedData);

      // Simulate API call (replace with your actual Supabase call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 5. Success Handling
      setRateLimit(); // Start cooldown
      setIsSuccess(true);
    } catch (error) {
      // 6. Secure Error Handling
      setSubmitError(secureError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] p-8 sm:p-10 bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center border border-gray-100"
      >
        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-7 h-7 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Request Received</h3>
        <p className="text-gray-500 leading-relaxed text-[13px] font-light px-4">
          Thank you for reaching out. Our team will contact you within 24 hours to discuss your transformation.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 hover:text-blue-700 transition-colors"
        >
          Send another request
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-[480px] p-5 sm:p-7 bg-white rounded-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden"
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Honeypot Field */}
        <Honeypot 
          value={formData.website_url} 
          onChange={(e) => setFormData({ ...formData, website_url: e.target.value })} 
        />

        {submitError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-[11px] font-medium"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {submitError}
          </motion.div>
        )}

        <FloatingLabelInput
          label="Full Name"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          error={errors.fullName}
          disabled={isSubmitting}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <PhoneInput
            label="Phone"
            value={formData.phone}
            onValueChange={(val) => setFormData({ ...formData, phone: val })}
            error={errors.phone}
            disabled={isSubmitting}
          />
          <FloatingLabelInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            disabled={isSubmitting}
          />
        </div>

        <ServiceDropdown
          label="Service Type"
          options={SERVICES}
          value={formData.service}
          onChange={(val) => setFormData({ ...formData, service: val })}
          error={errors.service}
        />

        <AutoExpandTextarea
          label="Project Details"
          value={formData.details}
          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
          disabled={isSubmitting}
        />

        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
          className={cn(
            "w-full h-12 rounded-[18px] text-white font-bold text-[10px] uppercase tracking-[0.25em] transition-all duration-200 bg-blue-600 flex items-center justify-center gap-2 border-x border-t border-blue-400/30 border-b-4 border-blue-800/50 active:translate-y-1 active:border-b-[1px]",
            isSubmitting ? "cursor-progress opacity-80" : "hover:bg-blue-700 hover:-translate-y-0.5 hover:border-b-[5px]"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            "Request Consultation"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};
