import { api } from './client';
import type {
  RecommendationListResponse,
  RecommendationResponse,
  RecommendationStatus,
  PaginationParams,
} from '@/types';

/**
 * Recommendations API - AI-powered recommendations
 */
export const recommendationsApi = {
  /**
   * List all recommendations with pagination
   */
  async list(params?: PaginationParams & { status?: RecommendationStatus; priority?: string }): Promise<RecommendationListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.per_page) searchParams.set('per_page', String(params.per_page));
    if (params?.status) searchParams.set('status', params.status);
    if (params?.priority) searchParams.set('priority', params.priority);

    const query = searchParams.toString();
    return api.get<RecommendationListResponse>(`/recommendations${query ? `?${query}` : ''}`, {
      next: { revalidate: 300, tags: ['recommendations'] },
    });
  },

  /**
   * Update recommendation status
   * Use in Server Action or Client Component
   */
  async updateStatus(id: number, status: RecommendationStatus): Promise<RecommendationResponse> {
    return api.patch<RecommendationResponse>(`/recommendations/${id}/status`, { status });
  },
};
