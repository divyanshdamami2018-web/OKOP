'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  Plus,
  Bell,
  User,
  LayoutGrid
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';

export const BottomNav = () => {
  const pathname = usePathname();
  const { profile } = useAuth();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Don't show bottom nav on landing page or auth pages
  const isAuthPage = ['/login', '/signup', '/forgot-password', '/onboarding'].includes(pathname);
  const isLandingPage = pathname === '/';

  if (!mounted || isLandingPage || isAuthPage) return null;

  const navItems = [
    { icon: Home, href: '/feed', label: 'Home' },
    { icon: LayoutGrid, href: '/explore', label: 'Explore' },
    { icon: Plus, href: '/create', label: 'Create', isAction: true },
    { icon: Bell, href: '/notifications', label: 'Alerts' },
    { icon: User, href: '/profile', label: 'Profile', isProfile: true },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 pt-2 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pointer-events-none">
      <div className="max-w-md mx-auto glass-card rounded-[2.5rem] h-20 flex items-center justify-around px-6 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-900/90 backdrop-blur-2xl pointer-events-auto relative overflow-hidden">
        {/* Active Indicator Glow */}
        <div className="absolute inset-0 bg-brand-primary/5 opacity-50" />

        {navItems.map((item) => {
          const isActive = pathname === item.href;

          if (item.isAction) {
            return (
              <Link key={item.label} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 -translate-y-2 nav-active-gradient rounded-2xl flex items-center justify-center text-white shadow-2xl border-4 border-slate-900 z-10"
                >
                  <Plus size={28} strokeWidth={3} />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link key={item.label} href={item.href} className="relative flex flex-col items-center gap-1 group">
              <div className={`transition-all duration-300 ${isActive ? 'text-brand-primary scale-110' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {item.isProfile && profile?.avatar ? (
                  <div className={`w-7 h-7 rounded-full overflow-hidden ring-2 ${isActive ? 'ring-brand-primary' : 'ring-transparent'}`}>
                    <img src={profile.avatar} alt="Me" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                )}
              </div>

              {isActive && (
                <motion.div
                  layoutId="bottom-nav-dot"
                  className="w-1 h-1 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,1)]"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
