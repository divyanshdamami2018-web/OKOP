'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Globe,
  Lock,
  ShieldCheck,
  Flame,
  Star,
  LayoutGrid,
  ChevronRight,
  MessageCircle,
  MoreVertical,
  Target,
  FileText,
  Pin,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Official Clubs', 'Academic', 'Tech', 'Cultural', 'Sports', 'Gaming'];

const COMMUNITIES = [
  {
    id: '1',
    name: 'Stanford AI Club',
    slug: 'ai-club',
    desc: 'Exploring the frontiers of Machine Learning and Robotics. Open to all branches.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=400&h=400&auto=format&fit=crop',
    category: 'Tech',
    members: 1240,
    isClub: true,
    isPrivate: false,
    trending: true,
  },
  {
    id: '2',
    name: 'The Photography Society',
    slug: 'photo-soc',
    desc: 'Weekly photowalks and equipment sharing. Beginner friendly!',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&h=400&auto=format&fit=crop',
    category: 'Cultural',
    members: 850,
    isClub: true,
    isPrivate: false,
    trending: false,
  },
  {
    id: '3',
    name: 'Web3 & Blockchain',
    slug: 'web3',
    desc: 'Student-led research and development group for decentralized technologies.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=400&h=400&auto=format&fit=crop',
    category: 'Academic',
    members: 430,
    isClub: false,
    isPrivate: true,
    trending: true,
  }
];

