import { apiClient } from './client';
import { Agent, CreateAgentRequest } from '../types/api';

export const agentsApi = {
  getAgents: async (): Promise<Agent[]> => {
    const response = await apiClient.get<Agent[]>('/api/agents');
    return response.data;
  },

  createAgent: async (data: CreateAgentRequest): Promise<Agent> => {
    const response = await apiClient.post<Agent>('/api/agents', data);
    return response.data;
  },
};
