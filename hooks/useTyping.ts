'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';

export function useTypingIndicator(conversationId: string | null) {
  const { profile } = useAuthStore();
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

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
      supabase.removeChannel(channel);
    };
  }, [conversationId, profile]);

  const setTyping = async (typing: boolean) => {
    const channel = supabase.channel(`typing_${conversationId}`);
    if (channel) {
      await channel.track({ isTyping: typing });
    }
    setIsTyping(typing);
  };

  return { isTyping, typingUsers, setTyping };
}
