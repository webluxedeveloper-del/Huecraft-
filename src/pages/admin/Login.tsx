import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Paintbrush } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Logged in successfully');
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] p-4 font-sans selection:bg-luxury-gold/20 selection:text-luxury-gold">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md overflow-hidden rounded-[2.5rem] border border-luxury-border bg-white shadow-2xl"
      >
        <div className="bg-luxury-ink p-8 text-center text-white">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg border border-luxury-border overflow-hidden">
             <img 
                src="https://ik.imagekit.io/jabzmiuta/Gemini_Generated_Image_6tlhjt6tlhjt6tlh-removebg-preview.png" 
                alt="Huecraft Logo" 
                className="h-10 w-10 object-contain"
                referrerPolicy="no-referrer"
              />
          </div>
          <h1 className="font-serif text-2xl font-light uppercase tracking-widest">
            HUE<span className="italic text-luxury-gold">CRAFT</span>
          </h1>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold/80">
            Admin Management Portal
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-luxury-gray" />
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-luxury-border bg-white py-3.5 pl-12 pr-4 text-sm outline-none focus:border-luxury-gold transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-luxury-gray" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-luxury-border bg-white py-3.5 pl-12 pr-4 text-sm outline-none focus:border-luxury-gold transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-luxury-ink py-4 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-luxury-gold transition-all disabled:opacity-50 shadow-lg shadow-luxury-ink/10"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Access Dashboard
              </>
            )}
          </button>
          
          <div className="text-center">
             <p className="text-[9px] font-bold uppercase tracking-widest text-luxury-gray">
               Authorized Personnel Only
             </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
