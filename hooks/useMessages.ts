'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { chatService } from '@/services/chat.service';
import { useChatStore } from '@/store/chat.store';
import { useAuthStore } from '@/store/auth.store';
import { supabase } from '@/lib/supabase';
import { Message } from '@/types';

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

  return { conversations, loading, refresh: fetch };
}

export function useChat(conversationId: string | null) {
  const { profile } = useAuthStore();
  const { messageCache, setMessages: setGlobalMessages, addMessage } = useChatStore();
  const [loading, setLoading] = useState(false);

  const messages = conversationId ? (messageCache[conversationId] || []) : [];

  const fetchMessages = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await chatService.getMessages(id);
      setGlobalMessages(id, data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  }, [setGlobalMessages]);

  useEffect(() => {
    if (conversationId && !messageCache[conversationId]) {
      fetchMessages(conversationId);
    }

    if (!conversationId) return;

    const channelName = `chat_room_${conversationId}_${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload: any) => {
        const msg = payload.new;
        const mapped: Message = {
          id: msg.id,
          senderId: msg.sender_id,
          text: msg.content,
          timestamp: msg.created_at,
          isRead: !!msg.read_at
        };

        // Skip own messages handled optimistically
        if (msg.sender_id !== profile?.id) {
          addMessage(conversationId, mapped);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, fetchMessages, addMessage, profile?.id]);

  const sendMessage = async (text: string) => {
    if (!conversationId || !profile) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: Message = {
      id: tempId,
      senderId: profile.id,
      text,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    // Push to global store immediately
    addMessage(conversationId, optimisticMsg);

    try {
      const msg = await chatService.sendMessage(conversationId, profile.id, text);

      // Update global store: replace optimistic with real
      const currentMessages = useChatStore.getState().messageCache[conversationId] || [];
      const updated = currentMessages.map(m => m.id === tempId ? {
        id: msg.id,
        senderId: msg.sender_id,
        text: msg.content,
        timestamp: msg.created_at,
        isRead: false
      } : m);

      setGlobalMessages(conversationId, updated);
      return msg;
    } catch (err) {
      // Rollback failure
      const currentMessages = useChatStore.getState().messageCache[conversationId] || [];
      setGlobalMessages(conversationId, currentMessages.filter(m => m.id !== tempId));
      console.error('Failed to send message:', err);
      throw err;
    }
  };

  return { messages, loading, sendMessage };
}
