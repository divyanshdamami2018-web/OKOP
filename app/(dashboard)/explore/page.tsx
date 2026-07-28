'use client';

import React, { useState } from 'react';
import { SidebarNav } from '@/components/SidebarNav';
import {
  Search,
  Compass,
  Star,
  Hash,
  Flame,
  Loader2,
  UserPlus,
  MessageCircle,
  Plus,
  Users,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClubs } from '@/hooks/useClubs';
import { usePeople } from '@/hooks/usePeople';
import { PersonCard } from '@/components/explore/PersonCard';
import { Leaderboard } from '@/components/explore/Leaderboard';

type TabType = 'All' | 'Clubs' | 'Interests' | 'Events' | 'People';

const TRENDING_TAGS = [
  { name: 'Hackathon2024', count: '1.2k', growth: '+12%' },
  { name: 'StanfordSpikeball', count: '850', growth: '+5%' },
  { name: 'LofiStudy', count: '2.1k', growth: '+24%' },
  { name: 'MidnightYoga', count: '430', growth: '+8%' },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const { clubs, loading: clubsLoading, joinClub } = useClubs();
  const { people, loading: peopleLoading } = usePeople(activeTab === 'People' ? searchQuery : '');

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px] animate-blob" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-brand-secondary/10 rounded-full blur-[100px] animate-blob animate-delay-200" />
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-brand-success/5 rounded-full blur-[100px] animate-blob animate-delay-500" />

        {/* Floating Icons */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] right-[20%] text-brand-primary/20"
        >
          <Sparkles size={120} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] left-[15%] text-brand-secondary/20"
        >
          <Compass size={140} />
        </motion.div>
      </div>

      <SidebarNav />

      <main className="flex-1 md:ml-24 transition-all duration-500 relative z-10">
        {/* Modern Header */}
        <header className="sticky top-0 z-40 bg-slate-950/40 backdrop-blur-3xl border-b border-white/5 px-6 py-6 md:py-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="relative group">
                <div className="absolute -inset-2 bg-brand-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full -z-10" />
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-4"
                >
                  <div className="p-3 bg-brand-primary/10 rounded-2xl border border-brand-primary/20 relative">
                    <Compass className="text-brand-primary animate-pulse-gentle" size={32} />
                    <div className="absolute inset-0 bg-brand-primary/5 animate-ping rounded-2xl opacity-20" />
                  </div>
                  <span>Explore <span className="text-gradient">Campus</span></span>
                </motion.h1>
                <p className="text-slate-500 mt-2 font-medium ml-1">Connect with the pulse of your university.</p>
              </div>

              <div className="relative flex-1 max-w-xl group">
                <div className="absolute -inset-1 bg-brand-gradient opacity-0 group-focus-within:opacity-10 blur-xl transition-opacity rounded-[2rem]" />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input
                  type="text"
                  placeholder={`Search ${activeTab.toLowerCase()}...`}
                  className="glass-input w-full py-4 pl-12 pr-4 text-sm border-white/10 focus:border-brand-primary/40 focus:bg-slate-900/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Sliding Background Tab Bar */}
            <div className="flex p-1.5 bg-slate-900/50 rounded-[2rem] border border-white/5 backdrop-blur-xl w-fit">
              {['All', 'Clubs', 'Interests', 'Events', 'People'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as TabType)}
                  className={`relative px-8 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap overflow-hidden ${
                    activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="explore-tab-bg"
                      className="absolute inset-0 bg-brand-gradient -z-10 shadow-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-16">
              <AnimatePresence mode="wait">
                {activeTab === 'People' ? (
                  <motion.section
                    key="people"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {peopleLoading ? (
                      <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-brand-primary" size={40} />
                        <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">Finding students...</p>
                      </div>
                    ) : (
                      people.map((person) => (
                        <PersonCard key={person.id} person={person} />
                      ))
                    )}
                  </motion.section>
                ) : (
                  <motion.div
                    key="discovery"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-16"
                  >
                    {/* NEW: Featured Spotlight Section */}
                    <section className="space-y-8">
                       <div className="flex items-center gap-3 px-2">
                          <div className="w-1.5 h-6 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                          <h2 className="text-2xl font-black tracking-tight">Today's <span className="text-brand-primary">Spotlight</span></h2>
                       </div>

                       <div className="relative h-[300px] rounded-[3rem] overflow-hidden group shadow-3xl">
                          <img
                            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&h=600&auto=format&fit=crop"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            alt="Spotlight"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                          <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row items-end justify-between gap-6">
                             <div className="space-y-3">
                                <span className="px-3 py-1 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">Featured Squad</span>
                                <h3 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tighter">Campus Tech <br/>Innovators Club</h3>
                                <div className="flex items-center gap-4 text-white/70 text-xs font-bold uppercase tracking-widest">
                                   <div className="flex items-center gap-1.5"><Users size={14} /> 850 Members</div>
                                   <div className="flex items-center gap-1.5"><Star size={14} className="text-brand-warning" fill="currentColor" /> 4.9 Rating</div>
                                </div>
                             </div>
                             <button className="btn-primary py-4 px-10 rounded-2xl whitespace-nowrap">Join Squad</button>
                          </div>
                       </div>
                    </section>

                    {/* Featured Club / Community */}
                    <section>
                      <div className="flex items-center justify-between mb-8 px-2 relative">
                        <div className="absolute -left-4 w-1 h-10 bg-brand-gradient rounded-full" />
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                          <Star className="text-brand-warning animate-bounce-subtle" size={24} fill="currentColor" fillOpacity={0.2} />
                          Top Communities
                        </h2>
                        <button className="text-brand-primary text-xs font-black uppercase tracking-[0.2em] hover:opacity-80 transition-all border-b-2 border-brand-primary/20 pb-1">View All</button>
                      </div>

                      {clubsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-40 rounded-4xl bg-slate-900/50 animate-pulse border border-white/5 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {filteredClubs.map((club) => (
                            <motion.div
                              key={club.id}
                              whileHover={{ y: -8, scale: 1.02 }}
                              className="glass-card p-6 rounded-4xl group cursor-pointer relative overflow-hidden"
                            >
                              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />

                              <div className="flex gap-5 relative z-10">
                                <img
                                  src={club.image_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=200&h=200&auto=format&fit=crop'}
                                  alt={club.name}
                                  className="w-24 h-24 rounded-3xl object-cover ring-2 ring-slate-800 group-hover:ring-brand-primary/50 transition-all shadow-2xl"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-md">
                                      {club.category}
                                    </span>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); joinClub(club.id); }}
                                      className="p-2 bg-slate-950 rounded-xl hover:bg-brand-primary transition-all shadow-lg border border-white/5"
                                    >
                                      <Plus size={16} className="text-white" />
                                    </button>
                                  </div>
                                  <h3 className="font-black text-slate-100 text-lg leading-tight truncate mt-2 group-hover:text-brand-primary transition-colors">
                                    {club.name}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-4 text-slate-500">
                                    <Users size={14} className="text-brand-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-tighter">
                                      {club.membersCount.toLocaleString()} Students
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </section>

                    {/* Creative Discovery Banner */}
                    <motion.section
                      whileHover={{ scale: 1.01 }}
                      className="bg-mesh-dynamic rounded-[3rem] p-10 relative overflow-hidden group cursor-pointer shadow-3xl border border-white/10"
                    >
                      <div className="absolute inset-0 bg-brand-gradient opacity-10" />
                      <div className="relative z-10 max-w-lg">
                        <div className="flex items-center gap-2 text-brand-primary text-xs font-black uppercase tracking-[0.25em] mb-4">
                          <Sparkles size={16} className="animate-pulse" />
                          Limited Opportunity
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter">
                          Become a <br/>Campus <span className="text-gradient">Ambassador</span>
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mt-6 font-medium text-lg leading-relaxed">
                          Host 5 activities this month to unlock the exclusive <span className="text-brand-primary font-black">Gold Pulse</span> badge and triple XP rewards.
                        </p>
                        <button className="mt-10 px-12 py-5 bg-brand-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-brand-primary/40 hover:scale-105 transition-all active:scale-95 flex items-center gap-3">
                          Learn More <ArrowRight size={20} strokeWidth={3} />
                        </button>
                      </div>

                      {/* Decorative 3D-ish Icons */}
                      <motion.div
                        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute right-10 top-10 opacity-10 dark:opacity-20"
                      >
                        <Trophy size={180} />
                      </motion.div>
                      <motion.div
                        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="absolute right-20 bottom-10 opacity-10 dark:opacity-20"
                      >
                        <Star size={120} />
                      </motion.div>
                    </motion.section>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar with Stats & Trends */}
            <div className="lg:col-span-1 space-y-10">
              <Leaderboard />

              <section className="glass-card rounded-[2.5rem] p-8 border-white/5">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                    <TrendingUp className="text-brand-accent" size={24} />
                    Trending
                  </h3>
                </div>

                <div className="space-y-6">
                  {TRENDING_TAGS.map((tag) => (
                    <div key={tag.name} className="flex justify-between items-center group cursor-pointer">
                      <div className="space-y-1">
                        <p className="text-slate-100 font-black text-sm group-hover:text-brand-primary transition-colors tracking-tight">#{tag.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{tag.count} students active</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-brand-success">{tag.growth}</span>
                        <ArrowUpRight size={14} className="text-slate-700 group-hover:text-brand-primary" />
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-10 py-4 bg-slate-900/50 hover:bg-slate-900 border border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">
                  Show More
                </button>
              </section>

              <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 border border-brand-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-brand-primary/20 blur-2xl rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-widest text-brand-primary mb-3">Campus Pro Tip</h3>
                <p className="text-slate-300 text-sm font-medium leading-relaxed italic">
                  "Checking into a <span className="text-white font-bold">Live Meet Spot</span> during finals week doubles your XP gain and helps others find study buddies!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
