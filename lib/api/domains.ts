import { api } from './client';
import type { PaginationParams } from '@/types';

export interface DomainResponse {
  id: number;
  workspace_id: number;
  url: string;
  name: string;
  geo_score: number;
  keywords_count: number;
  last_scanned?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDomainRequest {
  url: string;
  name?: string;
}

export interface DomainListResponse {
  items: DomainResponse[];
  total: number;
  page: number;
  per_page: number;
}

/**
 * Domains API - Manage domains
 */
export const domainsApi = {
  /**
   * List all domains
   */
  async list(params?: PaginationParams): Promise<DomainListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.per_page) searchParams.set('per_page', String(params.per_page));

    const query = searchParams.toString();
    return api.get<DomainListResponse>(`/domains${query ? `?${query}` : ''}`, {
      next: { revalidate: 60, tags: ['domains'] },
    });
  },

  /**
   * Get a single domain by ID
   */
  async get(id: number): Promise<DomainResponse> {
    return api.get<DomainResponse>(`/domains/${id}`, {
      next: { revalidate: 60, tags: ['domains', `domain-${id}`] },
    });
  },

  /**
   * Create a new domain
   */
  async create(data: CreateDomainRequest): Promise<DomainResponse> {
    return api.post<DomainResponse>('/domains', data);
  },

  /**
   * Update a domain
   */
  async update(id: number, data: Partial<CreateDomainRequest>): Promise<DomainResponse> {
    return api.put<DomainResponse>(`/domains/${id}`, data);
  },

  /**
   * Delete a domain
   */
  async delete(id: number): Promise<void> {
    return api.delete(`/domains/${id}`);
  },
};
