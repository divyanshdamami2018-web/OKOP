'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { chatService } from '@/services/chat.service';
import { Message } from '@/types';
import { supabase } from '@/lib/supabase';

export function useChatRoom(conversationId: string | null) {
  const { profile } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      const msgs = await chatService.getMessages(conversationId);
      setMessages(msgs);
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
        const newMessage = payload.new;
        if (newMessage.sender_id !== profile?.id) {
          setMessages(prev => [...prev, {
            id: newMessage.id,
            senderId: newMessage.sender_id,
            text: newMessage.content,
            timestamp: newMessage.created_at,
            isRead: false
          }]);
          // Auto mark as read if active
          chatService.markAsRead(conversationId, profile?.id || '');
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, fetchMessages, profile?.id]);

  const send = async (content: string) => {
    if (!conversationId || !profile) return;

    // Optimistic Update
    const tempId = Math.random().toString();
    const optimisticMsg: Message = {
      id: tempId,
      senderId: profile.id,
      text: content,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const sent = await chatService.sendMessage(conversationId, profile.id, content);
      setMessages(prev => prev.map(m => m.id === tempId ? {
        ...m,
        id: sent.id,
        timestamp: sent.created_at
      } : m));
    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== tempId));
      console.error('Failed to send:', err);
    }
  };

  return { messages, loading, send };
}
