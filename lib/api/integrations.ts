import { api } from './client';
import type {
  IntegrationListResponse,
  IntegrationResponse,
  IntegrationType,
} from '@/types';

/**
 * Integrations API - Manage third-party integrations
 */
export const integrationsApi = {
  /**
   * List all integrations
   */
  async list(): Promise<IntegrationListResponse> {
    return api.get<IntegrationListResponse>('/integrations', {
      next: { revalidate: 300, tags: ['integrations'] },
    });
  },

  /**
   * Toggle integration on/off
   * Use in Server Action or Client Component
   */
  async toggle(type: IntegrationType, enabled: boolean): Promise<IntegrationResponse> {
    return api.patch<IntegrationResponse>(`/integrations/${type}/toggle`, { enabled });
  },

  async saveConfig(type: IntegrationType, config: { webhook_url: string; secret?: string }): Promise<void> {
    return api.put(`/integrations/${type}/config`, config);
  },

  async testConnection(type: IntegrationType): Promise<void> {
    return api.post(`/integrations/${type}/test`);
  },
};
