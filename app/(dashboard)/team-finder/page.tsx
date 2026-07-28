'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Code2,
  Palette,
  Mic2,
  BrainCircuit,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ROLES = [
  { id: 'android', label: 'Android Developer', icon: Code2, color: 'text-brand-success' },
  { id: 'react', label: 'React Developer', icon: Code2, color: 'text-brand-info' },
  { id: 'uiux', label: 'UI Designer', icon: Palette, color: 'text-brand-accent' },
  { id: 'ml', label: 'ML Engineer', icon: BrainCircuit, color: 'text-brand-primary' },
];

const TEAMS = [
  {
    id: '1',
    title: 'FinTech Hackathon Project',
    desc: 'Building a decentralized payment system for campus vendors.',
    members: 2,
    needed: ['ML Engineer', 'UI Designer'],
    tags: ['Blockchain', 'AI'],
    deadline: 'In 3 days',
    difficulty: 'Advanced'
  },
  {
    id: '2',
    title: 'Eco-Track App',
    desc: 'A gamified recycling tracker for hostel residents.',
    members: 3,
    needed: ['Android Developer'],
    tags: ['Sustainability', 'Gamification'],
    deadline: 'In 1 week',
    difficulty: 'Intermediate'
  }
];

export default function TeamFinderPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 text-slate-900 dark:text-white">
            <Users className="text-brand-primary" size={36} />
            Team <span className="text-brand-primary">Finder</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Build your dream team for projects and hackathons.</p>
        </div>
        <button className="btn-primary py-3.5 px-8">
          <Plus size={20} /> Post Project
        </button>
      </header>

      {/* Role Selection */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-2">I am looking for:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id === selectedRole ? null : role.id)}
              className={`p-6 rounded-[2.5rem] glass-card flex flex-col items-center gap-3 transition-all ${
                selectedRole === role.id ? 'ring-2 ring-brand-primary border-brand-primary/50 bg-brand-primary/5' : ''
              }`}
            >
              <div className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 ${role.color}`}>
                <role.icon size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-center">{role.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black tracking-tight">Active Recruiting</h2>
            <div className="flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase bg-brand-primary/10 px-3 py-1 rounded-full">
              <Sparkles size={12} fill="currentColor" />
              AI Recommended
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {TEAMS.map((team) => (
              <motion.div
                whileHover={{ y: -5 }}
                key={team.id}
                className="glass-card p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 group"
              >
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500">
                      {team.difficulty}
                    </span>
                    <span className="text-[9px] font-black text-brand-danger uppercase">🔥 {team.deadline}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors">{team.title}</h3>
                  <p className="text-slate-500 font-medium text-sm line-clamp-2">{team.desc}</p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {team.needed.map(role => (
                      <span key={role} className="px-3 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-[10px] font-bold text-brand-primary">
                        Needed: {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4 shrink-0">
                  <div className="flex -space-x-3">
                    {[1, 2].map(i => (
                      <div key={i} className="w-10 h-10 rounded-xl border-4 border-white dark:border-slate-950 bg-slate-200 overflow-hidden shadow-lg">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Team${i}${team.id}`} alt="Member" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-xl border-4 border-white dark:border-slate-950 bg-brand-primary flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                      +2
                    </div>
                  </div>
                  <button className="btn-primary py-3 px-8 text-xs whitespace-nowrap">
                    Join Team <ChevronRight size={14} strokeWidth={3} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card rounded-[2.5rem] p-8 border-brand-success/10">
            <h3 className="text-lg font-black tracking-tight flex items-center gap-2 mb-6 text-brand-success">
              <Trophy size={20} />
              Featured Hackathons
            </h3>
            <div className="space-y-5">
              {[
                { name: 'Global AI Summit', prize: '$10k', date: 'Dec 15' },
                { name: 'Eco-Hack 2024', prize: '$5k', date: 'Nov 20' },
              ].map(h => (
                <div key={h.name} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5 group cursor-pointer hover:border-brand-success/30 transition-all">
                  <p className="font-black text-sm text-slate-900 dark:text-white group-hover:text-brand-success transition-colors">{h.name}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{h.date}</span>
                    <span className="text-[10px] font-black text-brand-success uppercase">{h.prize} Pool</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
