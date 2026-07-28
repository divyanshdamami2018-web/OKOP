'use client';

import React from 'react';
import { SidebarNav } from '@/components/SidebarNav';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import {
  Bell,
  MessageSquare,
  UserPlus,
  Zap,
  Clock,
  Check,
  MoreHorizontal,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  switch (type) {
    case 'activity_join':
      return <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl"><UserPlus size={20} /></div>;
    case 'message':
      return <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl"><MessageSquare size={20} /></div>;
    case 'spot_alert':
      return <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl"><Zap size={20} /></div>;
    default:
      return <div className="p-2 bg-slate-500/10 text-slate-500 rounded-xl"><Bell size={20} /></div>;
  }
};

export default function NotificationsPage() {
  const { notifications, loading, markAsRead } = useNotifications();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <SidebarNav />

      <main className="flex-1 ml-20">
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 px-8 py-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <Bell className="text-blue-500" size={24} />
                Notifications
              </h1>
              <p className="text-slate-500 text-sm mt-1">Stay updated with your campus circle.</p>
            </div>
            <button className="p-2 hover:bg-slate-900 rounded-xl text-slate-400 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-8 py-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
              <Loader2 className="animate-spin" size={32} />
              <p className="text-sm font-medium">Loading your alerts...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-700 mb-4">
                <Bell size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-300">All caught up!</h3>
              <p className="text-slate-500 text-sm mt-1">We'll notify you when something exciting happens.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => markAsRead(notification.id)}
                    className={`group relative p-5 rounded-2xl border transition-all cursor-pointer flex gap-4 ${
                      notification.is_read
                        ? 'bg-slate-900/20 border-slate-800/50 grayscale-[0.5]'
                        : 'bg-slate-900/50 border-slate-800 hover:border-blue-500/30 ring-1 ring-blue-500/5 shadow-xl shadow-blue-900/5'
                    }`}
                  >
                    <NotificationIcon type={notification.type} />

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-bold text-sm ${notification.is_read ? 'text-slate-400' : 'text-slate-100'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                          <Clock size={12} />
                          {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <p className={`text-sm leading-relaxed ${notification.is_read ? 'text-slate-500' : 'text-slate-400'}`}>
                        {notification.content}
                      </p>

                      {!notification.is_read && (
                        <div className="absolute right-4 bottom-4 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                      )}
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                      <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-blue-400">
                        <Check size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <div className="mt-12 p-8 border border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center">
            <h4 className="text-slate-400 font-bold mb-2">Notification Settings</h4>
            <p className="text-slate-600 text-xs max-w-xs mb-6">
              Customize how you want to be notified about campus activities and messages.
            </p>
            <button className="px-6 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 transition-all">
              Manage Preferences
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
