'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

export const LoadingLogo = () => {
  return (
    <div className="fixed inset-0 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center z-[9999]">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="relative z-10"
        >
          <Logo size="xl" showText={false} />
        </motion.div>

        {/* Pulsing Outer Rings for "Pulse" Branding */}
        <div className="absolute inset-0 -m-8 border-2 border-brand-primary/20 rounded-full animate-pulse-slow" />
        <div className="absolute inset-0 -m-16 border border-brand-secondary/10 rounded-full animate-pulse-gentle" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-20 text-center"
      >
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">OKOP'S</h2>
        <div className="flex items-center gap-1 justify-center mt-2">
          <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" />
          <div className="w-1.5 h-1.5 bg-brand-secondary rounded-full animate-bounce animate-delay-100" />
          <div className="w-1.5 h-1.5 bg-brand-success rounded-full animate-bounce animate-delay-200" />
        </div>
      </motion.div>
    </div>
  );
};
