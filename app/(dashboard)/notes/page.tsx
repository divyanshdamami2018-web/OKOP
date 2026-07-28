'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  FileText,
  Download,
  Filter,
  MoreVertical,
  ChevronRight,
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEPARTMENTS = ['All', 'CS', 'AI', 'ME', 'EE', 'Design'];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const NOTES = [
  {
    id: '1',
    title: 'Data Structures & Algorithms',
    desc: 'Complete handwritten notes covering trees, graphs, and dynamic programming.',
    type: 'PDF',
    department: 'CS',
    semester: 4,
    subject: 'Algorithms',
    downloads: 1240,
    uploader: { name: 'Divyanshu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Divyanshu' }
  },
  {
    id: '2',
    title: 'Machine Learning Basics',
    desc: 'Professor lecture slides with additional annotations and cheat sheets.',
    type: 'PPT',
    department: 'AI',
    semester: 5,
    subject: 'ML',
    downloads: 850,
    uploader: { name: 'Sarah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' }
  },
  {
    id: '3',
    title: 'Thermodynamics Formula Sheet',
    desc: 'Quick reference sheet for midterms. Includes all major laws and equations.',
    type: 'PDF',
    department: 'ME',
    semester: 3,
    subject: 'Thermal',
    downloads: 2100,
    uploader: { name: 'James', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' }
  }
];

export default function NotesPage() {
  const [activeDept, setActiveDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-10 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 text-slate-900 dark:text-white">
            <BookOpen className="text-brand-success" size={36} />
            Academic <span className="text-brand-success">Vault</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Shared knowledge from the campus community.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-success transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search notes, subjects..."
              className="glass-input w-full py-3.5 pl-12 pr-4 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn-primary py-3.5 px-8 whitespace-nowrap !bg-brand-success shadow-brand-success/20">
            <Plus size={20} /> Upload Note
          </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5">
          {DEPARTMENTS.map(dept => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeDept === dept ? 'bg-white dark:bg-slate-800 text-brand-success shadow-lg' : 'text-slate-500'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 flex items-center gap-1">
            <Layers size={12} /> Sem:
          </span>
          {SEMESTERS.map(sem => (
            <button key={sem} className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-500 hover:text-brand-success hover:bg-brand-success/10 transition-all">
              {sem}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {NOTES.filter(n => activeDept === 'All' || n.department === activeDept).map((note, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={note.id}
              className="glass-card rounded-[2.5rem] p-8 group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-success/5 blur-3xl -mr-16 -mt-16 group-hover:bg-brand-success/10 transition-all" />

              <div className="relative z-10 flex justify-between items-start mb-6">
                <div className={`p-4 rounded-3xl bg-brand-success/10 text-brand-success shadow-sm`}>
                  <FileText size={28} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-100 dark:border-white/5 mb-1">
                    {note.type}
                  </span>
                  <div className="flex items-center gap-1.5 text-brand-success">
                    <Download size={12} />
                    <span className="text-[10px] font-black">{note.downloads.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-950/5 dark:bg-white/5 rounded-md text-[8px] font-black text-slate-500 uppercase tracking-widest">
                    Sem {note.semester} • {note.department}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-brand-success transition-colors">
                  {note.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                  {note.desc}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <img src={note.uploader.avatar} className="w-8 h-8 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-brand-success transition-all" alt="Uploader" />
                  <div>
                    <p className="text-[10px] font-black text-slate-900 dark:text-white">{note.uploader.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Contributor</p>
                  </div>
                </div>
                <button className="p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl">
                  <Download size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* AI Note Search CTA */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-brand-success rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-brand-success/20 group cursor-pointer"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <Sparkles className="mb-4 opacity-80" />
              <h3 className="text-2xl font-black tracking-tight leading-tight">Can't find a <br/>specific topic?</h3>
              <p className="text-white/80 mt-4 text-sm font-medium leading-relaxed">Ask Campus AI to scan the vault or find a study group for you.</p>
            </div>
            <button className="mt-8 w-fit px-8 py-3 bg-white text-brand-success rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all">
              Ask AI
            </button>
          </div>
          <GraduationCap className="absolute right-[-30px] bottom-[-30px] w-64 h-64 text-white/10 rotate-12" />
        </motion.div>
      </div>
    </div>
  );
}
