'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  Map as MapIcon,
  MessageCircle,
  Bell,
  User,
  Settings,
  Plus,
  LogOut,
  Sparkles,
  Zap,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNotifications } from '@/hooks/useNotifications';
import { LogoutDialog } from './auth/LogoutDialog';


const NavItem = ({ icon: Icon, href, label, badgeCount }: { icon: any, href: string, label: string, badgeCount?: number }) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link href={href} className="relative group flex items-center justify-center py-2 w-full outline-none">
      <div className={`
        relative p-3 rounded-2xl transition-all duration-500 flex items-center justify-center
        ${active
          ? 'bg-brand-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-110'
          : 'text-slate-500 hover:text-brand-primary hover:bg-brand-primary/10'}
      `}>
        <Icon size={24} strokeWidth={active ? 2.5 : 2} />

        {badgeCount && badgeCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-950 shadow-lg"
          >
            {badgeCount > 9 ? '9+' : badgeCount}
          </motion.span>
        )}

        {/* Tooltip */}
        <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-50 border border-slate-800 translate-x-[-10px] group-hover:translate-x-0 shadow-2xl">
          {label}
        </div>
      </div>

      {active && (
        <motion.div
          layoutId="sidebar-active-glow"
          className="absolute left-0 w-1.5 h-8 bg-brand-primary rounded-r-full shadow-[0_0_15px_rgba(99,102,241,0.8)]"
        />
      )}
    </Link>
  );
};

export const SidebarNav: React.FC = () => {
  const { user, profile } = useAuth();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <>
      {/* Side Navigation - Desktop */}
      <aside className="fixed left-0 top-0 h-screen w-24 bg-slate-950/40 backdrop-blur-2xl border-r border-white/5 flex flex-col items-center py-8 z-50 max-md:hidden">
        {/* Logo */}
        <Link href="/feed" className="mb-12 relative group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center font-black text-3xl text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            O
          </motion.div>
          <div className="absolute -inset-4 bg-brand-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full -z-10" />
        </Link>

        <nav className="flex-1 w-full space-y-4 px-3">
          <NavItem icon={Home} href="/feed" label="Feed" />
          <NavItem icon={Compass} href="/explore" label="Explore" />
          <NavItem icon={MapIcon} href="/map" label="Live Map" />
          <NavItem icon={MessageCircle} href="/messages" label="Messages" />
          <NavItem icon={Bell} href="/notifications" label="Notifications" badgeCount={unreadCount} />
          {profile?.role === 'admin' && (
             <NavItem icon={ShieldAlert} href="/admin/dashboard" label="Admin Terminal" />
          )}
        </nav>

        <div className="mt-auto space-y-6 w-full flex flex-col items-center px-3">
          <Link href="/create">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-2xl bg-slate-900/50 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand-primary/50 transition-all shadow-xl group"
            >
              <Plus size={28} className="group-hover:text-brand-primary transition-colors" />
            </motion.div>
          </Link>

          <div className="w-10 h-px bg-white/5" />

          <Link href="/profile" className="relative group">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 rounded-2xl bg-slate-800 overflow-hidden ring-2 ring-transparent hover:ring-brand-primary transition-all cursor-pointer p-0.5"
            >
              <img
                src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'default'}`}
                alt="Profile"
                className="w-full h-full object-cover rounded-xl"
              />
            </motion.div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-success border-2 border-slate-950 rounded-full shadow-lg" />
          </Link>

          <button
            onClick={() => setIsLogoutOpen(true)}
            className="p-3 rounded-2xl text-slate-600 hover:text-brand-accent hover:bg-brand-accent/10 transition-all duration-300"
            title="Log Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      <LogoutDialog isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} />
    </>
  );
};

const MobileNavItem = ({ icon: Icon, href, badgeCount }: { icon: any, href: string, badgeCount?: number }) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link href={href} className="relative p-2 flex flex-col items-center gap-1 group">
      <Icon
        size={24}
        className={`transition-all duration-300 ${active ? 'text-brand-primary scale-110' : 'text-slate-500 group-hover:text-slate-300'}`}
        strokeWidth={active ? 2.5 : 2}
      />
      {badgeCount && badgeCount > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 bg-brand-accent text-white text-[8px] font-black rounded-full flex items-center justify-center border border-slate-950">
          {badgeCount}
        </span>
      )}
      {active && (
        <motion.div
          layoutId="mobile-nav-indicator"
          className="w-1 h-1 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,1)]"
        />
      )}
    </Link>
  );
};
