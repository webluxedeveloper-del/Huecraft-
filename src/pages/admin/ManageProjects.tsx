import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Loader2, 
  Image as ImageIcon, 
  Eye, 
  Check,
  Layout
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import BeforeAfterSlider from '../../components/BeforeAfterSlider';
import { secureLog, secureError } from '../../lib/security';

type Project = Database['public']['Tables']['projects']['Row'] & { 
  before_image_url?: string; 
  after_image_url?: string;
  subtitle?: string;
  tags?: string[];
  features?: string[];
};

const ManageProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [hasPreviewed, setHasPreviewed] = useState(false);
  const [showConfirm, setShowConfirm] = useState<'none' | 'step1' | 'step2'>('none');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    tags: [] as string[],
    features: [] as string[],
    category: 'Residential',
  });

  const [tagInput, setTagInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  const [previews, setPreviews] = useState({
    before: '',
    after: '',
  });

  const [selectedFiles, setSelectedFiles] = useState<{
    before: File | null;
    after: File | null;
  }>({
    before: null,
    after: null,
  });

  useEffect(() => {
    fetchProjects();
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

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviews(prev => ({ ...prev, [type]: url }));
      setSelectedFiles(prev => ({ ...prev, [type]: file }));
      // Don't set blob URL in formData, we'll upload it on submit
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== index) });
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({ ...formData, features: [...formData.features, featureInput.trim()] });
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!previews.before) newErrors.beforeImage = 'Before image is required';
    if (!previews.after) newErrors.afterImage = 'After image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = () => {
    if (validate()) {
      setHasPreviewed(true);
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
    setShowConfirm('step1');
  };

  const handleConfirmStep1 = () => setShowConfirm('step2');
  const handleConfirmStep2 = async () => {
    setShowConfirm('none');
    await handleSubmit();
  };

  const uploadFile = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let beforeUrl = editingProject?.before_image_url || '';
      let afterUrl = editingProject?.after_image_url || '';

      // Upload files if selected
      if (selectedFiles.before) {
        toast.loading('Uploading before image...', { id: 'upload-before' });
        beforeUrl = await uploadFile(selectedFiles.before, 'before');
        toast.success('Before image uploaded', { id: 'upload-before' });
      }

      if (selectedFiles.after) {
        toast.loading('Uploading after image...', { id: 'upload-after' });
        afterUrl = await uploadFile(selectedFiles.after, 'after');
        toast.success('After image uploaded', { id: 'upload-after' });
      }

      const payload = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        tags: formData.tags,
        features: formData.features,
        before_image_url: beforeUrl,
        after_image_url: afterUrl,
        image_url: afterUrl || beforeUrl || '', // Ensure image_url is not empty
        category: formData.category,
      };

      secureLog('Submitting project payload:', payload);

      if (editingProject) {
        const { error, data } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editingProject.id)
          .select();
        
        if (error) {
          throw error;
        }
        secureLog('Project updated successfully:', data);
        toast.success('Project updated successfully');
      } else {
        const { error, data } = await supabase
          .from('projects')
          .insert([payload])
          .select();
        
        if (error) {
          throw error;
        }
        secureLog('Project inserted successfully:', data);
        toast.success('Project published successfully');
      }

      setIsModalOpen(false);
      resetForm();
      fetchProjects();
    } catch (error: any) {
      toast.error(secureError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        toast.success('Project deleted successfully');
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({ 
      title: '', 
      subtitle: '',
      description: '', 
      tags: [],
      features: [],
      category: 'Residential',
    });
    setPreviews({ before: '', after: '' });
    setSelectedFiles({ before: null, after: null });
    setHasPreviewed(false);
    setShowConfirm('none');
    setErrors({});
  };

  const seedInitialData = async () => {
    const huecraftProjects = [
      {
        title: 'Modern Interior Transformation',
        subtitle: 'Client wanted a modern and durable finish for their open-concept living area.',
        description: 'We transformed this space with precision surface preparation and premium coatings to achieve a long-lasting, refined finish.',
        tags: ['Long-lasting finish', 'Premium coating', 'Eco-friendly'],
        features: [
          'Surface preparation',
          'Premium coating applied',
          'Smooth finish',
          'Long-lasting durability'
        ],
        before_image_url: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=1200',
        after_image_url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
        image_url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
        category: 'Interior'
      },
      {
        title: 'Coastal Exterior Revitalization',
        subtitle: 'Outdated exterior transformed into a premium, weather-resistant coastal masterpiece.',
        description: 'A complete exterior overhaul using weather-resistant premium paints designed to withstand harsh coastal elements while maintaining aesthetic brilliance.',
        tags: ['Weather resistant', 'UV protection', 'Coastal grade'],
        features: [
          'Weather-shield technology',
          'UV resistant pigments',
          'Detailed trim work',
          'Eco-friendly materials'
        ],
        before_image_url: 'https://images.unsplash.com/photo-1505843513577-22bb7d21ef45?auto=format&fit=crop&q=80&w=1200',
        after_image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
        image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
        category: 'Exterior'
      }
    ];

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('projects').insert(huecraftProjects);
      if (error) throw error;
      toast.success('Initial projects seeded successfully');
      fetchProjects();
    } catch (error) {
      console.error('Error seeding projects:', error);
      toast.error('Failed to seed projects');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-2xl font-light text-luxury-ink uppercase tracking-widest">
            Manage <span className="italic text-luxury-gold">Projects</span>
          </h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-gray">
            Showcase your finest craftsmanship
          </p>
        </div>
        <div className="flex gap-3">
          {projects.length === 0 && !loading && (
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
            <Plus className="h-3.5 w-3.5" /> Add Project
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="group relative overflow-hidden rounded-3xl border border-luxury-border bg-white p-4 transition-all hover:border-luxury-gold hover:shadow-md">
            <div className="relative mb-4 h-48 overflow-hidden rounded-2xl">
              <img src={project.image_url || project.after_image_url} alt={project.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button 
                  onClick={() => {
                    setEditingProject(project);
                    setFormData({ 
                      title: project.title, 
                      subtitle: project.subtitle || '',
                      description: project.description, 
                      tags: project.tags || [],
                      features: project.features || [],
                      category: project.category || 'Residential',
                    });
                    setPreviews({ 
                      before: project.before_image_url || '', 
                      after: project.after_image_url || project.image_url || '' 
                    });
                    setIsModalOpen(true);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-luxury-ink shadow-sm backdrop-blur-sm hover:bg-luxury-ink hover:text-white transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={() => handleDelete(project.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm backdrop-blur-sm hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <h3 className="font-serif text-lg font-medium text-luxury-ink">{project.title}</h3>
            <p className="mt-1 text-xs text-luxury-gray line-clamp-2">{project.description}</p>
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
                      {editingProject ? 'Edit' : 'Add'} <span className="italic text-luxury-gold">Project</span>
                    </h2>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="rounded-full bg-luxury-ink/5 p-2 text-luxury-gray hover:text-luxury-ink transition-colors sm:p-3">
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              {/* Modal Content - Single Scrollable Form */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-10">
                
                {/* Section 1: Project Header */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-luxury-ink border-b border-luxury-border pb-2">1. Project Header</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Project Title</label>
                      <input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className={cn(
                          "w-full rounded-xl border bg-luxury-ink/[0.02] px-4 py-3 text-sm text-luxury-ink outline-none transition-all focus:border-luxury-gold focus:bg-white",
                          errors.title ? "border-red-500" : "border-luxury-border"
                        )}
                        placeholder="e.g. Modern Penthouse Renovation"
                      />
                      {errors.title && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest">{errors.title}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-xl border border-luxury-border bg-luxury-ink/[0.02] px-4 py-3 text-sm text-luxury-ink outline-none transition-all focus:border-luxury-gold focus:bg-white appearance-none cursor-pointer"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Restoration">Restoration</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Subtitle (Short Description)</label>
                      <input
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        className="w-full rounded-xl border border-luxury-border bg-luxury-ink/[0.02] px-4 py-3 text-sm text-luxury-ink outline-none transition-all focus:border-luxury-gold focus:bg-white"
                        placeholder="e.g. Client wanted a modern and durable finish..."
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Highlight Tags */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-luxury-ink border-b border-luxury-border pb-2">2. Highlight Tags / Keywords</h3>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        className="flex-1 rounded-xl border border-luxury-border bg-luxury-ink/[0.02] px-4 py-3 text-sm text-luxury-ink outline-none transition-all focus:border-luxury-gold focus:bg-white"
                        placeholder="e.g. Premium Coating, Eco-Friendly..."
                      />
                      <button onClick={addTag} className="rounded-xl bg-luxury-ink px-4 text-white hover:bg-luxury-gold transition-colors">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, i) => (
                        <span key={i} className="flex items-center gap-1.5 rounded-full bg-luxury-ink/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-luxury-ink">
                          {tag}
                          <button onClick={() => removeTag(i)} className="text-red-500 hover:text-red-700">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 3: Description */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-luxury-ink border-b border-luxury-border pb-2">3. Description</h3>
                  <div className="space-y-2">
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className={cn(
                        "w-full rounded-xl border bg-luxury-ink/[0.02] px-4 py-3 text-sm text-luxury-ink outline-none transition-all focus:border-luxury-gold focus:bg-white resize-none",
                        errors.description ? "border-red-500" : "border-luxury-border"
                      )}
                      placeholder="Full paragraph description of the project..."
                    />
                    {errors.description && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest">{errors.description}</p>}
                  </div>
                </div>

                {/* Section 4: Key Points / Features */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-luxury-ink border-b border-luxury-border pb-2">4. Key Points / Features</h3>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                        className="flex-1 rounded-xl border border-luxury-border bg-luxury-ink/[0.02] px-4 py-3 text-sm text-luxury-ink outline-none transition-all focus:border-luxury-gold focus:bg-white"
                        placeholder="e.g. Surface Preparation, Smooth Finish..."
                      />
                      <button onClick={addFeature} className="rounded-xl bg-luxury-ink px-4 text-white hover:bg-luxury-gold transition-colors">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.features.map((feature, i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl border border-luxury-border bg-white px-4 py-2 shadow-sm">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-luxury-gold" />
                            <span className="text-xs font-medium text-luxury-ink">{feature}</span>
                          </div>
                          <button onClick={() => removeFeature(i)} className="text-red-500 hover:text-red-700 p-1">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                 {/* Section 5: Before & After Images */}
                 <div className="space-y-4">
                   <h3 className="text-[10px] font-bold uppercase tracking-widest text-luxury-ink border-b border-luxury-border pb-2">5. Before & After Images</h3>
                   <div className="grid gap-4 sm:grid-cols-2">
                     <div className="space-y-2">
                       <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Before Image</label>
                       <div className={cn(
                         "relative flex h-32 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all hover:border-luxury-gold group",
                         errors.beforeImage ? "border-red-500 bg-red-50/10" : "border-luxury-border bg-luxury-ink/[0.02]"
                       )}>
                         {previews.before ? (
                           <img src={previews.before} className="h-full w-full object-cover" />
                         ) : (
                           <div className="flex flex-col items-center gap-2">
                             <ImageIcon className="h-6 w-6 text-luxury-gold opacity-50" />
                             <span className="text-[8px] font-bold uppercase tracking-widest text-luxury-gray">Upload Before</span>
                           </div>
                         )}
                         <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'before')} className="absolute inset-0 cursor-pointer opacity-0 z-10" />
                       </div>
                       {errors.beforeImage && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest">{errors.beforeImage}</p>}
                     </div>
                     <div className="space-y-2">
                       <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-gray">After Image</label>
                       <div className={cn(
                         "relative flex h-32 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all hover:border-luxury-gold group",
                         errors.afterImage ? "border-red-500 bg-red-50/10" : "border-luxury-border bg-luxury-ink/[0.02]"
                       )}>
                         {previews.after ? (
                           <img src={previews.after} className="h-full w-full object-cover" />
                         ) : (
                           <div className="flex flex-col items-center gap-2">
                             <ImageIcon className="h-6 w-6 text-luxury-gold opacity-50" />
                             <span className="text-[8px] font-bold uppercase tracking-widest text-luxury-gray">Upload After</span>
                           </div>
                         )}
                         <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'after')} className="absolute inset-0 cursor-pointer opacity-0 z-10" />
                       </div>
                       {errors.afterImage && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest">{errors.afterImage}</p>}
                     </div>
                   </div>
                  
                  {/* Small side-by-side preview inside admin */}
                  {previews.before && previews.after && (
                    <div className="mt-4 rounded-2xl border border-luxury-border p-2 bg-luxury-ink/[0.02]">
                      <p className="text-[8px] font-bold uppercase tracking-widest text-luxury-gray mb-2 text-center">Slider Preview</p>
                      <div className="h-32 rounded-xl overflow-hidden relative">
                        <BeforeAfterSlider 
                          beforeImage={previews.before} 
                          afterImage={previews.after} 
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Sticky Action Bar */}
              <div className="sticky bottom-0 z-10 border-t border-luxury-border bg-white/90 p-4 backdrop-blur-md sm:px-8 sm:py-6">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[9px] font-medium text-luxury-gray hidden sm:block">
                    {hasPreviewed ? 'Ready to publish.' : 'Preview required before publishing.'}
                  </p>
                  <div className="flex w-full sm:w-auto gap-3">
                    <button
                      onClick={handlePreview}
                      className={cn(
                        "flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-all",
                        hasPreviewed 
                          ? "bg-emerald-500 text-white shadow-md" 
                          : "bg-white border-2 border-luxury-ink text-luxury-ink hover:bg-luxury-ink hover:text-white"
                      )}
                    >
                      <Eye className="h-4 w-4" /> 
                      {hasPreviewed ? 'Previewed' : 'Preview Project'}
                    </button>
                    
                    <button
                      onClick={handleStartPublish}
                      disabled={isSubmitting}
                      className={cn(
                        "flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-full px-8 py-3.5 text-[10px] font-bold uppercase tracking-widest text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                        hasPreviewed ? "bg-luxury-ink hover:bg-luxury-gold shadow-xl" : "bg-luxury-gray hover:bg-luxury-gray/80"
                      )}
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      {editingProject ? 'Update' : 'Save Project'}
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
              
              <p className="mb-8 text-[11px] font-medium uppercase tracking-widest text-luxury-gray leading-relaxed">
                {showConfirm === 'step1' 
                  ? 'Are you sure you want to publish this project?' 
                  : 'This will be visible on the website. Confirm publish?'}
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={showConfirm === 'step1' ? handleConfirmStep1 : handleConfirmStep2}
                  className="w-full rounded-full bg-luxury-ink py-4 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-luxury-gold transition-all shadow-lg"
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

      {/* Full Preview Modal (Matches Live Website UI) */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[200] bg-white overflow-y-auto"
          >
            <div className="sticky top-0 z-50 flex items-center justify-between border-b border-luxury-border bg-white/90 px-6 py-4 sm:px-10 sm:py-6 backdrop-blur-md shadow-sm">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-gray">Live Preview Mode</span>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              <button onClick={() => setIsPreviewOpen(false)} className="flex items-center gap-2 rounded-full bg-luxury-ink px-6 py-2.5 sm:py-3 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-luxury-gold transition-all shadow-md">
                <X className="h-4 w-4" /> Close Preview
              </button>
            </div>
            
            <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
              {/* Exact match of ProjectBlock from Projects.tsx */}
              <div className="flex flex-col items-start text-left flex-grow max-w-4xl mx-auto">
                {/* 1. Project Label */}
                <div className="mb-4 ml-1 md:ml-2">
                  <span className="text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.4em] text-luxury-gold">
                    Project Preview
                  </span>
                </div>

                {/* 2. Image (Slider) */}
                <div className="w-full mb-6 relative border-x border-t border-luxury-divider border-b-4 border-luxury-divider/50 rounded-[1.5rem] overflow-hidden shadow-xl">
                  <BeforeAfterSlider 
                    beforeImage={previews.before || 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=1200'} 
                    afterImage={previews.after || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200'} 
                    className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-[1.5rem]"
                  />
                </div>

                {/* 3. Title & Tags */}
                <div className="space-y-3 mb-6 w-full ml-1 md:ml-2">
                  <div className="space-y-2">
                    <h2 className="font-serif font-bold text-luxury-blue-mid tracking-tight text-2xl md:text-3xl lg:text-4xl">
                      {formData.title || 'Project Title'}
                    </h2>
                    <p className="text-xs md:text-sm font-medium italic text-luxury-gold tracking-wide line-clamp-2">
                      "{formData.subtitle || 'Project subtitle will appear here...'}"
                    </p>
                  </div>
                  
                  {/* Proof Tags */}
                  <div className="flex flex-wrap justify-start gap-2 pt-2">
                    {formData.tags.map((tag, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[9px] font-bold uppercase tracking-wider text-luxury-blue-mid border border-luxury-divider shadow-premium-sm">
                        <span className="text-luxury-gold">✔</span> {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. Description & Key Points */}
                <div className="w-full ml-1 md:ml-2 flex flex-col flex-grow">
                  <p className="text-base md:text-lg font-light leading-relaxed text-luxury-gray mb-6">
                    {formData.description || 'Project description will appear here...'}
                  </p>

                  {/* Key Points */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 w-full mt-auto pt-4 border-t border-luxury-divider/50 text-left">
                    {formData.features.map((bullet, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium uppercase tracking-wider text-luxury-ink">
                        <div className="h-1 w-1 rounded-full bg-luxury-gold shadow-sm shrink-0" />
                        <span className="leading-tight">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageProjects;
