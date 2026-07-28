'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, Loader2 } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useLeaderboard';

export const Leaderboard: React.FC = () => {
  const { topStudents, loading } = useLeaderboard();

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-3xl backdrop-blur-3xl relative group">
      {/* Background Pulse Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-brand-primary/10 transition-all duration-1000" />

      <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between relative z-10">
        <div className="space-y-1">
          <h3 className="text-xl font-black flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <Trophy className="text-amber-500 animate-bounce-subtle" size={20} />
            </div>
            <span>Top <span className="text-gradient">Pulse</span></span>
          </h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Rankings this week</p>
        </div>
      </div>

      <div className="divide-y divide-slate-800/50">
        {topStudents.map((student, index) => (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            key={student.id}
            className="p-4 flex items-center gap-4 hover:bg-slate-800/30 transition-all group"
          >
            <div className="w-8 flex justify-center shrink-0">
              {index === 0 ? (
                <Medal size={20} className="text-amber-400" />
              ) : index === 1 ? (
                <Medal size={20} className="text-slate-300" />
              ) : index === 2 ? (
                <Medal size={20} className="text-amber-700" />
              ) : (
                <span className="text-sm font-bold text-slate-600">#{index + 1}</span>
              )}
            </div>

            <div className="relative">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-800 group-hover:ring-blue-500 transition-all"
              />
              {index < 3 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center border-2 border-slate-900">
                  <Award size={8} className="text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-100 text-sm truncate group-hover:text-blue-400 transition-colors">
                {student.name}
              </h4>
              <p className="text-[10px] text-slate-500 font-medium truncate uppercase tracking-tighter">
                {student.college}
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 justify-end text-blue-400 font-black text-sm">
                <TrendingUp size={12} />
                {student.xp_points?.toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-600 font-bold uppercase">XP Points</p>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full py-4 bg-slate-800/30 text-xs font-bold text-slate-500 hover:text-slate-100 hover:bg-slate-800/50 transition-all uppercase tracking-widest border-t border-slate-800/50">
        View Full Rankings
      </button>
    </div>
  );
};
