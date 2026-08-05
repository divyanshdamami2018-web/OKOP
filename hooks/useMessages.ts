'use client';

import { useEffect, useState, useCallback } from 'react';
import { chatService } from '@/services/chat.service';
import { useChatStore } from '@/store/chat.store';
import { useAuthStore } from '@/store/auth.store';
import { supabase } from '@/lib/supabase';

export function useConversations() {
  const { profile } = useAuthStore();
  const { conversations, setConversations } = useChatStore();
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!profile) return;
    try {
      const data = await chatService.getConversations(profile.id);
      setConversations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [profile, setConversations]);

  useEffect(() => {
    fetch();

    if (!profile) return;

    // Real-time conversation list updates
    const channel = supabase
      .channel('convo_list')
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

    const channel = supabase
      .channel(`chat_${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload: any) => {
        const msg = payload.new;
        setMessages(prev => [...prev, {
          id: msg.id,
          senderId: msg.sender_id,
          text: msg.content,
          timestamp: msg.created_at,
          isRead: false
        }]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, fetchMessages]);

  const sendMessage = async (text: string) => {
    if (!conversationId || !profile) return;
    const msg = await chatService.sendMessage(conversationId, profile.id, text);
    return msg;
  };

  return { messages, loading, sendMessage };
}
