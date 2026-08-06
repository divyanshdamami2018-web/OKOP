import { create } from 'zustand';
import { Conversation, Message } from '@/types';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messageCache: Record<string, Message[]>;
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateLastMessage: (conversationId: string, message: Message) => void;
  clearCache: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversationId: null,
  messageCache: {},
  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (id) => set({ activeConversationId: id }),
  setMessages: (conversationId, messages) => set((state) => ({
    messageCache: { ...state.messageCache, [conversationId]: messages }
  })),
  addMessage: (conversationId, message) => set((state) => {
    const existing = state.messageCache[conversationId] || [];
    // Prevent duplicates
    if (existing.some(m => m.id === message.id)) return state;

    return {
      messageCache: {
        ...state.messageCache,
        [conversationId]: [...existing, message]
      }
    };
  }),
  updateLastMessage: (conversationId, message) => set((state) => ({
    conversations: state.conversations.map((c) =>
      c.id === conversationId ? { ...c, lastMessage: message } : c
    )
  })),
  clearCache: () => set({ messageCache: {}, activeConversationId: null }),
}));
