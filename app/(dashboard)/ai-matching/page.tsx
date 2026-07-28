'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  BrainCircuit,
  Target,
  Zap,
  Heart,
  Star,
  ShieldCheck,
  UserPlus,
  MessageCircle,
  Trophy,
  ArrowRight,
  RefreshCw,
  Search
} from 'lucide-react';
import { SidebarNav } from '@/components/SidebarNav';
import { PersonCard } from '@/components/explore/PersonCard';
import { usePeople } from '@/hooks/usePeople';

const MATCH_CRITERIA = [
  { id: 'interests', label: 'Interests', icon: Heart, color: 'text-brand-accent' },
  { id: 'skills', label: 'Skills', icon: Zap, color: 'text-brand-primary' },
  { id: 'clubs', label: 'Clubs', icon: Target, color: 'text-brand-secondary' },
  { id: 'branch', label: 'Academic Branch', icon: BrainCircuit, color: 'text-brand-info' },
];

export default function AIMatchingPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [matchStep, setMatchStep] = useState(0);
  const { people, loading } = usePeople();
  const [matches, setMatches] = useState<any[]>([]);

  const runMatch = () => {
    setIsScanning(true);
    setMatchStep(0);
    setMatches([]);

    // Animate scanning process
    const timer = setInterval(() => {
      setMatchStep(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsScanning(false);
          setMatches(people.slice(0, 3)); // Mock top 3 matches
          return 100;
        }
        return prev + 2;
      });
    }, 40);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 space-y-12 pb-32">
      <header className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-brand-gradient rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-brand-primary/30"
        >
          <Sparkles size={40} className="animate-pulse" />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            AI Friend <span className="text-gradient">Match</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
            Stop scrolling. Let our neural engine find your next best friend, study partner, or project teammate.
          </p>
        </div>
      </header>

      {/* Matching Engine UI */}
      <div className="glass-card rounded-[3.5rem] p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 dark:bg-white/5" />
        <AnimatePresence mode="wait">
          {!isScanning && matches.length === 0 ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-10"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {MATCH_CRITERIA.map((item) => (
                  <div key={item.id} className="flex flex-col items-center gap-4 group">
                    <div className={`p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 transition-all group-hover:scale-110 group-hover:shadow-xl ${item.color}`}>
                      <item.icon size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-6">
                <button
                  onClick={runMatch}
                  className="btn-primary py-5 px-12 text-lg font-black uppercase tracking-widest shadow-2xl shadow-brand-primary/40 hover:scale-105 active:scale-95 transition-all"
                >
                  Find My Squad <ArrowRight size={24} strokeWidth={3} />
                </button>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShieldCheck size={14} className="text-brand-success" />
                  Your academic data is encrypted & private
                </p>
              </div>
            </motion.div>
          ) : isScanning ? (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 space-y-12 text-center"
            >
              <div className="relative w-48 h-48 mx-auto">
                <svg className="w-full h-full rotate-[-90deg]">
                  <circle
                    cx="96" cy="96" r="80"
                    fill="none" stroke="currentColor"
                    className="text-slate-100 dark:text-white/5"
                    strokeWidth="12"
                  />
                  <motion.circle
                    cx="96" cy="96" r="80"
                    fill="none" stroke="url(#gradient)"
                    strokeWidth="12"
                    strokeDasharray="502"
                    strokeDashoffset={502 - (502 * matchStep) / 100}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">{matchStep}%</span>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Optimizing</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Analyzing Campus Network...</h3>
                <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
                  {['Branch Similarity', 'Project History', 'Club Synergy', 'Mutual Goals'].map((tag, i) => (
                    <motion.span
                      key={tag}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-2xl text-[10px] font-bold text-slate-500 uppercase border border-slate-200 dark:border-white/5"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-10"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  Neural Matches Found <Trophy className="text-brand-warning" size={24} />
                </h2>
                <button onClick={runMatch} className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-500 hover:text-brand-primary transition-all">
                  <RefreshCw size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {matches.map((person, i) => (
                  <motion.div
                    key={person.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="relative mb-4">
                       <div className="absolute -top-3 -right-3 w-12 h-12 nav-active-gradient rounded-full flex items-center justify-center text-white text-xs font-black shadow-xl z-10 border-4 border-white dark:border-slate-900">
                         {98 - i}%
                       </div>
                       <PersonCard person={person} />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-8 rounded-[2.5rem] bg-brand-primary/5 border border-brand-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                       <Search size={24} />
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">Looking for someone specific?</p>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Our filters allow deep academic searches</p>
                    </div>
                 </div>
                 <button className="btn-secondary py-3 px-8 text-[10px] uppercase tracking-widest">
                    Open Search
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Features Showcase */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-[2.5rem] space-y-4">
           <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
              <BrainCircuit size={24} />
           </div>
           <h3 className="text-xl font-black tracking-tight">Skill Synergy</h3>
           <p className="text-slate-500 text-sm font-medium leading-relaxed">We pair you with students who have complementary skills. If you're a coder, we find you a designer.</p>
        </div>
        <div className="glass-card p-8 rounded-[2.5rem] space-y-4">
           <div className="w-12 h-12 rounded-2xl bg-brand-success/10 flex items-center justify-center text-brand-success">
              <Zap size={24} />
           </div>
           <h3 className="text-xl font-black tracking-tight">Active Pulse</h3>
           <p className="text-slate-500 text-sm font-medium leading-relaxed">AI prioritizes students who are currently active on campus, making it easier to meet up IRL.</p>
        </div>
      </section>
    </div>
  );
}
