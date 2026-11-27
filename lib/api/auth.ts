import { api } from './client';

export interface MeResponse {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  language: string;
  role: string;
  workspace_id: number;
  workspace: string;
  plan: string;
}

/**
 * Auth API - Authentication and user info
 */
export const authApi = {
  /**
   * Get current authenticated user
   */
  async me(): Promise<MeResponse> {
    return api.get<MeResponse>('/auth/me', {
      next: { revalidate: 60, tags: ['user'] },
    });
  },
};
