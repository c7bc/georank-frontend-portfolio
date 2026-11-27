import { api } from './client';
import type {
  KeywordListResponse,
  KeywordResponse,
  CreateKeywordRequest,
  UpdateKeywordRequest,
  BulkCreateKeywordsRequest,
  PaginationParams,
} from '@/types';

/**
 * Keywords API - CRUD operations for keywords
 * GET operations work well in Server Components
 * POST/PUT/DELETE should be called from Server Actions or Client Components
 */
export const keywordsApi = {
  /**
   * List all keywords with pagination
   */
  async list(params?: PaginationParams & { status?: string; category?: string; search?: string; platform?: string; sort?: string; domain_id?: string }): Promise<KeywordListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.per_page) searchParams.set('per_page', String(params.per_page));
    if (params?.status) searchParams.set('status', params.status);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.platform) searchParams.set('platform', params.platform);
    if (params?.sort) searchParams.set('sort', params.sort);
    if (params?.domain_id) searchParams.set('domain_id', params.domain_id);

    const query = searchParams.toString();
    return api.get<KeywordListResponse>(`/keywords${query ? `?${query}` : ''}`, {
      next: { revalidate: 60, tags: ['keywords'] },
    });
  },

  /**
   * Get a single keyword by ID
   */
  async get(id: number): Promise<KeywordResponse> {
    return api.get<KeywordResponse>(`/keywords/${id}`, {
      next: { revalidate: 60, tags: ['keywords', `keyword-${id}`] },
    });
  },

  /**
   * Create a new keyword
   * Use in Server Action or Client Component
   */
  async create(data: CreateKeywordRequest): Promise<KeywordResponse> {
    return api.post<KeywordResponse>('/keywords', data);
  },

  /**
   * Bulk create keywords
   * Use in Server Action or Client Component
   */
  async bulkCreate(data: BulkCreateKeywordsRequest): Promise<{ created: number; keywords: KeywordResponse[] }> {
    return api.post('/keywords/bulk', data);
  },

  /**
   * Update a keyword
   * Use in Server Action or Client Component
   */
  async update(id: number, data: UpdateKeywordRequest): Promise<KeywordResponse> {
    return api.put<KeywordResponse>(`/keywords/${id}`, data);
  },

  /**
   * Delete a keyword
   * Use in Server Action or Client Component
   */
  async delete(id: number): Promise<void> {
    return api.delete(`/keywords/${id}`);
  },

  /**
   * Generate queries for selected keywords with per-keyword platform selection
   * Use in Server Action or Client Component
   */
  async refresh(params?: { selections: Array<{ keyword_id: number; platforms: string[] }> }): Promise<{ message: string; queries_enqueued?: number }> {
    return api.post('/keywords/refresh', params);
  },
};
