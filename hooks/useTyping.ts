'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useTypingIndicator(conversationId: string | null) {
  const { profile } = useAuthStore();
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  // Store the channel in a ref so setTyping can access the exact same channel instance
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!conversationId || !profile) return;

    const channelName = `typing_${conversationId}_${Math.random().toString(36).substring(7)}`;
    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: profile.id,
        },
      },
    });

    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users: string[] = [];
        for (const id in state) {
          const pres: any = state[id];
          if (pres[0]?.isTyping && id !== profile.id) {
            users.push(id);
          }
        }
        setTypingUsers(users);
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ isTyping: false });
        }
      });

    return () => {
      channelRef.current = null;
      supabase.removeChannel(channel);
    };
  }, [conversationId, profile]);

  const setTyping = async (typing: boolean) => {
    // Use the ref to track on the correct channel instance
    if (channelRef.current) {
      await channelRef.current.track({ isTyping: typing });
    }
    setIsTyping(typing);
  };

  return { isTyping, typingUsers, setTyping };
}
