'use client';

import React from 'react';
import Image from 'next/image';
import { Message, UserProfile } from '@/types';

interface MessageItemProps {
  message: Message;
  isMe: boolean;
  sender?: UserProfile;
}

export default function MessageItem({
  message,
  isMe,
  sender,
}: MessageItemProps) {
  return (
    <div className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex items-end gap-2 max-w-[75%] ${
          isMe ? 'flex-row-reverse' : ''
        }`}
      >
        {!isMe && sender && (
          <Image
            src={sender.avatar || '/default-avatar.png'}
            alt={sender.name}
            width={32}
            height={32}
            className="rounded-full border border-slate-200 dark:border-slate-700 object-cover"
          />
        )}

        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
          {!isMe && sender && (
            <span className="text-xs text-slate-500 mb-1 font-medium">
              {sender.name}
            </span>
          )}

          <div
            className={`px-4 py-3 rounded-2xl break-words whitespace-pre-wrap text-sm leading-relaxed transition-all ${
              isMe
                ? 'bg-brand-primary text-white rounded-br-md shadow-lg shadow-brand-primary/20'
                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-md border border-slate-200 dark:border-slate-700 shadow'
            }`}
          >
            {message.text}
          </div>

          <span className="mt-1 px-1 text-[11px] text-slate-500">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}