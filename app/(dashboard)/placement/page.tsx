'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Calendar,
  MapPin,
  Building2,
  Trophy,
  ChevronRight,
  ArrowUpRight,
  Download,
  BookMarked,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Internship', 'Full-time', 'Freelance'];

const JOBS = [
  {
    id: '1',
    company: 'Google',
    logo: 'G',
    role: 'Frontend Engineering Intern',
    location: 'Mountain View, CA',
    package: '$8,500 / month',
    deadline: '2024-12-01',
    category: 'Internship',
    tags: ['React', 'TypeScript', 'Next.js'],
    posted: '2 hours ago'
  },
  {
    id: '2',
    company: 'Tesla',
    logo: 'T',
    role: 'AI / ML Research Associate',
    location: 'Austin, TX',
    package: '$120k - $150k',
    deadline: '2024-11-15',
    category: 'Full-time',
    tags: ['Python', 'PyTorch', 'Robotics'],
    posted: '5 hours ago'
  },
  {
    id: '3',
    company: 'Adobe',
    logo: 'A',
    role: 'Product Design Intern',
    location: 'Remote',
    package: '$7,000 / month',
    deadline: '2024-12-15',
    category: 'Internship',
    tags: ['Figma', 'UI/UX', 'Prototyping'],
    posted: '1 day ago'
  }
];

export default function PlacementPage() {
  const [activeTab, setActiveTab] = useState('listings');
  const [filter, setFilter] = useState('All');

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-10 pb-20">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <Briefcase className="text-brand-info" size={36} />
            Placement <span className="text-brand-info">Hub</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Your bridge from campus to career.</p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-3xl border border-slate-200 dark:border-white/5">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'listings' ? 'bg-white dark:bg-slate-800 text-brand-info shadow-xl' : 'text-slate-500'
            }`}
          >
            Listings
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'resources' ? 'bg-white dark:bg-slate-800 text-brand-info shadow-xl' : 'text-slate-500'
            }`}
          >
            Resources
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card rounded-[2.5rem] p-8 space-y-8">
            <div>
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Search size={14} /> Search
              </h3>
              <input
                type="text"
                placeholder="Role, Company..."
                className="glass-input w-full py-3 px-5 text-sm"
              />
            </div>

            <div>
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Filter size={14} /> Category
              </h3>
              <div className="space-y-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                      filter === cat
                        ? 'bg-brand-info/10 text-brand-info border border-brand-info/20'
                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-white/5 text-center">
              <button className="text-[10px] font-black text-brand-info uppercase tracking-widest hover:underline">
                Clear Filters
              </button>
            </div>
          </div>

          <div className="bg-brand-gradient rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-2xl rounded-full" />
            <Sparkles className="mb-4 opacity-50" />
            <h3 className="text-xl font-black tracking-tight mb-2">Resume AI Builder</h3>
            <p className="text-white/70 text-sm font-medium leading-relaxed mb-6">Optimize your resume for 2024 ATS systems with our campus AI.</p>
            <button className="w-full bg-white text-brand-primary py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 active:scale-95 transition-all">
              Launch Builder
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'listings' ? (
              <motion.div
                key="listings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {JOBS.filter(job => filter === 'All' || job.category === filter).map((job) => (
                  <motion.div
                    layout
                    key={job.id}
                    whileHover={{ y: -5 }}
                    className="glass-card p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 group"
                  >
                    <div className="flex items-center gap-6 flex-1">
                      <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center text-3xl font-black text-slate-400 group-hover:text-brand-info transition-colors">
                        {job.logo}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-brand-info transition-colors">{job.role}</h2>
                          <span className="px-3 py-1 bg-brand-info/10 text-brand-info text-[9px] font-black uppercase tracking-widest rounded-lg border border-brand-info/20">
                            {job.category}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-slate-500 text-xs font-bold uppercase tracking-tighter">
                          <div className="flex items-center gap-1.5">
                            <Building2 size={14} className="text-brand-info" />
                            {job.company}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-brand-info" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-brand-info" />
                            Deadline: {job.deadline}
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          {job.tags.map(tag => (
                            <span key={tag} className="text-[10px] font-black text-slate-400">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-4 shrink-0">
                      <div className="text-center md:text-right">
                        <p className="text-xl font-black text-slate-900 dark:text-white">{job.package}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Posted {job.posted}</p>
                      </div>
                      <button className="btn-primary py-3 px-8 text-xs whitespace-nowrap shadow-brand-info/20">
                        Apply Now <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="resources"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {[
                  { title: 'Resume Templates', desc: 'ATS-friendly Google Docs and LaTeX templates.', icon: BookMarked, color: 'text-brand-primary' },
                  { title: 'Interview Questions', desc: 'Top 50 Data Structures and System Design questions.', icon: Trophy, color: 'text-brand-warning' },
                  { title: 'Coding Sheets', desc: 'Daily practice sheets for SDE-1 preparations.', icon: Building2, color: 'text-brand-success' },
                  { title: 'Career Guide 2024', desc: 'Complete PDF on how to land internships.', icon: Download, color: 'text-brand-info' },
                ].map((item) => (
                  <div key={item.title} className="glass-card p-10 rounded-[3rem] group cursor-pointer hover:border-brand-primary/30 transition-all">
                    <div className={`w-16 h-16 rounded-[1.5rem] bg-slate-50 dark:bg-slate-900 flex items-center justify-center ${item.color} mb-6 shadow-sm border border-slate-100 dark:border-white/5`}>
                      <item.icon size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-brand-primary transition-colors">{item.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed mb-6">{item.desc}</p>
                    <button className="text-sm font-black text-brand-primary uppercase tracking-widest flex items-center gap-2">
                      Access Now <ChevronRight size={16} />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
