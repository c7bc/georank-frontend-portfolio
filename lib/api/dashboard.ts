import { api } from './client';
import type {
  DashboardMetricsResponse,
  VisibilityResponse,
  RecentMentionsResponse,
  TopKeywordsResponse,
  CompetitorComparisonResponse,
} from '@/types';

/**
 * Dashboard API - These endpoints return data for the main dashboard
 * Best used in Server Components for initial data load
 */
export const dashboardApi = {
  /**
   * Get dashboard metrics (GEO Score, mentions, keywords, position)
   * @cache Revalidate every 5 minutes
   */
  async getMetrics(): Promise<DashboardMetricsResponse> {
    return api.get<DashboardMetricsResponse>('/dashboard/metrics', {
      next: { revalidate: 300, tags: ['dashboard', 'metrics'] },
    });
  },

  /**
   * Get visibility data over time
   * @param period - 'week' | 'month' | 'quarter'
   */
  async getVisibility(period: string = 'month'): Promise<VisibilityResponse> {
    return api.get<VisibilityResponse>(`/dashboard/visibility?period=${period}`, {
      next: { revalidate: 300, tags: ['dashboard', 'visibility'] },
    });
  },

  /**
   * Get recent AI mentions
   * @param limit - Number of mentions to return
   */
  async getRecentMentions(limit: number = 10): Promise<RecentMentionsResponse> {
    return api.get<RecentMentionsResponse>(`/dashboard/mentions/recent?limit=${limit}`, {
      next: { revalidate: 60, tags: ['dashboard', 'mentions'] },
    });
  },

  /**
   * Get top performing keywords
   * @param limit - Number of keywords to return
   */
  async getTopKeywords(limit: number = 5): Promise<TopKeywordsResponse> {
    return api.get<TopKeywordsResponse>(`/dashboard/keywords/top?limit=${limit}`, {
      next: { revalidate: 300, tags: ['dashboard', 'keywords'] },
    });
  },

  /**
   * Get competitor comparison data
   */
  async getCompetitorComparison(): Promise<CompetitorComparisonResponse> {
    return api.get<CompetitorComparisonResponse>('/dashboard/competitors/comparison', {
      next: { revalidate: 300, tags: ['dashboard', 'competitors'] },
    });
  },
};
