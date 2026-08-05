'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin, Clock, Loader2 } from 'lucide-react';
import { useMoments, Moment } from '@/hooks/useMoments';
import { CreateMomentModal } from './CreateMomentModal';

export const MomentsFeed: React.FC = () => {
  const { moments, loading } = useMoments();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Campus Moments</h3>
        <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">LIVE</span>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
        {/* Add Moment Trigger */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex-shrink-0 w-32 h-44 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3 group hover:border-brand-primary/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-brand-primary group-hover:bg-brand-primary/10 transition-all">
            <Plus size={20} />
          </div>
          <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">Post Status</span>
        </button>

        {loading ? (
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-32 h-44 rounded-3xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {moments.map((moment) => (
              <MomentCard key={moment.id} moment={moment} />
            ))}
          </AnimatePresence>
        )}
      </div>

      <CreateMomentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

const MomentCard = ({ moment }: { moment: Moment }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex-shrink-0 w-44 h-44 rounded-3xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-between relative overflow-hidden group hover:border-blue-500/30 transition-all"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600/5 blur-2xl rounded-full" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <img
            src={moment.profiles.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${moment.user_id}`}
            className="w-6 h-6 rounded-lg object-cover ring-1 ring-slate-800"
          />
          <span className="text-[10px] font-bold text-slate-300 truncate">{moment.profiles.full_name.split(' ')[0]}</span>
        </div>
        <p className="text-xs text-slate-100 line-clamp-4 leading-relaxed font-medium">
          {moment.content}
        </p>
      </div>

      <div className="relative z-10 space-y-1">
        {moment.location_name && (
          <div className="flex items-center gap-1 text-slate-500">
            <MapPin size={10} />
            <span className="text-[9px] font-bold truncate uppercase tracking-tighter">{moment.location_name}</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-slate-600">
          <Clock size={10} />
          <span className="text-[9px] font-bold uppercase tracking-tighter">
            {new Date(moment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
