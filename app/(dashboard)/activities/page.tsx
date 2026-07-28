'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Search,
  Plus,
  MapPin,
  Users,
  QrCode,
  Filter,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Trophy,
  MoreVertical,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActivities } from '@/hooks/useActivities';
import { ActivityCard } from '@/components/ActivityCard';
import { CreateActivityModal } from '@/components/activities/CreateActivityModal';

const CATEGORIES = ['All', 'Academic', 'Workshops', 'Sports', 'Cultural', 'Club Meetings', 'Hackathons'];

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { activities, loading } = useActivities();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-10 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 text-slate-900 dark:text-white">
            <Calendar className="text-brand-primary" size={36} />
            Campus <span className="text-gradient">Events</span>
          </h1>
          <p className="text-slate-500 font-medium">From workshops to hackathons, stay in the loop.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowQR(true)}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-all active:scale-90 shadow-sm"
            title="Scan QR for Check-in"
          >
            <QrCode size={24} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary py-3.5 px-8 whitespace-nowrap"
          >
            <Plus size={20} /> Host Event
          </button>
        </div>
      </header>

      {/* Featured Event - Hackathon Style */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="relative h-[400px] rounded-[3rem] overflow-hidden group cursor-pointer shadow-2xl"
      >
        <img
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&h=600&auto=format&fit=crop"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          alt="Hackathon"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-brand-primary text-white rounded-full w-fit text-[10px] font-black uppercase tracking-widest shadow-lg">
              <Trophy size={12} fill="white" />
              Annual Hackathon 2024
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tighter">
              Build the Future <br /> of Campus Social.
            </h2>
            <div className="flex flex-wrap items-center gap-6 text-white/80 font-bold uppercase tracking-widest text-[10px]">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-brand-primary" /> Main Auditorium
              </div>
              <div className="flex items-center gap-2">
                <Users size={14} className="text-brand-secondary" /> 240/500 Slots
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-brand-accent" /> Dec 15-17
              </div>
            </div>
          </div>

          <button className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all">
            Register Now
          </button>
        </div>
      </motion.div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-6 px-6 md:mx-0 md:px-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-transparent shadow-xl'
                  : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 text-slate-500 hover:border-brand-primary/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search for events..."
            className="glass-input w-full py-3 pl-12 pr-4 text-sm"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activities.map((activity, index) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}

        {/* Placeholder for "More coming soon" */}
        <div className="glass-card rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center gap-6 border-dashed border-2 border-slate-200 dark:border-white/10 group hover:border-brand-primary/50 transition-all">
          <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 group-hover:text-brand-primary transition-all">
            <Sparkles size={32} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Organize Your Own</h4>
            <p className="text-xs text-slate-500 mt-2 font-medium">Create a private event for your branch or an open workshop for the whole campus.</p>
          </div>
          <button className="btn-secondary py-3 px-8 text-[10px] uppercase tracking-widest">
            Host Event
          </button>
        </div>
      </div>

      {/* QR Check-in Modal Overlay */}
      <AnimatePresence>
        {showQR && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQR(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[201] p-6"
            >
              <div className="glass-card rounded-[3rem] p-10 text-center space-y-8 bg-white dark:bg-slate-900">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight">QR Check-in</h3>
                  <p className="text-slate-500 text-sm font-medium">Point your camera at the event QR code to confirm your attendance.</p>
                </div>

                <div className="aspect-square w-full max-w-[240px] mx-auto bg-slate-50 dark:bg-slate-950 rounded-4xl border-4 border-slate-100 dark:border-white/5 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-brand-gradient opacity-10 animate-pulse" />
                  <QrCode size={120} className="text-brand-primary relative z-10 group-hover:scale-110 transition-transform duration-500" />

                  {/* Scanning Animation */}
                  <motion.div
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-0.5 bg-brand-primary shadow-[0_0_15px_rgba(99,102,241,1)] z-20"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <button className="btn-primary py-4 w-full text-xs font-black tracking-[0.2em] uppercase">
                    Select from Gallery
                  </button>
                  <button
                    onClick={() => setShowQR(false)}
                    className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    Close Scanner
                  </button>
                </div>

                <div className="flex items-center gap-3 px-6 py-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-600">
                  <ShieldCheck size={20} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-left">Auto-verifies your student ID during scan</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CreateActivityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
