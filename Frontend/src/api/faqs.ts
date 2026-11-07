import { apiClient } from './client';
import { FAQDocument } from '../types/api';

export const faqsApi = {
  getFaqs: async (agentId: number): Promise<FAQDocument[]> => {
    const response = await apiClient.get<FAQDocument[]>(`/api/agents/${agentId}/faqs`);
    return response.data;
  },

  uploadFaq: async (
    agentId: number,
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<FAQDocument> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<FAQDocument>(
      `/api/agents/${agentId}/faqs`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      }
    );
    return response.data;
  },
};
