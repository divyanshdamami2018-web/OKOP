'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  Calendar,
  MapPin,
  Award,
  Instagram,
  Twitter,
  Sparkles,
  Zap,
  Star,
  Github,
  Linkedin,
  Globe,
  Mail,
  Smartphone,
  ShieldCheck,
  MoreHorizontal,
  Flame,
  Crown
} from 'lucide-react';
import { UserProfile } from '@/types';

interface ProfileCardProps {
  user: UserProfile;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-[3rem] overflow-hidden relative group border-white/40 dark:border-white/5 shadow-2xl"
    >
      {/* Hero Header / Cover */}
      <div className="h-44 bg-gradient-to-br from-brand-primary/20 via-brand-secondary/20 to-brand-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] dark:opacity-[0.1]" />

        {/* Dynamic Badges Overlay */}
        <div className="absolute top-6 right-8 flex flex-col gap-2 items-end">
          <div className="px-4 py-1.5 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest text-brand-primary flex items-center gap-2 shadow-xl">
            <Crown size={12} fill="currentColor" />
            Top 1% Contributor
          </div>
          <div className="px-4 py-1.5 bg-brand-warning/90 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
            <Flame size={12} fill="white" />
            {user.daily_streak} Day Streak
          </div>
        </div>
      </div>

      <div className="px-8 pb-10 relative">
        {/* Avatar Section */}
        <div className="relative -mt-20 mb-8 flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="relative group/avatar self-center md:self-auto">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="relative z-10"
            >
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt={user.name}
                className="w-36 h-36 rounded-[2.5rem] border-8 border-white dark:border-slate-950 object-cover shadow-2xl transition-all duration-500"
              />
            </motion.div>
            {user.status === 'online' && (
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-brand-success border-4 border-white dark:border-slate-950 rounded-full z-20 shadow-lg animate-pulse-gentle" />
            )}
            <div className="absolute -inset-4 bg-brand-primary/20 blur-2xl opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-full -z-10" />
          </div>

          <div className="flex gap-3 mb-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-500 hover:text-brand-primary hover:border-brand-primary/30 transition-all border border-slate-200 dark:border-white/5 active:scale-95 shadow-sm">
              <Share2 size={20} />
            </button>
            <button className="flex-1 md:flex-none btn-primary py-4 px-10 text-xs font-black uppercase tracking-widest">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Identity & Basic Info */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{user.name}</h2>
            <div className="flex items-center gap-2">
              <div className="bg-brand-primary/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                <BadgeCheck size={16} className="text-brand-primary" fill="currentColor" fillOpacity={0.1} />
                <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Verified</span>
              </div>
              <span className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">@{user.username}</span>
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-400 font-medium text-lg max-w-2xl leading-relaxed">
            {user.bio || 'Product Designer & AI Enthusiast. Building the next generation of campus tools.'}
          </p>

          <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/5">
              <GraduationCap size={16} className="text-brand-secondary" />
              <span>{user.college} • {user.branch} '26</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/5">
              <Star size={16} className="text-brand-warning" fill="currentColor" fillOpacity={0.2} />
              <span>Lvl {Math.floor(user.xp_points / 100)} Legend</span>
            </div>
          </div>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="XP Points" value={user.xp_points.toLocaleString()} color="brand-primary" />
          <StatBox label="Friends" value="1.2k" color="brand-secondary" />
          <StatBox label="Activities" value="48" color="brand-accent" />
          <StatBox label="Communities" value="12" color="brand-info" />
        </div>

        {/* Skills & Interests Tags */}
        <div className="mt-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 px-1">Social Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map(tag => (
                  <span key={tag} className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl text-[10px] font-black text-slate-600 dark:text-slate-400 hover:text-brand-primary hover:border-brand-primary/30 transition-all cursor-default shadow-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 px-1">Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map(skill => (
                  <span key={skill} className="px-4 py-2 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl text-[10px] font-black text-brand-primary transition-all cursor-default shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions / Links */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <SocialLink icon={Github} href={user.github_url} />
            <SocialLink icon={Linkedin} href={user.linkedin_url} />
            <SocialLink icon={Globe} href={user.website_url} />
            <div className="w-px h-6 bg-slate-200 dark:bg-white/5 mx-2" />
            <button className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-brand-primary transition-all">
              <Smartphone size={14} /> Biometric Login Enabled
            </button>
          </div>

          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Student ID Verified</p>
                <p className="text-xs font-black text-brand-success">STU-88294-A</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-brand-success/10 flex items-center justify-center text-brand-success">
                <ShieldCheck size={20} />
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatBox = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className={`p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 group hover:border-${color}/30 transition-all shadow-sm`}>
    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</p>
    <p className={`text-[9px] font-black uppercase tracking-widest mt-1 text-slate-500 group-hover:text-${color}`}>
      {label}
    </p>
  </div>
);

const SocialLink = ({ icon: Icon, href }: { icon: any, href?: string }) => (
  <a
    href={href || '#'}
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-400 hover:text-brand-primary hover:bg-white dark:hover:bg-slate-900 border border-slate-200 dark:border-white/5 transition-all active:scale-90 shadow-sm"
  >
    <Icon size={18} />
  </a>
);

import { Share2, GraduationCap } from 'lucide-react';
