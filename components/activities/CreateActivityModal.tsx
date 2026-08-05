'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Calendar, MapPin, Users, Tag as TagIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Zod Schema for Validation
const activitySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(60, 'Title too long'),
  category: z.enum(['Sports', 'Music', 'Coding', 'Study', 'Gaming', 'Hangout'], {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
  location: z.string().min(3, 'Location is required'),
  startTime: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Start time must be in the future',
  }),
  maxParticipants: z.number().min(2, 'At least 2 participants').max(30, 'Maximum 30 participants'),
  tags: z.array(z.object({ value: z.string() })).min(1, 'Add at least one tag'),
});

type ActivityFormValues = z.infer<typeof activitySchema>;

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateActivityModal: React.FC<CreateActivityModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      tags: [],
      maxParticipants: 5,
    },
  });

  const { fields: tags, append, remove } = useFieldArray({
    control,
    name: 'tags',
  });

  const handleAddTag = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      if (!tags.find((t) => t.value === tagInput.trim())) {
        append({ value: tagInput.trim() });
      }
      setTagInput('');
    }
  };

  const onSubmit = async (data: ActivityFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Get current user session
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('You must be logged in to create an activity');
      }

      // 2. Insert into Supabase
      const { error: insertError } = await supabase
        .from('events')
        .insert({
          creator_id: user.id,
          title: data.title,
          category: data.category,
          location: data.location,
          start_time: data.startTime,
          max_participants: data.maxParticipants,
          tags: data.tags.map(t => t.value)
        });

      if (insertError) throw insertError;

      reset();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create activity');
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
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none p-4"
          >
            <div className="bg-slate-900 w-full max-w-xl rounded-3xl border border-slate-800 shadow-2xl pointer-events-auto overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Create New Activity</h2>
                  <p className="text-slate-400 text-sm">Fill in the details to host a campus event.</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Activity Title</label>
                  <input
                    {...register('title')}
                    placeholder="e.g., Sunday Morning Basketball"
                    className={`w-full bg-slate-950 border ${errors.title ? 'border-red-500/50' : 'border-slate-800'} rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-slate-100`}
                  />
                  {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">Category</label>
                    <select
                      {...register('category')}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-slate-300"
                    >
                      <option value="">Select a category</option>
                      <option value="Sports">Sports</option>
                      <option value="Music">Music</option>
                      <option value="Coding">Coding</option>
                      <option value="Study">Study</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Hangout">Hangout</option>
                    </select>
                    {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <Users size={14} /> Max Participants
                    </label>
                    <input
                      type="number"
                      {...register('maxParticipants', { valueAsNumber: true })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-slate-100"
                    />
                    {errors.maxParticipants && <p className="text-red-400 text-xs mt-1">{errors.maxParticipants.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <MapPin size={14} /> Location
                    </label>
                    <input
                      {...register('location')}
                      placeholder="e.g., AOERC Courts"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-slate-100"
                    />
                    {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <Calendar size={14} /> Start Time
                    </label>
                    <input
                      type="datetime-local"
                      {...register('startTime')}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-slate-300"
                    />
                    {errors.startTime && <p className="text-red-400 text-xs mt-1">{errors.startTime.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <TagIcon size={14} /> Tags
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl min-h-[50px] focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500/50 transition-all">
                    {tags.map((tag, index) => (
                      <span
                        key={tag.id}
                        className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg text-xs font-semibold border border-blue-500/20 flex items-center gap-2"
                      >
                        {tag.value}
                        <button type="button" onClick={() => remove(index)} className="hover:text-blue-200">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder={tags.length === 0 ? "Type and press Enter..." : ""}
                      className="flex-1 bg-transparent border-none outline-none text-sm text-slate-300 min-w-[120px]"
                    />
                  </div>
                  {errors.tags && <p className="text-red-400 text-xs mt-1">{errors.tags.message}</p>}
                </div>

                <div className="pt-4 sticky bottom-0 bg-slate-900 pb-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Creating Activity...
                      </>
                    ) : (
                      <>
                        <Plus size={20} />
                        Launch Activity
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
