import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';

const ConfigWarning = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-luxury-ink/40 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-[4rem] border border-luxury-border bg-white p-12 text-center shadow-2xl">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white text-luxury-gold">
          <AlertTriangle className="h-12 w-12" />
        </div>
        <h2 className="mb-4 font-serif text-3xl font-light tracking-tight text-luxury-ink uppercase">Setup Required</h2>
        <p className="mb-10 text-sm font-light leading-relaxed text-luxury-gray">
          To get this application running, you need to connect your Supabase project. 
          Please add your credentials to the <span className="font-bold text-luxury-ink">Secrets</span> panel in AI Studio.
        </p>
        
        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 text-left text-sm">
            <p className="mb-4 font-bold text-luxury-gray uppercase tracking-[0.2em] text-[10px]">Required Secrets:</p>
            <ul className="space-y-3 font-mono text-xs text-luxury-ink">
              <li className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-luxury-gold"></div>
                VITE_SUPABASE_URL
              </li>
              <li className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-luxury-gold"></div>
                VITE_SUPABASE_ANON_KEY
              </li>
            </ul>
          </div>
          
          <a 
            href="https://supabase.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-3 rounded-full bg-luxury-ink py-5 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-luxury-gold hover:shadow-xl"
          >
            Go to Supabase <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConfigWarning;
