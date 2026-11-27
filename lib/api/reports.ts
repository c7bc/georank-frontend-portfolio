import { api } from './client';
import type {
  ReportListResponse,
  ReportResponse,
  ReportSettingsResponse,
  GenerateReportRequest,
  ReportSettingsRequest,
  PaginationParams,
} from '@/types';

/**
 * Reports API - Generate and manage reports
 */
export const reportsApi = {
  /**
   * List all reports with pagination
   */
  async list(params?: PaginationParams): Promise<ReportListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.per_page) searchParams.set('per_page', String(params.per_page));

    const query = searchParams.toString();
    return api.get<ReportListResponse>(`/reports${query ? `?${query}` : ''}`, {
      next: { revalidate: 60, tags: ['reports'] },
    });
  },

  /**
   * Generate a new report
   * Use in Server Action or Client Component
   */
  async generate(data: GenerateReportRequest): Promise<ReportResponse> {
    return api.post<ReportResponse>('/reports/generate', data);
  },

  /**
   * Get report settings
   */
  async getSettings(): Promise<ReportSettingsResponse> {
    return api.get<ReportSettingsResponse>('/reports/settings', {
      next: { revalidate: 300, tags: ['report-settings'] },
    });
  },

  /**
   * Update report settings
   * Use in Server Action or Client Component
   */
  async updateSettings(data: ReportSettingsRequest): Promise<ReportSettingsResponse> {
    return api.put<ReportSettingsResponse>('/reports/settings', data);
  },
};
