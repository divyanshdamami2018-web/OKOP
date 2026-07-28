'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  MessageSquare,
  Calendar,
  BookOpen,
  Users,
  ShoppingBag,
  HelpCircle,
  X,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ACTION_CARDS = [
  { id: 'moment', label: 'Post a Moment', desc: 'Share what is happening right now', icon: Sparkles, color: 'bg-brand-primary', href: '/feed' },
  { id: 'activity', label: 'Host Event', desc: 'Organize a campus activity', icon: Calendar, color: 'bg-brand-accent', href: '/activities' },
  { id: 'note', label: 'Share Notes', desc: 'Upload study material to vault', icon: BookOpen, color: 'bg-brand-success', href: '/notes' },
  { id: 'squad', label: 'Start a Squad', desc: 'Find study or project partners', icon: Users, color: 'bg-brand-secondary', href: '/study-groups' },
  { id: 'item', label: 'Sell Item', desc: 'List something on marketplace', icon: ShoppingBag, color: 'bg-amber-500', href: '/marketplace' },
  { id: 'lost', label: 'Report Lost', desc: 'Help return campus items', icon: HelpCircle, color: 'bg-red-500', href: '/lost-found' },
];

export default function CreateActionPage() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-12">
      <header className="text-center space-y-4">
        <div className="w-20 h-20 bg-brand-gradient rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-brand-primary/30 relative">
           <Plus size={40} strokeWidth={3} />
           <div className="absolute inset-0 bg-white/20 animate-ping rounded-[2.5rem] opacity-20" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Action <span className="text-gradient">Center</span></h1>
          <p className="text-slate-500 font-medium">What do you want to contribute to the campus today?</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {ACTION_CARDS.map((action, i) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={action.href} className="group glass-card p-6 rounded-[2.5rem] flex items-center gap-6 hover:border-brand-primary/50 transition-all active:scale-95 block">
              <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <action.icon size={28} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors uppercase tracking-tight text-sm">{action.label}</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{action.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <button
        onClick={() => router.back()}
        className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-xl"
      >
        <X size={24} />
      </button>
    </div>
  );
}
