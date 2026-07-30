'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  Loader2,
  ArrowRight,
  AlertCircle,
  Github,
  Chrome,
  Apple
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

import { Logo } from '../layout/Logo';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (signupError) throw signupError;

        if (data.user && data.session) {
          window.location.href = '/onboarding';
        } else if (data.user && !data.session) {
          setError('Success! Please check your email to confirm your account.');
          setLoading(false);
          return;
        }
      } else {
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (loginError) throw loginError;

        // If a session was returned immediately, redirect.
        if (loginData?.session) {
          window.location.href = '/feed';
          return;
        }

        // Otherwise, briefly poll/get session to allow cookies to sync, then redirect.
        const waitForSession = async () => {
          const start = Date.now();
          while (Date.now() - start < 3000) {
            try {
              // ask supabase for current session
              const { data: sessionResp } = await supabase.auth.getSession();
              if (sessionResp?.session) {
                window.location.href = '/feed';
                return;
              }
            } catch (e) {
              // ignore
            }
            await new Promise((r) => setTimeout(r, 250));
          }
          // fallback redirect even if session not detected (keeps previous behaviour)
          window.location.href = '/feed';
        };

        waitForSession();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 rounded-[3rem] shadow-2xl relative overflow-hidden bg-white/80 dark:bg-slate-900/40"
      >
        {/* Animated Background Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-3xl -mr-16 -mt-16 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-secondary/10 blur-3xl -ml-16 -mb-16 animate-pulse animate-delay-200" />

        <div className="mb-10 text-center relative z-10">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="flex justify-center mb-6"
          >
            <Logo showText={false} size="lg" />
          </motion.div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            The social pulse of your campus
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8 relative z-10">
          <button
            onClick={() => handleSocialLogin('google')}
            className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-750 transition-all shadow-sm active:scale-95"
          >
            <Chrome size={20} className="text-slate-700 dark:text-slate-200" />
          </button>
          <button
            onClick={() => handleSocialLogin('apple')}
            className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-750 transition-all shadow-sm active:scale-95"
          >
            <Apple size={20} className="text-slate-700 dark:text-slate-200" />
          </button>
          <button
            onClick={() => handleSocialLogin('github')}
            className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-750 transition-all shadow-sm active:scale-95"
          >
            <Github size={20} className="text-slate-700 dark:text-slate-200" />
          </button>
        </div>

        <div className="relative mb-8 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
          <span className="relative px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white dark:bg-slate-900">or continue with email</span>
        </div>

        <form onSubmit={handleAuth} className="space-y-5 relative z-10">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-3"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  className="glass-input w-full py-4 pl-12 pr-4 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Campus Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="glass-input w-full py-4 pl-12 pr-4 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
              {mode === 'login' && <button type="button" className="text-[10px] font-black text-brand-primary uppercase hover:underline">Forgot?</button>}
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input w-full py-4 pl-12 pr-4 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center relative z-10">
          <p className="text-slate-500 text-xs font-bold">
            {mode === 'login' ? "New student?" : "Already a member?"}{' '}
            <button
              onClick={() => router.push(mode === 'login' ? '/signup' : '/login')}
              className="text-brand-primary font-black uppercase tracking-widest text-[10px] hover:underline underline-offset-4"
            >
              {mode === 'login' ? 'Join Pulse' : 'Log In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
