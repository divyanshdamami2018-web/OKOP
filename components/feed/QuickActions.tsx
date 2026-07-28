'use client';

import React from 'react';
import {
  Plus,
  Search,
  MapPin,
  BookOpen,
  ShoppingBag,
  Briefcase,
  HelpCircle,
  Megaphone
} from 'lucide-react';
import { motion } from 'framer-motion';

const ACTIONS = [
  { label: 'Host Event', icon: Plus, color: 'bg-brand-primary', href: '#' },
  { label: 'Find Teammate', icon: Users, color: 'bg-brand-secondary', href: '#' },
  { label: 'Share Notes', icon: BookOpen, color: 'bg-brand-success', href: '#' },
  { label: 'Post Moment', icon: Sparkles, color: 'bg-brand-accent', href: '#' },
  { label: 'Sell Item', icon: ShoppingBag, color: 'bg-amber-500', href: '#' },
  { label: 'Report Lost', icon: HelpCircle, color: 'bg-brand-danger', href: '#' },
];

export const QuickActions = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-2">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {ACTIONS.map((action, index) => (
          <motion.button
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            key={action.label}
            className="glass-card p-4 rounded-[2rem] flex flex-col items-center justify-center gap-3 group transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all`}>
              <action.icon size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 group-hover:text-brand-primary transition-colors">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

import { Users, Sparkles } from 'lucide-react';
