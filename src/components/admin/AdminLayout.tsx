import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { 
  LayoutDashboard, 
  Briefcase, 
  Wrench, 
  MessageSquare, 
  Users, 
  LogOut, 
  ExternalLink,
  Paintbrush,
  User,
  Menu,
  X,
  ChevronRight,
  FileText,
  Search,
  Bell,
  Command,
  Clock
} from 'lucide-react';
import { cn } from '../../lib/utils';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/admin/login');
      } else {
        setAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Quotes', path: '/admin/quotes', icon: FileText },
    { name: 'Leads', path: '/admin/leads', icon: Users },
    { name: 'Services', path: '/admin/services', icon: Wrench },
    { name: 'Projects', path: '/admin/projects', icon: Briefcase },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const currentPage = menuItems.find(item => item.path === location.pathname)?.name || 'Admin';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-luxury-gold border-t-transparent"></div>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-luxury-ink font-sans selection:bg-luxury-gold/20 selection:text-luxury-gold">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-64 flex-col border-r border-luxury-border bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all">
        <div className="flex h-full flex-col px-6 py-8">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm border border-luxury-border overflow-hidden">
              <img 
                src="https://ik.imagekit.io/jabzmiuta/Gemini_Generated_Image_6tlhjt6tlhjt6tlh-removebg-preview.png" 
                alt="Huecraft Logo" 
                className="h-7 w-7 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-serif text-xl font-light tracking-tight uppercase">HUE<span className="italic text-luxury-gold">CRAFT</span></span>
          </div>

          <nav className="flex-1 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "group flex items-center justify-between rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300",
                    isActive 
                      ? "bg-luxury-ink text-white shadow-lg shadow-luxury-ink/10" 
                      : "text-luxury-gray hover:bg-luxury-ink/5 hover:text-luxury-ink"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <item.icon className={cn("h-3.5 w-3.5 transition-colors", isActive ? "text-luxury-gold" : "text-luxury-gray group-hover:text-luxury-gold")} />
                    {item.name}
                  </div>
                  {isActive && <motion.div layoutId="active-indicator"><ChevronRight className="h-2.5 w-2.5 text-luxury-gold" /></motion.div>}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-1.5 pt-6 border-t border-luxury-border">
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-luxury-gray transition-all hover:bg-luxury-ink/5 hover:text-luxury-ink"
            >
              <ExternalLink className="h-3.5 w-3.5 text-luxury-gold" />
              Live Website
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-red-500/80 transition-all hover:bg-red-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-luxury-border bg-white/80 px-4 sm:px-5 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm border border-luxury-border overflow-hidden">
            <img 
              src="https://ik.imagekit.io/jabzmiuta/Gemini_Generated_Image_6tlhjt6tlhjt6tlh-removebg-preview.png" 
              alt="Huecraft Logo" 
              className="h-5 w-5 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="hidden sm:inline-block font-serif text-sm font-light tracking-tight uppercase">HUE<span className="italic text-luxury-gold">CRAFT</span></span>
        </div>
        
        <h1 className="text-xs font-bold uppercase tracking-[0.2em] text-luxury-ink truncate px-2">{currentPage}</h1>

        <div className="flex items-center gap-3 relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-luxury-ink/5 text-luxury-ink hover:bg-luxury-ink/10 transition-colors"
          >
            <User className="h-4 w-4" />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-3 w-48 overflow-hidden rounded-xl border border-luxury-border bg-white shadow-2xl z-50"
                >
                  <div className="p-3 border-b border-luxury-border bg-luxury-ink/[0.02]">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-luxury-ink">Admin Panel</p>
                    <p className="text-[8px] text-luxury-gray truncate">Full Access</p>
                  </div>
                  <div className="p-1.5">
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:flex fixed top-0 right-0 left-64 z-30 h-14 items-center justify-between border-b border-luxury-border bg-white/50 px-6 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <h1 className="font-serif text-lg font-light text-luxury-ink uppercase tracking-widest">{currentPage}</h1>
          <div 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2.5 rounded-full border border-luxury-border bg-white/50 px-4 py-1.5 text-luxury-gray hover:border-luxury-gold hover:bg-white transition-all cursor-pointer group w-56"
          >
            <Search className="h-4 w-4 group-hover:text-luxury-gold transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Search...</span>
            <div className="ml-auto flex items-center gap-1 rounded bg-luxury-ink/5 px-1.5 py-0.5 text-[8px]">
              <Command className="h-2 w-2" />
              <span>K</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-luxury-gray hover:bg-luxury-ink/5 transition-all">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-luxury-gold border border-white"></span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 group"
            >
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-ink leading-none">Admin</span>
                <span className="text-[9px] text-luxury-gray leading-none mt-0.5">Management</span>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-luxury-ink text-luxury-gold shadow-lg transition-transform group-hover:scale-105 active:scale-95">
                <User className="h-4 w-4" />
              </div>
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-48 overflow-hidden rounded-xl border border-luxury-border bg-white shadow-2xl z-50"
                  >
                    <div className="p-3 border-b border-luxury-border bg-luxury-ink/[0.02]">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-luxury-ink">Admin Panel</p>
                      <p className="text-[8px] text-luxury-gray truncate">Full Access</p>
                    </div>
                    <div className="p-1.5">
                      <button 
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
                      >
                        <LogOut className="h-3.5 w-3.5" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-24 lg:pt-16 lg:pb-0 lg:ml-72">
        <div className="mx-auto max-w-6xl p-4 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t border-luxury-border bg-white/90 px-4 pb-2 backdrop-blur-xl">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-300",
                isActive ? "text-luxury-gold" : "text-luxury-gray"
              )}
            >
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300",
                isActive ? "bg-luxury-ink shadow-lg shadow-luxury-ink/20" : "bg-transparent"
              )}>
                <item.icon className={cn("h-5 w-5", isActive ? "text-luxury-gold" : "text-luxury-gray")} />
              </div>
              <span className="text-[8px] font-bold uppercase tracking-widest">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Global Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center bg-luxury-ink/40 p-4 pt-[15vh] backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-luxury-border bg-white shadow-2xl"
            >
              <div className="relative flex items-center border-b border-luxury-border px-8 py-6">
                <Search className="h-5 w-5 text-luxury-gold" />
                <input 
                  autoFocus
                  placeholder="Search leads, projects, services..."
                  className="w-full bg-transparent px-4 text-sm font-medium text-luxury-ink outline-none"
                />
                <button onClick={() => setIsSearchOpen(false)} className="rounded-lg bg-luxury-ink/5 px-3 py-1.5 text-[8px] font-bold uppercase tracking-widest text-luxury-gray hover:text-luxury-ink">
                  Esc
                </button>
              </div>
              <div className="max-h-[50vh] overflow-y-auto p-4">
                <div className="space-y-2">
                  <p className="px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-luxury-gray">Recent Searches</p>
                  {['Modern Villa', 'Kitchen Remodel', 'Sarah J.'].map((item) => (
                    <button key={item} className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-xs text-luxury-ink hover:bg-luxury-ink/5 transition-all">
                      <Clock className="h-4 w-4 text-luxury-gold opacity-50" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
