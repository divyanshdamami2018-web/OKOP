'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Search,
  UserPlus,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const PlacementWidget = () => {
  const listings = [
    { company: 'Google', role: 'SWE Intern', package: '$8k/mo', deadline: '2 days left' },
    { company: 'Microsoft', role: 'PM Intern', package: '$7k/mo', deadline: '5 days left' },
  ];

  return (
    <div className="glass-card rounded-[2.5rem] p-6 border-brand-info/10">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Briefcase size={14} className="text-brand-info" />
          Placement Hub
        </h3>
        <button className="text-[10px] font-black text-brand-info uppercase tracking-widest">Portal <ChevronRight size={10} /></button>
      </div>
      <div className="space-y-3">
        {listings.map((item) => (
          <div key={item.company} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between group cursor-pointer hover:border-brand-info/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-info/10 flex items-center justify-center font-black text-brand-info text-xs">
                {item.company[0]}
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">{item.company}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{item.role}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-brand-info">{item.package}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{item.deadline}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FriendSuggestions = () => {
  const suggestions = [
    { name: 'Sarah Chen', major: 'CS', mutuals: 12, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { name: 'James Wilson', major: 'Design', mutuals: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
  ];

  return (
    <div className="glass-card rounded-[2.5rem] p-6">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <UserPlus size={14} className="text-brand-primary" />
          Suggested Friends
        </h3>
      </div>
      <div className="space-y-4">
        {suggestions.map((person) => (
          <div key={person.name} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <img src={person.avatar} className="w-10 h-10 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-brand-primary transition-all" />
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">{person.name}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{person.major} • {person.mutuals} mutuals</p>
              </div>
            </div>
            <button className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-all active:scale-90">
              <UserPlus size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LostFoundWidget = () => {
  return (
    <div className="glass-card rounded-[2.5rem] p-6 border-brand-danger/10">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <HelpCircle size={14} className="text-brand-danger" />
          Lost & Found
        </h3>
        <button className="text-[10px] font-black text-brand-danger uppercase tracking-widest flex items-center gap-1">Report <Plus size={10} /></button>
      </div>
      <div className="p-4 bg-brand-danger/5 rounded-2xl border border-brand-danger/10">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-brand-danger border border-brand-danger/20">
            <Clock size={20} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-black text-slate-900 dark:text-white">Keys Found @ Cafeteria</p>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Reported 10m ago</p>
            <button className="mt-3 text-[10px] font-black text-brand-danger uppercase tracking-widest flex items-center gap-1 hover:underline">
              Is this yours? <ChevronRight size={10} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import { Plus } from 'lucide-react';
