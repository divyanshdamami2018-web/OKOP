'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Command,
  User,
  Users,
  Calendar,
  BookOpen,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  Sparkles,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const ACTIONS = [
    { label: 'Find Students', icon: User, href: '/people', color: 'text-brand-primary' },
    { label: 'Explore Communities', icon: Users, href: '/explore', color: 'text-brand-secondary' },
    { label: 'Campus Events', icon: Calendar, href: '/activities', color: 'text-brand-accent' },
    { label: 'Academic Vault', icon: BookOpen, href: '/notes', color: 'text-brand-success' },
    { label: 'Student Market', icon: ShoppingBag, href: '/marketplace', color: 'text-amber-500' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[201] p-4"
          >
            <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/40 shadow-[0_30px_100px_rgba(0,0,0,0.3)] bg-white/90 dark:bg-slate-900/90">
              <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center gap-4">
                <Search className="text-brand-primary" size={24} />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search students, notes, events, or clubs..."
                  className="flex-1 bg-transparent border-none outline-none text-xl font-black text-slate-900 dark:text-white placeholder:text-slate-400"
                />
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-white/10">
                  <span className="text-[10px] font-black text-slate-500">ESC</span>
                </div>
              </div>

              <div className="p-4 max-h-[400px] overflow-y-auto no-scrollbar">
                {query.length === 0 ? (
                  <div className="space-y-6">
                    <section>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-3">Quick Navigation</h3>
                      <div className="grid grid-cols-1 gap-1">
                        {ACTIONS.map((action) => (
                          <button
                            key={action.label}
                            onClick={() => { router.push(action.href); setIsOpen(false); }}
                            className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-all group"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 ${action.color}`}>
                                <action.icon size={20} />
                              </div>
                              <span className="font-black text-slate-700 dark:text-slate-200 text-sm">{action.label}</span>
                            </div>
                            <ArrowRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                    </section>

                    <section className="bg-brand-primary/5 rounded-3xl p-6 border border-brand-primary/10">
                      <div className="flex items-center gap-3 mb-2 text-brand-primary">
                        <Sparkles size={18} />
                        <h4 className="font-black text-xs uppercase tracking-widest">AI Assistant Tip</h4>
                      </div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                        Try typing <span className="text-brand-primary font-bold">"Where is Room 204"</span> or <span className="text-brand-secondary font-bold">"Find ML Internships"</span>
                      </p>
                    </section>
                  </div>
                ) : (
                  <div className="py-10 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto text-slate-400">
                      <TrendingUp size={32} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white">Searching for "{query}"</p>
                      <p className="text-xs text-slate-500 font-medium">Scanning campus database...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-white/10"><Command size={10} className="text-slate-400" /></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">K to search</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-white/10"><ArrowRight size={10} className="rotate-90 text-slate-400" /></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Navigate</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-brand-primary" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Powered by OKOP'S AI</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
