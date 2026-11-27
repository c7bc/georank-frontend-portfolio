'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import type {
  CreateKeywordRequest,
  UpdateKeywordRequest,
  BulkCreateKeywordsRequest,
  KeywordResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface ActionResult {
  success: boolean;
  error?: string;
}

interface KeywordActionResult extends ActionResult {
  keyword?: KeywordResponse;
}

interface BulkKeywordActionResult extends ActionResult {
  created?: number;
  keywords?: KeywordResponse[];
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Create a new keyword
 */
export async function createKeyword(data: CreateKeywordRequest): Promise<KeywordActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/keywords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to create keyword' };
    }

    const json = await response.json();
    const keyword: KeywordResponse = json.data ?? json;

    // Revalidate keywords cache
    revalidateTag('keywords', 'max');
    revalidateTag('dashboard', 'max');

    return { success: true, keyword };
  } catch (error) {
    console.error('Create keyword error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Bulk create keywords
 */
export async function bulkCreateKeywords(data: BulkCreateKeywordsRequest): Promise<BulkKeywordActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/keywords/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to create keywords' };
    }

    const json = await response.json();
    const result = json.data ?? json;

    revalidateTag('keywords', 'max');
    revalidateTag('dashboard', 'max');

    return { success: true, created: result.created, keywords: result.keywords };
  } catch (error) {
    console.error('Bulk create keywords error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Update a keyword
 */
export async function updateKeyword(id: number, data: UpdateKeywordRequest): Promise<KeywordActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/keywords/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to update keyword' };
    }

    const json = await response.json();
    const keyword: KeywordResponse = json.data ?? json;

    revalidateTag('keywords', 'max');
    revalidateTag(`keyword-${id}`, 'max');
    revalidateTag('dashboard', 'max');
    revalidateTag('scheduling', 'max');

    return { success: true, keyword };
  } catch (error) {
    console.error('Update keyword error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Generate keyword queries (manual trigger, selective or all)
 */
export async function generateQueries(params?: {
  selections: Array<{ keyword_id: number; platforms: string[] }>;
}): Promise<ActionResult & { queries_enqueued?: number }> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/keywords/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      ...(params ? { body: JSON.stringify(params) } : {}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData?.error?.message || errorData?.message || 'Failed to generate queries' };
    }

    const data = await response.json().catch(() => ({}));

    revalidateTag('keywords', 'max');
    revalidateTag('dashboard', 'max');
    revalidateTag('billing', 'max');

    return { success: true, queries_enqueued: data?.data?.queries_enqueued };
  } catch (error) {
    console.error('Generate queries error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Delete a keyword
 */
export async function deleteKeyword(id: number): Promise<ActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/keywords/${id}`, {
      method: 'DELETE',
      headers: authHeader,
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to delete keyword' };
    }

    revalidateTag('keywords', 'max');
    revalidateTag('dashboard', 'max');

    return { success: true };
  } catch (error) {
    console.error('Delete keyword error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
