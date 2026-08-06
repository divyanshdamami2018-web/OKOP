'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { chatService } from '@/services/chat.service';
import { Message } from '@/types';
import { supabase } from '@/lib/supabase';

export function useChatRoom(conversationId: string | null) {
  const { profile } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Keep a ref to profile.id to prevent stale closure issues inside Realtime listener
  const profileIdRef = useRef(profile?.id);
  useEffect(() => {
    profileIdRef.current = profile?.id;
  }, [profile?.id]);

  const fetchMessages = useCallback(async (activeConversationId: string, signal: { cancelled: boolean }) => {
    setLoading(true);
    try {
      const msgs = await chatService.getMessages(activeConversationId);
      if (!signal.cancelled) {
        setMessages(msgs);
      }
    } catch (err) {
      if (!signal.cancelled) {
        console.error('Failed to fetch messages:', err);
      }
    } finally {
      if (!signal.cancelled) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const cancellationSignal = { cancelled: false };

    // 1. Initial Fetch
    fetchMessages(conversationId, cancellationSignal);

    // 2. Setup Realtime Subscription
    const channelName = `chat_room:${conversationId}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload: any) => {
          const newMessage = payload.new;
          const currentUserId = profileIdRef.current;

          // Only add if message wasn't sent by current user
          if (newMessage.sender_id !== currentUserId) {
            setMessages((prev) => {
              // Prevent duplicates
              if (prev.some((m) => m.id === newMessage.id)) return prev;

              return [
                ...prev,
                {
                  id: newMessage.id,
                  senderId: newMessage.sender_id,
                  text: newMessage.content,
                  timestamp: newMessage.created_at,
                  isRead: false
                }
              ];
            });

            if (currentUserId) {
              chatService.markAsRead(conversationId, currentUserId);
            }
          }
        }
      )
      .subscribe();

    // 3. Cleanup on switch/unmount
    return () => {
      cancellationSignal.cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [conversationId, fetchMessages]);

  const send = async (content: string) => {
    if (!conversationId || !profile?.id || !content.trim()) return;

    const currentUserId = profile.id;
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const optimisticMsg: Message = {
      id: tempId,
      senderId: currentUserId,
      text: content,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    // Optimistic Insertion
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const sent = await chatService.sendMessage(conversationId, currentUserId, content);

      // Swap temporary ID with server ID
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
                ...m,
                id: sent.id,
                timestamp: sent.created_at
              }
            : m
        )
      );
    } catch (err) {
      // Rollback optimistic update on error
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      console.error('Failed to send message:', err);
    }
  };

  return { messages, loading, send };
}