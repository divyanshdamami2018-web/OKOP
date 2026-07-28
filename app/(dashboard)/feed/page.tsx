'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  Sparkles,
  Flame,
  Briefcase,
  ArrowRight,
  TrendingUp,
  Star,
  BookOpen,
  ChevronRight,
  Target,
  Rocket
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useActivities } from '@/hooks/useActivities';
import { useMeetSpots } from '@/hooks/useMeetSpots';
import { useAuth } from '@/components/auth/AuthProvider';
import { UserProfile } from '@/types';
import Link from 'next/link';

// Lazy-load everything below the fold — none needed for first paint
const MomentsFeed = dynamic(() => import('@/components/feed/MomentsFeed').then(m => ({ default: m.MomentsFeed })), {
  loading: () => <div className="h-44 bg-slate-100 dark:bg-slate-900 rounded-3xl animate-pulse" />,
  ssr: false
});
const ActivityCard = dynamic(() => import('@/components/ActivityCard').then(m => ({ default: m.ActivityCard })), { ssr: false });
const ScheduleStrip = dynamic(() => import('@/components/feed/ScheduleStrip').then(m => ({ default: m.ScheduleStrip })), { ssr: false });
const PlacementWidget = dynamic(() => import('@/components/feed/DashboardWidgets').then(m => ({ default: m.PlacementWidget })), { ssr: false });
const FriendSuggestions = dynamic(() => import('@/components/feed/DashboardWidgets').then(m => ({ default: m.FriendSuggestions })), { ssr: false });
const LostFoundWidget = dynamic(() => import('@/components/feed/DashboardWidgets').then(m => ({ default: m.LostFoundWidget })), { ssr: false });
const QuickActions = dynamic(() => import('@/components/feed/QuickActions').then(m => ({ default: m.QuickActions })), { ssr: false });
const CreateMomentModal = dynamic(() => import('@/components/feed/CreateMomentModal').then(m => ({ default: m.CreateMomentModal })), { ssr: false });


