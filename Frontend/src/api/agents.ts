import { apiClient } from './client';
import { Agent, CreateAgentRequest, UpdateAgentRequest } from '../types/api';

export const agentsApi = {
  getAgents: async (): Promise<Agent[]> => {
    const response = await apiClient.get<Agent[]>('/api/agents');
    return response.data;
  },

  createAgent: async (data: CreateAgentRequest): Promise<Agent> => {
    const response = await apiClient.post<Agent>('/api/agents', data);
    return response.data;
  },

  updateAgent: async (agentId: number, data: UpdateAgentRequest): Promise<Agent> => {
    const response = await apiClient.patch<Agent>(`/api/agents/${agentId}`, data);
    return response.data;
  },

  updateAgentStatus: async (agentId: number, status: 'ACTIVE' | 'INACTIVE'): Promise<Agent> => {
    const response = await apiClient.patch<Agent>(`/api/agents/${agentId}/status`, { status });
    return response.data;
  },

  testRagAnswer: async (agentId: number, question: string): Promise<string> => {
    const response = await apiClient.get<string>(`/api/agents/${agentId}/rag/answer`, {
      params: { question },
    });
    return response.data;
  },
};
