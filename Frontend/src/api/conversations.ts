import { apiClient } from './client';
import { Conversation, ChatMessage } from '../types/api';

export const conversationsApi = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await apiClient.get<Conversation[]>('/api/conversations');
    return response.data;
  },

  getMessages: async (conversationId: number): Promise<ChatMessage[]> => {
    const response = await apiClient.get<ChatMessage[]>(`/api/conversations/${conversationId}/messages`);
    return response.data;
  },
};
