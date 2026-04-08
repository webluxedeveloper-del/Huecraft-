import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  User,
  DollarSign,
  Briefcase,
  X,
  Check,
  Ban,
  Download,
  FileText,
  FileSpreadsheet,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate, cn } from '../../lib/utils';
import { downloadCSV, downloadPDF } from '../../lib/downloadUtils';

interface Quote {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  budget_range: string;
  timeline: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected' | 'contacted';
  created_at: string;
}

const parseDescription = (description: string) => {
  const details: Record<string, string> = {};
  const lines = description.split('\n');
  
  lines.forEach(line => {
    if (line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      if (key && value) {
        details[key.trim()] = value;
      }
    }
  });

  return {
    service: details['Service'] || '',
    propertyType: details['Property Type'] || '',
    condition: details['Condition'] || '',
    areaSize: details['Area Size/Rooms'] || '',
    location: details['Location'] || '',
    timeline: details['Timeline'] || '',
    notes: details['Notes'] || ''
  };
};

const ViewQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data as Quote[]);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast.error('Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: Quote['status']) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
      toast.success(`Quote marked as ${newStatus}`);
      
      if (selectedQuote?.id === id) {
        setSelectedQuote(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quote?')) return;
    
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setQuotes(prev => prev.filter(q => q.id !== id));
      setSelectedQuote(null);
      toast.success('Quote deleted successfully');
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast.error('Failed to delete quote');
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesStatus = filterStatus === 'all' || quote.status === filterStatus;
    const matchesSearch = quote.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         quote.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleBulkDownload = () => {
    downloadCSV(filteredQuotes, 'Huecraft_Quotes');
    setShowDownloadConfirm(false);
    toast.success('Quotes downloaded successfully');
  };

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'pending': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'contacted': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'accepted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-2xl font-light text-luxury-ink uppercase tracking-widest">
            Project <span className="italic text-luxury-gold">Quotes</span>
          </h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-gray">
            Manage high-value proposals
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setShowDownloadConfirm(true)}
            className="flex h-9 items-center gap-1.5 rounded-full border border-luxury-border bg-white px-3 text-[9px] font-bold uppercase tracking-wider text-luxury-ink hover:border-luxury-gold hover:bg-luxury-ink/5 transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            Download all CSV
          </button>
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-luxury-gray" />
            <input 
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-luxury-border bg-white pl-10 pr-4 py-2 text-[11px] outline-none focus:border-luxury-gold transition-all md:w-48"
            />
          </div>
          <div className="relative group">
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-luxury-border bg-white text-luxury-ink hover:border-luxury-gold transition-all">
              <Filter className="h-3.5 w-3.5" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-40 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all z-50 pointer-events-none group-hover:pointer-events-auto">
              <div className="rounded-xl border border-luxury-border bg-white p-1.5 shadow-xl">
                {['all', 'pending', 'contacted', 'accepted', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={cn(
                      "w-full rounded-lg px-3 py-2 text-left text-[9px] font-bold uppercase tracking-widest transition-all",
                      filterStatus === status ? "bg-luxury-ink text-white" : "text-luxury-gray hover:bg-luxury-ink/5"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white border border-luxury-border"></div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredQuotes.length === 0 ? (
            <div className="rounded-3xl border border-luxury-border bg-white py-12 text-center">
              <p className="font-serif text-lg italic text-luxury-gray">No quotes found.</p>
            </div>
          ) : (
            filteredQuotes.map((quote) => (
              <motion.div 
                key={quote.id} 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedQuote(quote)}
                className="group relative flex cursor-pointer flex-col gap-4 rounded-2xl border border-luxury-border bg-white p-5 transition-all hover:border-luxury-gold hover:shadow-premium-md sm:flex-row sm:items-center sm:justify-between sm:p-6"
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-luxury-ink/5 text-luxury-gold sm:h-14 sm:w-14 transition-colors group-hover:bg-luxury-gold group-hover:text-white">
                    <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-serif text-lg font-medium text-luxury-ink sm:text-xl">{quote.name}</h3>
                      <div className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[7px] font-bold uppercase tracking-widest",
                        getStatusColor(quote.status)
                      )}>
                        {quote.status}
                      </div>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[9px] text-luxury-gray font-medium">
                      <span className="flex items-center gap-1.5"><DollarSign className="h-3 w-3 text-luxury-gold" /> {quote.budget_range}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {formatDate(quote.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-luxury-border/50 pt-3 sm:border-t-0 sm:pt-0">
                  <div className="sm:text-right sm:mr-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-ink/80 sm:text-xs">{quote.service_type}</p>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-luxury-border text-luxury-gray transition-all group-hover:border-luxury-gold group-hover:text-luxury-gold sm:h-11 sm:w-11">
                    <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Quote Detail Modal */}
      <AnimatePresence>
        {selectedQuote && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-luxury-ink/40 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative flex h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-luxury-border bg-white shadow-2xl sm:rounded-[3rem]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-luxury-border px-6 py-5 sm:px-10 sm:py-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-luxury-ink/5 text-luxury-gold sm:h-12 sm:w-12">
                    <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-light text-luxury-ink uppercase tracking-widest sm:text-xl">{selectedQuote.name}</h2>
                    <div className={cn(
                      "inline-block rounded-full border px-2.5 py-0.5 text-[7px] font-bold uppercase tracking-widest",
                      getStatusColor(selectedQuote.status)
                    )}>
                      {selectedQuote.status}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedQuote(null)} 
                  className="rounded-full bg-luxury-ink/5 p-2 text-luxury-gray hover:text-luxury-ink transition-colors sm:p-3"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 sm:p-10 sm:space-y-10">
                {/* Key Info Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-luxury-border bg-luxury-ink/[0.02] p-5 space-y-2">
                    <div className="flex items-center gap-2 text-luxury-gold">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-[8px] font-bold uppercase tracking-widest">Estimated Budget</span>
                    </div>
                    <p className="text-sm font-medium text-luxury-ink">{selectedQuote.budget_range}</p>
                  </div>
                  <div className="rounded-2xl border border-luxury-border bg-luxury-ink/[0.02] p-5 space-y-2">
                    <div className="flex items-center gap-2 text-luxury-gold">
                      <Clock className="h-4 w-4" />
                      <span className="text-[8px] font-bold uppercase tracking-widest">Project Timeline</span>
                    </div>
                    <p className="text-sm font-medium text-luxury-ink">{selectedQuote.timeline}</p>
                  </div>
                  <div className="rounded-2xl border border-luxury-border bg-luxury-ink/[0.02] p-5 space-y-2">
                    <div className="flex items-center gap-2 text-luxury-gold">
                      <Tag className="h-4 w-4" />
                      <span className="text-[8px] font-bold uppercase tracking-widest">Service Type</span>
                    </div>
                    <p className="text-sm font-medium text-luxury-ink">{selectedQuote.service_type}</p>
                  </div>
                </div>

                {/* Client Contact */}
                <div className="space-y-4">
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-gold border-b border-luxury-gold/20 pb-2">Client Contact</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <a href={`mailto:${selectedQuote.email}`} className="flex items-center gap-3 rounded-xl border border-luxury-border p-4 text-[11px] text-luxury-ink hover:border-luxury-gold hover:bg-luxury-ink/5 transition-all">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-luxury-ink/5 text-luxury-gold">
                        <Mail className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[7px] font-bold uppercase tracking-widest text-luxury-gray">Email Address</span>
                        <span className="font-medium">{selectedQuote.email}</span>
                      </div>
                    </a>
                    <a href={`tel:${selectedQuote.phone}`} className="flex items-center gap-3 rounded-xl border border-luxury-border p-4 text-[11px] text-luxury-ink hover:border-luxury-gold hover:bg-luxury-ink/5 transition-all">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-luxury-ink/5 text-luxury-gold">
                        <Phone className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[7px] font-bold uppercase tracking-widest text-luxury-gray">Phone Number</span>
                        <span className="font-medium">{selectedQuote.phone}</span>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-4">
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-gold border-b border-luxury-gold/20 pb-2">Project Details</h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(parseDescription(selectedQuote.description)).map(([key, value]) => {
                      if (key === 'notes' || !value) return null;
                      
                      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                      
                      return (
                        <div key={key} className="rounded-xl border border-luxury-border p-4 space-y-1 bg-white hover:border-luxury-gold/50 transition-colors">
                          <label className="text-[7px] font-bold uppercase tracking-widest text-luxury-gray">{label}</label>
                          <p className="text-xs font-medium text-luxury-ink">{value}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Client Notes */}
                <div className="space-y-4">
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-gold border-b border-luxury-gold/20 pb-2">Client Notes</h3>
                  <div className="rounded-2xl bg-luxury-ink/[0.02] p-6 border border-luxury-border shadow-inner">
                    <p className="whitespace-pre-wrap font-sans text-sm font-medium leading-relaxed text-luxury-ink">
                      {parseDescription(selectedQuote.description).notes || 'No additional notes provided.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="border-t border-luxury-border bg-white p-6 sm:px-10 sm:py-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Primary Actions */}
                  <div className="flex flex-1 flex-wrap gap-3">
                    <div className="relative group/status flex-1 sm:flex-none">
                      <button className="flex w-full items-center justify-center gap-2 rounded-full border border-luxury-border bg-white px-6 py-3.5 text-[9px] font-bold uppercase tracking-widest text-luxury-ink hover:border-luxury-gold hover:bg-luxury-ink/5 transition-all sm:w-auto">
                        <CheckCircle2 className="h-3.5 w-3.5 text-luxury-gold" />
                        Status: {selectedQuote.status}
                      </button>
                      <div className="absolute bottom-full left-0 mb-2 w-48 scale-95 opacity-0 group-hover/status:scale-100 group-hover/status:opacity-100 transition-all z-50 pointer-events-none group-hover/status:pointer-events-auto">
                        <div className="rounded-2xl border border-luxury-border bg-white p-2 shadow-2xl">
                          {['pending', 'contacted', 'accepted', 'rejected'].map((status) => (
                            <button
                              key={status}
                              onClick={() => updateStatus(selectedQuote.id, status as Quote['status'])}
                              className={cn(
                                "w-full rounded-xl px-4 py-2.5 text-left text-[9px] font-bold uppercase tracking-widest transition-all",
                                selectedQuote.status === status ? "bg-luxury-ink text-white" : "text-luxury-gray hover:bg-luxury-ink/5"
                              )}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {selectedQuote.status === 'contacted' ? (
                      <button 
                        onClick={() => updateStatus(selectedQuote.id, 'pending')}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full border border-luxury-ink bg-white px-6 py-3.5 text-[9px] font-bold uppercase tracking-widest text-luxury-ink hover:bg-luxury-ink hover:text-white transition-all sm:flex-none"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reverse Contacted
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateStatus(selectedQuote.id, 'contacted')}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-luxury-ink px-6 py-3.5 text-[9px] font-bold uppercase tracking-widest text-white hover:bg-luxury-gold transition-all sm:flex-none"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        Mark Contacted
                      </button>
                    )}
                  </div>

                  {/* Secondary Actions */}
                  <div className="flex flex-wrap items-center gap-3 border-t border-luxury-border pt-4 sm:border-t-0 sm:pt-0">
                    <button 
                      onClick={() => downloadCSV([selectedQuote], `Quote_${selectedQuote.name.replace(/\s+/g, '_')}`)}
                      className="flex items-center gap-2 rounded-full border border-luxury-border px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest text-luxury-gray hover:border-luxury-gold hover:text-luxury-gold transition-all"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" />
                      CSV
                    </button>
                    <button 
                      onClick={() => downloadPDF(selectedQuote, 'quote', `Quote_${selectedQuote.name.replace(/\s+/g, '_')}`)}
                      className="flex items-center gap-2 rounded-full border border-luxury-border px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest text-luxury-gray hover:border-luxury-gold hover:text-luxury-gold transition-all"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      PDF
                    </button>
                    <button 
                      onClick={() => handleDelete(selectedQuote.id)}
                      title="Delete Quote"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Download Confirmation Modal */}
      <AnimatePresence>
        {showDownloadConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-luxury-ink/40 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-luxury-border bg-white p-8 shadow-2xl text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-luxury-ink/5 text-luxury-gold">
                <Download className="h-8 w-8" />
              </div>
              <h3 className="mb-2 font-serif text-xl font-medium text-luxury-ink">Download Quotes Data</h3>
              <p className="mb-8 text-sm text-luxury-gray">
                You are about to download a CSV file containing all {filteredQuotes.length} filtered quotes. Do you wish to proceed?
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowDownloadConfirm(false)}
                  className="flex-1 rounded-full border border-luxury-border py-3 text-[10px] font-bold uppercase tracking-widest text-luxury-ink hover:bg-luxury-ink/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBulkDownload}
                  className="flex-1 rounded-full bg-luxury-ink py-3 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-luxury-gold transition-all"
                >
                  Confirm Download
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Tag = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </svg>
);

export default ViewQuotes;
