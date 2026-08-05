import { create } from 'zustand';
import { Conversation, Message } from '@/types';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  updateLastMessage: (conversationId: string, message: Message) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversationId: null,
  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (id) => set({ activeConversationId: id }),
  updateLastMessage: (conversationId, message) => set((state) => ({
    conversations: state.conversations.map((c) =>
      c.id === conversationId ? { ...c, lastMessage: message } : c
    )
  })),
}));
