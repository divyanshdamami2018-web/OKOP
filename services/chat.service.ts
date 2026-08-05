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
              username,
              avatar_url,
              status,
              role
            )
          ),
          messages (
            id,
            sender_id,
            content,
            created_at,
            read_at
          )
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;

    return (data || []).map((item: any) => {
      const conv = item.conversations;
      if (!conv) return null;

      const otherParticipants = (conv.conversation_participants || [])
        .filter((p: any) => p.user_id !== userId)
        .map((p: any) => ({
          id: p.profiles?.id,
          name: p.profiles?.full_name || 'Campus User',
          avatar: p.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.user_id}`,
          username: p.profiles?.username || 'user',
          status: p.profiles?.status || 'offline',
          role: p.profiles?.role || 'student'
        }));

      // Get last message
      const lastMsgData = conv.messages && conv.messages.length > 0
        ? conv.messages.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
        : null;

      const lastMessage: Message | undefined = lastMsgData ? {
        id: lastMsgData.id,
        senderId: lastMsgData.sender_id,
        text: lastMsgData.content,
        timestamp: lastMsgData.created_at,
        isRead: !!lastMsgData.read_at
      } : undefined;

      return {
        id: conv.id,
        is_group: conv.is_group,
        name: conv.name,
        participants: otherParticipants,
        lastMessage,
        unreadCount: 0
      } as Conversation;
    }).filter(Boolean) as Conversation[];
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
  },

  async getConversationById(conversationId: string, userId: string): Promise<Conversation | null> {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        id,
        is_group,
        name,
        created_at,
        conversation_participants (
          user_id,
          profiles (
            id,
            full_name,
            username,
            avatar_url,
            status,
            role
          )
        )
      `)
      .eq('id', conversationId)
      .single();

    if (error || !data) return null;

    const otherParticipants = (data.conversation_participants || [])
      .filter((p: any) => p.user_id !== userId)
      .map((p: any) => ({
        id: p.profiles?.id,
        name: p.profiles?.full_name || 'Campus User',
        avatar: p.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.user_id}`,
        username: p.profiles?.username || 'user',
        status: p.profiles?.status || 'offline',
        role: p.profiles?.role || 'student'
      }));

    return {
      id: data.id,
      is_group: data.is_group,
      name: data.name,
      participants: otherParticipants,
      unreadCount: 0
    } as any;
  },

  async createDM(user1Id: string, user2Id: string): Promise<string> {
    // 1. Check existing
    const { data: shared } = await supabase.rpc('get_conversation_between_users', {
      user1: user1Id,
      user2: user2Id
    });

    if (shared && shared.length > 0) {
      return shared[0].id;
    }

    // 2. Create New
    const { data: newConv, error: createErr } = await supabase
      .from('conversations')
      .insert({ is_group: false })
      .select('id')
      .single();

    if (createErr) throw createErr;

    // 3. Add Participants
    const { error: partErr } = await supabase
      .from('conversation_participants')
      .insert([
        { conversation_id: newConv.id, user_id: user1Id },
        { conversation_id: newConv.id, user_id: user2Id }
      ]);

    if (partErr) throw partErr;

    return newConv.id;
  }
};
