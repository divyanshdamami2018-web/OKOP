'use client';

import { useEffect, useState, useCallback } from 'react';
import { chatService } from '@/services/chat.service';
import { useChatStore } from '@/store/chat.store';
import { useAuthStore } from '@/store/auth.store';
import { supabase } from '@/lib/supabase';

export function useConversations() {
  const { profile, loading: authLoading } = useAuthStore();
  const { conversations, setConversations } = useChatStore();
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!profile) {
      if (!authLoading) setLoading(false);
      return;
    }
    try {
      const data = await chatService.getConversations(profile.id);
      setConversations(data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [profile, authLoading, setConversations]);

  useEffect(() => {
    fetch();

    if (!profile) return;

    // Real-time conversation list updates
    const channelName = `convo_list_${profile.id}_${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversation_participants',
        filter: `user_id=eq.${profile.id}`
      }, () => fetch())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile, fetch]);

  return { conversations, loading };
}

export function useChat(conversationId: string | null) {
  const { profile } = useAuthStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const data = await chatService.getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchMessages();

    if (!conversationId) return;

    const channelName = `chat_${conversationId}_${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload: any) => {
        const msg = payload.new;
        setMessages(prev => {
          // Prevent duplicates if optimistic update already finished
          if (prev.some(m => m.id === msg.id)) return prev;

          return [...prev, {
            id: msg.id,
            senderId: msg.sender_id,
            text: msg.content,
            timestamp: msg.created_at,
            isRead: false
          }];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, fetchMessages]);

  const sendMessage = async (text: string) => {
    if (!conversationId || !profile) return;

    // Create optimistic message
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      senderId: profile.id,
      text,
      timestamp: new Date().toISOString(),
      isRead: false,
      isOptimistic: true
    };

    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const msg = await chatService.sendMessage(conversationId, profile.id, text);
      // Replace optimistic message with real one
      setMessages(prev => prev.map(m => m.id === tempId ? {
        id: msg.id,
        senderId: msg.sender_id,
        text: msg.content,
        timestamp: msg.created_at,
        isRead: false
      } : m));
      return msg;
    } catch (err) {
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(m => m.id !== tempId));
      console.error('Failed to send message:', err);
      throw err;
    }
  };

  return { messages, loading, sendMessage };
}
