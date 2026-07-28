'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 'md' }) => {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', sub: 'text-[7px]' },
    md: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-[9px]' },
    lg: { icon: 'w-16 h-16', text: 'text-3xl', sub: 'text-[10px]' },
    xl: { icon: 'w-24 h-24', text: 'text-5xl', sub: 'text-[12px]' },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${currentSize.icon}`}>
        {/* Three Person Circle Interlocking Design */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl overflow-visible">
          {/* Main Circle Ring (Faint) */}
          <circle cx="50" cy="50" r="38" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-20" />

          {/* Green Segment (Bottom) */}
          <path d="M75 75C68 85 59 90 50 90C41 90 32 85 25 75" stroke="#10B981" strokeWidth="12" strokeLinecap="round" />
          <circle cx="50" cy="90" r="10" fill="#10B981" className="animate-pulse" />

          {/* Blue Segment (Top Left) */}
          <path d="M25 25C15 32 10 41 10 50C10 59 15 68 25 75" stroke="#4F46E5" strokeWidth="12" strokeLinecap="round" />
          <circle cx="10" cy="50" r="10" fill="#4F46E5" className="animate-pulse animate-delay-200" />

          {/* Purple Segment (Top Right) */}
          <path d="M75 75C85 68 90 59 90 50C90 41 85 32 75 25" stroke="#7C3AED" strokeWidth="12" strokeLinecap="round" />
          <circle cx="90" cy="50" r="10" fill="#7C3AED" className="animate-pulse animate-delay-500" />

          {/* Interlocking Connectors */}
          <circle cx="50" cy="50" r="15" stroke="url(#logo-grad)" strokeWidth="4" strokeDasharray="8 4" className="animate-spin-slow" style={{ transformOrigin: 'center' }} />

          <defs>
            <linearGradient id="logo-grad" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <h1 className={`${currentSize.text} font-black tracking-tighter text-slate-900 dark:text-white leading-none`}>
            OKOP'S
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`${currentSize.sub} font-black text-brand-primary uppercase tracking-[0.25em]`}>
              Connect. Collaborate. Grow.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
