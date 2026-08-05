'use client';

import React, { useEffect, useState } from 'react';
import { SidebarNav } from '@/components/SidebarNav';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { ActivityCard } from '@/components/ActivityCard';
import { Activity, UserProfile } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Share2,
  Grid,
  Bookmark,
  History,
  BookOpen,
  Briefcase,
  Github,
  Linkedin,
  Globe,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Award,
  Heart,
  Plus,
  Check,
  Flame
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const MY_ACTIVITIES: Activity[] = [];

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'social' | 'academic' | 'professional'>('social');

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        setUser({
          id: profile.id,
          name: profile.full_name,
          username: profile.username || 'student',
          avatar: profile.avatar_url,
          cover_url: profile.cover_url,
          bio: profile.bio || 'Student at Stanford University',
          college: profile.college,
          department: profile.department,
          branch: profile.branch,
          semester: profile.semester,
          graduation_year: profile.graduation_year,
          interests: profile.interests || [],
          skills: profile.skills || [],
          xp_points: profile.xp_points || 0,
          daily_streak: profile.daily_streak || 0,
          is_ghost_mode: profile.is_ghost_mode || false,
          onboarding_completed: profile.onboarding_completed || false,
          is_profile_public: profile.is_profile_public ?? true,
          hide_email: profile.hide_email ?? false,
          hide_phone: profile.hide_phone ?? false,
          hide_semester: profile.hide_semester ?? false,
          created_at: profile.created_at || new Date().toISOString(),
          github_url: profile.github_url,
          linkedin_url: profile.linkedin_url,
          website_url: profile.website_url,
        });
      }
    }
    fetchProfile();
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-12">
           <ProfileCard user={user} isOwnProfile={true} />
        </div>

        {/* Tabbed Content */}
        <div className="lg:col-span-12 space-y-8">
          {/* Custom Tabs */}
          <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-white/5">
            {[
              { id: 'social', label: 'Social', icon: Heart },
              { id: 'academic', label: 'Academic', icon: GraduationCap },
              { id: 'professional', label: 'Professional', icon: Briefcase },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.25rem] text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-800 text-brand-primary shadow-xl scale-[1.02]'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <tab.icon size={16} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {activeTab === 'social' && (
                <div className="space-y-8">
                  {/* Interests & Skills */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card rounded-[2.5rem] p-8">
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.interests.map(interest => (
                          <span key={interest} className="px-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-2xl text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                            #{interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="glass-card rounded-[2.5rem] p-8">
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map(skill => (
                          <span key={skill} className="px-4 py-2 bg-brand-primary/10 rounded-2xl text-[10px] font-bold text-brand-primary border border-brand-primary/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-2">Recent Activities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {MY_ACTIVITIES.length > 0 ? (
                        <ActivityCard activity={MY_ACTIVITIES[0]} />
                      ) : (
                        <div className="glass-card p-8 rounded-3xl border-dashed border-2 border-slate-800 text-center col-span-full">
                          <p className="text-slate-500 text-sm font-medium italic">No recent activities found.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'academic' && (
                <div className="glass-card rounded-[2.5rem] p-10 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">University</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white">{user.college}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Department</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white">{user.department || 'Computer Science'}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Branch / Major</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white">{user.branch || 'Artificial Intelligence'}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Current Semester</p>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-black text-brand-primary">{user.semester || '5'}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">th Semester</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-10 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Check size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">Student Verified</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stanford Academic ID: Verified</p>
                      </div>
                    </div>
                    <button className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline flex items-center gap-2">
                      View Certificate <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'professional' && (
                <div className="space-y-8">
                  <div className="glass-card rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 border-brand-primary/20">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-3xl bg-brand-primary flex items-center justify-center text-white shadow-2xl shadow-brand-primary/40">
                        <BookOpen size={32} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Student Resume</h3>
                        <p className="text-slate-500 font-medium">Last updated 2 days ago</p>
                      </div>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                      <button className="btn-secondary flex-1 md:flex-none py-4 px-8">Preview</button>
                      <button className="btn-primary flex-1 md:flex-none py-4 px-8">Download PDF</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-card rounded-[2.5rem] p-8 space-y-6">
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Key Projects</h3>
                      {[1, 2].map(i => (
                        <div key={i} className="group cursor-pointer">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-black text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors">Campus Pulse Engine</h4>
                            <ChevronRight size={14} className="text-slate-300" />
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2">Real-time social coordination platform for students using Next.js and Supabase.</p>
                        </div>
                      ))}
                      <button className="w-full py-3 bg-slate-50 dark:bg-slate-900 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-primary transition-colors">
                        Add New Project
                      </button>
                    </div>

                    <div className="glass-card rounded-[2.5rem] p-8 space-y-6 border-brand-info/10">
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Open For Roles</h3>
                      <div className="space-y-3">
                        {['Software Engineer', 'UI/UX Designer', 'Frontend Dev'].map(role => (
                          <div key={role} className="flex items-center justify-between p-4 bg-brand-info/5 rounded-2xl border border-brand-info/10">
                            <span className="text-xs font-black text-brand-info uppercase tracking-widest">{role}</span>
                            <Check size={14} className="text-brand-info" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
