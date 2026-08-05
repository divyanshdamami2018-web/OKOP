'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Smile, Flame, Heart, Zap } from 'lucide-react';
import { Moment } from '@/hooks/useMoments';
import { supabase } from '@/lib/supabase';

const REACTIONS = [
  { emoji: '🔥', label: 'Lit' },
  { emoji: '🍕', label: 'Food' },
  { emoji: '🙌', label: 'High Five' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '⚡', label: 'Pulse' },
];

export const MomentCard = ({ moment }: { moment: Moment }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [activeReactions, setActiveReactions] = useState<Record<string, number>>({
    '🔥': 2,
    '⚡': 5
  });

  const handleReact = async (emoji: string) => {
    setActiveReactions(prev => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1
    }));
    setShowReactions(false);

    // In real app: await supabase.from('moment_reactions').insert({ ... })
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex-shrink-0 w-48 h-56 rounded-[2.5rem] glass-card p-5 flex flex-col justify-between relative group hover:border-brand-primary/30 transition-all border border-slate-200 dark:border-white/5 shadow-premium bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={moment.profiles.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${moment.user_id}`}
              className="w-8 h-8 rounded-xl object-cover ring-2 ring-white dark:ring-slate-800 shadow-sm"
            />
            <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 truncate max-w-[80px]">
              {moment.profiles.full_name.split(' ')[0]}
            </span>
          </div>
          <button
            onClick={() => setShowReactions(!showReactions)}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-brand-primary"
          >
            <Smile size={16} />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-4 leading-relaxed font-medium">
          {moment.content}
        </p>
      </div>

      <div className="relative z-10 space-y-3">
        {/* Active Reactions */}
        <div className="flex flex-wrap gap-1">
          {Object.entries(activeReactions).map(([emoji, count]) => (
            <div key={emoji} className="px-2 py-0.5 bg-white dark:bg-slate-800 rounded-full text-[9px] font-black border border-slate-100 dark:border-white/5 shadow-sm flex items-center gap-1">
              <span>{emoji}</span>
              <span className="text-slate-500">{count}</span>
            </div>
          ))}
        </div>

        <div className="space-y-1">
          {moment.location_name && (
            <div className="flex items-center gap-1 text-brand-primary">
              <MapPin size={10} />
              <span className="text-[9px] font-black truncate uppercase tracking-tighter">{moment.location_name}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-slate-400">
            <Clock size={10} />
            <span className="text-[9px] font-bold uppercase tracking-tighter">
              {new Date(moment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Reaction Picker Popup */}
      <AnimatePresence>
        {showReactions && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute -top-12 left-0 right-0 mx-auto w-fit bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-2 shadow-2xl z-50 flex gap-2"
          >
            {REACTIONS.map(r => (
              <button
                key={r.emoji}
                onClick={() => handleReact(r.emoji)}
                className="hover:scale-125 transition-transform text-lg"
                title={r.label}
              >
                {r.emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
