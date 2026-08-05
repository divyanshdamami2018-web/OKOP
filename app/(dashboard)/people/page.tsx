'use client';

import React, { useState } from 'react';
import { SidebarNav } from '@/components/SidebarNav';
import {
  Users,
  Search,
  UserPlus,
  UserCheck,
  Clock,
  Filter,
  Sparkles,
  MapPin,
  MessageCircle,
  MoreVertical,
  Loader2,
  Bell,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePeople } from '@/hooks/usePeople';
import { useFriendSystem } from '@/hooks/useFriendSystem';
import { PersonCard } from '@/components/explore/PersonCard';

export default function PeoplePage() {
  const [query, setQuery] = useState('');
  const { people, loading: peopleLoading } = usePeople(query);
  const { requests, friends, loading: friendLoading, respondToRequest } = useFriendSystem();
  const [activeTab, setActiveTab] = useState<'discover' | 'friends' | 'requests'>('discover');

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-10 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 text-slate-900 dark:text-white">
            <Users className="text-brand-primary" size={36} />
            Student <span className="text-brand-primary">Network</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Connect with your campus community.</p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-3xl border border-slate-200 dark:border-white/5">
          {[
            { id: 'discover', label: 'Discover', icon: Search },
            { id: 'friends', label: 'Friends', icon: Users },
            { id: 'requests', label: 'Requests', icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-800 text-brand-primary shadow-xl scale-105'
                  : 'text-slate-500 hover:text-brand-primary'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
              {tab.id === 'requests' && requests.length > 0 && (
                <span className="w-4 h-4 bg-brand-accent text-white text-[8px] flex items-center justify-center rounded-full">
                  {requests.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'discover' && (
          <motion.div
            key="discover"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* AI Friend Matching Banner */}
            <div className="bg-brand-gradient rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-brand-primary/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-32 -mt-32" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full w-fit text-[10px] font-black uppercase tracking-widest">
                    <Sparkles size={12} fill="white" />
                    AI Match Engine
                  </div>
                  <h2 className="text-3xl font-black tracking-tight">Find Your Academic Soulmate</h2>
                  <p className="text-white/70 font-medium max-w-xl">Our AI analyzes your interests, branch, and activity level to find students you'll actually vibe with.</p>
                </div>
                <button className="px-8 py-4 bg-white text-brand-primary rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all active:scale-95 shadow-xl whitespace-nowrap">
                  Run AI Match
                </button>
              </div>
            </div>

            <div className="relative group max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search by name, branch, or skills..."
                className="glass-input w-full py-4 pl-12 pr-4 text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {peopleLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-brand-primary" size={40} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {people.map(person => (
                  <PersonCard key={person.id} person={person} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'friends' && (
          <motion.div
            key="friends"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {friends.length === 0 ? (
                <div className="col-span-full py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center text-slate-300 mx-auto">
                    <Users size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">No friends yet</h3>
                  <p className="text-slate-500 text-sm">Start exploring to find your campus squad!</p>
                  <button onClick={() => setActiveTab('discover')} className="btn-primary py-3 px-8 mt-4 mx-auto">Find People</button>
                </div>
              ) : (
                friends.map(friend => (
                  <PersonCard key={friend.id} person={friend} />
                ))
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'requests' && (
          <motion.div
            key="requests"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            {requests.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center text-slate-300 mx-auto">
                  <Bell size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">No pending requests</h3>
                <p className="text-slate-500 text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div key={req.id} className="glass-card p-6 rounded-3xl flex items-center justify-between border-brand-primary/10">
                    <div className="flex items-center gap-4">
                      <img src={req.sender?.avatar} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800" alt="Sender" />
                      <div>
                        <h4 className="font-black text-slate-900 dark:text-white">{req.sender?.name}</h4>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{req.sender?.college}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-brand-primary uppercase">
                          <Clock size={10} /> {new Date(req.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => respondToRequest(req.id, 'accepted')}
                        className="p-3 bg-brand-primary text-white rounded-2xl hover:scale-105 transition-all shadow-lg shadow-brand-primary/20"
                      >
                        <UserCheck size={20} />
                      </button>
                      <button
                        onClick={() => respondToRequest(req.id, 'rejected')}
                        className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
