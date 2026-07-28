'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  MapPin,
  User,
  Heart,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const INTERESTS = [
  'Coding', 'Basketball', 'Music', 'UI Design', 'Gaming',
  'Hiking', 'Photography', 'Jazz', 'Coffee', 'Football',
  'Study Groups', 'Yoga', 'Entrepreneurship', 'Anime', 'Cooking'
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    fullName: '',
    college: 'Stanford University',
    selectedInterests: [] as string[]
  });
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Check metadata first for speed
      if (user.user_metadata?.onboarding_completed) {
        router.push('/feed');
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data?.onboarding_completed) {
        router.push('/feed');
      } else {
        setProfile({
          fullName: data?.full_name || user.user_metadata?.full_name || '',
          college: data?.college || 'Stanford University',
          selectedInterests: data?.interests || []
        });
        setLoading(false);
      }
    }
    checkUser();
  }, [router]);

  const toggleInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interest)
        ? prev.selectedInterests.filter(i => i !== interest)
        : [...prev.selectedInterests, interest]
    }));
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Update Public Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: profile.fullName,
          college: profile.college,
          interests: profile.selectedInterests,
          onboarding_completed: true
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 2. Update Auth Metadata (This allows Middleware to see it instantly)
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          onboarding_completed: true,
          full_name: profile.fullName
        }
      });

      if (authError) throw authError;

      // 3. Force a hard refresh to update the session cookie for Middleware
      window.location.href = '/feed';
    } catch (err) {
      console.error('Onboarding error:', err);
      alert('Failed to save profile. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="flex gap-2 mb-12 justify-center">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'w-12 bg-brand-primary' : 'w-4 bg-slate-800'}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 text-center"
            >
              <div>
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mx-auto mb-4">
                  <User size={32} />
                </div>
                <h1 className="text-3xl font-black tracking-tight">Set up your identity</h1>
                <p className="text-slate-500 mt-2 font-medium">How should the campus community call you?</p>
              </div>

              <div className="space-y-4 text-left">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                    placeholder="Enter your name"
                    className="glass-input w-full py-4 px-5 text-slate-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Your University</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      value={profile.college}
                      onChange={(e) => setProfile({...profile, college: e.target.value})}
                      className="glass-input w-full py-4 pl-12 pr-5 text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={!profile.fullName}
                onClick={() => setStep(2)}
                className="btn-primary w-full py-4"
              >
                Continue <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent mx-auto mb-4">
                  <Heart size={32} />
                </div>
                <h1 className="text-3xl font-black tracking-tight">Pick your vibes</h1>
                <p className="text-slate-500 mt-2 font-medium">We'll show you activities based on your interests.</p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center max-h-[300px] overflow-y-auto no-scrollbar p-2">
                {INTERESTS.map((interest) => {
                  const isSelected = profile.selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                        isSelected
                        ? 'bg-brand-primary border-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-105'
                        : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-white transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  disabled={profile.selectedInterests.length < 3}
                  onClick={() => setStep(3)}
                  className="btn-primary flex-1 py-4"
                >
                  {profile.selectedInterests.length < 3 ? `Pick ${3 - profile.selectedInterests.length} more` : 'Next Step'} <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 text-center"
            >
              <div>
                <div className="w-20 h-20 bg-brand-success/10 rounded-[2.5rem] flex items-center justify-center text-brand-success mx-auto mb-6 shadow-2xl shadow-brand-success/20">
                  <Sparkles size={40} className="animate-pulse-gentle" />
                </div>
                <h1 className="text-4xl font-black tracking-tight leading-tight">You're ready, <span className="text-gradient">{profile.fullName.split(' ')[0]}!</span></h1>
                <p className="text-slate-400 mt-4 text-lg font-medium">
                  Welcome to OKOP'S. Your campus is waiting.
                </p>
              </div>

              <div className="glass-card p-6 text-left space-y-4 rounded-3xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-success/20 flex items-center justify-center text-brand-success">
                    <Check size={16} />
                  </div>
                  <p className="text-sm font-bold text-slate-300">Identity verified at {profile.college}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-success/20 flex items-center justify-center text-brand-success">
                    <Check size={16} />
                  </div>
                  <p className="text-sm font-bold text-slate-300">{profile.selectedInterests.length} interests synced</p>
                </div>
              </div>

              <button
                onClick={handleComplete}
                disabled={saving}
                className="btn-primary w-full py-5 text-lg font-black"
              >
                {saving ? <Loader2 className="animate-spin" /> : 'Enter OKOP\'S'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
