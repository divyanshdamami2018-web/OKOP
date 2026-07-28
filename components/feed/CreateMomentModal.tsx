'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MapPin, Loader2, Send } from 'lucide-react';
import { useMoments } from '@/hooks/useMoments';

interface CreateMomentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateMomentModal: React.FC<CreateMomentModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [locationName, setLocationName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createMoment } = useMoments();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await createMoment(content, locationName || undefined);
      setContent('');
      setLocationName('');
      onClose();
    } catch (err) {
      console.error('Failed to post moment:', err);
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
            <div className="bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-800 shadow-2xl pointer-events-auto overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-blue-500" size={18} />
                  <h2 className="text-lg font-bold text-slate-100">Post a Moment</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">What's happening?</label>
                  <textarea
                    autoFocus
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="e.g., Free pizza at the Gates Building 4th floor! 🍕"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-slate-100 resize-none h-32 text-sm"
                    maxLength={150}
                  />
                  <div className="flex justify-end">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                      {content.length}/150
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Tag Location (Optional)</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder="e.g., Old Union"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-11 pr-5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-slate-100 text-sm"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Send size={18} />
                        Share with Campus
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-4">
                    Moments expire in 24 hours
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