export default function HomeDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const { activities, loading: activitiesLoading } = useActivities();
  const { spots } = useMeetSpots();

  const stats = useMemo(() => {
    const spotsTotal = spots.reduce((acc, spot) => acc + spot.liveCount, 0);
    const activitiesTotal = activities.reduce((acc, act) => acc + act.currentParticipants, 0);

    // Calculate Profile Completion %
    let completion = 0;
    if (profile) {
      const fields: (keyof UserProfile)[] = ['name', 'username', 'avatar', 'college', 'department', 'bio', 'interests', 'skills'];
      const filled = fields.filter(f => {
        const val = profile[f];
        return val && (Array.isArray(val) ? val.length > 0 : true);
      }).length;
      completion = Math.round((filled / fields.length) * 100);
    }

    return {
      totalActive: spotsTotal + activitiesTotal,
      attendance: 92, // Default static for now until schema updated
      xp: profile?.xp_points || 0,
      completion
    };
  }, [spots, activities, profile]);

  const firstName = profile?.name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || 'Student';

  const [isMomentModalOpen, setIsMomentModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12 pb-32 animate-slide-up relative overflow-hidden md:overflow-visible">
      {/* Animated Background Mesh */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] -left-[10%] w-[60%] h-[60%] bg-brand-primary/5 blur-[120px] rounded-full animate-blob" />
        <div className="absolute bottom-[-10%] -right-[10%] w-[50%] h-[50%] bg-brand-secondary/5 blur-[120px] rounded-full animate-blob animate-delay-200" />
      </div>

      <CreateMomentModal isOpen={isMomentModalOpen} onClose={() => setIsMomentModalOpen(false)} />

      {/* 1. Personal Command Center Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-4 relative">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-2 text-brand-primary font-black uppercase tracking-[0.3em] text-[10px] bg-brand-primary/5 w-fit px-4 py-1.5 rounded-full border border-brand-primary/10 shadow-sm">
              <Target size={12} className="animate-pulse" />
              Personal Control Center
            </div>
            {profile?.created_at && (
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Last Sync: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85]">
            Hey, <span className="text-gradient">{firstName}</span> <span className="wave">👋</span>
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
              Your university vibe is <span className="text-brand-success font-black uppercase tracking-widest text-sm">High</span>.
            </p>
            <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-900 rounded-full border border-slate-100 dark:border-white/5 shadow-sm">
              <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-brand-primary" style={{ width: `${stats.completion}%` }} />
              </div>
              <span className="text-[9px] font-black text-brand-primary uppercase">{stats.completion}% Profile</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Quick Stats Pill */}
          <div className="flex items-center gap-6 bg-white dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-premium">
            <div className="text-center space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance</p>
              <p className="text-2xl font-black text-brand-primary">{stats.attendance}%</p>
            </div>
            <div className="w-px h-10 bg-slate-100 dark:bg-white/5" />
            <div className="text-center space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global XP</p>
              <p className="text-2xl font-black text-brand-secondary">{stats.xp.toLocaleString()}</p>
            </div>
          </div>

          <button
            onClick={() => setIsMomentModalOpen(true)}
            className="btn-primary py-5 px-10 rounded-[2rem] shadow-brand group"
          >
            <Rocket size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            <span>Launch Action</span>
          </button>
        </div>
      </section>

      {/* 2. Today's Mission (Schedule) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
            Today's <span className="text-brand-primary underline decoration-brand-primary/20 decoration-8 underline-offset-[10px]">Schedule</span>
          </h2>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-2xl">
            October 24, 2024
          </div>
        </div>
        <ScheduleStrip />
      </section>

      {/* 3. Campus Pulse Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Left Interactive Column (8 cols) */}
        <div className="lg:col-span-8 space-y-12">

          {/* Quick Hub Navigation */}
          <QuickActions />

          {/* Social Moments Feed */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-slate-900 dark:text-white">
                Live Pulse <Flame size={22} className="text-brand-accent animate-bounce-subtle" fill="currentColor" />
              </h2>
              <button className="btn-secondary py-2.5 px-6 rounded-2xl text-[10px]">
                Post a Moment
              </button>
            </div>
            <MomentsFeed />
          </section>

          {/* Placement & Opportunity Highlight */}
          <div className="bg-brand-primary/5 rounded-[4rem] border border-brand-primary/10 p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 blur-[100px] -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-[2rem] bg-white dark:bg-slate-950 flex items-center justify-center text-brand-primary shadow-xl border border-white dark:border-white/5">
                  <Briefcase size={32} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">Internship <span className="text-brand-primary">Alerts</span></h2>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Google and Tesla just posted new student roles. Your profile matches 85% of the requirements!
                  </p>
                </div>
                <Link href="/placement" className="btn-primary w-fit px-10">
                  Open Career Hub <ArrowRight size={18} />
                </Link>
              </div>
              <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-white/5 p-6 shadow-2xl">
                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Newest in Hub</p>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5 group/job cursor-pointer">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center font-black text-slate-400 group-hover/job:text-brand-primary transition-colors">T</div>
                            <p className="text-sm font-black text-slate-900 dark:text-white">ML Engineer</p>
                         </div>
                         <ChevronRight size={14} className="text-slate-300" />
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>

          {/* Academic Vault Preview */}
          <section className="space-y-8">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black tracking-tight">Academic Vault</h2>
                <div className="px-3 py-1 bg-brand-success/10 text-brand-success text-[10px] font-black rounded-lg border border-brand-success/20">NEW PAPERS</div>
              </div>
              <Link href="/notes" className="text-xs font-black text-brand-primary uppercase tracking-widest flex items-center gap-1 hover:underline">
                Open Vault <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="glass-card p-6 rounded-[2.5rem] flex items-center gap-6 group cursor-pointer hover:border-brand-success/30">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-brand-success/10 flex items-center justify-center text-brand-success shadow-inner">
                    <BookOpen size={32} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-lg leading-tight group-hover:text-brand-success transition-colors">OS Finals Prep.pdf</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">CS • Semester 5 • Shared by Sarah</p>
                    <div className="flex items-center gap-3 mt-3">
                       <span className="text-[9px] font-black text-brand-success uppercase">1.2k Downloads</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Widgets Column (4 cols) */}
        <div className="lg:col-span-4 space-y-10">

          {/* AI Matching Hub */}
          <div className="bg-brand-gradient p-10 rounded-[4rem] text-white relative overflow-hidden shadow-2xl shadow-brand-primary/20 group cursor-pointer">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:scale-125" />
             <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center shadow-inner">
                  <Sparkles size={32} className="animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black tracking-tighter leading-tight text-white">AI Buddy <br/>Matching</h3>
                  <p className="text-white/70 text-sm font-medium leading-relaxed">
                    Based on your interest in <span className="text-white font-bold underline">#Robotics</span>, we've found 3 students for your project squad.
                  </p>
                </div>
                <Link href="/ai-matching" className="flex items-center gap-3 bg-white text-brand-primary w-full py-5 rounded-[1.75rem] font-black uppercase tracking-widest text-[10px] justify-center shadow-xl hover:scale-105 active:scale-95 transition-all">
                  Run Neural Match <ArrowRight size={14} strokeWidth={3} />
                </Link>
             </div>
          </div>

          <PlacementWidget />
          <FriendSuggestions />
          <LostFoundWidget />

          {/* Gamification / Daily Streak Center */}
          <div className="glass-card rounded-[3.5rem] p-10 relative overflow-hidden group border-brand-warning/10">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-warning/5 blur-3xl -mr-16 -mt-16" />
             <div className="flex items-center justify-between mb-10 px-2">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.25em] flex items-center gap-2">
                   <TrendingUp size={14} className="text-brand-warning" />
                   Participation
                </h3>
                <Star className="text-brand-warning animate-spin-slow" size={24} fill="currentColor" fillOpacity={0.2} />
             </div>
             <div className="space-y-6">
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">7 <span className="text-2xl">Days</span></p>
                      <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Active Streak</p>
                   </div>
                   <div className="text-right">
                      <p className="text-2xl font-black text-brand-warning">+250 XP</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bonus Unlocked</p>
                   </div>
                </div>
                <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-white/5 shadow-inner">
                   <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-brand-warning rounded-full shadow-[0_0_20px_#f59e0b] relative overflow-hidden"
                   >
                     <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                   </motion.div>
                </div>
                <p className="text-xs font-medium text-slate-500 text-center leading-relaxed">
                  You're in the top <span className="text-brand-warning font-black">5% of students</span> this week! 🏆
                </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
