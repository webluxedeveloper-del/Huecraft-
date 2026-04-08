import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Send, 
  Loader2, 
  Phone, 
  Mail,
  User,
  MapPin,
  Maximize,
  Paintbrush,
  Shield,
  Hammer,
  Droplets,
  ChevronRight,
  Home,
  Briefcase,
  Factory,
  Layout,
  Wrench,
  Zap,
  Calendar,
  Clock,
  Sparkles,
  Star,
  Award,
  Crown
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const proposalSchema = z.object({
  service: z.string().min(1, 'Please select a service'),
  propertyType: z.string().min(1, 'Please select a property type'),
  condition: z.string().min(1, 'Please select property condition'),
  areaSize: z.string().min(1, 'Please provide area size or number of rooms'),
  location: z.string().min(1, 'Please provide the location'),
  budget: z.string().min(1, 'Please select a budget range'),
  timeline: z.string().min(1, 'Please select a timeline'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  notes: z.string().optional(),
});

type ProposalForm = z.infer<typeof proposalSchema>;

const steps = [
  { id: 1, title: 'Project Type', subSteps: 3, label: 'Project Type' },
  { id: 2, title: 'Project Details', subSteps: 3, label: 'Details' },
  { id: 3, title: 'Contact Details', subSteps: 2, label: 'Contact' },
];

const services = [
  { id: 'interior', title: 'Interior Painting', desc: 'Premium indoor finishes.', icon: Paintbrush },
  { id: 'exterior', title: 'Exterior Painting', desc: 'Weather-resistant protection.', icon: Shield },
  { id: 'siding', title: 'Siding', desc: 'Lasting exterior impression.', icon: Hammer },
  { id: 'other', title: 'Other Services', desc: 'Custom solutions.', icon: Layout },
];

const propertyTypes = [
  { title: 'House', icon: Home },
  { title: 'Apartment', icon: Layout },
  { title: 'Commercial', icon: Briefcase },
];

const conditions = [
  { title: 'New', icon: Sparkles },
  { title: 'Good', icon: CheckCircle2 },
  { title: 'Needs Repair', icon: Wrench },
];

const timelines = [
  { title: 'Flexible', icon: Clock },
  { title: 'Urgent', icon: Zap },
  { title: 'Specific Date', icon: Calendar },
];

const budgets = [
  { title: 'Under $5,000', icon: Star },
  { title: '$5,000 - $15,000', icon: Award },
  { title: '$15,000 - $30,000', icon: Crown },
  { title: '$30,000+', icon: Sparkles },
];

const PremiumInput = ({ 
  label, 
  name, 
  register, 
  error, 
  type = "text", 
  isSelect = false,
  options = [],
  icon: Icon
}: { 
  label: string; 
  name: keyof ProposalForm; 
  register: any; 
  error?: string; 
  type?: string;
  isSelect?: boolean;
  options?: any[];
  icon?: any;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full group pb-4 md:pb-5">
      <label className="block text-[9px] md:text-[11px] font-extrabold uppercase tracking-[0.25em] text-luxury-ink/70 mb-1 md:mb-2 ml-1 transition-colors group-focus-within:text-luxury-gold">
        {label}
      </label>
      <div
        className={cn(
          "relative rounded-[14px] md:rounded-[22px] border-[0.5px] transition-all duration-500 luxury-easing bg-luxury-surface-warm/40 flex items-center overflow-hidden",
          isFocused 
            ? "border-luxury-gold ring-4 ring-luxury-gold/10 -translate-y-[1px] bg-white" 
            : "border-luxury-divider/60",
          error ? "border-red-400/60" : ""
        )}
      >
        {isFocused && (
          <div className="absolute left-0 top-0 bottom-0 w-[2px] md:w-[3px] bg-luxury-gold shadow-[0_0_15px_rgba(197,148,63,0.4)]" />
        )}
        {Icon && (
          <div className={cn(
            "pl-3 md:pl-5 transition-colors duration-300",
            isFocused ? "text-luxury-gold" : "text-luxury-gray/50"
          )}>
            <Icon className="h-3.5 w-3.5 md:h-4.5 md:w-4.5" />
          </div>
        )}
        {isSelect ? (
          <select
            {...register(name)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent px-3 md:px-5 py-2 md:py-3 text-xs md:text-base text-luxury-ink outline-none appearance-none cursor-pointer font-medium"
          >
            <option value="" disabled>Select {label}</option>
            {options.map(opt => (
              <option key={typeof opt === 'string' ? opt : opt.title} value={typeof opt === 'string' ? opt : opt.title}>
                {typeof opt === 'string' ? opt : opt.title}
              </option>
            ))}
          </select>
        ) : (
          <input
            {...register(name)}
            type={type}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent px-3 md:px-5 py-2 md:py-3 text-xs md:text-base text-luxury-ink outline-none placeholder:text-luxury-gray/40 font-medium"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-4 left-1 text-[8px] font-bold uppercase tracking-widest text-red-500 transform-gpu"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

const SelectionCard: React.FC<{ 
  title: string; 
  description?: string; 
  isSelected: boolean; 
  onClick: () => void;
  icon?: any;
  compact?: boolean;
  className?: string;
}> = ({ 
  title, 
  description, 
  isSelected, 
  onClick,
  icon: Icon,
  compact = false,
  className = ""
}) => (
  <motion.div
    whileTap={{ scale: 0.98 }}
    whileHover={{ y: -4, scale: 1.01 }}
    onClick={onClick}
    className={cn(
      "cursor-pointer rounded-[20px] md:rounded-[32px] transition-all duration-300 luxury-easing relative overflow-hidden group h-full flex flex-col justify-center",
      compact ? "p-4 md:p-6 min-h-[70px] md:min-h-[110px]" : "p-5 md:p-8 min-h-[90px] md:min-h-[140px]",
      isSelected 
        ? "border-[2px] border-luxury-gold bg-white shadow-[0_15px_30px_-10px_rgba(197,148,63,0.15)]" 
        : "border-[1px] border-luxury-divider/40 bg-luxury-surface-warm/10 hover:border-luxury-gold/40 hover:bg-white hover:shadow-premium-md",
      className
    )}
  >
    {isSelected && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-luxury-gold/10 via-transparent to-transparent pointer-events-none" 
      />
    )}
    <div className="relative z-10 flex flex-row items-center gap-4 md:gap-8 h-full justify-start w-full text-left">
      <div className={cn(
        "flex shrink-0 items-center justify-center rounded-xl md:rounded-[1.5rem] transition-all duration-500 luxury-easing",
        compact ? "h-10 w-10 md:h-14 md:w-14" : "h-14 w-14 md:h-20 md:w-20",
        isSelected ? "bg-luxury-gold text-white scale-105 md:scale-110 shadow-premium-sm" : "bg-white text-luxury-gold group-hover:bg-luxury-gold group-hover:text-white border border-luxury-divider/40"
      )}>
        {Icon ? <Icon className={cn(compact ? "h-5 w-5 md:h-7 md:w-7" : "h-7 w-7 md:h-10 md:w-10")} /> : <div className="h-2.5 w-2.5 rounded-full bg-current" />}
      </div>
      <div className="flex-1 min-w-0 w-full">
        <h3 className={cn(
          "font-serif transition-colors duration-300 luxury-easing leading-tight break-words font-bold",
          compact ? "text-base md:text-2xl" : "text-xl md:text-3xl",
          isSelected ? "text-luxury-ink" : "text-luxury-ink group-hover:text-luxury-gold"
        )}>
          {title}
        </h3>
        {description && (
          <p className={cn(
            "font-medium transition-colors duration-300 luxury-easing mt-0.5 md:mt-1 line-clamp-2",
            compact ? "text-[10px] md:text-sm" : "text-[10px] md:text-sm",
            isSelected ? "text-luxury-gray" : "text-luxury-gray/60 group-hover:text-luxury-gray"
          )}>
            {description}
          </p>
        )}
      </div>
      {!compact && (
        <div className={cn(
          "h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 luxury-easing shrink-0",
          isSelected ? "border-luxury-gold bg-luxury-gold" : "border-luxury-divider group-hover:border-luxury-gold"
        )}>
          {isSelected && <CheckCircle2 className="h-5 w-5 text-white" />}
        </div>
      )}
    </div>
  </motion.div>
);

const ProposalForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ProposalForm>({
    resolver: zodResolver(proposalSchema),
    mode: 'onChange',
    defaultValues: {
      service: '',
      propertyType: '',
      condition: '',
      areaSize: '',
      location: '',
      budget: '',
      timeline: '',
      name: '',
      email: '',
      phone: '',
      notes: '',
    }
  });

  const formData = watch();

  useEffect(() => {
    document.title = 'Get Quote | Huecraft';
  }, []);

  const handleNext = async () => {
    let fieldsToValidate: (keyof ProposalForm)[] = [];
    
    // Step 1: Project Type
    if (currentStep === 1) {
      if (currentSubStep === 1) fieldsToValidate = ['service'];
      if (currentSubStep === 2) fieldsToValidate = ['propertyType'];
      if (currentSubStep === 3) fieldsToValidate = ['condition'];
    }
    
    // Step 2: Project Details
    if (currentStep === 2) {
      if (currentSubStep === 1) fieldsToValidate = ['areaSize', 'location'];
      if (currentSubStep === 2) fieldsToValidate = ['budget'];
      if (currentSubStep === 3) fieldsToValidate = ['timeline'];
    }
    
    // Step 3: Contact Details
    if (currentStep === 3) {
      if (currentSubStep === 1) fieldsToValidate = ['name', 'email', 'phone'];
    }

    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      const stepConfig = steps.find(s => s.id === currentStep);
      if (stepConfig && currentSubStep < stepConfig.subSteps) {
        setCurrentSubStep(prev => prev + 1);
      } else if (currentStep < steps.length) {
        setCurrentStep(prev => prev + 1);
        setCurrentSubStep(1);
      } else {
        // Final step - trigger submit
        handleSubmit(onSubmit)();
      }
    } else {
      // Show the first error message
      const firstErrorField = fieldsToValidate.find(field => errors[field]);
      if (firstErrorField && errors[firstErrorField]) {
        toast.error(errors[firstErrorField]?.message);
      } else {
        toast.error('Please complete all required fields on this step');
      }
    }
  };

  const handleBack = () => {
    if (currentSubStep > 1) {
      setCurrentSubStep(prev => prev - 1);
    } else if (currentStep > 1) {
      const prevStep = steps.find(s => s.id === currentStep - 1);
      setCurrentStep(prev => prev - 1);
      setCurrentSubStep(prevStep?.subSteps || 1);
    }
  };

  const onSubmit = async (data: ProposalForm) => {
    setIsSubmitting(true);
    try {
      const formattedMessage = `
TRANSFORMATION REQUEST DETAILS:
------------------------
Service: ${data.service}
Property Type: ${data.propertyType}
Condition: ${data.condition}
Area Size/Rooms: ${data.areaSize}
Location: ${data.location}
Timeline: ${data.timeline}
Notes: ${data.notes || 'None'}
      `.trim();

      const { error } = await supabase.from('quotes').insert([{
        name: data.name,
        email: data.email,
        phone: data.phone,
        service_type: data.service,
        budget_range: data.budget,
        timeline: data.timeline,
        description: formattedMessage,
        status: 'pending'
      }]);
      
      if (error) throw error;
      setIsSuccess(true);
    } catch (error: any) {
      console.error('Error submitting transformation request:', error);
      toast.error(error.message || 'Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 30 : -30,
      opacity: 0,
      scale: 0.98
    })
  };

  return (
    <div className="relative min-h-screen bg-white pt-24 pb-24 selection:bg-luxury-gold/20 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8">
        
        {/* HERO SECTION - More compact */}
        <div className="text-center mb-6 md:mb-10 relative">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <div className="mb-3">
              <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.4em] text-luxury-gold bg-white/80 px-4 py-2 rounded-full border border-luxury-divider/40 shadow-premium-sm">
                Bespoke Estimates
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-7xl font-bold tracking-tighter text-luxury-ink leading-[0.9] mb-4">
              Transform Your <br className="hidden sm:block" />
              <span className="text-luxury-gold italic font-light">Space.</span>
            </h1>
            <p className="text-sm md:text-base lg:text-lg font-light text-luxury-gray/70 max-w-2xl mx-auto leading-relaxed px-4">
              Share your project details and we'll help transform your space with master-level craftsmanship.
            </p>
          </motion.div>
        </div>

        {/* MAIN FORM SECTION */}
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative overflow-hidden rounded-[2.5rem] bg-white border border-luxury-border/20 p-10 md:p-16 shadow-premium-xl text-center"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
                className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500 shadow-inner"
              >
                <CheckCircle2 className="h-10 w-10" />
              </motion.div>
              <h2 className="font-serif text-3xl font-bold text-luxury-ink mb-4">Transformation Request Submitted</h2>
              <p className="text-base text-luxury-gray font-light max-w-sm mx-auto leading-relaxed mb-10">
                Your request has been successfully submitted. Our team will review your details and contact you shortly to begin your transformation.
              </p>
              
              <div className="pt-10 border-t border-luxury-border/20">
                <h3 className="font-serif text-xl font-bold text-luxury-ink mb-6">Need Immediate Assistance?</h3>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link 
                    to="/contact"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-luxury-gold px-10 py-4 text-[10px] font-bold uppercase tracking-widest text-luxury-gold transition-all hover:bg-luxury-gold hover:text-white shadow-premium-sm hover:shadow-premium-md active:scale-95"
                  >
                    <Mail className="h-4 w-4" />
                    Contact Us
                  </Link>
                  <a 
                    href="tel:+14379928442"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-luxury-gold px-8 py-3.5 text-[9px] font-bold uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Call Now
                  </a>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              {/* PROGRESS INDICATOR - More compact */}
              <div className="mb-8 relative z-10 w-full max-w-3xl mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full bg-white/80 border border-luxury-divider/30 shadow-premium-sm">
                    <Sparkles className="h-3.5 w-3.5 text-luxury-gold animate-pulse" />
                    <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest text-luxury-gold">
                      Quick 60-second request
                    </span>
                  </div>
                </div>
                
                <div className="max-w-[280px] md:max-w-xl mx-auto relative">
                  {/* Background Line */}
                  <div className="absolute left-0 top-4 md:top-5 -translate-y-1/2 w-full h-[2px] bg-luxury-border/20 rounded-full z-0" />
                  
                  {/* Active Progress Line */}
                  <motion.div 
                    className="absolute left-0 top-4 md:top-5 -translate-y-1/2 h-[2px] bg-luxury-gold rounded-full z-10 shadow-[0_0_10px_rgba(197,148,63,0.5)]"
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: (() => {
                        if (currentStep === 1) {
                          return `${((currentSubStep - 1) / 3) * 33.33}%`;
                        } else if (currentStep === 2) {
                          return `${33.33 + ((currentSubStep - 1) / 3) * 33.33}%`;
                        } else if (currentStep === 3) {
                          return `${66.66 + ((currentSubStep - 1) / 2) * 33.33}%`;
                        } else {
                          return '100%';
                        }
                      })()
                    }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                  
                  <div className="flex items-center justify-between relative z-20">
                    {steps.map((step) => {
                      const isActive = currentStep === step.id;
                      const isCompleted = currentStep > step.id;
                      
                      return (
                        <div key={step.id} className="flex flex-col items-center gap-2 md:gap-3 w-20 md:w-28">
                          <motion.div 
                            animate={{ 
                              scale: isActive ? 1.05 : 1,
                              backgroundColor: isActive || isCompleted ? "var(--color-luxury-gold)" : "#ffffff",
                              borderColor: isActive || isCompleted ? "var(--color-luxury-gold)" : "var(--color-luxury-divider)",
                            }}
                            className={cn(
                              "flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border-2 relative z-10 bg-white transition-all duration-500 shadow-sm",
                              isActive || isCompleted ? "text-white" : "text-luxury-gray/40"
                            )}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" />
                            ) : (
                              <span className="text-xs md:text-sm font-bold">
                                {step.id}
                              </span>
                            )}
                          </motion.div>
                          
                          <span className={cn(
                            "text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] transition-colors duration-500 text-center",
                            isActive ? "text-luxury-gold" : "text-luxury-gray/50"
                          )}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-[2rem] md:rounded-[2.5rem] bg-white/95 border border-luxury-divider/40 shadow-[0_20px_60px_-15px_rgba(26,46,71,0.1)] max-w-3xl mx-auto overflow-hidden min-h-[400px] md:min-h-[450px] flex flex-col mb-6"
              >
                <div className="p-6 md:p-8 lg:p-10 lg:pt-6 lg:pb-4 relative z-10 w-full">
                  <AnimatePresence mode="wait" custom={1}>
                  {/* STEP 1: PROJECT TYPE */}
                  {currentStep === 1 && (
                    <motion.div
                      key={`step1-${currentSubStep}`}
                      custom={1}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="space-y-6 transform-gpu"
                    >
                      {currentSubStep === 1 && (
                        <>
                          <div className="text-center mb-4">
                            <h2 className="font-serif text-2xl md:text-3xl font-bold text-luxury-ink mb-2 md:mb-3">Service Selection</h2>
                            <p className="text-sm md:text-base text-luxury-gray/80 font-medium">What can we help you with today?</p>
                          </div>
                          <div className="flex flex-col gap-3 max-w-2xl mx-auto">
                            {services.map((service) => (
                              <SelectionCard
                                key={service.id}
                                title={service.title}
                                description={service.desc}
                                icon={service.icon}
                                isSelected={formData.service === service.title}
                                onClick={() => setValue('service', service.title, { shouldValidate: true })}
                                compact={true}
                              />
                            ))}
                            {errors.service && (
                              <p className="text-[10px] md:text-xs text-red-500 font-bold uppercase tracking-widest text-center mt-2">
                                {errors.service.message}
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      {currentSubStep === 2 && (
                        <>
                          <div className="text-center mb-6">
                            <h2 className="font-serif text-2xl md:text-3xl font-bold text-luxury-ink mb-2 md:mb-3">Property Type</h2>
                            <p className="text-sm md:text-base text-luxury-gray/80 font-medium">Where is the project located?</p>
                          </div>
                          <div className="flex flex-col gap-3 max-w-2xl mx-auto">
                            {propertyTypes.map((type) => (
                              <SelectionCard
                                key={type.title}
                                title={type.title}
                                icon={type.icon}
                                isSelected={formData.propertyType === type.title}
                                onClick={() => setValue('propertyType', type.title, { shouldValidate: true })}
                                compact={true}
                              />
                            ))}
                            {errors.propertyType && (
                              <p className="text-[10px] md:text-xs text-red-500 font-bold uppercase tracking-widest text-center mt-2">
                                {errors.propertyType.message}
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      {currentSubStep === 3 && (
                        <>
                          <div className="text-center mb-6">
                            <h2 className="font-serif text-2xl md:text-3xl font-bold text-luxury-ink mb-2 md:mb-3">Current Condition</h2>
                            <p className="text-sm md:text-base text-luxury-gray/80 font-medium">Tell us about the state of the property.</p>
                          </div>
                          <div className="flex flex-col gap-3 max-w-2xl mx-auto">
                            {conditions.map((cond) => (
                              <SelectionCard
                                key={cond.title}
                                title={cond.title}
                                icon={cond.icon}
                                isSelected={formData.condition === cond.title}
                                onClick={() => setValue('condition', cond.title, { shouldValidate: true })}
                                compact={true}
                              />
                            ))}
                            {errors.condition && (
                              <p className="text-[10px] md:text-xs text-red-500 font-bold uppercase tracking-widest text-center mt-2">
                                {errors.condition.message}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* STEP 2: PROJECT DETAILS */}
                  {currentStep === 2 && (
                    <motion.div
                      key={`step2-${currentSubStep}`}
                      custom={1}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="space-y-6 transform-gpu"
                    >
                      {currentSubStep === 1 && (
                        <>
                          <div className="text-center mb-6">
                            <h2 className="font-serif text-2xl md:text-3xl font-bold text-luxury-ink mb-2 md:mb-3">Project Scope</h2>
                            <p className="text-sm md:text-base text-luxury-gray/80 font-medium">Size and location.</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto bg-white p-8 md:p-10 rounded-[2.5rem] border border-luxury-divider/30 shadow-inner edge-highlight">
                            <div className="space-y-5">
                              <PremiumInput 
                                label="Area Size / Rooms" 
                                name="areaSize" 
                                icon={Maximize}
                                register={register} 
                                error={errors.areaSize?.message} 
                              />
                            </div>
                            <div className="space-y-5">
                              <PremiumInput 
                                label="Location (City, Zip)" 
                                name="location" 
                                icon={MapPin}
                                register={register} 
                                error={errors.location?.message} 
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {currentSubStep === 2 && (
                        <>
                          <div className="text-center mb-8">
                            <h2 className="font-serif text-2xl md:text-3xl font-bold text-luxury-ink mb-2 md:mb-3">Budget Range</h2>
                            <p className="text-sm md:text-base text-luxury-gray/80 font-medium">What is your estimated investment?</p>
                          </div>
                          <div className="flex flex-col gap-3 max-w-2xl mx-auto">
                            {budgets.map((budget) => (
                              <SelectionCard
                                key={budget.title}
                                title={budget.title}
                                icon={budget.icon}
                                isSelected={formData.budget === budget.title}
                                onClick={() => setValue('budget', budget.title, { shouldValidate: true })}
                                compact={true}
                              />
                            ))}
                            {errors.budget && (
                              <p className="text-[10px] md:text-xs text-red-500 font-bold uppercase tracking-widest text-center mt-2">
                                {errors.budget.message}
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      {currentSubStep === 3 && (
                        <>
                          <div className="text-center mb-8">
                            <h2 className="font-serif text-2xl md:text-3xl font-bold text-luxury-ink mb-2 md:mb-3">Timeline</h2>
                            <p className="text-sm md:text-base text-luxury-gray/80 font-medium">When would you like to start?</p>
                          </div>
                          <div className="flex flex-col gap-3 max-w-2xl mx-auto">
                            {timelines.map((time) => (
                              <SelectionCard
                                key={time.title}
                                title={time.title}
                                icon={time.icon}
                                isSelected={formData.timeline === time.title}
                                onClick={() => setValue('timeline', time.title, { shouldValidate: true })}
                                compact={true}
                              />
                            ))}
                            {errors.timeline && (
                              <p className="text-[10px] md:text-xs text-red-500 font-bold uppercase tracking-widest text-center mt-2">
                                {errors.timeline.message}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* STEP 3: CONTACT DETAILS */}
                  {currentStep === 3 && (
                    <motion.div
                      key={`step3-${currentSubStep}`}
                      custom={1}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="space-y-6 transform-gpu"
                    >
                      {currentSubStep === 1 ? (
                        <>
                          <div className="text-center mb-8">
                            <h2 className="font-serif text-2xl md:text-3xl font-bold text-luxury-ink mb-2 md:mb-3">Contact Details</h2>
                            <p className="text-sm md:text-base text-luxury-gray/80 font-medium">How should we reach you?</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 max-w-xl mx-auto">
                            <PremiumInput 
                              label="Full Name" 
                              name="name" 
                              icon={User}
                              register={register} 
                              error={errors.name?.message} 
                            />
                            <PremiumInput 
                              label="Phone Number" 
                              name="phone" 
                              type="tel"
                              icon={Phone}
                              register={register} 
                              error={errors.phone?.message} 
                            />
                            <div className="sm:col-span-2">
                              <PremiumInput 
                                label="Email Address" 
                                name="email" 
                                type="email"
                                icon={Mail}
                                register={register} 
                                error={errors.email?.message} 
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-luxury-ink/60 mb-1.5 ml-1">
                                Additional Notes
                              </label>
                              <textarea
                                {...register('notes')}
                                className="w-full bg-white border border-luxury-divider/50 rounded-[20px] px-5 py-3.5 text-sm text-luxury-ink outline-none focus:border-luxury-gold focus:bg-white focus:ring-4 focus:ring-luxury-gold/5 transition-all duration-500 luxury-easing min-h-[80px] md:min-h-[100px] font-light shadow-sm placeholder:text-luxury-gray/30"
                                placeholder="Any specific details or requirements?"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-center mb-8">
                            <h2 className="font-serif text-2xl md:text-3xl font-bold text-luxury-ink mb-2 md:mb-3">Final Review</h2>
                            <p className="text-sm md:text-base text-luxury-gray/80 font-medium">Please check your details before submitting.</p>
                          </div>
                          <div className="bg-white rounded-[2rem] p-6 border border-luxury-divider/30 space-y-4 max-w-lg mx-auto shadow-inner edge-highlight">
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <p className="text-luxury-gold font-bold uppercase tracking-[0.15em] mb-1 text-[9px]">Service</p>
                                <p className="text-luxury-ink font-serif text-lg font-semibold">{formData.service}</p>
                              </div>
                              <div>
                                <p className="text-luxury-gold font-bold uppercase tracking-[0.15em] mb-1 text-[9px]">Property</p>
                                <p className="text-luxury-ink font-serif text-lg font-semibold">{formData.propertyType}</p>
                              </div>
                              <div>
                                <p className="text-luxury-gold font-bold uppercase tracking-[0.15em] mb-1 text-[9px]">Condition</p>
                                <p className="text-luxury-ink font-serif text-lg font-semibold">{formData.condition}</p>
                              </div>
                              <div>
                                <p className="text-luxury-gold font-bold uppercase tracking-[0.15em] mb-1 text-[9px]">Timeline</p>
                                <p className="text-luxury-ink font-serif text-lg font-semibold">{formData.timeline}</p>
                              </div>
                              <div>
                                <p className="text-luxury-gold font-bold uppercase tracking-[0.15em] mb-1 text-[9px]">Budget</p>
                                <p className="text-luxury-ink font-serif text-lg font-semibold">{formData.budget}</p>
                              </div>
                            </div>
                            <div className="pt-5 border-t border-luxury-divider/30">
                              <p className="text-luxury-gold font-bold uppercase tracking-[0.15em] mb-2 text-[9px]">Contact Information</p>
                              <p className="text-luxury-ink font-serif text-xl font-semibold mb-0.5">{formData.name}</p>
                              <p className="text-luxury-gray/80 font-medium text-sm">{formData.email}</p>
                              <p className="text-luxury-gray/80 font-medium text-sm">{formData.phone}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
              </motion.div>

              {/* NAVIGATION BUTTONS - Outside the panel */}
              <div className="px-6 md:px-12 lg:px-16 flex items-center justify-between gap-4 relative z-20 max-w-3xl mx-auto w-full">
                {currentStep > 1 || currentSubStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="group flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-luxury-gray hover:text-luxury-gold transition-all duration-300"
                  >
                    <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95, y: 1 }}
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className={cn(
                    "group relative flex items-center justify-center gap-3 md:gap-4 rounded-full px-10 md:px-12 py-4 md:py-4.5 text-[11px] md:text-sm font-bold uppercase tracking-[0.3em] overflow-hidden transition-all duration-500",
                    isSubmitting 
                      ? "bg-luxury-gray cursor-not-allowed text-white" 
                      : "bg-gradient-to-b from-luxury-blue-mid to-luxury-ink text-white border-x border-t border-luxury-blue-soft/30 border-b-[4px] border-black/80 hover:border-b-[6px] active:border-b-[1px]"
                  )}
                >
                  {/* Intense Sparkle/Shimmer Effect */}
                  <motion.div 
                    className="absolute top-0 bottom-0 w-[200%] bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 z-0"
                    animate={{ left: ["-200%", "200%"] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                  
                  {/* Lightning/Pulse Effect */}
                  <motion.div
                    className="absolute inset-0 bg-luxury-blue-soft/20 opacity-0 group-hover:opacity-100"
                    animate={{ opacity: [0, 0.2, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  
                  <span className="relative z-10 drop-shadow-md">
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        {currentStep === steps.length && currentSubStep === steps[currentStep-1].subSteps ? 'Get Quote' : 'Continue'}
                      </>
                    )}
                  </span>
                  {!isSubmitting && (
                    <ArrowRight className="h-4 w-4 relative z-10 transition-transform duration-700 luxury-easing group-hover:translate-x-2" />
                  )}
                </motion.button>
              </div>
          </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProposalForm;
