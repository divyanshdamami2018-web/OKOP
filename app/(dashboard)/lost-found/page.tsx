'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  Plus,
  MapPin,
  Clock,
  Filter,
  Camera,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  MessageCircle,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Electronics', 'Wallets/IDs', 'Keys', 'Books', 'Other'];

const ITEMS = [
  {
    id: '1',
    title: 'Silver Apple Watch SE',
    desc: 'Found near the Sports Ground benches. It has a blue sport band.',
    location: 'Sports Ground',
    time: '20 mins ago',
    type: 'found',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=400&h=300&auto=format&fit=crop',
    reporter: { name: 'Aryan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan' }
  },
  {
    id: '2',
    title: 'Blue Nike Backpack',
    desc: 'Lost my bag containing a laptop charger and some notebooks. Probably left it in the Library.',
    location: 'Main Library',
    time: '2 hours ago',
    type: 'lost',
    category: 'Other',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&h=300&auto=format&fit=crop',
    reporter: { name: 'Sneha', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha' }
  },
  {
    id: '3',
    title: 'Student ID Card',
    desc: 'Found an ID card for Rahul Sharma (Year 3). Left it at the reception desk.',
    location: 'Student Union',
    time: 'Yesterday',
    type: 'found',
    category: 'Wallets/IDs',
    reporter: { name: 'John', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' }
  }
];

export default function LostFoundPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found'>('all');
  const [category, setCategory] = useState('All');

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 text-slate-900 dark:text-white">
            <HelpCircle className="text-brand-danger" size={36} />
            Lost & <span className="text-brand-danger">Found</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Helping campus items find their way back home.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-3xl border border-slate-200 dark:border-white/5">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'all' ? 'bg-white dark:bg-slate-800 text-brand-danger shadow-xl' : 'text-slate-500'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('lost')}
              className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'lost' ? 'bg-white dark:bg-slate-800 text-brand-danger shadow-xl' : 'text-slate-500'
              }`}
            >
              Lost
            </button>
            <button
              onClick={() => setActiveTab('found')}
              className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'found' ? 'bg-white dark:bg-slate-800 text-brand-danger shadow-xl' : 'text-slate-500'
              }`}
            >
              Found
            </button>
          </div>
          <button className="btn-primary py-3.5 px-8 !bg-brand-danger shadow-brand-danger/20 whitespace-nowrap">
            <Plus size={20} /> Report Item
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-[2.5rem] p-8">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Filter by Category</h3>
            <div className="space-y-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    category === cat
                      ? 'bg-brand-danger/10 text-brand-danger border border-brand-danger/20'
                      : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <ShieldCheck size={24} />
            </div>
            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Verified Recovery</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              When claiming an item, we use AI to verify your student ID and match your description with the reporter's logs.
            </p>
          </div>
        </div>

        {/* Items Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {ITEMS.filter(item =>
                (activeTab === 'all' || item.type === activeTab) &&
                (category === 'All' || item.category === category)
              ).map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  key={item.id}
                  className="glass-card rounded-[2.5rem] overflow-hidden group cursor-pointer"
                >
                  {item.image && (
                    <div className="relative aspect-video overflow-hidden">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1.5 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg border border-white/20 ${
                          item.type === 'found' ? 'bg-emerald-500/80 text-white' : 'bg-brand-danger/80 text-white'
                        }`}>
                          {item.type === 'found' ? 'Found' : 'Lost'}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-8 space-y-6">
                    {!item.image && (
                      <div className={`p-4 rounded-2xl w-fit ${item.type === 'found' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-brand-danger/10 text-brand-danger'}`}>
                        {item.type === 'found' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                      </div>
                    )}

                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-brand-danger transition-colors">{item.title}</h3>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">{item.desc}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-brand-danger" />
                        {item.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-brand-danger" />
                        {item.time}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={item.reporter.avatar} className="w-8 h-8 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800" alt="Reporter" />
                        <div>
                          <p className="text-[10px] font-black text-slate-900 dark:text-white">{item.reporter.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Reporter</p>
                        </div>
                      </div>
                      <button className="p-2.5 bg-slate-100 dark:bg-slate-900 text-slate-500 rounded-xl hover:text-brand-danger transition-all active:scale-90">
                        <MessageCircle size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Post CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="group rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 hover:border-brand-danger/50 hover:bg-brand-danger/5 transition-all relative overflow-hidden min-h-[300px]"
            >
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-brand-danger group-hover:border-brand-danger/50 transition-all shadow-xl">
                <Camera size={32} />
              </div>
              <div className="text-center px-8">
                <p className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Post Something</p>
                <p className="text-xs text-slate-500 mt-2 font-medium">Lost your wallet? Found some keys? Let the campus know.</p>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
