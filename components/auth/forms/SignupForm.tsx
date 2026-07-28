'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Phone,
  GraduationCap,
  Building2,
  IdCard,
  ArrowRight,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Logo } from '../../layout/Logo';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  studentId: z.string().min(3, 'Valid Student ID is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  university: z.string().min(2, 'University name is required'),
  department: z.string().min(2, 'Department is required'),
  semester: z.number().min(1).max(12),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export const SignupForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, trigger } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      university: 'Stanford University',
      semester: 1
    }
  });

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ['fullName', 'email', 'studentId', 'phone'];
    if (step === 2) fieldsToValidate = ['university', 'department', 'semester'];

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: signupError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            student_id: data.studentId,
            phone: data.phone,
            university: data.university,
            department: data.department,
            semester: data.semester,
          }
        }
      });

      if (signupError) throw signupError;

      if (authData.user && !authData.session) {
        setError('Success! Please check your email to verify your identity.');
      } else {
        router.push('/onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please check your details.');
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
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 md:p-12 rounded-[3.5rem] shadow-3xl relative overflow-hidden bg-white/90 dark:bg-slate-900/60 backdrop-blur-3xl border-white/50"
      >
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <Logo size="md" className="mb-4" />
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Create Account</h1>
            <p className="text-slate-500 font-medium mt-2">Join the elite campus network</p>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'w-8 bg-brand-primary' : 'w-3 bg-slate-200 dark:bg-slate-800'}`} />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold border ${error.includes('Success') ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 text-emerald-600' : 'bg-red-50 dark:bg-red-500/10 border-red-100 text-red-500'}`}
            >
              {error.includes('Success') ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Legal Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                    <input {...register('fullName')} placeholder="Divyanshu ..." className="glass-input w-full py-4 pl-12 pr-4 text-sm bg-slate-50/50" />
                  </div>
                  {errors.fullName && <p className="text-red-500 text-[9px] font-bold ml-1 uppercase">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                    <input {...register('email')} type="email" placeholder="student@gmail.com" className="glass-input w-full py-4 pl-12 pr-4 text-sm bg-slate-50/50" />
                  </div>
                  {errors.email && <p className="text-red-500 text-[9px] font-bold ml-1 uppercase">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Student ID</label>
                  <div className="relative group">
                    <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                    <input {...register('studentId')} placeholder="ID-2024-XXX" className="glass-input w-full py-4 pl-12 pr-4 text-sm bg-slate-50/50" />
                  </div>
                  {errors.studentId && <p className="text-red-500 text-[9px] font-bold ml-1 uppercase">{errors.studentId.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                    <input {...register('phone')} placeholder="+1 (555) 000-0000" className="glass-input w-full py-4 pl-12 pr-4 text-sm bg-slate-50/50" />
                  </div>
                  {errors.phone && <p className="text-red-500 text-[9px] font-bold ml-1 uppercase">{errors.phone.message}</p>}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">University Name</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                    <input {...register('university')} placeholder="Stanford University" className="glass-input w-full py-4 pl-12 pr-4 text-sm bg-slate-50/50" />
                  </div>
                  {errors.university && <p className="text-red-500 text-[9px] font-bold ml-1 uppercase">{errors.university.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Department</label>
                  <div className="relative group">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                    <input {...register('department')} placeholder="Computer Science" className="glass-input w-full py-4 pl-12 pr-4 text-sm bg-slate-50/50" />
                  </div>
                  {errors.department && <p className="text-red-500 text-[9px] font-bold ml-1 uppercase">{errors.department.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Semester</label>
                  <input {...register('semester', { valueAsNumber: true })} type="number" className="glass-input w-full py-4 px-5 text-sm bg-slate-50/50" />
                  {errors.semester && <p className="text-red-500 text-[9px] font-bold ml-1 uppercase">{errors.semester.message}</p>}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                      <input {...register('password')} type="password" placeholder="••••••••" className="glass-input w-full py-4 pl-12 pr-4 text-sm bg-slate-50/50" />
                    </div>
                    {errors.password && <p className="text-red-500 text-[9px] font-bold ml-1 uppercase">{errors.password.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                      <input {...register('confirmPassword')} type="password" placeholder="••••••••" className="glass-input w-full py-4 pl-12 pr-4 text-sm bg-slate-50/50" />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-[9px] font-bold ml-1 uppercase">{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-white/5 cursor-pointer group hover:border-brand-primary/30 transition-all">
                  <input type="checkbox" {...register('acceptTerms')} className="w-5 h-5 rounded-lg border-slate-200 text-brand-primary focus:ring-brand-primary/20" />
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                    I agree to the <button type="button" className="text-brand-primary hover:underline">Terms of Service</button> and <button type="button" className="text-brand-primary hover:underline">Privacy Policy</button>
                  </span>
                </label>
                {errors.acceptTerms && <p className="text-red-500 text-[9px] font-black ml-1 uppercase">{errors.acceptTerms.message}</p>}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-4 pt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-md active:scale-95"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 btn-primary py-5 rounded-2xl shadow-xl shadow-brand-primary/30 group"
              >
                Continue <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary py-5 rounded-2xl shadow-xl shadow-brand-primary/30 active:scale-95 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : 'Create Account'}
              </button>
            )}
          </div>
        </form>

        <div className="mt-10 relative z-10">
          <div className="relative text-center mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
            <span className="relative px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white dark:bg-[#0f172a]">Enterprise Single Sign-On</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleSocialLogin('google')} type="button" className="flex items-center justify-center gap-3 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">Google</span>
            </button>
            <button onClick={() => handleSocialLogin('azure')} type="button" className="flex items-center justify-center gap-3 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" className="w-4 h-4" alt="Microsoft" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">Microsoft</span>
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-slate-500 text-xs font-bold relative z-10">
          Already a member?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-brand-primary font-black uppercase tracking-[0.15em] text-[10px] hover:underline underline-offset-4"
          >
            Log In
          </button>
        </p>
      </motion.div>

      <div className="mt-8 flex items-center justify-center gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-60">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-emerald-500" />
          University Data Protection
        </div>
      </div>
    </div>
  );
};
