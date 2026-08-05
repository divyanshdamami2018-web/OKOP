'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { SidebarNav } from '@/components/SidebarNav';
import { ConversationList } from '@/components/messages/ConversationList';
import { MessageItem } from '@/components/messages/MessageItem';
import {
  Send,
  Phone,
  Video,
  Info,
  MessageSquare,
  Loader2,
  User,
  Plus,
  Smile,
  Paperclip,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useConversations, useChat } from '@/hooks/useMessages';
import { useTypingIndicator } from '@/hooks/useTyping';
import { usePresence } from '@/hooks/usePresence';
import { useAuthStore } from '@/store/auth.store';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';

function MessagesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const conversationIdParam = searchParams.get('id');
  const userIdParam = searchParams.get('user');

  const { profile: currentUser } = useAuthStore();
  const { conversations, loading: convsLoading } = useConversations();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const { messages, loading: msgsLoading, sendMessage } = useChat(activeConversationId);
  const { typingUsers, setTyping } = useTypingIndicator(activeConversationId);
  const { isOnline } = usePresence();

  const [inputText, setInputText] = useState('');

  useEffect(() => {
    async function resolveParams() {
      // Prioritize explicit ID
      if (conversationIdParam) {
        setActiveConversationId(conversationIdParam);
        return;
      }

      // If we have a user ID, find or create conversation
      if (userIdParam && currentUser) {
        try {
          // Use atomic function to get or create DM
          const { data: convId, error: rpcErr } = await supabase
            .rpc('create_dm_conversation', {
              user1_id: currentUser.id,
              user2_id: userIdParam
            });

          if (rpcErr) throw rpcErr;

          if (convId) {
            setActiveConversationId(convId);
          }
        } catch (err) {
          console.error('Error resolving user chat:', err);
        }
        return;
      }

      // Fallback: Pick first conversation if none selected
      if (conversations.length > 0 && !activeConversationId) {
        setActiveConversationId(conversations[0].id);
      }
    }

    if (currentUser && !convsLoading) {
      resolveParams();
    }
  }, [conversations, activeConversationId, conversationIdParam, userIdParam, currentUser, convsLoading]);

  const activeConv = conversations.find(c => c.id === activeConversationId);
  const otherParticipant = activeConv?.participants[0];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationId || !currentUser) return;

    const textToSend = inputText.trim();
    setInputText(''); // Clear instantly

    try {
      await sendMessage(textToSend);
      setTyping(false);
    } catch (err) {
      console.error('Failed to send message:', err);
      setInputText(textToSend); // Restore on error
      alert('Failed to send message. Please check your connection.');
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100">
      <SidebarNav />

      <main className="flex-1 md:ml-24 flex h-full transition-all duration-500">
        {/* Left Side: Conversations */}
        <div className="hidden md:block w-80 lg:w-96 h-full border-r border-slate-200 dark:border-white/5">
          {convsLoading ? (
            <div className="flex items-center justify-center h-full bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-xl">
              <Loader2 className="animate-spin text-brand-primary" size={24} />
            </div>
          ) : (
            <ConversationList
              conversations={conversations}
              activeId={activeConversationId || undefined}
              onSelect={setActiveConversationId}
            />
          )}
        </div>

        {/* Right Side: Chat Window */}
        <div className="flex-1 flex flex-col bg-slate-100/5 dark:bg-slate-900/10 relative">
          {/* Background Gradient Orbs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-secondary/5 blur-[100px] rounded-full -ml-48 -mb-48 pointer-events-none" />

          {activeConversationId && activeConv ? (
            <>
              {/* Chat Header */}
              <header className="h-24 flex items-center justify-between px-8 border-b border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  {otherParticipant ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative"
                    >
                      <img
                        src={otherParticipant.avatar}
                        alt={otherParticipant.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-xl"
                      />
                      {isOnline(otherParticipant.id) && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-success border-4 border-white dark:border-slate-950 rounded-full shadow-lg" />
                      )}
                    </motion.div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      <User size={24} className="text-slate-500" />
                    </div>
                  )}
                  <div>
                    <h2 className="font-black text-slate-900 dark:text-slate-100 text-lg tracking-tight flex items-center gap-2">
                      {otherParticipant?.name || 'Loading...'}
                      {activeConv.is_group && <span className="bg-brand-primary/20 text-brand-primary text-[10px] px-2 py-0.5 rounded-md uppercase font-black">Group</span>}
                    </h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      {otherParticipant && isOnline(otherParticipant.id) ? (
                        <>
                          <span className="w-1.5 h-1.5 bg-brand-success rounded-full animate-pulse" />
                          Active now
                        </>
                      ) : typingUsers.length > 0 ? (
                        <span className="text-brand-primary animate-pulse italic">typing...</span>
                      ) : (
                        'Campus Community'
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2">
                    <button className="p-3 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 transition-all active:scale-90">
                      <Phone size={20} />
                    </button>
                    <button className="p-3 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 transition-all active:scale-90">
                      <Video size={20} />
                    </button>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-white/5 mx-2 hidden sm:block" />
                  <button className="p-3 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-400 hover:text-brand-primary dark:hover:text-white transition-all active:scale-90">
                    <Info size={20} />
                  </button>
                </div>
              </header>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-8 no-scrollbar flex flex-col gap-6 relative z-0">
                {msgsLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-400">
                    <Loader2 className="animate-spin text-brand-primary" size={32} />
                    <p className="text-xs font-black uppercase tracking-widest">Syncing Chat...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                    <div className="w-20 h-20 bg-brand-primary/10 rounded-[2.5rem] flex items-center justify-center mb-6 text-brand-primary">
                      <Sparkles size={40} className="animate-pulse-gentle" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-2 tracking-tight">The start of something new!</h3>
                    <p className="text-slate-500 text-sm font-medium">Say hi to {otherParticipant?.name?.split(' ')[0]} and discover what you have in common.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {messages.map((msg: any) => (
                      <MessageItem
                        key={msg.id}
                        message={msg}
                        isMe={msg.senderId === currentUser?.id}
                        sender={msg.senderId === currentUser?.id ? currentUser! : otherParticipant}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Input Area */}
              <footer className="p-8 bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl border-t border-slate-200 dark:border-white/5 sticky bottom-0 z-10">
                <form
                  onSubmit={handleSendMessage}
                  className="max-w-5xl mx-auto flex items-center gap-4"
                >
                  <button type="button" className="p-4 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-[1.5rem] text-slate-500 hover:text-brand-primary hover:bg-brand-primary/5 transition-all shadow-xl active:scale-90">
                    <Plus size={20} />
                  </button>

                  <div className="flex-1 relative group">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value);
                        setTyping(e.target.value.length > 0);
                      }}
                      onBlur={() => setTyping(false)}
                      placeholder={`Message ${otherParticipant?.name || '...'}`}
                      className="glass-input w-full py-4 px-6 text-sm pr-24 shadow-2xl"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                      <button type="button" className="text-slate-400 hover:text-brand-accent transition-colors">
                        <Smile size={20} />
                      </button>
                      <button type="button" className="text-slate-400 hover:text-brand-primary transition-colors">
                        <Paperclip size={20} />
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-4 bg-brand-gradient text-white rounded-[1.5rem] shadow-xl shadow-brand-primary/20 hover:opacity-90 disabled:opacity-50 disabled:grayscale transition-all active:scale-95 flex items-center justify-center group"
                  >
                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </footer>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-32 h-32 bg-slate-100 dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-white/5 flex items-center justify-center mb-8 text-slate-300 dark:text-slate-800 relative group overflow-hidden">
                <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-10 transition-opacity" />
                <MessageSquare size={56} className="relative z-10 group-hover:text-brand-primary transition-colors duration-500" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-3 tracking-tighter">Campus Chat</h2>
              <p className="text-slate-500 text-lg font-medium max-w-md">Select a teammate or activity group to start the conversation.</p>
              <button
                onClick={() => router.push('/explore')}
                className="btn-primary mt-10 px-10 py-4 text-xs font-black uppercase tracking-widest"
              >
                Find People to Chat
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center"><Loader2 className="animate-spin text-brand-primary" /></div>}>
      <MessagesContent />
    </Suspense>
  );
}
