import { supabase } from '@/lib/supabase';
import { Message, Conversation } from '@/types';

export const chatService = {
  async getConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversation_participants')
      .select(`
        conversation_id,
        conversations (
          id,
          is_group,
          name,
          created_at,
          conversation_participants (
            user_id,
            profiles (
              id,
              full_name,
              avatar_url,
              status,
              role
            )
          )
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;

    return (data || []).map((item: any) => {
      const conv = item.conversations;
      const otherParticipants = conv.conversation_participants
        .filter((p: any) => p.user_id !== userId)
        .map((p: any) => ({
          id: p.profiles.id,
          name: p.profiles.full_name,
          avatar: p.profiles.avatar_url,
          username: p.profiles.username,
          status: p.profiles.status,
          role: p.profiles.role
        }));

      return {
        id: conv.id,
        is_group: conv.is_group,
        name: conv.name,
        participants: otherParticipants,
        unreadCount: 0 // Fetch separately or via a view
      } as any;
    });
  },

  async getMessages(conversationId: string, limit = 50, cursor?: string): Promise<Message[]> {
    let query = supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map((m: any) => ({
      id: m.id,
      senderId: m.sender_id,
      text: m.content,
      fileUrl: m.file_url,
      timestamp: m.created_at,
      isRead: !!m.read_at
    })).reverse();
  },

  async sendMessage(conversationId: string, senderId: string, content: string, fileUrl?: string) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        file_url: fileUrl
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async markAsRead(conversationId: string, userId: string) {
    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .is('read_at', null);

    if (error) console.error('Error marking as read:', error);
  }
};
