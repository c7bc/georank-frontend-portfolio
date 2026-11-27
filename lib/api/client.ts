import { cookies } from 'next/headers';
import type { APIError } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: RequestMethod;
  body?: unknown;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  skipAuth?: boolean;
}

interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}

class APIClientError extends Error {
  status: number;
  data: APIError;

  constructor(message: string, status: number, data: APIError) {
    super(message);
    this.name = 'APIClientError';
    this.status = status;
    this.data = data;
  }
}

/** Fetch a GeoRank API resource from a Next.js server boundary. */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    cache,
    next,
    skipAuth = false,
  } = options;

  const token = skipAuth ? null : (await cookies()).get('access_token')?.value;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) requestHeaders['Authorization'] = `Bearer ${token}`;

  const fetchOptions: RequestInit & { next?: NextFetchRequestConfig } = {
    method,
    headers: requestHeaders,
  };
  if (body !== undefined) fetchOptions.body = JSON.stringify(body);

  // Account responses include private data. Explicit public GETs can still revalidate.
  if (!skipAuth || method !== 'GET') {
    fetchOptions.cache = 'no-store';
  } else {
    if (cache) fetchOptions.cache = cache;
    if (next) fetchOptions.next = next;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

  if (!response.ok) {
    const errorData = await readApiError(response);
    throw new APIClientError(errorData.message, response.status, errorData);
  }

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  const json = await response.json();

  // Handle wrapped response format: { success: true, data: {...} }
  const data = (json && typeof json === 'object' && 'success' in json && 'data' in json)
    ? json.data as T
    : json as T;

  return data;
}

async function readApiError(response: Response): Promise<APIError> {
  const body: unknown = await response.json().catch(() => null);
  const record = body !== null && typeof body === 'object' ? body : {};
  const value = 'error' in record ? record.error : undefined;
  const error = value !== null && typeof value === 'object' ? value : record;
  const message = 'message' in error && typeof error.message === 'string'
    ? error.message
    : response.statusText || 'An error occurred';
  const code = 'code' in error && typeof error.code === 'string' ? error.code : value;
  return { error: typeof code === 'string' ? code : 'unknown_error', message, status: response.status };
}

/**
 * Convenience methods for common HTTP methods
 */
export const api = {
  get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return apiFetch<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return apiFetch<T>(endpoint, { ...options, method: 'POST', body });
  },

  put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return apiFetch<T>(endpoint, { ...options, method: 'PUT', body });
  },

  patch<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return apiFetch<T>(endpoint, { ...options, method: 'PATCH', body });
  },

  delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return apiFetch<T>(endpoint, { ...options, method: 'DELETE' });
  },
};

export { APIClientError };