export default function CommunitiesPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12 pb-32">
      {/* Dynamic Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-3 text-slate-900 dark:text-white">
            <LayoutGrid className="text-brand-secondary" size={40} />
            Campus <span className="text-brand-secondary">Hub</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium text-lg">Join clubs, squads, and official college communities.</p>
        </motion.div>

        <div className="flex items-center gap-3">
          <div className="relative group hidden sm:block w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-secondary transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by name or interest..."
              className="glass-input w-full py-4 pl-12 pr-4 text-sm"
            />
          </div>
          <button className="btn-primary py-4 px-8 whitespace-nowrap !bg-brand-secondary shadow-brand-secondary/20 group">
            <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
            Create Community
          </button>
        </div>
      </header>

      {/* Hero: Discover Clubs */}
      <motion.div
        whileHover={{ scale: 1.005 }}
        className="relative h-[480px] rounded-[3.5rem] overflow-hidden group cursor-pointer shadow-2xl border-4 border-white dark:border-white/5 bg-slate-100"
      >
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&h=600&auto=format&fit=crop"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          alt="Featured"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        <div className="absolute top-10 left-10 flex gap-3">
          <div className="px-5 py-2 bg-brand-secondary text-white rounded-full text-[10px] font-black uppercase tracking-[0.25em] shadow-xl backdrop-blur-md">
            Featured Selection
          </div>
          <div className="px-5 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-white/20">
            Official Club
          </div>
        </div>

        <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row items-end justify-between gap-10">
          <div className="space-y-6 flex-1">
            <div className="flex items-center gap-4">
              <div className="w-16 h-14 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-2xl">
                <Target className="text-brand-secondary" size={32} />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">The Entrepreneur Hub</h2>
                <div className="flex items-center gap-3 text-white/70 text-xs font-bold uppercase tracking-widest mt-2">
                  <Users size={14} className="text-brand-secondary" /> 4.2k Active Students
                </div>
              </div>
            </div>
            <p className="text-white/80 max-w-2xl text-lg font-medium leading-relaxed">
              Launch your ideas. We provide mentorship, funding opportunities, and a network of 500+ student-led startups.
            </p>
          </div>

          <button className="px-10 py-5 bg-white text-brand-secondary rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all">
            Join The Hub
          </button>
        </div>
      </motion.div>

      {/* Category Filter */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 -mx-2 px-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-brand-secondary text-white border-transparent shadow-xl shadow-brand-secondary/20 scale-105'
                : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/5 text-slate-500 hover:border-brand-secondary/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Communities Feed */}
        <div className="lg:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {COMMUNITIES.map((com, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  key={com.id}
                  className="glass-card rounded-[3rem] p-5 flex flex-col group cursor-pointer border-white/50 dark:border-white/5 hover:border-brand-secondary/40 transition-all"
                >
                  <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-6">
                    <img src={com.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={com.name} />
                    <div className="absolute top-4 right-4 flex gap-2">
                      {com.trending && (
                        <div className="p-2.5 bg-brand-accent rounded-xl text-white shadow-lg animate-pulse">
                          <Flame size={18} fill="white" />
                        </div>
                      )}
                      <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-white shadow-lg border border-white/20">
                        {com.isPrivate ? <Lock size={18} /> : <Globe size={18} />}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="px-3 pb-3 space-y-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded-lg border border-brand-secondary/20">
                            {com.category}
                          </span>
                          {com.isClub && (
                            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-brand-success">
                              <ShieldCheck size={10} /> Verified
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-2 leading-tight group-hover:text-brand-secondary transition-colors">
                          {com.name}
                        </h3>
                      </div>
                      <button className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl text-slate-400 hover:text-brand-secondary hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10">
                        <MoreVertical size={20} />
                      </button>
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">
                      {com.desc}
                    </p>

                    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-9 h-9 rounded-xl border-4 border-white dark:border-slate-950 bg-slate-200 overflow-hidden shadow-sm">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Hub${i}${com.id}`} alt="User" />
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          {com.members.toLocaleString()} joined
                        </span>
                      </div>

                      <button className="p-3.5 bg-brand-secondary text-white rounded-2xl shadow-xl shadow-brand-secondary/20 hover:scale-110 active:scale-95 transition-all">
                        <ChevronRight size={20} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Discover More CTA */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-[3rem] p-8 flex flex-col items-center justify-center text-center gap-6 border-dashed border-2 border-slate-200 dark:border-white/10 group hover:border-brand-secondary/50 transition-all min-h-[400px]"
            >
              <div className="w-20 h-20 rounded-[2rem] bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-300 group-hover:text-brand-secondary group-hover:bg-brand-secondary/5 transition-all shadow-inner">
                <Star size={40} />
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Discover New Clubs</h4>
                <p className="text-xs text-slate-500 font-medium max-w-[200px] leading-relaxed">We add new student-led communities every week. Can't find yours?</p>
              </div>
              <button className="btn-secondary py-3 px-10 text-[10px] font-black uppercase tracking-widest">
                Browse Directory
              </button>
            </motion.div>
          </div>
        </div>

        {/* Sidebar: Hub Tools */}
        <div className="lg:col-span-4 space-y-10">

          {/* Trending Polls Widget */}
          <div className="glass-card rounded-[2.5rem] p-8 border-brand-accent/10">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <BarChart3 size={16} className="text-brand-accent" />
              Active Polls
            </h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">Next venue for Winter Fest?</p>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-white/5 flex justify-between items-center group cursor-pointer hover:border-brand-accent/30 transition-all">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Main Quad</span>
                    <span className="text-[10px] font-black text-brand-accent">64%</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-white/5 flex justify-between items-center group cursor-pointer hover:border-brand-accent/30 transition-all">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Auditorium</span>
                    <span className="text-[10px] font-black text-slate-500">36%</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full mt-8 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-accent transition-colors">
              Create a Poll
            </button>
          </div>

          {/* Recently Shared Files */}
          <div className="glass-card rounded-[2.5rem] p-8 border-brand-success/10">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <FileText size={16} className="text-brand-success" />
              Shared Files
            </h3>
            <div className="space-y-5">
              {[
                { name: 'AI_Club_Syllabus.pdf', size: '2.4MB', club: 'AI Club' },
                { name: 'Figma_Basics.zip', size: '15MB', club: 'Design Soc' },
                { name: 'Meeting_Notes.docx', size: '45KB', club: 'Web3 Group' },
              ].map((file) => (
                <div key={file.name} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-brand-success transition-all">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[120px] group-hover:text-brand-success transition-colors">{file.name}</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{file.club} • {file.size}</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-success transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* Announcement Feed */}
          <div className="p-8 rounded-[2.5rem] bg-brand-secondary/5 border border-brand-secondary/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary/10 blur-2xl rounded-full" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-secondary mb-6 flex items-center gap-2">
              <Pin size={14} fill="currentColor" fillOpacity={0.2} />
              Pinned Hubs
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 cursor-pointer hover:scale-[1.02] transition-all">
                <div className="w-8 h-8 rounded-lg bg-brand-secondary/10 flex items-center justify-center text-brand-secondary font-black text-xs">AI</div>
                <p className="text-xs font-black text-slate-900 dark:text-white">AI Club Announcements</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 cursor-pointer hover:scale-[1.02] transition-all">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black text-xs">CS</div>
                <p className="text-xs font-black text-slate-900 dark:text-white">CS Society Discussion</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
