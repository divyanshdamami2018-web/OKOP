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

import { usePlacementListings, useLostFound } from '@/hooks/useDashboardData';
import { usePeople } from '@/hooks/usePeople';
import { useAuth } from '@/components/auth/AuthProvider';
import { UserProfile } from '@/types';

export const PlacementWidget = () => {
  const { listings, loading } = usePlacementListings();

  if (loading) return <div className="h-40 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] animate-pulse" />;

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
        {listings.length > 0 ? listings.map((item: any) => (
          <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between group cursor-pointer hover:border-brand-info/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-info/10 flex items-center justify-center font-black text-brand-info text-xs">
                {item.company_name[0]}
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">{item.company_name}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{item.role}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-brand-info">{item.package_info || 'N/A'}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                {item.deadline ? new Date(item.deadline).toLocaleDateString() : 'Active'}
              </p>
            </div>
          </div>
        )) : (
          <p className="text-[10px] text-slate-500 text-center py-4 italic">No active listings.</p>
        )}
      </div>
    </div>
  );
};

export const FriendSuggestions = () => {
  const { people, loading } = usePeople('');
  const suggestions = people.slice(0, 3);

  if (loading) return <div className="h-40 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] animate-pulse" />;

  return (
    <div className="glass-card rounded-[2.5rem] p-6">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <UserPlus size={14} className="text-brand-primary" />
          Suggested People
        </h3>
      </div>
      <div className="space-y-4">
        {suggestions.length > 0 ? suggestions.map((person: UserProfile) => (
          <div key={person.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <img src={person.avatar} className="w-10 h-10 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-brand-primary transition-all" />
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">{person.name}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{person.college} • {person.xp_points} XP</p>
              </div>
            </div>
            <button className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-all active:scale-90">
              <UserPlus size={16} />
            </button>
          </div>
        )) : (
          <p className="text-[10px] text-slate-500 text-center py-4 italic">No suggestions found.</p>
        )}
      </div>
    </div>
  );
};

export const LostFoundWidget = () => {
  const { items, loading } = useLostFound();

  if (loading) return <div className="h-40 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] animate-pulse" />;

  return (
    <div className="glass-card rounded-[2.5rem] p-6 border-brand-danger/10">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <HelpCircle size={14} className="text-brand-danger" />
          Lost & Found
        </h3>
        <button className="text-[10px] font-black text-brand-danger uppercase tracking-widest flex items-center gap-1">Report <Plus size={10} /></button>
      </div>
      <div className="space-y-3">
        {items.length > 0 ? items.map((item: any) => (
          <div key={item.id} className="p-4 bg-brand-danger/5 rounded-2xl border border-brand-danger/10">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-brand-danger border border-brand-danger/20">
                <Clock size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">{item.title}</p>
                <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">
                  {item.type === 'lost' ? 'Lost' : 'Found'} • {item.location}
                </p>
                <button className="mt-3 text-[10px] font-black text-brand-danger uppercase tracking-widest flex items-center gap-1 hover:underline">
                  Is this yours? <ChevronRight size={10} />
                </button>
              </div>
            </div>
          </div>
        )) : (
          <p className="text-[10px] text-slate-500 text-center py-4 italic">Everything is in its place.</p>
        )}
      </div>
    </div>
  );
};

import { Plus } from 'lucide-react';
