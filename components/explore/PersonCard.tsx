'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserMinus, MessageCircle, Loader2, Sparkles } from 'lucide-react';
import { UserProfile } from '@/types';
import { useFollows } from '@/hooks/useFollows';
import Link from 'next/link';

interface PersonCardProps {
  person: UserProfile;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person }) => {
  const { isFollowing, follow, unfollow, loading } = useFollows(person.id);
  const [actionLoading, setActionLoading] = useState(false);

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (isFollowing) {
        await unfollow();
      } else {
        await follow();
      }
    } catch (err) {
      console.error('Follow action failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 rounded-[2.5rem] group relative overflow-hidden border-white/5 hover:border-brand-primary/40 shadow-2xl transition-all duration-500"
    >
      {/* Dynamic Hover Glows */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/10 blur-3xl rounded-full group-hover:bg-brand-primary/25 transition-all duration-700" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-secondary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100" />

      <Link href={`/profile/${person.id}`} className="block relative z-10">
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <motion.div
              whileHover={{ rotate: 5 }}
              className="relative z-10"
            >
              <img
                src={person.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`}
                alt={person.name}
                className="w-20 h-20 rounded-3xl object-cover ring-2 ring-slate-800 group-hover:ring-brand-primary/50 transition-all shadow-2xl"
              />
            </motion.div>
            {person.status === 'online' && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-brand-success border-4 border-slate-950 rounded-full z-20 shadow-lg" />
            )}
            <div className="absolute -inset-2 bg-brand-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full -z-10" />
          </div>

          <div className="min-w-0">
            <h3 className="font-black text-slate-100 text-xl truncate group-hover:text-brand-primary transition-colors tracking-tight">
              {person.name}
            </h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
              {person.college}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-brand-primary font-black text-[10px] uppercase tracking-tighter bg-brand-primary/10 w-fit px-2 py-0.5 rounded-lg">
              <Sparkles size={10} fill="currentColor" />
              {person.xp_points || 0} XP
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 h-12 overflow-hidden">
          {person.interests.slice(0, 3).map(interest => (
            <span key={interest} className="px-3 py-1 bg-slate-950/50 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:border-brand-primary/30 transition-all">
              #{interest}
            </span>
          ))}
          {person.interests.length > 3 && (
            <span className="text-[10px] font-black text-slate-600 self-center">+{person.interests.length - 3}</span>
          )}
        </div>
      </Link>

      <div className="flex gap-3 relative z-10">
        <button
          onClick={handleFollow}
          disabled={loading || actionLoading}
          className={`flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 ${
            isFollowing
            ? 'bg-slate-800 text-slate-300 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20'
            : 'bg-brand-gradient text-white shadow-xl shadow-brand-primary/20 hover:opacity-90'
          }`}
        >
          {actionLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : isFollowing ? (
            'Following'
          ) : (
            <>
              <UserPlus size={16} /> Follow
            </>
          )}
        </button>

        <Link
          href={`/messages?id=${person.id}`}
          className="p-3.5 bg-slate-950 border border-slate-800 text-slate-400 rounded-2xl hover:text-brand-primary hover:border-brand-primary/30 transition-all active:scale-95 shadow-lg"
        >
          <MessageCircle size={20} strokeWidth={2.5} />
        </Link>
      </div>
    </motion.div>
  );
};
