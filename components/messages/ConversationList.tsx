'use client';

import React, { useState } from 'react';
import { Conversation } from '@/types';
import { Search, MessageSquarePlus, MessageSquareOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConversationListProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeId,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((conv) => {
    const otherParticipant = conv.participants[0];
    if (!otherParticipant) return false;
    return (
      otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage?.text?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col h-full bg-slate-950/50 backdrop-blur-xl border-r border-slate-900 w-full md:w-80">
      {/* Header with Search & Action */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">Messages</h1>
          <button
            className="p-2 bg-blue-600/10 text-blue-500 rounded-xl hover:bg-blue-600/20 transition-all active:scale-95 group"
            aria-label="New Message"
          >
            <MessageSquarePlus size={20} className="group-hover:rotate-3 transition-transform" />
          </button>
        </div>

        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors"
            size={16}
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Conversations List with Framer Motion */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="px-2 pb-6 space-y-1">
          <AnimatePresence mode="popLayout">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => {
                const otherParticipant = conv.participants[0];
                const isActive = activeId === conv.id;

                return (
                  <motion.button
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={conv.id}
                    onClick={() => onSelect(conv.id)}
                    className={`w-full p-3 flex items-center gap-3 transition-all rounded-2xl text-left relative group ${
                      isActive
                        ? 'bg-slate-900 shadow-lg shadow-black/20'
                        : 'hover:bg-slate-900/30'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-chat-indicator"
                        className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full"
                      />
                    )}

                    <div className="relative flex-shrink-0">
                      <img
                        src={otherParticipant?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.id}`}
                        alt={otherParticipant?.name || 'User'}
                        className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-800 group-hover:ring-slate-700 transition-all"
                      />
                      {otherParticipant?.status === 'online' && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className={`font-semibold truncate ${isActive ? 'text-slate-100' : 'text-slate-300 group-hover:text-slate-100'}`}>
                          {otherParticipant?.name || 'Campus User'}
                        </h3>
                        {conv.lastMessage && (
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                            {new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs truncate ${isActive ? 'text-slate-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
                          {conv.lastMessage?.text || 'No messages yet'}
                        </p>
                        {conv.unreadCount > 0 && (
                          <div className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-blue-900/40">
                            {conv.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 px-6 text-center"
              >
                <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center mb-4 text-slate-800">
                  <MessageSquareOff size={32} />
                </div>
                <p className="text-sm font-semibold text-slate-400">No chats found</p>
                <p className="text-xs text-slate-600 mt-1 max-w-[180px]">Try searching for someone else or start a new conversation.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Identity Footer */}
      <div className="p-4 border-t border-slate-900/50 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-500">@S</span>
          </div>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Stanford University Network</p>
        </div>
      </div>
    </div>
  );
};
