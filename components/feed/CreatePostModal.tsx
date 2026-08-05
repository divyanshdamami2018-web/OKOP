'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, MapPin, Loader2, Send, Globe, Lock } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [locationName, setLocationName] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const { createPost } = usePosts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaUrls.length === 0) return;

    setIsSubmitting(true);
    try {
      await createPost(content, mediaUrls, locationName || undefined);
      setContent('');
      setLocationName('');
      setMediaUrls([]);
      onClose();
    } catch (err) {
      console.error('Failed to create post:', err);
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
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Create <span className="text-brand-primary">Post</span></h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <textarea
                  autoFocus
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind? Share an update, question, or just a vibe..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 transition-all text-slate-900 dark:text-white resize-none h-40 text-base"
                />

                <div className="flex flex-wrap gap-4">
                   <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          value={locationName}
                          onChange={(e) => setLocationName(e.target.value)}
                          placeholder="Add location..."
                          className="glass-input w-full py-3 pl-11 pr-4 text-xs"
                        />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Privacy</label>
                      <button
                        type="button"
                        onClick={() => setIsPublic(!isPublic)}
                        className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-brand-primary/30 transition-all"
                      >
                        {isPublic ? <Globe size={14} /> : <Lock size={14} />}
                        {isPublic ? 'Public' : 'Private'}
                      </button>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors font-bold text-sm">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl">
                      <ImageIcon size={20} />
                    </div>
                    Add Media
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || (!content.trim() && mediaUrls.length === 0)}
                    className="btn-primary py-4 px-10 rounded-2xl shadow-brand/20 active:scale-95"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Post to Feed</>}
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
