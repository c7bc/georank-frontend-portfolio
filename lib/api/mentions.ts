import type { AIRecommendation, QueryInsight } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

async function clientFetch<T>(endpoint: string): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const json = await res.json();
  if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
    return json.data as T;
  }
  return json as T;
}

export const mentionsApi = {
  getRecommendations(mentionId: number): Promise<AIRecommendation[]> {
    return clientFetch<AIRecommendation[]>(`/mentions/${mentionId}/recommendations`);
  },

  getInsights(mentionId: number): Promise<QueryInsight> {
    return clientFetch<QueryInsight>(`/mentions/${mentionId}/insights`);
  },
};
