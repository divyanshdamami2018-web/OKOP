'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, BookOpen, ChevronRight } from 'lucide-react';

const SCHEDULE = [
  { id: 1, title: 'Data Structures', time: '09:00 AM', room: 'Lab 402', color: 'bg-brand-primary' },
  { id: 2, title: 'AI Ethics Seminar', time: '11:30 AM', room: 'Hall A', color: 'bg-brand-secondary' },
  { id: 3, title: 'Basketball Practice', time: '04:30 PM', room: 'Gym', color: 'bg-brand-accent' },
];

export const ScheduleStrip = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Today's Schedule</h3>
        <button className="text-[10px] font-black text-brand-primary uppercase tracking-widest flex items-center gap-1 hover:opacity-80 transition-opacity">
          Full Calendar <ChevronRight size={12} />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {SCHEDULE.map((item, index) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={item.id}
            className="flex-shrink-0 w-64 glass-card p-5 rounded-3xl relative overflow-hidden group cursor-pointer"
          >
            <div className={`absolute top-0 left-0 w-1.5 h-full ${item.color}`} />

            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl ${item.color.replace('bg-', 'bg-')}/10 ${item.color.replace('bg-', 'text-')}`}>
                <BookOpen size={18} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg">
                In 2h 15m
              </span>
            </div>

            <h4 className="text-slate-900 dark:text-white font-black text-lg tracking-tight mb-3">
              {item.title}
            </h4>

            <div className="flex items-center gap-4 text-slate-500 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-brand-primary" />
                {item.time}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-brand-secondary" />
                {item.room}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Placeholder for "No more classes" */}
        <div className="flex-shrink-0 w-48 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center p-4">
          <p className="text-[10px] font-black text-slate-400 uppercase">That's all for today!</p>
        </div>
      </div>
    </div>
  );
};
