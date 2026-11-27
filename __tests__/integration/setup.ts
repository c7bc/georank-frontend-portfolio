/**
 * Integration test setup - provides helpers for testing against the real backend API.
 *
 * The backend Go server must be running on API_URL (default: http://localhost:8080/api).
 * Start it with: cd backend && go run cmd/server/main.go
 */

const API_URL = process.env.API_URL || 'http://localhost:8080/api';

interface APIResponse<T = unknown> {
  success: boolean;
  data: T;
}

/**
 * Make an authenticated API request, unwrapping the {success, data} envelope.
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: {
    method?: string;
    body?: unknown;
    token?: string;
  } = {}
): Promise<{ data: T; status: number }> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = { method, headers };
  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);

  if (response.status === 204) {
    return { data: {} as T, status: 204 };
  }

  const json = await response.json();

  if (json && typeof json === 'object' && 'data' in json) {
    return { data: json.data as T, status: response.status };
  }

  return { data: json as T, status: response.status };
}

/**
 * Create a new user and return the auth token.
 */
export async function createUserAndGetToken(
  prefix = 'vitest'
): Promise<string> {
  const email = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
  const { data } = await apiFetch<{ token: string; user: unknown }>(
    '/auth/signup',
    {
      method: 'POST',
      body: {
        name: `${prefix} Test User`,
        email,
        password: 'password123',
      },
    }
  );
  return data.token;
}

/**
 * Check if the backend is reachable.
 */
export async function isBackendAvailable(): Promise<boolean> {
  try {
    const response = await fetch(API_URL.replace('/api', '/health'));
    return response.ok;
  } catch {
    return false;
  }
}

export { API_URL };
