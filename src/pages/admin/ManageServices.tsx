import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Upload, 
  Loader2, 
  Image as ImageIcon, 
  Eye, 
  ChevronRight, 
  ChevronLeft,
  Check,
  Layout
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

type Service = Database['public']['Tables']['services']['Row'];

const ManageServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [hasPreviewed, setHasPreviewed] = useState(false);
  const [hasExploredPreview, setHasExploredPreview] = useState(false);
  const [previewStage, setPreviewStage] = useState<'list' | 'detail'>('list');
  const [showConfirm, setShowConfirm] = useState<'none' | 'step1' | 'step2'>('none');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    shortDescription: '',
    fullDescription: '',
    points: [] as string[],
    images: [] as string[],
    coreFeatures: [] as { title: string, desc: string }[],
    pricing: [] as { label: string, price: string, unit: string }[],
  });
  const [pointInput, setPointInput] = useState('');
  const [coreFeatureInput, setCoreFeatureInput] = useState({ title: '', desc: '' });
  const [pricingInput, setPricingInput] = useState({ label: '', price: '', unit: '' });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (isPreviewOpen || isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPreviewOpen, isModalOpen]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
      const newPreviewUrls = files.map((file: File) => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `services/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('project-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const addPoint = () => {
    if (pointInput.trim()) {
      setFormData({ ...formData, points: [...formData.points, pointInput.trim()] });
      setPointInput('');
    }
  };

  const removePoint = (index: number) => {
    setFormData({ ...formData, points: formData.points.filter((_, i) => i !== index) });
  };

  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  const addCoreFeature = () => {
    if (coreFeatureInput.title.trim() && coreFeatureInput.desc.trim()) {
      setFormData({ ...formData, coreFeatures: [...formData.coreFeatures, { ...coreFeatureInput }] });
      setCoreFeatureInput({ title: '', desc: '' });
    }
  };

  const removeCoreFeature = (index: number) => {
    setFormData({ ...formData, coreFeatures: formData.coreFeatures.filter((_, i) => i !== index) });
  };

  const addPricing = () => {
    if (pricingInput.label.trim() && pricingInput.price.trim()) {
      setFormData({ ...formData, pricing: [...formData.pricing, { ...pricingInput }] });
      setPricingInput({ label: '', price: '', unit: '' });
    }
  };

  const removePricing = (index: number) => {
    setFormData({ ...formData, pricing: formData.pricing.filter((_, i) => i !== index) });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.shortDescription) newErrors.shortDescription = 'Short description is required';
    if (!formData.fullDescription) newErrors.fullDescription = 'Full description is required';
    if (formData.points.length === 0) newErrors.points = 'At least one feature is required';
    if (previewUrls.length === 0 && formData.images.length === 0) newErrors.image = 'At least one image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = () => {
    if (validate()) {
      setHasPreviewed(true);
      setHasExploredPreview(false);
      setPreviewStage('list');
      setIsPreviewOpen(true);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleStartPublish = () => {
    if (!hasPreviewed) {
      toast.error('Please check preview');
      return;
    }
    if (!hasExploredPreview) {
      toast.error('Please click "Explore More" in preview to see full details');
      return;
    }
    setShowConfirm('step1');
  };

  const handleConfirmStep1 = () => setShowConfirm('step2');
  const handleConfirmStep2 = async () => {
    setShowConfirm('none');
    await handleSubmit();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let uploadedUrls: string[] = [];
      
      if (selectedFiles.length > 0) {
        toast.loading('Uploading images...', { id: 'upload-images' });
        const uploadPromises = selectedFiles.map(file => uploadFile(file));
        uploadedUrls = await Promise.all(uploadPromises);
        toast.success('Images uploaded', { id: 'upload-images' });
      }

      const allImages = [...formData.images, ...uploadedUrls];
      const mainImageUrl = allImages.length > 0 ? allImages[0] : '';

      const payload = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.fullDescription,
        short_description: formData.shortDescription,
        image_url: mainImageUrl,
        images: allImages,
        points: formData.points,
        core_features: formData.coreFeatures as any,
        pricing: formData.pricing as any,
      };

      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(payload)
          .eq('id', editingService.id);
        
        if (error) throw error;
        toast.success('Service updated successfully');
      } else {
        const { error } = await supabase
          .from('services')
          .insert([payload]);
        
        if (error) throw error;
        toast.success('Service published successfully');
      }

      setIsModalOpen(false);
      resetForm();
      fetchServices();
    } catch (error: any) {
      console.error('Error submitting service:', error);
      toast.error(error.message || 'Failed to save service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = React.useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const { error } = await supabase
          .from('services')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        toast.success('Service deleted successfully');
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.error('Failed to delete service');
      }
    }
  }, []);

  const resetForm = () => {
    setEditingService(null);
    setFormData({ 
      title: '', 
      subtitle: '',
      shortDescription: '', 
      fullDescription: '', 
      points: [], 
      images: [],
      coreFeatures: [], 
      pricing: [], 
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setCurrentStep(1);
    setHasPreviewed(false);
    setHasExploredPreview(false);
    setPreviewStage('list');
    setShowConfirm('none');
    setErrors({});
  };

  const nextStep = () => {
    if (currentStep === 1) {
      const step1Errors: Record<string, string> = {};
      if (!formData.title) step1Errors.title = 'Title is required';
      if (!formData.shortDescription) step1Errors.shortDescription = 'Short description is required';
      
      if (Object.keys(step1Errors).length > 0) {
        setErrors(step1Errors);
        toast.error('Please fill in all required fields');
        return;
      }
    } else if (currentStep === 2) {
      const step2Errors: Record<string, string> = {};
      if (!formData.fullDescription) step2Errors.fullDescription = 'Full description is required';
      if (formData.points.length === 0) step2Errors.points = 'At least one feature is required';
      
      if (Object.keys(step2Errors).length > 0) {
        setErrors(step2Errors);
        toast.error('Please fill in all required fields');
        return;
      }
    }
    setErrors({});
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleEdit = React.useCallback((service: Service) => {
    setEditingService(service);
    setFormData({ 
      title: service.title, 
      subtitle: service.subtitle || '',
      shortDescription: service.short_description || '', 
      fullDescription: service.description, 
      points: service.points || [], 
      images: service.images || [],
      coreFeatures: (service.core_features as any) || [],
      pricing: (service.pricing as any) || [],
    });
    setPreviewUrls([]);
    setIsModalOpen(true);
  }, []);

  const handlePreviewClick = React.useCallback((service: Service) => {
    setFormData({ 
      title: service.title, 
      subtitle: service.subtitle || '',
      shortDescription: service.short_description || '', 
      fullDescription: service.description, 
      points: service.points || [], 
      images: service.images || [],
      coreFeatures: (service.core_features as any) || [],
      pricing: (service.pricing as any) || [],
    });
    setPreviewUrls([]);
    setIsPreviewOpen(true);
  }, []);

  const memoizedServicesGrid = React.useMemo(() => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <div key={service.id} className="group relative overflow-hidden rounded-3xl border border-luxury-border bg-white p-4 transition-all hover:border-luxury-gold hover:shadow-md">
          <div className="relative mb-4 h-40 overflow-hidden rounded-2xl">
            <img src={service.image_url} alt={service.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
              <button 
                onClick={() => handleEdit(service)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-luxury-ink shadow-sm backdrop-blur-sm hover:bg-luxury-ink hover:text-white transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={() => handleDelete(service.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm backdrop-blur-sm hover:bg-red-500 hover:text-white transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="absolute bottom-3 left-3">
              <span className="text-[7px] font-bold uppercase tracking-widest bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-sm">Active</span>
            </div>
          </div>
          <h3 className="font-serif text-lg font-medium text-luxury-ink">{service.title}</h3>
          <p className="mt-2 text-[10px] font-light text-luxury-gray line-clamp-2 leading-relaxed">{service.description}</p>
          
          <button 
            onClick={() => handlePreviewClick(service)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-luxury-border py-2.5 text-[8px] font-bold uppercase tracking-widest text-luxury-ink transition-all hover:bg-luxury-ink hover:text-white"
          >
            <Eye className="h-3 w-3" /> Preview
          </button>
        </div>
      ))}
    </div>
  ), [services, handleEdit, handlePreviewClick, handleDelete]);

  const seedInitialData = async () => {
    const huecraftServices = [
      {
        title: 'Interior Painting',
        subtitle: 'Elevated living spaces',
        description: 'Premium interior solutions designed for durability and aesthetic excellence.',
        short_description: 'Premium interior solutions designed for durability and aesthetic excellence.',
        image_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=1200',
        images: [
          'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1562663474-6cbb3fee1c77?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1615873968403-89e068628265?auto=format&fit=crop&q=80&w=1200'
        ],
        points: ['Precision application', 'Long-lasting durability', 'Low-VOC materials', 'Clean execution'],
        core_features: [
          { title: 'Surface Prep', desc: 'Thorough cleaning and sanding for optimal adhesion.' },
          { title: 'Premium Paint', desc: 'We use only the highest quality, low-VOC paints.' }
        ],
        pricing: [
          { label: 'Standard Room', price: '$450', unit: 'starting' },
          { label: 'Large Hall', price: '$850', unit: 'starting' }
        ]
      },
      {
        title: 'Exterior Painting',
        subtitle: 'Weather-resistant elegance',
        description: 'Protect and beautify your home’s exterior with our professional coatings.',
        short_description: 'Protect and beautify your home’s exterior with our professional coatings.',
        image_url: 'https://images.unsplash.com/photo-1518605336347-fb8396099d22?auto=format&fit=crop&q=80&w=1200',
        images: [
          'https://images.unsplash.com/photo-1518605336347-fb8396099d22?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&q=80&w=1200'
        ],
        points: ['Weather resistance', 'Surface protection', 'Climate-resistant solutions', 'Curb appeal enhancement'],
        core_features: [
          { title: 'Power Wash', desc: 'Removing dirt and mildew before painting.' },
          { title: 'Caulking', desc: 'Sealing gaps to prevent water intrusion.' }
        ],
        pricing: [
          { label: 'Single Story', price: '$2,500', unit: 'starting' },
          { label: 'Two Story', price: '$4,500', unit: 'starting' }
        ]
      }
    ];

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('services').insert(huecraftServices);
      if (error) throw error;
      toast.success('Initial services seeded successfully');
      fetchServices();
    } catch (error) {
      console.error('Error seeding services:', error);
      toast.error('Failed to seed services');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-2xl font-light text-luxury-ink uppercase tracking-widest">
            Manage <span className="italic text-luxury-gold">Services</span>
          </h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-gray">
            Define your artisan offerings
          </p>
        </div>
        <div className="flex gap-3">
          {services.length === 0 && !loading && (
            <button
              onClick={seedInitialData}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-full border border-luxury-gold px-6 py-3 text-[9px] font-bold uppercase tracking-widest text-luxury-gold transition-all hover:bg-luxury-gold hover:text-white"
            >
              Seed Initial Data
            </button>
          )}
          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="group flex items-center gap-2 rounded-full bg-luxury-ink px-6 py-3 text-[9px] font-bold uppercase tracking-widest text-white transition-all hover:bg-luxury-gold hover:shadow-lg"
          >
            <Plus className="h-3.5 w-3.5" /> Add Service
          </button>
        </div>
      </div>

      {/* Services Grid */}
      {memoizedServicesGrid}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-luxury-ink/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative flex h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-luxury-border bg-white shadow-2xl sm:rounded-[3rem]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-luxury-border px-6 py-5 sm:px-10 sm:py-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-luxury-ink/5 text-luxury-gold">
                    <Layout className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-light text-luxury-ink uppercase tracking-widest sm:text-2xl">
                      {editingService ? 'Edit' : 'Add'} <span className="italic text-luxury-gold">Service</span>
                    </h2>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((s) => (
                          <div 
                            key={s} 
                            className={cn(
                              "h-1 w-4 rounded-full transition-all",
                              currentStep >= s ? "bg-luxury-gold" : "bg-luxury-ink/10"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-[8px] font-bold uppercase tracking-widest text-luxury-gray">Step {currentStep} of 3</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="rounded-full bg-luxury-ink/5 p-2 text-luxury-gray hover:text-luxury-ink transition-colors sm:p-3">
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-10 sm:py-8 no-scrollbar">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-8 max-w-2xl mx-auto"
                    >
                      {/* Section 1: Basic Info */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-luxury-gold text-[10px] font-bold text-white">1</span>
                          <h3 className="text-[10px] font-bold uppercase tracking-widest text-luxury-ink">Basic Information</h3>
                        </div>
                          <div className="grid gap-6">
                            <div className="space-y-2">
                              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Service Title</label>
                              <input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className={cn(
                                  "w-full border-b bg-transparent py-3 text-sm md:text-base text-luxury-ink outline-none transition-all focus:border-luxury-gold",
                                  errors.title ? "border-red-500" : "border-luxury-border"
                                )}
                                placeholder="e.g. Premium Interior Finish"
                              />
                              {errors.title && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest">{errors.title}</p>}
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Subtitle</label>
                              <input
                                value={formData.subtitle}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                className="w-full border-b border-luxury-border bg-transparent py-3 text-sm md:text-base text-luxury-ink outline-none transition-all focus:border-luxury-gold"
                                placeholder="e.g. Elevated living spaces"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Short Description</label>
                              <textarea
                                value={formData.shortDescription}
                                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                rows={2}
                                className={cn(
                                  "w-full border-b bg-transparent py-3 text-sm md:text-base text-luxury-ink outline-none transition-all focus:border-luxury-gold resize-none",
                                  errors.shortDescription ? "border-red-500" : "border-luxury-border"
                                )}
                                placeholder="A brief summary for the list view..."
                              />
                              {errors.shortDescription && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest">{errors.shortDescription}</p>}
                            </div>
                          </div>
                      </div>

                      {/* Section 2: Detailed Info */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-luxury-gold text-[10px] font-bold text-white">2</span>
                          <h3 className="text-[10px] font-bold uppercase tracking-widest text-luxury-ink">Detailed Information</h3>
                        </div>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Full Description</label>
                            <textarea
                              value={formData.fullDescription}
                              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                              rows={4}
                              className={cn(
                                "w-full border-b bg-transparent py-3 text-sm md:text-base text-luxury-ink outline-none transition-all focus:border-luxury-gold resize-none",
                                errors.fullDescription ? "border-red-500" : "border-luxury-border"
                              )}
                              placeholder="Detailed explanation of the service..."
                            />
                            {errors.fullDescription && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest">{errors.fullDescription}</p>}
                          </div>
                          <div className="space-y-3">
                            <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Key Features / Highlights</label>
                            <div className="flex gap-2">
                              <input
                                value={pointInput}
                                onChange={(e) => setPointInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addPoint()}
                                className="flex-1 border-b border-luxury-border bg-transparent py-2 text-sm md:text-base text-luxury-ink outline-none transition-all focus:border-luxury-gold"
                                placeholder="Add a feature..."
                              />
                              <button onClick={addPoint} className="rounded-lg bg-luxury-ink px-4 text-white hover:bg-luxury-gold transition-colors flex items-center justify-center">
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                              {formData.points.map((point, i) => (
                                <span key={i} className="flex items-center gap-1.5 rounded-full bg-luxury-ink/5 px-3 py-1.5 text-[9px] font-medium text-luxury-ink border border-luxury-border">
                                  {point}
                                  <button onClick={() => removePoint(i)} className="text-red-500 hover:text-red-700 transition-colors">
                                    <X className="h-3 w-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                            {errors.features && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest">{errors.features}</p>}
                          </div>
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
                      className="space-y-8 max-w-2xl mx-auto"
                    >
                      {/* Section 3: Core Features */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-luxury-gold text-[10px] font-bold text-white">3</span>
                          <h3 className="text-[10px] font-bold uppercase tracking-widest text-luxury-ink">Core Features</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <input
                              value={coreFeatureInput.title}
                              onChange={(e) => setCoreFeatureInput({ ...coreFeatureInput, title: e.target.value })}
                              className="w-full border-b border-luxury-border bg-transparent py-2 text-sm md:text-base text-luxury-ink outline-none transition-all focus:border-luxury-gold"
                              placeholder="Feature Title"
                            />
                            <div className="flex gap-2">
                              <input
                                value={coreFeatureInput.desc}
                                onChange={(e) => setCoreFeatureInput({ ...coreFeatureInput, desc: e.target.value })}
                                onKeyPress={(e) => e.key === 'Enter' && addCoreFeature()}
                                className="flex-1 border-b border-luxury-border bg-transparent py-2 text-sm md:text-base text-luxury-ink outline-none transition-all focus:border-luxury-gold"
                                placeholder="Feature Description"
                              />
                              <button onClick={addCoreFeature} className="rounded-lg bg-luxury-ink px-4 text-white hover:bg-luxury-gold transition-colors flex items-center justify-center">
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {formData.coreFeatures.map((feature, i) => (
                              <div key={i} className="relative rounded-xl border border-luxury-border bg-luxury-ink/5 p-4 pr-10">
                                <h4 className="text-sm font-bold text-luxury-ink">{feature.title}</h4>
                                <p className="text-xs text-luxury-gray mt-1">{feature.desc}</p>
                                <button onClick={() => removeCoreFeature(i)} className="absolute right-3 top-3 text-red-500 hover:text-red-700 transition-colors">
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Section 4: Investment / Pricing */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-luxury-gold text-[10px] font-bold text-white">4</span>
                          <h3 className="text-[10px] font-bold uppercase tracking-widest text-luxury-ink">Investment / Pricing</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="grid gap-3 sm:grid-cols-3">
                            <input
                              value={pricingInput.label}
                              onChange={(e) => setPricingInput({ ...pricingInput, label: e.target.value })}
                              className="w-full border-b border-luxury-border bg-transparent py-2 text-sm md:text-base text-luxury-ink outline-none transition-all focus:border-luxury-gold"
                              placeholder="Label (e.g. Starting at)"
                            />
                            <input
                              value={pricingInput.price}
                              onChange={(e) => setPricingInput({ ...pricingInput, price: e.target.value })}
                              className="w-full border-b border-luxury-border bg-transparent py-2 text-sm md:text-base text-luxury-ink outline-none transition-all focus:border-luxury-gold"
                              placeholder="Price (e.g. $5,000)"
                            />
                            <div className="flex gap-2">
                              <input
                                value={pricingInput.unit}
                                onChange={(e) => setPricingInput({ ...pricingInput, unit: e.target.value })}
                                onKeyPress={(e) => e.key === 'Enter' && addPricing()}
                                className="flex-1 border-b border-luxury-border bg-transparent py-2 text-sm md:text-base text-luxury-ink outline-none transition-all focus:border-luxury-gold"
                                placeholder="Unit (e.g. /project)"
                              />
                              <button onClick={addPricing} className="rounded-lg bg-luxury-ink px-4 text-white hover:bg-luxury-gold transition-colors flex items-center justify-center">
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {formData.pricing.map((item, i) => (
                              <div key={i} className="flex items-center justify-between rounded-xl border border-luxury-border bg-luxury-ink/5 p-4">
                                <div className="flex items-baseline gap-3">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-gray">{item.label}</span>
                                  <span className="text-lg font-serif font-bold text-luxury-gold">{item.price}</span>
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-gray/60">{item.unit}</span>
                                </div>
                                <button onClick={() => removePricing(i)} className="text-red-500 hover:text-red-700 transition-colors">
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8 max-w-2xl mx-auto"
                    >
                      {/* Section 5: Media */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-luxury-gold text-[10px] font-bold text-white">5</span>
                          <h3 className="text-[10px] font-bold uppercase tracking-widest text-luxury-ink">Media & Visuals</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Upload Images (First image will be the main image)</label>
                          
                          <div className={cn(
                            "relative flex h-32 sm:h-40 items-center justify-center overflow-hidden rounded-[2rem] border-2 border-dashed transition-all hover:border-luxury-gold group",
                            errors.image ? "border-red-500 bg-red-50/10" : "border-luxury-border bg-luxury-ink/[0.01]"
                          )}>
                            {previewUrls[0] || formData.images[0] ? (
                              <img src={previewUrls[0] || formData.images[0]} className="h-full w-full object-cover" />
                            ) : (
                              <div className="text-center">
                                <ImageIcon className="mx-auto h-8 w-8 text-luxury-gold opacity-30" />
                                <p className="mt-3 text-[9px] font-bold uppercase tracking-widest text-luxury-gray">Click to upload images</p>
                                <p className="mt-1 text-[7px] text-luxury-gray/60 uppercase tracking-widest">You can select multiple files</p>
                              </div>
                            )}
                            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 cursor-pointer opacity-0 z-10" />
                          </div>
                          {errors.image && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest">{errors.image}</p>}

                          {/* Existing Images (from edit) */}
                          {formData.images.length > 0 && (
                            <div className="mt-4">
                              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-gray mb-2">Current Images</p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {formData.images.map((img, i) => (
                                  <div key={`existing-${i}`} className="relative group/img-item h-24 overflow-hidden rounded-xl border border-luxury-border">
                                    <img src={img} className="h-full w-full object-cover" />
                                    <button 
                                      type="button"
                                      onClick={() => removeImage(i)}
                                      className="absolute top-1 right-1 h-6 w-6 flex items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover/img-item:opacity-100 transition-opacity z-20"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Newly Selected Images */}
                          {previewUrls.length > 0 && (
                            <div className="mt-4">
                              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-gray mb-2">New Images to Upload</p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {previewUrls.map((url, i) => (
                                  <div key={`new-${i}`} className="relative group/img-item h-24 overflow-hidden rounded-xl border border-luxury-border">
                                    <img src={url} className="h-full w-full object-cover" />
                                    <button 
                                      type="button"
                                      onClick={() => removeSelectedFile(i)}
                                      className="absolute top-1 right-1 h-6 w-6 flex items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover/img-item:opacity-100 transition-opacity z-20"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sticky Action Bar */}
              <div className="sticky bottom-0 z-10 border-t border-luxury-border bg-white/80 p-6 backdrop-blur-md sm:px-10 sm:py-8">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex gap-2">
                    {currentStep > 1 && (
                      <button
                        onClick={prevStep}
                        className="flex items-center gap-2 rounded-full border border-luxury-border px-6 py-3 text-[9px] font-bold uppercase tracking-widest text-luxury-ink hover:bg-luxury-ink/5 transition-all"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" /> Back
                      </button>
                    )}
                    {currentStep < 3 && (
                      <button
                        onClick={nextStep}
                        className="flex items-center gap-2 rounded-full bg-luxury-ink px-8 py-3 text-[9px] font-bold uppercase tracking-widest text-white hover:bg-luxury-gold transition-all"
                      >
                        Next Step <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handlePreview}
                      className={cn(
                        "flex items-center gap-2 rounded-full px-8 py-3 text-[9px] font-bold uppercase tracking-widest transition-all",
                        hasPreviewed 
                          ? "bg-emerald-500 text-white" 
                          : "bg-white border border-luxury-ink text-luxury-ink hover:bg-luxury-ink hover:text-white"
                      )}
                    >
                      <Eye className="h-3.5 w-3.5" /> 
                      {hasPreviewed ? 'Previewed' : 'Preview First'}
                    </button>
                    
                    <button
                      onClick={handleStartPublish}
                      disabled={isSubmitting}
                      className={cn(
                        "flex items-center gap-2 rounded-full px-10 py-3 text-[9px] font-bold uppercase tracking-widest text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                        hasPreviewed ? "bg-luxury-ink hover:bg-luxury-gold shadow-lg" : "bg-luxury-gray hover:bg-luxury-gray/80"
                      )}
                    >
                      {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                      {editingService ? 'Update' : 'Publish'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modals */}
      <AnimatePresence>
        {showConfirm !== 'none' && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-luxury-ink/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm rounded-[2.5rem] bg-white p-8 text-center shadow-2xl"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-luxury-gold/10 text-luxury-gold">
                <Check className="h-8 w-8" />
              </div>
              
              <h3 className="mb-2 font-serif text-2xl font-light text-luxury-ink uppercase tracking-widest">
                {showConfirm === 'step1' ? 'Confirm' : 'Final'} <span className="italic text-luxury-gold">Step</span>
              </h3>
              
              <p className="mb-8 text-[10px] font-medium uppercase tracking-widest text-luxury-gray leading-relaxed">
                {showConfirm === 'step1' 
                  ? 'Are you sure you want to publish this service?' 
                  : 'This will be visible on the website. Confirm?'}
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={showConfirm === 'step1' ? handleConfirmStep1 : handleConfirmStep2}
                  className="w-full rounded-full bg-luxury-ink py-4 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-luxury-gold transition-all"
                >
                  {showConfirm === 'step1' ? 'Yes, Continue' : 'Yes, Publish Now'}
                </button>
                <button
                  onClick={() => setShowConfirm('none')}
                  className="w-full rounded-full border border-luxury-border py-4 text-[10px] font-bold uppercase tracking-widest text-luxury-gray hover:bg-luxury-ink/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[200] bg-white overflow-y-auto"
          >
            <div className="sticky top-0 z-50 flex items-center justify-between border-b border-luxury-border bg-white/80 px-10 py-6 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-gray">Preview Mode</span>
                <div className="h-1.5 w-1.5 rounded-full bg-luxury-gold animate-pulse"></div>
              </div>
              <button onClick={() => setIsPreviewOpen(false)} className="flex items-center gap-2 rounded-full bg-luxury-ink px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-luxury-gold transition-all">
                <X className="h-4 w-4" /> Exit Preview
              </button>
            </div>
            
            {/* Website-like Preview Content */}
            <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
              <AnimatePresence mode="wait">
                {previewStage === 'list' ? (
                  <motion.div
                    key="list-preview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col items-center max-w-2xl mx-auto"
                  >
                    <div className="w-full mb-8 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold mb-2 inline-block">Service Card Preview</span>
                      <p className="text-sm text-luxury-gray">This is how the service will appear on the main Services page.</p>
                    </div>

                    <div className="flex flex-col gap-2 group/service-card w-full">
                      {/* Service Label Above Image */}
                      <div className="flex items-center gap-4 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-luxury-gold/70">Service Preview</span>
                        <div className="h-[1px] w-20 bg-luxury-gold/20" />
                      </div>

                      {/* Image Block */}
                      <div className="relative overflow-hidden rounded-[2rem] shadow-2xl transition-transform duration-700 group-hover/service-card:scale-[1.02] aspect-[16/10]">
                        {(previewUrls[0] || formData.images[0]) ? (
                          <img src={previewUrls[0] || formData.images[0]} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-luxury-ink/5">
                            <ImageIcon className="h-16 w-16 text-luxury-gold opacity-20" />
                          </div>
                        )}
                      </div>

                      {/* Text Block */}
                      <div className="flex flex-col flex-grow mt-4">
                        <div className="space-y-2 mb-6">
                          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-luxury-blue-mid tracking-tighter leading-tight group-hover/service-card:text-luxury-gold transition-colors duration-500">
                            {formData.title || 'Service Title'}
                          </h2>
                          <p className="text-xs font-bold uppercase tracking-[0.3em] text-luxury-gold-muted leading-none">
                            {formData.shortDescription || 'Short description'}
                          </p>
                        </div>
                        
                        <p className="text-base font-light leading-relaxed text-luxury-gray mb-8 line-clamp-3">
                          {formData.fullDescription || 'Full description will appear here...'}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-10 flex-grow">
                          {formData.points.map((point, i) => (
                            <div key={i} className="flex items-center gap-3 group/point">
                              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-luxury-divider text-luxury-blue-mid group-hover/point:bg-luxury-gold group-hover/point:text-white group-hover/point:border-luxury-gold transition-all duration-500 shadow-premium-sm">
                                <Check className="h-3 w-3" />
                              </div>
                              <span className="text-[11px] font-bold uppercase tracking-widest text-luxury-blue-mid/80">{point}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-auto pt-6 border-t border-luxury-divider/50">
                          <button
                            onClick={() => {
                              setPreviewStage('detail');
                              setHasExploredPreview(true);
                            }}
                            className="relative group/btn flex items-center justify-center gap-4 overflow-hidden rounded-full bg-luxury-ink text-white px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.4em] w-fit transition-all duration-500 hover:bg-luxury-gold hover:shadow-2xl"
                          >
                            <span className="relative z-10">Explore More</span>
                            <ChevronRight className="relative z-10 h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="detail-preview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col items-start text-left flex-grow max-w-4xl mx-auto"
                  >
                    <div className="w-full mb-8 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.4em] text-luxury-gold">
                          Service Detail Preview
                        </span>
                      </div>
                      <button
                        onClick={() => setPreviewStage('list')}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-luxury-gray hover:text-luxury-ink transition-colors"
                      >
                        <ChevronLeft className="h-3 w-3" /> Back to Card
                      </button>
                    </div>

                    {/* Image */}
                    <div className="w-full mb-6 relative border-x border-t border-luxury-divider border-b-4 border-luxury-divider/50 rounded-[1.5rem] overflow-hidden shadow-xl">
                      {(previewUrls[0] || formData.images[0]) ? (
                        <img src={previewUrls[0] || formData.images[0]} className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover rounded-[1.5rem]" />
                      ) : (
                        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center bg-luxury-ink/5 rounded-[1.5rem]">
                          <ImageIcon className="h-20 w-20 text-luxury-gold opacity-20" />
                        </div>
                      )}
                    </div>

                    {/* Title & Subtitle */}
                    <div className="space-y-3 mb-6 w-full ml-1 md:ml-2">
                      <div className="space-y-2">
                        <h2 className="font-serif font-bold text-luxury-blue-mid tracking-tight text-2xl md:text-3xl lg:text-4xl">
                          {formData.title || 'Service Title'}
                        </h2>
                        <p className="text-xs md:text-sm font-medium italic text-luxury-gold tracking-wide line-clamp-2">
                          "{formData.shortDescription || 'Short description will appear here...'}"
                        </p>
                      </div>
                    </div>

                    {/* Description & Key Features */}
                    <div className="w-full ml-1 md:ml-2 flex flex-col flex-grow mb-12">
                      <p className="text-base md:text-lg font-light leading-relaxed text-luxury-gray mb-6">
                        {formData.fullDescription || 'Full service description will appear here...'}
                      </p>

                      {/* Key Features */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 w-full border-t border-luxury-divider/50 pt-4 text-left">
                        {formData.points.map((point, i) => (
                          <div key={i} className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium uppercase tracking-wider text-luxury-ink">
                            <div className="h-1 w-1 rounded-full bg-luxury-gold shadow-sm shrink-0" />
                            <span className="leading-tight">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Core Features */}
                    {formData.coreFeatures.length > 0 && (
                      <div className="w-full mb-12">
                        <div className="text-center mb-8">
                          <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-luxury-gold mb-2 inline-block">The Details</span>
                          <h2 className="text-2xl md:text-3xl font-serif font-bold text-luxury-ink tracking-tight">Core Features</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
                          {formData.coreFeatures.map((feature, i) => (
                            <div key={i} className="group p-4 bg-white rounded-xl border border-luxury-divider shadow-premium-sm hover:shadow-premium-md transition-all duration-500">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 rounded-lg bg-luxury-gold/5 flex items-center justify-center group-hover:bg-luxury-gold group-hover:text-white transition-colors duration-500">
                                  <div className="h-2 w-2 rounded-full bg-luxury-gold group-hover:bg-white" />
                                </div>
                                <h4 className="text-base font-bold text-luxury-ink tracking-tight">{feature.title}</h4>
                              </div>
                              <p className="text-sm font-light text-luxury-gray leading-relaxed">{feature.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pricing */}
                    {formData.pricing.length > 0 && (
                      <div className="w-full max-w-3xl mx-auto">
                        <div className="relative bg-white rounded-[2rem] p-6 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.08),0_20px_40px_rgba(0,0,0,0.04)] border border-gray-50 overflow-hidden group">
                          <div className="text-center mb-10">
                            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-luxury-gold mb-3 inline-block">Investment</span>
                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-luxury-ink">Pricing Structure</h2>
                          </div>
                          <div className="space-y-3">
                            {formData.pricing.map((item, i) => (
                              <div key={i} className="flex items-center justify-between p-5 bg-white rounded-xl border border-luxury-divider/30 group/item transition-all duration-300 hover:border-luxury-gold/20 hover:scale-[1.01]">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-gray">{item.label}</span>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xl font-serif font-bold text-luxury-gold">{item.price}</span>
                                  <span className="text-[9px] font-bold uppercase tracking-widest text-luxury-gray/60">{item.unit}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageServices;
