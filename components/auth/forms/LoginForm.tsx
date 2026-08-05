'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Logo } from '../../layout/Logo';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.identifier, // Supabase handles phone-based auth slightly differently, focusing on email for now
        password: data.password,
      });

      if (authError) throw authError;

      // Use window.location for a hard refresh to ensure session is picked up by middleware
      window.location.href = '/feed';
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'azure') => {
    await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: { redirectTo: `${window.location.origin}/api/auth/callback` }
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 rounded-[3rem] shadow-3xl relative overflow-hidden bg-white/90 dark:bg-slate-900/60 backdrop-blur-3xl border-white/50"
      >
        <div className="mb-10 text-center relative z-10">
          <Logo showText={false} size="lg" className="justify-center mb-6" />
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Welcome Back</h1>
          <p className="text-slate-500 font-medium mt-2">Sign in to sync with your campus pulse</p>
        </div>

        {/* Method Toggle */}
        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl mb-8 relative z-10">
          <button
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${loginMethod === 'email' ? 'bg-white dark:bg-slate-700 text-brand-primary shadow-md' : 'text-slate-500'}`}
          >
            Email
          </button>
          <button
            onClick={() => setLoginMethod('phone')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${loginMethod === 'phone' ? 'bg-white dark:bg-slate-700 text-brand-primary shadow-md' : 'text-slate-500'}`}
          >
            Mobile
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-3"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              {loginMethod === 'email' ? 'University Email' : 'Mobile Number'}
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                {loginMethod === 'email' ? <Mail size={18} /> : <Phone size={18} />}
              </div>
              <input
                {...register('identifier')}
                type={loginMethod === 'email' ? 'email' : 'tel'}
                placeholder={loginMethod === 'email' ? 'you@university.edu' : '+1 (555) 000-0000'}
                className="glass-input w-full py-4 pl-12 pr-4 text-sm bg-slate-50/50"
              />
            </div>
            {errors.identifier && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.identifier.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
              <button type="button" className="text-[10px] font-black text-brand-primary uppercase hover:underline">Forgot?</button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18} />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="glass-input w-full py-4 pl-12 pr-12 text-sm bg-slate-50/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" {...register('rememberMe')} className="w-4 h-4 rounded border-slate-200 text-brand-primary focus:ring-brand-primary/20" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-700 dark:group-hover:text-slate-300">Remember Me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-5 rounded-2xl shadow-xl shadow-brand-primary/30 mt-4 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 relative z-10">
          <div className="relative text-center mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
            <span className="relative px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white dark:bg-[#0f172a]">Enterprise Single Sign-On</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleSocialLogin('google')} className="flex items-center justify-center gap-3 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">Google</span>
            </button>
            <button onClick={() => handleSocialLogin('azure')} className="flex items-center justify-center gap-3 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" className="w-4 h-4" alt="Microsoft" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">Microsoft</span>
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-slate-500 text-xs font-bold relative z-10">
          New to OKOP'S?{' '}
          <button
            onClick={() => router.push('/signup')}
            className="text-brand-primary font-black uppercase tracking-[0.15em] text-[10px] hover:underline underline-offset-4"
          >
            Create Account
          </button>
        </p>
      </motion.div>

      <div className="mt-8 flex items-center justify-center gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-60">
        <button className="hover:text-brand-primary transition-colors">Privacy Policy</button>
        <div className="w-1 h-1 bg-slate-400 rounded-full" />
        <button className="hover:text-brand-primary transition-colors">Terms of Service</button>
        <div className="w-1 h-1 bg-slate-400 rounded-full" />
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-emerald-500" />
          Secure Enterprise Node
        </div>
      </div>
    </div>
  );
};
