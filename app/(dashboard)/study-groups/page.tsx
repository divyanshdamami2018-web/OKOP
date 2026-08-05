'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  Search,
  Plus,
  Clock,
  MapPin,
  Filter,
  ChevronRight,
  MessageSquare,
  FileText,
  Sparkles,
  Zap,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudyGroups } from '@/hooks/useStudyGroups';

export default function StudyGroupsPage() {
  const [filter, setFilter] = useState('All');
  const { groups, loading, joinGroup } = useStudyGroups();

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-10 pb-20">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black tracking-tight flex items-center gap-3 text-slate-900 dark:text-white"
          >
            <GraduationCap className="text-brand-secondary" size={36} />
            Study <span className="text-brand-secondary">Groups</span>
          </motion.h1>
          <p className="text-slate-500 mt-2 font-medium">Don't study alone. Find your squad.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-secondary transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by subject or topic..."
              className="glass-input w-full py-3.5 pl-12 pr-4 text-sm"
            />
          </div>
          <button className="btn-primary py-3.5 px-8 whitespace-nowrap !bg-brand-secondary shadow-brand-secondary/20">
            <Plus size={20} /> Create Group
          </button>
        </div>
      </header>

      {/* Hero AI Suggestion */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="p-8 rounded-[3rem] bg-gradient-to-br from-brand-secondary/10 via-brand-primary/5 to-transparent border border-brand-secondary/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-brand-secondary text-white rounded-full w-fit text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-secondary/30">
              <Sparkles size={12} fill="white" />
              AI Match Ready
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
              Found a matching group for your <br />
              <span className="text-brand-secondary">#ArtificialIntelligence</span> midterm!
            </h2>
            <p className="text-slate-500 font-medium max-w-xl">
              Based on your branch (AI) and semester (5th), we recommend joining Sarah's prep session.
            </p>
          </div>
          <button className="btn-primary py-4 px-10 rounded-2xl !bg-slate-900 dark:!bg-white dark:text-slate-900 shadow-2xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap font-black uppercase tracking-widest text-xs">
            Join AI Session
          </button>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Left Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-[2.5rem] p-8">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Subject Filter</h3>
            <div className="space-y-2">
              {['All Subjects', 'Computer Science', 'Mathematics', 'Engineering', 'Design', 'Languages'].map((sub) => (
                <button
                  key={sub}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    sub === 'All Subjects' ? 'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] p-8 border-brand-success/10">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Quick Notes</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-brand-success/10 flex items-center justify-center text-brand-success">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white group-hover:text-brand-success transition-colors">AI Syllabus.pdf</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Shared 2h ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-brand-info/10 flex items-center justify-center text-brand-info">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white group-hover:text-brand-info transition-colors">Midterm Quiz.docx</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Shared Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-secondary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groups.map((group) => (
              <motion.div
                key={group.id}
                whileHover={{ y: -8 }}
                className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-brand-secondary/10 transition-colors" />

                <div className="relative z-10 flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <img src={group.creator.avatar} className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800" alt="Creator" />
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">{group.creator.name}</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Organizer</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500">
                    {group.department}
                  </div>
                </div>

                <div className="relative z-10 space-y-4">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-brand-secondary transition-colors">
                    {group.title}
                  </h3>
                  <p className="text-sm font-bold text-brand-secondary uppercase tracking-widest">
                    {group.subject}
                  </p>

                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-tighter">
                      <MapPin size={14} className="text-brand-secondary" />
                      {group.location}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-tighter">
                      <Clock size={14} className="text-brand-secondary" />
                      {group.time}
                    </div>
                  </div>

                  <div className="pt-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}${group.id}`} alt="User" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase">
                        {group.members}/{group.maxMembers} Joined
                      </span>
                    </div>
                    <button 
                      onClick={() => !group.hasJoined && joinGroup(group.id)}
                      disabled={group.hasJoined}
                      className={`p-3 rounded-2xl shadow-xl transition-all ${
                        group.hasJoined 
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-brand-secondary text-white shadow-brand-secondary/20 hover:scale-110 active:scale-90'
                      }`}
                    >
                      {group.hasJoined ? <CheckCircle2 size={20} strokeWidth={3} /> : <ChevronRight size={20} strokeWidth={3} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Empty Create CTA */}
            <button className="group h-full min-h-[350px] rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 hover:border-brand-secondary/50 hover:bg-brand-secondary/5 transition-all relative overflow-hidden">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-brand-secondary group-hover:border-brand-secondary/50 transition-all shadow-xl">
                <Plus size={32} />
              </div>
              <div className="text-center px-6">
                <p className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Start a Squad</p>
                <p className="text-xs text-slate-500 mt-2 font-medium max-w-[200px]">Create a study group for your favorite subjects.</p>
              </div>
            </button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
