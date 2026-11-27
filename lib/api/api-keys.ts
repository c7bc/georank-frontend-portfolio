import { api } from './client';
import type {
  APIKeyListResponse,
  APIKeyResponse,
  APIKeyCreatedResponse,
  CreateAPIKeyRequest,
} from '@/types';

/**
 * API Keys API - Manage API keys
 */
export const apiKeysApi = {
  /**
   * List all API keys
   */
  async list(): Promise<APIKeyListResponse> {
    return api.get<APIKeyListResponse>('/api-keys', {
      next: { revalidate: 60, tags: ['api-keys'] },
    });
  },

  /**
   * Create a new API key
   * Use in Server Action or Client Component
   * @returns The full key is only returned on creation
   */
  async create(data: CreateAPIKeyRequest): Promise<APIKeyCreatedResponse> {
    return api.post<APIKeyCreatedResponse>('/api-keys', data);
  },

  /**
   * Delete an API key
   * Use in Server Action or Client Component
   */
  async delete(id: number): Promise<void> {
    return api.delete(`/api-keys/${id}`);
  },
};
