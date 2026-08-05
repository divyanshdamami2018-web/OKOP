'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SidebarNav } from '@/components/SidebarNav';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Tag as TagIcon,
  MessageSquare,
  Share2,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  Plus,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useJoinActivity } from '@/hooks/useJoinActivity';
import { useActivityDetail } from '@/hooks/useActivityDetail';
import { useChat } from '@/hooks/useMessages';

export default function ActivityDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { activity, participants, loading } = useActivityDetail(id as string);
  const { isJoined, isLoading: joinLoading, join, leave } = useJoinActivity(id as string);
  const { messages, sendMessage } = useChat(activity?.id || null); // Note: Should probably use a specific group_conversation_id if implemented
  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    await sendMessage(chatInput);
    setChatInput('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="text-brand-primary animate-spin" size={40} />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-900 dark:text-slate-100">
        <h1 className="text-2xl font-bold mb-4">Activity not found</h1>
        <button onClick={() => router.push('/feed')} className="text-brand-primary hover:underline">Return to feed</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      <SidebarNav />

      <main className="flex-1 ml-20">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-900 px-8 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-slate-500 dark:text-slate-400 transition-colors flex items-center gap-2 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">Back to Feed</span>
            </button>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-slate-500 dark:text-slate-400 transition-colors">
                <Share2 size={20} />
              </button>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-slate-500 dark:text-slate-400 transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold border border-brand-primary/20 uppercase tracking-wider">
                    {activity.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-brand-success text-xs font-bold">
                    <ShieldCheck size={14} />
                    Verified Event
                  </div>
                </div>

                <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-6 leading-tight">
                  {activity.title}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Date & Time</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {new Date(activity.startTime).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })} at {new Date(activity.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-secondary/10 rounded-xl flex items-center justify-center text-brand-secondary">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Location</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{activity.location}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Interest Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {activity.tags.map((tag) => (
                      <span key={tag} className="px-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300 font-medium shadow-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Discussion / Chat Section */}
              <section className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/50 rounded-[2.5rem] overflow-hidden shadow-premium">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800/50 flex items-center justify-between">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <MessageSquare size={20} className="text-brand-primary" />
                    Activity Discussion
                  </h3>
                </div>

                <div className="h-64 overflow-y-auto p-6 space-y-4 no-scrollbar">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                      <MessageSquare size={32} className="mb-2 opacity-20" />
                      <p className="text-xs italic text-center">No messages yet. Be the first to start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex-shrink-0" />
                        <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-2xl rounded-tl-none">
                          <p className="text-xs text-slate-700 dark:text-slate-300">{msg.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800/50 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-primary/50 text-slate-900 dark:text-white shadow-inner"
                  />
                  <button type="submit" className="p-2 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 transition-colors shadow-brand/20">
                    <ChevronRight size={20} />
                  </button>
                </form>
              </section>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Hosted By</h3>
                <div className="flex items-center gap-4 mb-6">
                  <img src={activity.creator.avatar} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-md" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">{activity.creator.name}</h4>
                    <p className="text-xs text-slate-500">Student @ {activity.creator.college}</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/profile/${activity.creator.id}`)}
                  className="w-full py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold transition-all border border-slate-200 dark:border-white/5"
                >
                  View Profile
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Participants</h3>
                  <span className="text-xs font-bold text-brand-primary">{activity.currentParticipants}/{activity.maxParticipants}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {participants.map((p) => (
                    <img
                      key={p.id}
                      src={p.avatar}
                      title={p.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-white dark:ring-slate-950 hover:scale-110 transition-transform cursor-pointer shadow-sm"
                    />
                  ))}
                  {[...Array(Math.max(0, activity.maxParticipants - participants.length))].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700">
                      <Plus size={16} />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => isJoined ? leave() : join()}
                  disabled={joinLoading}
                  className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    isJoined
                      ? 'bg-slate-100 dark:bg-slate-800 text-brand-danger hover:bg-brand-danger/10 border border-transparent hover:border-brand-danger/20'
                      : 'bg-brand-primary hover:bg-brand-primary/90 text-white shadow-brand/20'
                  }`}
                >
                  {joinLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : isJoined ? (
                    'Leave Activity'
                  ) : (
                    'Join Activity'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
