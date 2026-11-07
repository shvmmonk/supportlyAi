import { apiClient } from './client';
import { DashboardSummary } from '../types/api';

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await apiClient.get<DashboardSummary>('/api/dashboard/summary');
    return response.data;
  },
};
