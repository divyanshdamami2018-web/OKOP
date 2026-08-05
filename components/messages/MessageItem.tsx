'use client';

import React from 'react';
import { Message, UserProfile } from '@/types';

interface MessageItemProps {
  message: Message;
  isMe: boolean;
  sender?: UserProfile;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, isMe, sender }) => {
  return (
    <div className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        {!isMe && sender && (
          <img
            src={sender.avatar}
            alt={sender.name}
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800"
          />
        )}
        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
          <div
            className={`px-4 py-2.5 rounded-2xl text-sm ${
              isMe
                ? 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-900/10'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700/50'
            }`}
          >
            {message.text}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 font-medium px-1 uppercase tracking-tighter">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};
