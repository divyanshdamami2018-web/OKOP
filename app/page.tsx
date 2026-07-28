'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from '@/components/layout/Logo';
import {
  ArrowRight,
  Users,
  Flame,
  BookOpen,
  Sparkles,
  MapPin,
  Zap,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Globe,
  MessageSquare
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc, color }: any) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="glass-card p-8 rounded-[3rem] border-white/40 shadow-2xl relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 ${color}/10 blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-all duration-700`} />
    <div className={`w-16 h-16 rounded-[2rem] ${color}/10 flex items-center justify-center ${color} mb-6 shadow-inner`}>
      <Icon size={32} />
    </div>
    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
      {desc}
    </p>
  </motion.div>
);

const StatPill = ({ label, value }: any) => (
  <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl px-8 py-4 rounded-[2rem] border border-white/40 dark:border-white/5 shadow-xl text-center">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</p>
  </div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] -left-[10%] w-[60%] h-[60%] bg-brand-primary/10 blur-[140px] rounded-full animate-pulse-gentle" />
        <div className="absolute bottom-[-10%] -right-[10%] w-[50%] h-[50%] bg-brand-secondary/10 blur-[140px] rounded-full animate-pulse-gentle animate-delay-300" />
        <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-brand-success/5 blur-[120px] rounded-full animate-pulse-gentle animate-delay-500" />
      </div>

      {/* Hero Section */}
      <header className="pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <Logo size="xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85]">
              Your Campus, <br/>
              <span className="text-gradient">Amplified.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
              The ultimate social pulse for modern students. Coordinate squads, share knowledge, and discover the heartbeat of your university.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/signup" className="btn-primary py-6 px-12 rounded-[2.5rem] text-lg shadow-[0_20px_50px_rgba(79,70,229,0.3)] group">
              Join the Pulse <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="btn-secondary py-6 px-12 rounded-[2.5rem] text-lg bg-white dark:bg-slate-900 shadow-xl">
              Sign In
            </Link>
          </motion.div>

          {/* Live Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 pt-12"
          >
            <StatPill label="Active Students" value="12,480+" />
            <StatPill label="Campus Squads" value="450+" />
            <StatPill label="Resources Shared" value="8,200+" />
            <StatPill label="Real-time Events" value="24" />
          </motion.div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-32 px-6 bg-slate-100/50 dark:bg-white/5 backdrop-blur-3xl border-y border-white/40 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase">One App. <span className="text-brand-primary">Infinite</span> Vibes.</h2>
            <div className="w-24 h-1.5 bg-brand-gradient mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <FeatureCard
              icon={Flame}
              title="Live Pulse"
              desc="Real-time social coordination. See where the energy is on campus and join spontaneous activities instantly."
              color="text-brand-accent"
            />
            <FeatureCard
              icon={Users}
              title="Smart Squads"
              desc="AI-powered student matching. Find project partners, study buddies, or workout groups based on your unique profile."
              color="text-brand-primary"
            />
            <FeatureCard
              icon={BookOpen}
              title="Academic Vault"
              desc="The collaborative knowledge base. Access peer-reviewed notes, past papers, and research material effortlessly."
              color="text-brand-success"
            />
            <FeatureCard
              icon={MapPin}
              title="Meet Spots"
              desc="Never lose your team again. Live map tracking for study groups and campus events with high-precision location data."
              color="text-brand-secondary"
            />
            <FeatureCard
              icon={Zap}
              title="Career Hub"
              desc="Direct pipeline to growth. Student-first internship listings, placement alerts, and professional networking."
              color="text-brand-warning"
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Safe & Secure"
              desc="University-verified profiles only. A trusted space for meaningful student interactions and collaboration."
              color="text-emerald-500"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-5xl mx-auto glass-card p-16 rounded-[4rem] border-white/60 text-center space-y-10 relative overflow-hidden bg-white/90 dark:bg-slate-900/90 shadow-[0_40px_100px_rgba(0,0,0,0.2)]">
          <div className="absolute top-0 left-0 w-full h-2 bg-brand-gradient" />
          <div className="space-y-4">
            <Sparkles size={48} className="mx-auto text-brand-primary animate-pulse" />
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white">Ready to <span className="text-gradient">Connect?</span></h2>
            <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto">
              Join thousands of students who are already amplifying their campus experience with OKOP'S.
            </p>
          </div>
          <Link href="/signup" className="btn-primary py-6 px-16 rounded-[2.5rem] text-xl inline-flex">
            Get Started Now
          </Link>

          <div className="flex justify-center gap-8 pt-8 border-t border-slate-100 dark:border-white/5">
             <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <CheckCircle2 size={16} className="text-brand-success" /> Verified Students
             </div>
             <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <CheckCircle2 size={16} className="text-brand-success" /> No Ads
             </div>
             <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <CheckCircle2 size={16} className="text-brand-success" /> Safe Space
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
           <Logo size="sm" />
           <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              <Link href="#" className="hover:text-brand-primary">Terms</Link>
              <Link href="#" className="hover:text-brand-primary">Privacy</Link>
              <Link href="#" className="hover:text-brand-primary">Campus Rules</Link>
              <Link href="#" className="hover:text-brand-primary">Contact Support</Link>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2024 OKOP'S Pulse Engine</p>
        </div>
      </footer>
    </div>
  );
}
