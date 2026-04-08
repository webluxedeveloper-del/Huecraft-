import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Using mock client.');
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        signInWithOtp: async (...args: any[]) => ({ data: { user: { id: 'mock-user' } }, error: null }),
        signInWithPassword: async ({ email, password }: any) => {
          if (password === 'admin123') {
            return { data: { user: { id: 'mock-user', email } }, error: null };
          }
          return { data: { user: null }, error: { message: 'Invalid password' } };
        },
        signInWithOAuth: async ({ provider }: any) => {
          // Simulate OAuth redirect
          window.location.href = '/admin';
          return { data: { provider, url: '/admin' }, error: null };
        },
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: { user: { id: 'mock-user' } } }, error: null }),
        onAuthStateChange: (callback: any) => {
          setTimeout(() => callback('SIGNED_IN', { user: { id: 'mock-user' } }), 0);
          return { data: { subscription: { unsubscribe: () => {} } } };
        },
      },
      from: (table: string) => {
        const chain = {
          select: (...args: any[]) => chain,
          insert: (...args: any[]) => chain,
          update: (...args: any[]) => chain,
          delete: (...args: any[]) => chain,
          upsert: (...args: any[]) => chain,
          eq: (...args: any[]) => chain,
          gte: (...args: any[]) => chain,
          order: (...args: any[]) => chain,
          single: (...args: any[]) => chain,
          limit: (...args: any[]) => chain,
          range: (...args: any[]) => chain,
          match: (...args: any[]) => chain,
          then: (onfulfilled?: (value: any) => any) => {
            const result = { data: [], error: null, count: 0 };
            return Promise.resolve(onfulfilled ? onfulfilled(result) : result);
          },
        };
        return chain;
      },
      storage: {
        from: (bucket: string) => ({
          upload: async (...args: any[]) => ({ data: { path: 'mock-path' }, error: null }),
          getPublicUrl: (path: string) => ({ data: { publicUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=1200' } }),
        }),
      },
    } as any;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
