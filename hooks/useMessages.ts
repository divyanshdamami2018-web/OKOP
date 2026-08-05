'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Conversation, Message, UserProfile } from '@/types';
import { useAuth } from '@/components/auth/AuthProvider';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchConversations() {
      if (!user) return;

      // Fetch conversations where the user is a participant
      const { data, error } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          conversations (
            id,
            created_at,
            messages (
              id,
              content,
              created_at,
              sender_id
            ),
            conversation_participants (
              user_id,
              profiles (
                id,
                full_name,
                avatar_url,
                status
              )
            )
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }

      const mapped: Conversation[] = (data || []).map((item: any) => {
        const conv = item.conversations;
        const lastMsg = conv.messages?.sort((a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];

        // Find the other participant(s)
        const participants = conv.conversation_participants
          .filter((p: any) => p.user_id !== user.id)
          .map((p: any) => ({
            id: p.profiles.id,
            name: p.profiles.full_name,
            username: p.profiles.username || 'user',
            avatar: p.profiles.avatar_url,
            status: p.profiles.status || 'offline',
            college: p.profiles.college || 'Stanford',
            interests: p.profiles.interests || [],
            skills: p.profiles.skills || [],
            xp_points: p.profiles.xp_points || 0,
            daily_streak: p.profiles.daily_streak || 0,
            is_ghost_mode: p.profiles.is_ghost_mode || false,
            onboarding_completed: true,
            is_profile_public: true,
            hide_email: false,
            hide_phone: false,
            hide_semester: false,
            created_at: p.profiles.created_at || new Date().toISOString()
          }));

        return {
          id: conv.id,
          is_group: conv.is_group || false,
          participants: participants,
          unreadCount: 0, // Would need a more complex query or table for this
          lastMessage: lastMsg ? {
            id: lastMsg.id,
            text: lastMsg.content,
            senderId: lastMsg.sender_id,
            timestamp: lastMsg.created_at,
            isRead: lastMsg.is_read || false
          } : undefined
        };
      });

      setConversations(mapped);
      setLoading(false);
    }

    fetchConversations();

    const channel = supabase
      .channel('conversations_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { conversations, loading };
}

export function useChat(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    async function fetchMessages() {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages((data || []).map((m: any) => ({
        id: m.id,
        text: m.content,
        senderId: m.sender_id,
        timestamp: m.created_at,
        isRead: m.is_read || false
      })));
      setLoading(false);
    }

    fetchMessages();

    const channel = supabase
      .channel(`chat_${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload: any) => {
        const newMessage = payload.new as any;
        setMessages((prev) => [...prev, {
          id: newMessage.id,
          text: newMessage.content,
          senderId: newMessage.sender_id,
          timestamp: newMessage.created_at,
          isRead: newMessage.is_read || false
        }]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const sendMessage = async (text: string) => {
    if (!conversationId || !user) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: text
      });

    if (error) throw error;
  };

  return { messages, loading, sendMessage };
}
