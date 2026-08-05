'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  MessageCircle,
  Bell,
  Users,
  Calendar,
  LayoutGrid,
  Moon,
  Sun,
  Sparkles,
  ChevronDown,
  LogOut,
  User,
  Settings as SettingsIcon,
  Shield,
  CreditCard,
  Plus
} from 'lucide-react';
import { Logo } from './Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useTheme } from 'next-themes';

import { useAuth } from '@/components/auth/AuthProvider';

const NavItem = ({ icon: Icon, label, href, active }: { icon: any, label: string, href: string, active: boolean }) => (
  <Link href={href} className="relative group flex flex-col items-center py-1 outline-none">
    <div className={`p-3 rounded-2xl transition-all duration-500 ${
      active
        ? 'nav-active-gradient text-white shadow-xl shadow-brand-primary/40 scale-110'
        : 'text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10'
    }`}>
      <Icon size={20} strokeWidth={active ? 3 : 2} />
    </div>
    <span className={`text-[9px] font-black uppercase tracking-[0.15em] mt-2 transition-all duration-300 ${
      active ? 'text-brand-primary opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'
    }`}>
      {label}
    </span>
  </Link>
);

export const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use a fallback for server-side or unmounted state to prevent hydration mismatch
  const currentPath = mounted ? pathname : '';

  if (!mounted) return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-8">
      <div className="max-w-7xl mx-auto glass-card rounded-[2.5rem] px-8 py-3.5 flex items-center justify-between border-white/5 opacity-50">
         <div className="w-12 h-12 bg-slate-800 rounded-2xl animate-pulse" />
      </div>
    </nav>
  );

  const navLinks = [
    { icon: Home, label: 'Pulse', href: '/feed' },
    { icon: LayoutGrid, label: 'Explore', href: '/explore' },
    { icon: Calendar, label: 'Events', href: '/activities' },
    { icon: Users, label: 'Squads', href: '/people' },
    { icon: MessageCircle, label: 'Chats', href: '/messages' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 md:left-24 z-[100] transition-all duration-700 px-6 ${
        isScrolled ? 'py-4' : 'py-8'
      }`}>
        <div className={`max-w-7xl mx-auto glass-card rounded-[2.5rem] px-8 py-3.5 flex items-center justify-between border-white/40 dark:border-white/5 shadow-2xl transition-all duration-700 ${
          isScrolled ? 'scale-[0.97] bg-white/90 dark:bg-slate-900/90' : ''
        }`}>
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-4 group">
            <Logo size="md" />
          </Link>

          {/* Desktop Links - Hidden on Mobile and Landing Page */}
          <div className="hidden md:flex items-center gap-10">
            {pathname !== '/' && navLinks.map((link) => (
              <NavItem
                key={link.label}
                {...link}
                active={pathname === link.href}
              />
            ))}
          </div>

          {/* Action Hub */}
          <div className="flex items-center gap-3">
            {!user ? (
              <div className="flex items-center gap-4 ml-4">
                <Link
                  href="/login"
                  className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-brand-primary transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="btn-primary py-2.5 px-6 rounded-xl text-[10px] shadow-brand/20"
                >
                  Join Pulse
                </Link>
              </div>
            ) : (
              <>
                {/* Theme Toggle */}
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="flex p-3.5 bg-slate-100 dark:bg-slate-950 rounded-2xl text-slate-500 hover:text-brand-primary transition-all border border-slate-200 dark:border-white/5 shadow-inner"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <Link href="/notifications" className="relative p-3.5 bg-slate-100 dark:bg-slate-950 rounded-2xl text-slate-500 hover:text-brand-primary transition-all border border-slate-200 dark:border-white/5 shadow-inner">
                  <Bell size={20} />
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-brand-accent rounded-full border-2 border-white dark:border-slate-900 shadow-sm" />
                </Link>

                <div className="hidden lg:block w-px h-10 bg-slate-200 dark:bg-slate-800 mx-2" />

                {/* Profile Dropdown - Hidden on mobile because it's in BottomNav */}
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-3 pl-2 py-1 pr-1 bg-slate-100 dark:bg-slate-950 rounded-[1.5rem] border border-slate-200 dark:border-white/5 group hover:border-brand-primary/30 transition-all active:scale-95"
                  >
                    <div className="relative">
                      <img
                        src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'default'}`}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-brand-primary transition-all shadow-lg"
                        alt="Me"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-success border-2 border-white dark:border-slate-900 rounded-full" />
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 mr-2 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-4 w-64 glass-card rounded-[2rem] p-4 shadow-3xl border-white/50 dark:border-white/5 overflow-hidden"
                      >
                        <div className="flex flex-col gap-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 pt-2">Account</p>
                          <Link href="/profile" className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-all group">
                            <div className="p-2 bg-brand-primary/10 rounded-xl text-brand-primary">
                              <User size={18} />
                            </div>
                            <span className="text-sm font-black text-slate-700 dark:text-slate-200">My Profile</span>
                          </Link>
                          <Link href="/settings" className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-all group">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500">
                              <SettingsIcon size={18} />
                            </div>
                            <span className="text-sm font-black text-slate-700 dark:text-slate-200">Settings</span>
                          </Link>

                          <div className="h-px bg-slate-100 dark:bg-white/5 my-2" />

                          <button
                            onClick={() => supabase.auth.signOut().then(() => window.location.href = '/login')}
                            className="flex items-center gap-3 p-4 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all group w-full text-left"
                          >
                            <div className="p-2 bg-red-100 dark:bg-red-500/10 rounded-xl text-red-500">
                              <LogOut size={18} />
                            </div>
                            <span className="text-sm font-black text-red-500">Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};
