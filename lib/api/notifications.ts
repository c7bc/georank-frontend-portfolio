import type { NotificationListResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

async function clientFetch<T>(endpoint: string, options?: { method?: string }): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options?.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  // Handle empty responses (204 No Content)
  if (res.status === 204) {
    return {} as T;
  }

  const json = await res.json();
  if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
    return json.data as T;
  }
  return json as T;
}

/**
 * Notifications API - Real-time and persisted notifications
 * Client-side only (uses localStorage for auth token)
 */
export const notificationsApi = {
  /**
   * List notifications with pagination
   */
  list(params?: { page?: number; limit?: number }): Promise<NotificationListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const qs = searchParams.toString();
    return clientFetch<NotificationListResponse>(`/notifications${qs ? `?${qs}` : ''}`);
  },

  /**
   * Get unread notification count
   */
  getUnreadCount(): Promise<{ count: number }> {
    return clientFetch<{ count: number }>('/notifications/unread-count');
  },

  /**
   * Mark a single notification as read
   */
  markRead(id: number): Promise<void> {
    return clientFetch<void>(`/notifications/${id}/read`, { method: 'PATCH' });
  },

  /**
   * Mark all notifications as read
   */
  markAllRead(): Promise<void> {
    return clientFetch<void>('/notifications/read-all', { method: 'POST' });
  },
};
