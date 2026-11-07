import { apiClient } from './client';
import { WhatsAppIntegrationStatus, AssignWhatsAppAgentRequest } from '../types/api';

export const integrationsApi = {
  getWhatsAppStatus: async (): Promise<WhatsAppIntegrationStatus> => {
    const response = await apiClient.get<WhatsAppIntegrationStatus>('/api/integrations/whatsapp/status');
    return response.data;
  },

  assignWhatsAppAgent: async (data: AssignWhatsAppAgentRequest): Promise<WhatsAppIntegrationStatus> => {
    const response = await apiClient.post<WhatsAppIntegrationStatus>('/api/integrations/whatsapp/assign', data);
    return response.data;
  },
};
