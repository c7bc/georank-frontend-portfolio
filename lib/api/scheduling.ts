import { api } from './client';
import type { SchedulingResponse } from '@/types';

/**
 * Scheduling API - Manage automatic query and report scheduling
 */
export const schedulingApi = {
  /**
   * Get scheduling overview (reports, recommendations, keywords)
   */
  async get(): Promise<SchedulingResponse> {
    return api.get<SchedulingResponse>('/scheduling', {
      next: { revalidate: 60, tags: ['scheduling'] },
    });
  },
};
