import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  User,
  ExternalLink,
  X,
  Download,
  FileText,
  FileSpreadsheet,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate, cn } from '../../lib/utils';
import { downloadCSV, downloadPDF } from '../../lib/downloadUtils';

type Lead = Database['public']['Tables']['leads']['Row'] & { 
  status?: string;
  budget?: string;
  budget_range?: string;
};

const ViewLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        // Use database status, default to 'new' if missing
        const leadsWithStatus = data.map(lead => ({
          ...lead,
          status: lead.status || 'new'
        }));
        setLeads(leadsWithStatus);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLeads(prev => prev.filter(lead => lead.id !== id));
      setSelectedLead(null);
      toast.success('Lead deleted successfully');
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
      toast.success(`Status updated to ${newStatus}`);
      
      if (selectedLead?.id === id) {
        setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleBulkDownload = () => {
    downloadCSV(filteredLeads, 'Huecraft_Leads');
    setShowDownloadConfirm(false);
    toast.success('Leads downloaded successfully');
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'new': return <Clock className="h-3 w-3" />;
      case 'contacted': return <MessageSquare className="h-3 w-3" />;
      case 'converted': return <CheckCircle2 className="h-3 w-3" />;
      case 'lost': return <XCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'new': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'contacted': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'converted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'lost': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-2xl font-light text-luxury-ink uppercase tracking-widest">
            Business <span className="italic text-luxury-gold">Leads</span>
          </h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-gray">
            Manage incoming requests
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
                {['all', 'new', 'contacted', 'converted', 'lost'].map((status) => (
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
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white border border-luxury-border"></div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredLeads.length === 0 ? (
            <div className="rounded-3xl border border-luxury-border bg-white py-12 text-center">
              <p className="font-serif text-lg italic text-luxury-gray">No leads found.</p>
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <div 
                key={lead.id} 
                onClick={() => setSelectedLead(lead)}
                className="group relative flex cursor-pointer flex-col gap-4 rounded-2xl border border-luxury-border bg-white p-4 transition-all hover:border-luxury-gold hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-luxury-ink/5 text-luxury-gold sm:h-12 sm:w-12">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-serif text-base font-medium text-luxury-ink sm:text-lg">{lead.name}</h3>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-luxury-gray">
                      <span className="flex items-center gap-1"><Mail className="h-2.5 w-2.5 text-luxury-gold" /> {lead.email}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-2.5 w-2.5" /> {formatDate(lead.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-luxury-border/50 pt-3 sm:border-t-0 sm:pt-0">
                  <div className={cn(
                    "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[7px] font-bold uppercase tracking-widest",
                    getStatusColor(lead.status)
                  )}>
                    {getStatusIcon(lead.status)}
                    {lead.status}
                  </div>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full text-luxury-gray hover:bg-luxury-ink/5 transition-colors sm:h-10 sm:w-10">
                    <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-luxury-ink/40 p-0 sm:p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl sm:h-[90vh] sm:rounded-[2.5rem] border border-luxury-border"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-20 flex items-center justify-between border-b border-luxury-border bg-white/80 px-6 py-4 backdrop-blur-xl sm:px-10 sm:py-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-luxury-ink/5 text-luxury-gold sm:h-12 sm:w-12">
                    <User className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-light text-luxury-ink uppercase tracking-widest sm:text-xl">
                      Lead <span className="italic text-luxury-gold">Details</span>
                    </h2>
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-luxury-gray">
                      Received {formatDate(selectedLead.created_at)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Status Dropdown - Desktop & Mobile */}
                  <div className="relative group">
                    <button className={cn(
                      "flex items-center gap-2 rounded-full border px-4 py-2 text-[9px] font-bold uppercase tracking-widest transition-all",
                      getStatusColor(selectedLead.status)
                    )}>
                      {getStatusIcon(selectedLead.status)}
                      {selectedLead.status}
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-36 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all z-50 pointer-events-none group-hover:pointer-events-auto">
                      <div className="rounded-xl border border-luxury-border bg-white p-1.5 shadow-xl">
                        {['new', 'contacted', 'converted', 'lost'].map((status) => (
                          <button
                            key={status}
                            onClick={() => updateStatus(selectedLead.id, status)}
                            className={cn(
                              "w-full rounded-lg px-3 py-2 text-left text-[8px] font-bold uppercase tracking-widest transition-all",
                              selectedLead.status === status ? "bg-luxury-ink text-white" : "text-luxury-gray hover:bg-luxury-ink/5"
                            )}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedLead(null)} 
                    className="rounded-full bg-luxury-ink/5 p-2 text-luxury-gray hover:text-luxury-ink transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 sm:p-10">
                {/* Section 1: Basic Information */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-luxury-border/50"></div>
                    <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-gold">Basic Information</h3>
                    <div className="h-px flex-1 bg-luxury-border/50"></div>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-luxury-border bg-luxury-ink/[0.01] p-5 transition-all hover:border-luxury-gold/30">
                      <label className="mb-1 block text-[7px] font-bold uppercase tracking-widest text-luxury-gray">Client Name</label>
                      <p className="font-serif text-lg text-luxury-ink">{selectedLead.name}</p>
                    </div>
                    
                    <div className="grid gap-3">
                      <a 
                        href={`tel:${selectedLead.phone}`}
                        className="group flex items-center justify-between rounded-2xl border border-luxury-border bg-white p-4 transition-all hover:border-luxury-gold hover:shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-luxury-ink/5 text-luxury-gold group-hover:bg-luxury-gold group-hover:text-white transition-all">
                            <Phone className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[7px] font-bold uppercase tracking-widest text-luxury-gray">Phone Number</span>
                            <span className="text-xs font-medium text-luxury-ink">{selectedLead.phone}</span>
                          </div>
                        </div>
                        <ExternalLink className="h-3 w-3 text-luxury-gray/40 group-hover:text-luxury-gold" />
                      </a>
                      
                      <a 
                        href={`mailto:${selectedLead.email}`}
                        className="group flex items-center justify-between rounded-2xl border border-luxury-border bg-white p-4 transition-all hover:border-luxury-gold hover:shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-luxury-ink/5 text-luxury-gold group-hover:bg-luxury-gold group-hover:text-white transition-all">
                            <Mail className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[7px] font-bold uppercase tracking-widest text-luxury-gray">Email Address</span>
                            <span className="text-xs font-medium text-luxury-ink">{selectedLead.email}</span>
                          </div>
                        </div>
                        <ExternalLink className="h-3 w-3 text-luxury-gray/40 group-hover:text-luxury-gold" />
                      </a>
                    </div>
                  </div>
                  
                  {selectedLead.address && (
                    <div className="rounded-2xl border border-luxury-border bg-white p-5">
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 text-luxury-gold" />
                        <div className="flex flex-col">
                          <span className="text-[7px] font-bold uppercase tracking-widest text-luxury-gray">Location / Address</span>
                          <span className="text-xs text-luxury-ink leading-relaxed">{selectedLead.address}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* Section 2: Request Details */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-luxury-border/50"></div>
                    <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-gold">Request Details</h3>
                    <div className="h-px flex-1 bg-luxury-border/50"></div>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-luxury-border bg-white p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-luxury-ink/5 text-luxury-gold">
                          <Filter className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[7px] font-bold uppercase tracking-widest text-luxury-gray">Service Requested</span>
                          <span className="text-xs font-medium text-luxury-ink">{selectedLead.service || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-2xl border border-luxury-border bg-white p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-luxury-ink/5 text-luxury-gold">
                          <Calendar className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[7px] font-bold uppercase tracking-widest text-luxury-gray">Submission Date</span>
                          <span className="text-xs font-medium text-luxury-ink">{formatDate(selectedLead.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {(selectedLead.budget || selectedLead.budget_range) && (
                      <div className="rounded-2xl border border-luxury-border bg-white p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-luxury-ink/5 text-luxury-gold">
                            <FileText className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[7px] font-bold uppercase tracking-widest text-luxury-gray">Estimated Budget</span>
                            <span className="text-xs font-medium text-luxury-ink">{selectedLead.budget || selectedLead.budget_range}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Section 3: Client Message */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-luxury-border/50"></div>
                    <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-gold">Client Message</h3>
                    <div className="h-px flex-1 bg-luxury-border/50"></div>
                  </div>
                  
                  <div className="relative rounded-[2rem] border border-luxury-border bg-luxury-ink/[0.02] p-6 sm:p-8">
                    <MessageSquare className="absolute right-6 top-6 h-12 w-12 text-luxury-ink/[0.03]" />
                    <div className="relative z-10">
                      <p className="font-sans text-sm font-medium leading-relaxed text-luxury-ink sm:text-base">
                        {selectedLead.message}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Modal Footer: Quick Actions */}
              <div className="border-t border-luxury-border bg-white p-6 sm:px-10 sm:py-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Primary Actions */}
                  <div className="flex flex-1 flex-wrap gap-3">
                    {selectedLead.status === 'contacted' ? (
                      <button 
                        onClick={() => updateStatus(selectedLead.id, 'new')}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full border border-luxury-ink bg-white px-6 py-3.5 text-[9px] font-bold uppercase tracking-widest text-luxury-ink hover:bg-luxury-ink hover:text-white transition-all sm:flex-none"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reverse Contacted
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateStatus(selectedLead.id, 'contacted')}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-luxury-ink px-6 py-3.5 text-[9px] font-bold uppercase tracking-widest text-white hover:bg-luxury-gold transition-all sm:flex-none"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Mark Contacted
                      </button>
                    )}
                    <a 
                      href={`tel:${selectedLead.phone}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full border border-luxury-border bg-white px-6 py-3.5 text-[9px] font-bold uppercase tracking-widest text-luxury-ink hover:border-luxury-gold transition-all sm:flex-none"
                    >
                      <Phone className="h-3.5 w-3.5" /> Call
                    </a>
                    <a 
                      href={`mailto:${selectedLead.email}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full border border-luxury-border bg-white px-6 py-3.5 text-[9px] font-bold uppercase tracking-widest text-luxury-ink hover:border-luxury-gold transition-all sm:flex-none"
                    >
                      <Mail className="h-3.5 w-3.5" /> Email
                    </a>
                  </div>

                  {/* Secondary Actions */}
                  <div className="flex flex-wrap items-center gap-3 border-t border-luxury-border pt-4 sm:border-t-0 sm:pt-0">
                    <button 
                      onClick={() => downloadPDF(selectedLead, 'lead', `Lead_${selectedLead.name.replace(/\s+/g, '_')}`)}
                      className="flex items-center gap-2 rounded-full border border-luxury-border px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest text-luxury-gray hover:border-luxury-gold hover:text-luxury-gold transition-all"
                    >
                      <FileText className="h-3.5 w-3.5" /> PDF
                    </button>
                    <button 
                      onClick={() => handleDelete(selectedLead.id)}
                      title="Delete Lead"
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
              <h3 className="mb-2 font-serif text-xl font-medium text-luxury-ink">Download Leads Data</h3>
              <p className="mb-8 text-sm text-luxury-gray">
                You are about to download a CSV file containing all {filteredLeads.length} filtered leads. Do you wish to proceed?
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

export default ViewLeads;
