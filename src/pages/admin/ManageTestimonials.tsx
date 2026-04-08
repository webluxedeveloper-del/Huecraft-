import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Star, 
  Loader2, 
  Quote, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { AnimatePresence } from 'framer-motion';

type Testimonial = Database['public']['Tables']['testimonials']['Row'];

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    message: '',
    rating: 5,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setTestimonials(data);
    } catch (error: any) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const testimonialData = {
        name: formData.name,
        message: formData.message,
        rating: formData.rating,
        updated_at: new Date().toISOString()
      };

      if (editingTestimonial) {
        const { error } = await supabase
          .from('testimonials')
          .update(testimonialData)
          .eq('id', editingTestimonial.id);
        if (error) throw error;
        toast.success('Testimonial updated successfully');
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([testimonialData]);
        if (error) throw error;
        toast.success('Testimonial published successfully');
      }

      setIsModalOpen(false);
      resetForm();
      fetchTestimonials();
    } catch (error: any) {
      console.error('Error saving testimonial:', error);
      toast.error(error.message || 'Failed to save testimonial');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        const { error } = await supabase
          .from('testimonials')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast.success('Testimonial deleted successfully');
        fetchTestimonials();
      } catch (error: any) {
        console.error('Error deleting testimonial:', error);
        toast.error('Failed to delete testimonial');
      }
    }
  };

  const resetForm = () => {
    setEditingTestimonial(null);
    setFormData({ name: '', message: '', rating: 5 });
    setCurrentStep(1);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 2));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-2xl font-light text-luxury-ink uppercase tracking-widest">
            Client <span className="italic text-luxury-gold">Voices</span>
          </h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-gray">
            Manage your reputation and social proof
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="group flex items-center gap-2 rounded-full bg-luxury-ink px-6 py-3 text-[9px] font-bold uppercase tracking-widest text-white transition-all hover:bg-luxury-gold hover:shadow-lg"
        >
          <Plus className="h-3.5 w-3.5" /> Add Testimonial
        </button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.id} className="group relative flex flex-col overflow-hidden rounded-3xl border border-luxury-border bg-white p-6 transition-all hover:border-luxury-gold hover:shadow-md sm:p-8">
            <div className="absolute top-6 right-6 text-luxury-gold/10">
              <Quote className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            
            <div className="mb-4 flex gap-1 text-luxury-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn("h-3 w-3", i < t.rating ? "fill-current" : "text-luxury-border")} />
              ))}
            </div>
            
            <p className="mb-6 font-serif text-sm italic leading-relaxed text-luxury-gray sm:text-base">"{t.message}"</p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-luxury-border/50">
              <h4 className="font-serif text-base font-medium text-luxury-ink">— {t.name}</h4>
              <div className="flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button 
                  onClick={() => {
                    setEditingTestimonial(t);
                    setFormData({ name: t.name, message: t.message, rating: t.rating });
                    setIsModalOpen(true);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-luxury-ink/5 text-luxury-ink hover:bg-luxury-ink hover:text-white transition-all"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button 
                  onClick={() => handleDelete(t.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-luxury-ink/40 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative flex h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-[2rem] border border-luxury-border bg-white shadow-2xl sm:h-auto sm:rounded-[3rem]"
            >
              <div className="flex items-center justify-between border-b border-luxury-border px-6 py-5 sm:px-10 sm:py-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-luxury-ink/5 text-luxury-gold">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-light text-luxury-ink uppercase tracking-widest sm:text-xl">
                      {editingTestimonial ? 'Edit' : 'Add'} <span className="italic text-luxury-gold">Voice</span>
                    </h2>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-luxury-gray">Step {currentStep} of 2</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="rounded-full bg-luxury-ink/5 p-2 text-luxury-gray hover:text-luxury-ink transition-colors sm:p-3">
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 sm:p-10">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Client Name</label>
                        <input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full border-b border-luxury-border bg-transparent py-3 text-sm text-luxury-ink outline-none transition-all focus:border-luxury-gold"
                          placeholder="e.g. Julian Moretti"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Rating</label>
                        <div className="flex gap-3 sm:gap-4">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              onClick={() => setFormData({ ...formData, rating: num })}
                              className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-xl border transition-all sm:h-12 sm:w-12 sm:rounded-2xl",
                                formData.rating === num 
                                  ? "bg-luxury-ink border-luxury-ink text-luxury-gold shadow-lg" 
                                  : "border-luxury-border text-luxury-gray hover:border-luxury-gold"
                              )}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Testimonial Message</label>
                        <textarea
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={6}
                          className="w-full border-b border-luxury-border bg-transparent py-3 text-sm text-luxury-ink outline-none transition-all focus:border-luxury-gold resize-none italic"
                          placeholder="Share the client's experience..."
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="sticky bottom-0 z-10 border-t border-luxury-border bg-white/80 px-6 py-5 backdrop-blur-md sm:px-10 sm:py-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-luxury-gray hover:text-luxury-ink disabled:opacity-0 transition-all"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Back
                  </button>
                  
                  {currentStep < 2 ? (
                    <button
                      onClick={nextStep}
                      className="flex items-center gap-1.5 rounded-full bg-luxury-ink px-6 py-3 text-[9px] font-bold uppercase tracking-widest text-white hover:bg-luxury-gold transition-all"
                    >
                      Next Step <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 rounded-full bg-luxury-ink px-8 py-3 text-[9px] font-bold uppercase tracking-widest text-white hover:bg-luxury-gold transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                      Publish Voice
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageTestimonials;
