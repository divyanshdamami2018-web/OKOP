'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Bell,
  Eye,
  Smartphone,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Lock,
  Mail,
  Trash2,
  CheckCircle2,
  Fingerprint,
  Users2,
  Ban,
  AlertTriangle,
  Settings as SettingsIcon,
  Sparkles,
  Palette,
  Zap,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { supabase } from '@/lib/supabase';
import { SidebarNav } from '@/components/SidebarNav';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-10 pb-32">
      <header className="space-y-1">
        <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 text-slate-900 dark:text-white">
          <SettingsIcon className="text-slate-400" size={36} />
          Control <span className="text-gradient">Center</span>
        </h1>
        <p className="text-slate-500 font-medium">Manage your campus identity, privacy, and security.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <SettingsNavButton
            icon={User}
            label="Profile"
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          />
          <SettingsNavButton
            icon={Shield}
            label="Privacy"
            active={activeTab === 'privacy'}
            onClick={() => setActiveTab('privacy')}
          />
          <SettingsNavButton
            icon={Lock}
            label="Security"
            active={activeTab === 'security'}
            onClick={() => setActiveTab('security')}
          />
          <SettingsNavButton
            icon={Bell}
            label="Notifications"
            active={activeTab === 'notifications'}
            onClick={() => setActiveTab('notifications')}
          />
          <SettingsNavButton
            icon={Palette}
            label="Appearance"
            active={activeTab === 'appearance'}
            onClick={() => setActiveTab('appearance')}
          />
          <div className="pt-8 px-4">
            <button
              onClick={() => supabase.auth.signOut().then(() => window.location.href = '/login')}
              className="flex items-center gap-3 text-red-500 font-black uppercase tracking-widest text-[10px] hover:opacity-80 transition-all"
            >
              <LogOut size={16} /> Logout all devices
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-8"
            >
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="glass-card rounded-[3rem] p-10 space-y-10">
                    <div className="flex items-center justify-between">
                       <h2 className="text-2xl font-black tracking-tight">Public Presence</h2>
                       <div className="flex items-center gap-2 text-brand-success text-[10px] font-black uppercase tracking-widest bg-brand-success/10 px-3 py-1 rounded-full border border-brand-success/20">
                         <CheckCircle2 size={12} /> Verified Student
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Display Name</label>
                        <input type="text" className="glass-input w-full py-4 px-6 text-sm" placeholder="Your Name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Username</label>
                        <input type="text" className="glass-input w-full py-4 px-6 text-sm" placeholder="@username" />
                      </div>
                      <div className="col-span-full space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Short Bio</label>
                        <textarea className="glass-input w-full py-4 px-6 text-sm h-32 resize-none" placeholder="Tell the campus about yourself..." />
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-[3rem] p-10 space-y-10 border-brand-primary/10">
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                      Academic Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">College</label>
                        <input type="text" disabled className="glass-input w-full py-4 px-6 text-sm opacity-50 cursor-not-allowed" value="Stanford University" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Department</label>
                        <select className="glass-input w-full py-4 px-6 text-sm appearance-none">
                          <option>Computer Science</option>
                          <option>Artificial Intelligence</option>
                          <option>Electrical Engineering</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div className="glass-card rounded-[3rem] p-10 space-y-8">
                    <h2 className="text-2xl font-black tracking-tight">Visibility Settings</h2>
                    <div className="space-y-4">
                      <ToggleItem
                        icon={Eye}
                        title="Ghost Mode"
                        desc="Hide your real-time location from the Campus Map."
                      />
                      <ToggleItem
                        icon={Users2}
                        title="Private Profile"
                        desc="Only friends can see your academic and social details."
                      />
                      <ToggleItem
                        icon={Mail}
                        title="Hide Email"
                        desc="Prevent other students from seeing your campus email."
                      />
                    </div>
                  </div>

                  <div className="glass-card rounded-[3rem] p-10 space-y-8 border-brand-danger/10">
                    <h2 className="text-2xl font-black tracking-tight text-red-500">Interaction Control</h2>
                    <div className="space-y-4">
                      <SettingsActionItem
                        icon={Ban}
                        title="Blocked Users"
                        desc="Manage the 0 people you have blocked."
                        action="Manage"
                      />
                      <SettingsActionItem
                        icon={AlertTriangle}
                        title="Report a Problem"
                        desc="Found a bug or an inappropriate community?"
                        action="Report"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="glass-card rounded-[3rem] p-10 space-y-8">
                    <h2 className="text-2xl font-black tracking-tight">Authentication</h2>
                    <div className="space-y-4">
                      <SettingsActionItem
                        icon={Lock}
                        title="Change Password"
                        desc="Last changed 3 months ago."
                        action="Update"
                      />
                      <ToggleItem
                        icon={Fingerprint}
                        title="Biometric Login"
                        desc="Use FaceID or Fingerprint for faster campus pulse access."
                        enabled
                      />
                      <SettingsActionItem
                        icon={Smartphone}
                        title="Active Sessions"
                        desc="Currently logged in on 2 devices."
                        action="Manage"
                      />
                    </div>
                  </div>

                  <div className="p-10 rounded-[3rem] bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 space-y-6">
                    <div className="flex items-center gap-4 text-red-500">
                      <Trash2 size={24} />
                      <h2 className="text-xl font-black tracking-tight">Danger Zone</h2>
                    </div>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      Permanently delete your OKOP'S account. All your data, notes, and community memberships will be erased forever. This action is irreversible.
                    </p>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-8 py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="glass-card rounded-[3rem] p-10 space-y-10">
                   <h2 className="text-2xl font-black tracking-tight">Theme Engine</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button
                        onClick={() => setTheme('light')}
                        className={`p-10 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 ${
                          theme === 'light' ? 'border-brand-primary bg-brand-primary/5 shadow-brand' : 'border-slate-100 dark:border-white/5 hover:border-slate-200'
                        }`}
                      >
                         <div className="w-16 h-16 rounded-[1.5rem] bg-white flex items-center justify-center text-brand-primary shadow-xl border border-slate-100">
                           <Sun size={32} />
                         </div>
                         <span className="font-black uppercase tracking-widest text-xs text-slate-900">Dynamic Light</span>
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`p-10 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 ${
                          theme === 'dark' ? 'border-brand-primary bg-brand-primary/5 shadow-brand' : 'border-slate-100 dark:border-white/5 hover:border-slate-800'
                        }`}
                      >
                         <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 flex items-center justify-center text-brand-primary shadow-xl border border-white/10">
                           <Moon size={32} />
                         </div>
                         <span className="font-black uppercase tracking-widest text-xs text-white">Deep Midnight</span>
                      </button>
                   </div>

                   <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-4 mb-4 text-brand-primary">
                        <Sparkles size={20} />
                        <h4 className="font-black text-xs uppercase tracking-widest">Experimental</h4>
                      </div>
                      <ToggleItem
                        icon={Zap}
                        title="Reduced Motion"
                        desc="Disable background mesh animations for better battery life."
                      />
                   </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Save FAB */}
      <div className="fixed bottom-10 right-10 z-[60]">
        <button
          onClick={() => { setIsSaving(true); setTimeout(() => setIsSaving(false), 1500); }}
          className="btn-primary py-4 px-10 rounded-[2rem] shadow-2xl flex items-center gap-3 group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          {isSaving ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={18} strokeWidth={3} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[201] p-6"
            >
              <div className="glass-card rounded-[3rem] p-10 text-center space-y-8">
                 <div className="w-20 h-20 bg-red-500/10 rounded-[2rem] flex items-center justify-center text-red-500 mx-auto">
                    <Trash2 size={40} />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight">Are you sure?</h3>
                    <p className="text-slate-500 text-sm font-medium">This will permanently delete your account and all associated data.</p>
                 </div>
                 <div className="flex flex-col gap-3">
                    <button className="w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">
                       Yes, Delete Everything
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="w-full py-4 bg-slate-100 dark:bg-slate-900 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs"
                    >
                       Wait, Cancel
                    </button>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingsNavButton({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-5 rounded-[1.75rem] transition-all group ${
        active
          ? 'bg-brand-primary text-white shadow-brand'
          : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-4">
        <Icon size={20} strokeWidth={active ? 3 : 2} />
        <span className={`text-sm font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
          {label}
        </span>
      </div>
      <ChevronRight size={16} className={`${active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'} transition-all`} />
    </button>
  );
}

function ToggleItem({ icon: Icon, title, desc, enabled = false }: { icon: any, title: string, desc: string, enabled?: boolean }) {
  const [isOn, setIsOn] = useState(enabled);
  return (
    <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950/50 rounded-[2rem] border border-slate-100 dark:border-white/5 group hover:border-brand-primary/20 transition-all shadow-sm">
      <div className="flex items-center gap-5">
        <div className={`p-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-400 group-hover:text-brand-primary transition-all border border-slate-100 dark:border-white/10`}>
          <Icon size={24} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">{title}</p>
          <p className="text-[11px] text-slate-500 font-medium leading-tight">{desc}</p>
        </div>
      </div>
      <button
        onClick={() => setIsOn(!isOn)}
        className={`w-14 h-8 rounded-full p-1 transition-all flex items-center ${isOn ? 'bg-brand-primary shadow-brand' : 'bg-slate-200 dark:bg-slate-800'}`}
      >
        <motion.div
          animate={{ x: isOn ? 24 : 0 }}
          className="w-6 h-6 bg-white rounded-full shadow-lg"
        />
      </button>
    </div>
  );
}

function SettingsActionItem({ icon: Icon, title, desc, action }: { icon: any, title: string, desc: string, action: string }) {
  return (
    <button className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950/50 rounded-[2rem] border border-slate-100 dark:border-white/5 group hover:border-brand-primary/20 transition-all shadow-sm text-left">
      <div className="flex items-center gap-5">
        <div className={`p-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-400 group-hover:text-brand-primary transition-all border border-slate-100 dark:border-white/10`}>
          <Icon size={24} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">{title}</p>
          <p className="text-[11px] text-slate-500 font-medium leading-tight">{desc}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-brand-primary font-black uppercase tracking-widest text-[10px]">
        {action}
        <ChevronRight size={12} strokeWidth={3} />
      </div>
    </button>
  );
}
