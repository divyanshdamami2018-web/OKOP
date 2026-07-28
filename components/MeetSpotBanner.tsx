'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Zap, Loader2, Sparkles, Navigation } from 'lucide-react';
import { MeetSpot } from '@/types';
import { useCheckIn } from '@/hooks/useMeetSpots';

interface MeetSpotBannerProps {
  spot: MeetSpot;
}

export const MeetSpotBanner: React.FC<MeetSpotBannerProps> = ({ spot }) => {
  const { isCheckedIn, isLoading: isStatusLoading, checkIn } = useCheckIn(spot.id);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleCheckIn = async () => {
    setIsActionLoading(true);
    try {
      await checkIn();
    } catch (err) {
      console.error('Check-in failed:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-[2.5rem] glass-card p-8 md:p-10 group"
    >
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 blur-[100px] -mr-40 -mt-40 rounded-full group-hover:bg-brand-primary/20 transition-colors duration-1000" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-secondary/10 blur-[80px] -ml-32 -mb-32 rounded-full group-hover:bg-brand-secondary/20 transition-colors duration-1000" />

      {/* Animated Mesh Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-brand-primary/20 border border-brand-primary/30 text-brand-primary rounded-full w-fit backdrop-blur-md">
              <Zap size={14} fill="currentColor" className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Campus Spot</span>
            </div>
            {spot.liveCount > 20 && (
              <div className="flex items-center gap-2 px-4 py-1.5 bg-brand-accent/20 border border-brand-accent/30 text-brand-accent rounded-full w-fit backdrop-blur-md">
                <Flame size={14} fill="currentColor" className="animate-bounce-subtle" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Hot Now</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-slate-100 tracking-tighter leading-none">
              {spot.name}
            </h2>
            <p className="text-slate-400 text-lg font-medium max-w-xl leading-relaxed">
              {spot.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-8 md:gap-12">
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">Activity Level</span>
              <div className="flex items-center gap-3 text-slate-100">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-xl border-2 border-slate-900 bg-slate-800 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Spot${i}${spot.id}`} alt="User" />
                    </div>
                  ))}
                </div>
                <span className="text-2xl font-black text-brand-primary">{spot.liveCount} Students</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 border-l border-slate-800/50 pl-8 md:pl-12">
              <span className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">Status</span>
              <div className="flex items-center gap-2 text-brand-success font-black text-xl">
                <div className="w-2 h-2 bg-brand-success rounded-full animate-ping" />
                <span>Open to Join</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 min-w-[240px]">
          <button
            onClick={handleCheckIn}
            disabled={isCheckedIn || isStatusLoading || isActionLoading}
            className={`group relative px-8 py-5 rounded-3xl font-black uppercase tracking-widest text-sm transition-all transform active:scale-95 flex items-center justify-center gap-3 overflow-hidden ${
              isCheckedIn
                ? 'bg-brand-success/20 text-brand-success border-2 border-brand-success/30'
                : 'bg-brand-gradient text-white shadow-[0_15px_30px_rgba(99,102,241,0.3)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.4)]'
            }`}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />

            {isActionLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : isCheckedIn ? (
              <>
                <Sparkles size={18} />
                Checked In
              </>
            ) : (
              <>
                <Navigation size={18} fill="currentColor" />
                Mark I'm Here
              </>
            )}
          </button>

          <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl p-3 border border-slate-800/50 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {isCheckedIn ? 'Boosting campus density' : '+5 XP per check-in'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

import { Flame } from 'lucide-react';
