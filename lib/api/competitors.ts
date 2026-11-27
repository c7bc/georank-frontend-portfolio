import { api } from './client';
import type {
  CompetitorListResponse,
  CompetitorResponse,
  CompetitorAnalysisResponse,
  CreateCompetitorRequest,
} from '@/types';

/**
 * Competitors API - Manage and analyze competitors
 */
export const competitorsApi = {
  /**
   * List all competitors
   */
  async list(): Promise<CompetitorListResponse> {
    return api.get<CompetitorListResponse>('/competitors', {
      next: { revalidate: 300, tags: ['competitors'] },
    });
  },

  /**
   * Create a new competitor
   * Use in Server Action or Client Component
   */
  async create(data: CreateCompetitorRequest): Promise<CompetitorResponse> {
    return api.post<CompetitorResponse>('/competitors', data);
  },

  /**
   * Delete a competitor
   * Use in Server Action or Client Component
   */
  async delete(id: number): Promise<void> {
    return api.delete(`/competitors/${id}`);
  },

  /**
   * Get detailed analysis for a competitor
   */
  async getAnalysis(id: number): Promise<CompetitorAnalysisResponse> {
    return api.get<CompetitorAnalysisResponse>(`/competitors/${id}/analysis`, {
      next: { revalidate: 300, tags: ['competitors', `competitor-${id}`] },
    });
  },
};
