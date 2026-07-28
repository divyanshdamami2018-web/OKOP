'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MapPin, Clock, Check, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { Activity } from '@/types';
import { useJoinActivity } from '@/hooks/useJoinActivity';
import Link from 'next/link';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  if (!activity) return null;

  const { isJoined, isLoading, join, leave } = useJoinActivity(activity.id);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleToggleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsActionLoading(true);
    try {
      if (isJoined) {
        await leave();
      } else {
        await join();
      }
    } catch (err) {
      console.error('Failed to update join status:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="glass-card rounded-3xl p-5 hover:border-brand-primary/50 transition-all group relative overflow-hidden"
    >
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-brand-primary/10 transition-colors" />

      <Link href={`/activities/${activity.id}`} className="block relative z-10">
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={activity.creator.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.creator.name}`}
                alt={activity.creator.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-800 group-hover:ring-brand-primary/50 transition-all shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-success border-2 border-slate-950 rounded-full" />
            </div>
            <div className="min-w-0">
              <h3 className="text-slate-100 font-bold leading-tight truncate group-hover:text-brand-primary transition-colors">
                {activity.title}
              </h3>
              <p className="text-slate-500 text-xs font-medium">@{activity.creator.name.toLowerCase().replace(/\s/g, '')}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-slate-950/50 text-brand-primary text-[10px] font-black uppercase tracking-widest border border-brand-primary/20 backdrop-blur-md">
            {activity.category}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2.5 text-slate-400 text-sm">
            <div className="p-1.5 bg-slate-950/50 rounded-lg border border-slate-800">
              <MapPin size={14} className="text-slate-500" />
            </div>
            <span className="truncate font-medium">{activity.location}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-400 text-sm">
            <div className="p-1.5 bg-slate-950/50 rounded-lg border border-slate-800">
              <Clock size={14} className="text-slate-500" />
            </div>
            <span className="font-medium">{new Date(activity.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-400 text-sm">
            <div className="p-1.5 bg-slate-950/50 rounded-lg border border-slate-800">
              <Users size={14} className="text-slate-500" />
            </div>
            <span className="font-medium text-brand-primary">{activity.currentParticipants}/{activity.maxParticipants} <span className="text-slate-500">attending</span></span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 h-6 overflow-hidden">
          {activity.tags.map((tag) => (
            <span key={tag} className="text-[9px] font-black uppercase tracking-tighter text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-800">
              #{tag}
            </span>
          ))}
        </div>
      </Link>

      <div className="flex gap-2 relative z-10">
        <button
          onClick={handleToggleJoin}
          disabled={isLoading || isActionLoading}
          className={`flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 ${
            isJoined
              ? 'bg-brand-success/10 text-brand-success border border-brand-success/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
              : isActionLoading
              ? 'bg-slate-800 text-slate-500'
              : 'bg-brand-gradient text-white shadow-xl shadow-brand-primary/20 hover:opacity-90'
          }`}
        >
          {isActionLoading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : isJoined ? (
            <>
              <Check size={16} className="group-hover:hidden" />
              <span className="group-hover:hidden">Joined</span>
              <span className="hidden group-hover:block">Leave Activity</span>
            </>
          ) : (
            <>
              <Sparkles size={16} className="animate-pulse" />
              Join Activity
            </>
          )}
        </button>

        <Link
          href={`/activities/${activity.id}`}
          className="p-3.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-2xl hover:text-brand-primary hover:border-brand-primary/30 transition-all active:scale-95 shadow-lg"
        >
          <ArrowRight size={20} strokeWidth={2.5} />
        </Link>
      </div>
    </motion.div>
  );
};
