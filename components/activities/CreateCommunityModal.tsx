'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Globe, Lock, Loader2, Plus, Target } from 'lucide-react';
import { useClubs } from '@/hooks/useClubs';

const communitySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(40),
  description: z.string().min(10, 'Description too short').max(200),
  category: z.string().min(1, 'Category is required'),
  isPrivate: z.boolean().default(false),
});

type CommunityFormValues = z.infer<typeof communitySchema>;

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createClub } = useClubs();

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<CommunityFormValues>({
    resolver: zodResolver(communitySchema),
    defaultValues: { isPrivate: false }
  });

  const isPrivate = watch('isPrivate');

  const onSubmit = async (data: CommunityFormValues) => {
    setIsSubmitting(true);
    try {
      await createClub(data.name, data.description, data.category);
      reset();
      onClose();
    } catch (err) {
      console.error('Failed to create community:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[201] flex items-center justify-center pointer-events-none p-4"
          >
            <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-3xl pointer-events-auto overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Launch <span className="text-brand-secondary">Community</span></h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Community Name</label>
                  <input
                    {...register('name')}
                    placeholder="e.g., Stanford Chess Club"
                    className="glass-input w-full py-4 px-5 text-sm"
                  />
                  {errors.name && <p className="text-red-500 text-[10px] font-bold ml-1 uppercase">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">What's it about?</label>
                  <textarea
                    {...register('description')}
                    placeholder="Describe your community's mission..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary/50 transition-all text-slate-900 dark:text-white resize-none h-32 text-sm"
                  />
                  {errors.description && <p className="text-red-500 text-[10px] font-bold ml-1 uppercase">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                      <select
                        {...register('category')}
                        className="glass-input w-full py-4 px-5 text-sm appearance-none"
                      >
                        <option value="">Select category</option>
                        <option value="Tech">Tech</option>
                        <option value="Academic">Academic</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Sports">Sports</option>
                        <option value="Gaming">Gaming</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Visibility</label>
                      <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer group hover:border-brand-secondary/30 transition-all">
                        <input type="checkbox" {...register('isPrivate')} className="w-5 h-5 rounded-lg border-slate-200 text-brand-secondary focus:ring-brand-secondary/20" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight flex items-center gap-2">
                           {isPrivate ? <Lock size={14} /> : <Globe size={14} />}
                           {isPrivate ? 'Private' : 'Public'}
                        </span>
                      </label>
                   </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary !bg-brand-secondary py-5 rounded-2xl shadow-xl shadow-brand-secondary/20 group mt-4 active:scale-95"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <><Plus size={20} strokeWidth={3} /> Create Community</>}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
