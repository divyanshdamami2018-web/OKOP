'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Plus,
  Tag,
  Filter,
  Clock,
  MapPin,
  ChevronRight,
  MoreVertical,
  Heart,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Books', 'Electronics', 'Bicycles', 'Furniture', 'Hostel Items'];

const ITEMS = [
  {
    id: '1',
    title: 'Modern Coding with Next.js (Hardcover)',
    price: 25,
    category: 'Books',
    location: 'Old Union',
    posted: '1h ago',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&h=300&auto=format&fit=crop',
    seller: { name: 'Alex', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' }
  },
  {
    id: '2',
    title: 'Electric Scooter - Lightly Used',
    price: 350,
    category: 'Bicycles',
    location: 'Main Quad',
    posted: '3h ago',
    image: 'https://images.unsplash.com/photo-1597075095353-83f063765f7c?q=80&w=400&h=300&auto=format&fit=crop',
    seller: { name: 'Sarah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' }
  },
  {
    id: '3',
    title: 'Mechanical Keyboard (RGB)',
    price: 45,
    category: 'Electronics',
    location: 'Lab 4',
    posted: '5h ago',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=400&h=300&auto=format&fit=crop',
    seller: { name: 'James', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' }
  },
  {
    id: '4',
    title: 'Study Table & Chair Set',
    price: 80,
    category: 'Furniture',
    location: 'Hostel A',
    posted: '1d ago',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f816b1a22a?q=80&w=400&h=300&auto=format&fit=crop',
    seller: { name: 'Emma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' }
  }
];

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-10 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 text-slate-900 dark:text-white">
            <ShoppingBag className="text-brand-primary" size={36} />
            Campus <span className="text-gradient">Market</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Buy and sell items within your campus community.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search items..."
              className="glass-input w-full py-3.5 pl-12 pr-4 text-sm"
            />
          </div>
          <button className="btn-primary py-3.5 px-8 whitespace-nowrap">
            <Plus size={20} /> Sell Item
          </button>
        </div>
      </header>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-white dark:bg-slate-800 text-brand-primary border-brand-primary shadow-xl scale-105'
                : 'bg-slate-900/50 border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {ITEMS.filter(item => activeCategory === 'All' || item.category === activeCategory).map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -8 }}
              key={item.id}
              className="glass-card rounded-[2.5rem] overflow-hidden group cursor-pointer border-white/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-primary shadow-lg border border-white/20">
                    {item.category}
                  </span>
                </div>
                <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 transition-all active:scale-90">
                  <Heart size={18} />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-black text-slate-900 dark:text-white leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">{item.title}</h3>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-brand-primary">${item.price}</span>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">{item.posted}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={item.seller.avatar} className="w-8 h-8 rounded-lg object-cover ring-2 ring-slate-100 dark:ring-slate-800" alt="Seller" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.seller.name}</span>
                  </div>
                  <button className="p-2.5 bg-brand-primary/10 text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-all active:scale-90 shadow-sm shadow-brand-primary/5">
                    <MessageCircle size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Post Item CTA Card */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all relative overflow-hidden h-full min-h-[350px]"
        >
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-brand-primary group-hover:border-brand-primary/50 transition-all shadow-xl">
            <Plus size={32} />
          </div>
          <div className="text-center px-6">
            <p className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Sell Something</p>
            <p className="text-xs text-slate-500 mt-2 font-medium">Turn your extra stuff into cash for textbooks!</p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">
            <Sparkles size={12} />
            +15 XP per listing
          </div>
        </motion.button>
      </div>
    </div>
  );
}
