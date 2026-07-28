'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X, AlertTriangle, ShieldOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutDialog: React.FC<LogoutDialogProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClose();
    window.location.href = '/login';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[1001] flex items-center justify-center pointer-events-none p-4"
          >
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-4xl pointer-events-auto overflow-hidden border border-white/40 dark:border-white/5 relative">
              {/* Top Accent Bar */}
              <div className="h-1.5 w-full bg-red-500/20" />

              <div className="p-10 text-center space-y-8">
                <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-[2rem] flex items-center justify-center text-red-500 mx-auto relative group">
                  <LogOut size={32} className="group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-red-500/10 animate-ping rounded-[2rem] opacity-20" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Ready to Leave?</h3>
                  <p className="text-slate-500 text-sm font-medium">Are you sure you want to sign out of your current campus session?</p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleLogout}
                    className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-red-900/20 transition-all active:scale-95"
                  >
                    Confirm Sign Out
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                  >
                    Keep Me Logged In
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-60">
                   <ShieldOff size={10} /> Session Tokens will be Purged
                </div>
              </div>

              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all shadow-sm"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
