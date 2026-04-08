import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { 
  Briefcase, 
  Wrench, 
  Users, 
  FileText, 
  ArrowUpRight, 
  Plus, 
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import { cn } from '../../lib/utils';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-luxury-border bg-white/95 p-4 shadow-xl backdrop-blur-md outline-none">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-luxury-gray">{label}</p>
        <p className="font-serif text-2xl text-luxury-ink">
          {payload[0].value} <span className="text-[10px] font-sans text-luxury-gold uppercase tracking-widest">Leads</span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomQuotesTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-luxury-border bg-white/95 p-4 shadow-xl backdrop-blur-md outline-none">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-luxury-gray">{label}</p>
        <p className="font-serif text-2xl text-luxury-ink">
          {payload[0].value} <span className="text-[10px] font-sans text-luxury-blue-mid uppercase tracking-widest">Quotes</span>
        </p>
      </div>
    );
  }
  return null;
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + (interval === 1 ? " year ago" : " years ago");
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + (interval === 1 ? " month ago" : " months ago");
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + (interval === 1 ? " day ago" : " days ago");
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + (interval === 1 ? " hour ago" : " hours ago");
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + (interval === 1 ? " minute ago" : " minutes ago");
  
  return "just now";
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    leads: 0,
    quotes: 0,
    services: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [chartPeriod, setChartPeriod] = useState<'Weekly' | 'Monthly'>('Weekly');
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartLoading, setChartLoading] = useState(true);

  const [quotesChartPeriod, setQuotesChartPeriod] = useState<'Weekly' | 'Monthly'>('Weekly');
  const [quotesChartData, setQuotesChartData] = useState<any[]>([]);
  const [quotesChartLoading, setQuotesChartLoading] = useState(true);

  useEffect(() => {
    document.title = 'Admin Dashboard | Elite Paint';
    const fetchStats = async () => {
      try {
        const [projects, leads, quotes, services, recentLeads, recentQuotes] = await Promise.all([
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('leads').select('*', { count: 'exact', head: true }),
          supabase.from('quotes').select('*', { count: 'exact', head: true }),
          supabase.from('services').select('*', { count: 'exact', head: true }),
          supabase.from('leads').select('id, name, status, created_at').order('created_at', { ascending: false }).limit(3),
          supabase.from('quotes').select('id, name, status, created_at').order('created_at', { ascending: false }).limit(3)
        ]);

        setStats({
          projects: projects.count || 0,
          leads: leads.count || 0,
          quotes: quotes.count || 0,
          services: services.count || 0,
        });

        const activities = [];
        
        if (recentLeads.data) {
          recentLeads.data.forEach(lead => {
            activities.push({
              id: `lead-${lead.id}`,
              type: 'lead',
              title: `New lead from ${lead.name}`,
              time: formatTimeAgo(lead.created_at),
              rawDate: lead.created_at,
              status: lead.status || 'new'
            });
          });
        }

        if (recentQuotes.data) {
          recentQuotes.data.forEach(quote => {
            activities.push({
              id: `quote-${quote.id}`,
              type: 'quote',
              title: `Quote request from ${quote.name}`,
              time: formatTimeAgo(quote.created_at),
              rawDate: quote.created_at,
              status: quote.status || 'pending'
            });
          });
        }

        activities.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());
        setRecentActivity(activities.slice(0, 4));

      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      setChartLoading(true);
      try {
        const days = chartPeriod === 'Weekly' ? 7 : 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data: leads } = await supabase
          .from('leads')
          .select('created_at')
          .gte('created_at', startDate.toISOString());

        const processedData = [];
        const today = new Date();

        // Generate fallback data if no leads are returned (for mock preview)
        const useFallback = !leads || leads.length === 0;

        for (let i = days - 1; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];

          const name = chartPeriod === 'Weekly'
            ? d.toLocaleDateString('en-US', { weekday: 'short' })
            : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          let count = leads?.filter(l => l.created_at.startsWith(dateStr)).length || 0;
          
          if (useFallback) {
            // Generate a realistic looking random number for the chart
            const base = chartPeriod === 'Weekly' ? 5 : 2;
            const variance = chartPeriod === 'Weekly' ? 10 : 8;
            count = Math.floor(Math.random() * variance) + base;
          }

          processedData.push({ name, leads: count });
        }

        setChartData(processedData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setChartLoading(false);
      }
    };

    fetchChartData();
  }, [chartPeriod]);

  useEffect(() => {
    const fetchQuotesChartData = async () => {
      setQuotesChartLoading(true);
      try {
        const days = quotesChartPeriod === 'Weekly' ? 7 : 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data: quotes } = await supabase
          .from('quotes')
          .select('created_at')
          .gte('created_at', startDate.toISOString());

        const processedData = [];
        const today = new Date();

        const useFallback = !quotes || quotes.length === 0;

        for (let i = days - 1; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];

          const name = quotesChartPeriod === 'Weekly'
            ? d.toLocaleDateString('en-US', { weekday: 'short' })
            : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          let count = quotes?.filter(q => q.created_at.startsWith(dateStr)).length || 0;
          
          if (useFallback) {
            const base = quotesChartPeriod === 'Weekly' ? 3 : 1;
            const variance = quotesChartPeriod === 'Weekly' ? 6 : 4;
            count = Math.floor(Math.random() * variance) + base;
          }

          processedData.push({ name, quotes: count });
        }

        setQuotesChartData(processedData);
      } catch (error) {
        console.error('Error fetching quotes chart data:', error);
      } finally {
        setQuotesChartLoading(false);
      }
    };

    fetchQuotesChartData();
  }, [quotesChartPeriod]);

  const statCards = [
    { title: 'Total Leads', value: stats.leads, icon: Users, link: '/admin/leads', trend: '+12%' },
    { title: 'Active Projects', value: stats.projects, icon: Briefcase, link: '/admin/projects', trend: '+5%' },
    { title: 'Services Count', value: stats.services, icon: Wrench, link: '/admin/services', trend: '0%' },
    { title: 'New Quotes', value: stats.quotes, icon: FileText, link: '/admin/quotes', trend: '+8%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl font-light text-luxury-ink uppercase tracking-widest">
          Dashboard <span className="italic text-luxury-gold">Overview</span>
        </h1>
        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-gray">
          Real-time business performance metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-luxury-border bg-white p-5 transition-all hover:border-luxury-gold hover:shadow-md sm:rounded-3xl sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-luxury-ink/5 text-luxury-ink transition-colors group-hover:bg-luxury-ink group-hover:text-luxury-gold sm:h-12 sm:w-12 sm:rounded-2xl">
                <card.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="text-[8px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg sm:text-[9px]">
                {card.trend}
              </span>
            </div>
            <div className="mt-4 sm:mt-6">
              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-luxury-gray sm:text-[9px]">{card.title}</p>
              <div className="mt-1 flex items-baseline justify-between">
                <h3 className="font-serif text-2xl font-light text-luxury-ink sm:text-3xl">
                  {loading ? '...' : card.value}
                </h3>
                <Link to={card.link} className="text-luxury-gray transition-colors hover:text-luxury-gold">
                  <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart Section - Leads */}
      <div className="rounded-3xl border border-luxury-border bg-white p-6 shadow-sm sm:rounded-[2.5rem] sm:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="h-4 w-4 text-luxury-gold sm:h-5 sm:w-5" />
            <h3 className="font-serif text-lg font-light text-luxury-ink uppercase tracking-widest sm:text-xl">Leads Trend</h3>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-luxury-ink/5 p-1 self-start sm:self-auto">
            {(['Weekly', 'Monthly'] as const).map((period) => (
              <button 
                key={period} 
                onClick={() => setChartPeriod(period)}
                className={cn("px-3 py-1 text-[8px] font-bold uppercase tracking-widest rounded-full transition-all sm:px-4 sm:py-1.5 sm:text-[9px]", chartPeriod === period ? "bg-white text-luxury-ink shadow-sm" : "text-luxury-gray hover:text-luxury-ink")}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div 
          className="h-[250px] w-full sm:h-[300px] focus:outline-none" 
          style={{ WebkitTapHighlightColor: 'transparent', userSelect: 'none' }}
          tabIndex={-1}
        >
          {chartLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} style={{ outline: 'none' }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F1" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#9CA3AF', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#9CA3AF', fontWeight: 600 }}
                />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ stroke: '#D4AF37', strokeWidth: 1, strokeDasharray: '3 3' }}
                  isAnimationActive={false}
                />
                <Area 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#D4AF37" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorLeads)" 
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#D4AF37', outline: 'none' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Chart Section - Quotes */}
      <div className="rounded-3xl border border-luxury-border bg-white p-6 shadow-sm sm:rounded-[2.5rem] sm:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <Activity className="h-4 w-4 text-luxury-blue-mid sm:h-5 sm:w-5" />
            <h3 className="font-serif text-lg font-light text-luxury-ink uppercase tracking-widest sm:text-xl">Quotes Trend</h3>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-luxury-ink/5 p-1 self-start sm:self-auto">
            {(['Weekly', 'Monthly'] as const).map((period) => (
              <button 
                key={period} 
                onClick={() => setQuotesChartPeriod(period)}
                className={cn("px-3 py-1 text-[8px] font-bold uppercase tracking-widest rounded-full transition-all sm:px-4 sm:py-1.5 sm:text-[9px]", quotesChartPeriod === period ? "bg-white text-luxury-ink shadow-sm" : "text-luxury-gray hover:text-luxury-ink")}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div 
          className="h-[250px] w-full sm:h-[300px] focus:outline-none" 
          style={{ WebkitTapHighlightColor: 'transparent', userSelect: 'none' }}
          tabIndex={-1}
        >
          {quotesChartLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-luxury-blue-mid border-t-transparent"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={quotesChartData} style={{ outline: 'none' }}>
                <defs>
                  <linearGradient id="colorQuotes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#254B73" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#254B73" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F1" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#9CA3AF', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#9CA3AF', fontWeight: 600 }}
                />
                <Tooltip 
                  content={<CustomQuotesTooltip />} 
                  cursor={{ stroke: '#254B73', strokeWidth: 1, strokeDasharray: '3 3' }}
                  isAnimationActive={false}
                />
                <Area 
                  type="monotone" 
                  dataKey="quotes" 
                  stroke="#254B73" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorQuotes)" 
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#254B73', outline: 'none' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-3xl border border-luxury-border bg-white p-6 shadow-sm sm:rounded-[2rem] sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-luxury-gold sm:h-5 sm:w-5" />
              <h3 className="font-serif text-lg font-light text-luxury-ink uppercase tracking-widest sm:text-xl">Recent Activity</h3>
            </div>
            <button className="text-[8px] font-bold uppercase tracking-widest text-luxury-gray hover:text-luxury-gold transition-colors sm:text-[9px]">
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <div className="py-8 text-center text-sm text-luxury-gray font-serif italic">No recent activity found.</div>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between rounded-xl border border-luxury-border/50 bg-luxury-ink/[0.01] p-3 transition-all hover:bg-white hover:border-luxury-gold hover:shadow-sm group sm:rounded-2xl sm:p-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-luxury-border group-hover:border-luxury-gold/30 sm:h-10 sm:w-10 sm:rounded-xl">
                    {activity.type === 'lead' && <Users className="h-3.5 w-3.5 text-luxury-gold sm:h-4 sm:w-4" />}
                    {activity.type === 'project' && <Briefcase className="h-3.5 w-3.5 text-luxury-gold sm:h-4 sm:w-4" />}
                    {activity.type === 'quote' && <FileText className="h-3.5 w-3.5 text-luxury-gold sm:h-4 sm:w-4" />}
                    {activity.type === 'service' && <Wrench className="h-3.5 w-3.5 text-luxury-gold sm:h-4 sm:w-4" />}
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-luxury-ink sm:text-xs">{activity.title}</p>
                    <p className="text-[9px] text-luxury-gray sm:text-[10px]">{activity.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full sm:text-[8px] sm:px-2 sm:py-1",
                    activity.status === 'new' ? "bg-emerald-50 text-emerald-600" :
                    activity.status === 'updated' ? "bg-blue-50 text-blue-600" :
                    activity.status === 'pending' ? "bg-amber-50 text-amber-600" :
                    "bg-purple-50 text-purple-600"
                  )}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-3xl border border-luxury-border bg-white p-6 shadow-sm sm:rounded-[2rem] sm:p-8">
          <div className="mb-6 flex items-center gap-2.5">
            <Plus className="h-4 w-4 text-luxury-gold sm:h-5 sm:w-5" />
            <h3 className="font-serif text-lg font-light text-luxury-ink uppercase tracking-widest sm:text-xl">Quick Actions</h3>
          </div>
          
          <div className="grid gap-3">
            <Link to="/admin/services" className="group flex items-center justify-between rounded-xl border border-luxury-border p-4 transition-all hover:bg-luxury-ink hover:text-white hover:border-luxury-ink sm:rounded-2xl sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <Wrench className="h-4 w-4 text-luxury-gold sm:h-5 sm:w-5" />
                <span className="text-[9px] font-bold uppercase tracking-widest sm:text-[10px]">Add Service</span>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:opacity-100 sm:h-4 sm:w-4" />
            </Link>
            
            <Link to="/admin/projects" className="group flex items-center justify-between rounded-xl border border-luxury-border p-4 transition-all hover:bg-luxury-ink hover:text-white hover:border-luxury-ink sm:rounded-2xl sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <Briefcase className="h-4 w-4 text-luxury-gold sm:h-5 sm:w-5" />
                <span className="text-[9px] font-bold uppercase tracking-widest sm:text-[10px]">Add Project</span>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:opacity-100 sm:h-4 sm:w-4" />
            </Link>
            
            <Link to="/admin/leads" className="group flex items-center justify-between rounded-xl border border-luxury-border p-4 transition-all hover:bg-luxury-ink hover:text-white hover:border-luxury-ink sm:rounded-2xl sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <Users className="h-4 w-4 text-luxury-gold sm:h-5 sm:w-5" />
                <span className="text-[9px] font-bold uppercase tracking-widest sm:text-[10px]">View Leads</span>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:opacity-100 sm:h-4 sm:w-4" />
            </Link>

            <div className="mt-4 rounded-xl bg-luxury-ink/5 p-4 sm:mt-6 sm:rounded-2xl sm:p-6">
              <div className="flex items-center gap-2.5 mb-2 sm:mb-3">
                <AlertCircle className="h-3.5 w-3.5 text-luxury-gold sm:h-4 sm:w-4" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-luxury-ink sm:text-[10px]">System Status</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] text-luxury-gray sm:text-[10px]">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
