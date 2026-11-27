import { APIRequestContext } from '@playwright/test';

export const API_URL = 'http://localhost:8080/api';

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expires_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
}

/**
 * Creates a test user via POST /api/auth/signup
 * @param request - Playwright APIRequestContext
 * @param userData - Optional user data (name, email, password)
 * @returns Auth response with token and user data
 */
export async function createTestUser(
  request: APIRequestContext,
  userData?: Partial<SignupInput>
): Promise<AuthResponse> {
  const timestamp = Date.now();
  const defaultData: SignupInput = {
    name: userData?.name || `Test User ${timestamp}`,
    email: userData?.email || `test${timestamp}@example.com`,
    password: userData?.password || 'Test@123456',
  };

  const response = await request.post(`${API_URL}/auth/signup`, {
    data: defaultData,
  });

  if (!response.ok()) {
    const error = await response.text();
    throw new Error(`Failed to create test user: ${response.status()} - ${error}`);
  }

  const data = await response.json();
  return data.data; // Backend wraps response in { data: ... }
}

/**
 * Logs in a user via POST /api/auth/login
 * @param request - Playwright APIRequestContext
 * @param email - User email
 * @param password - User password
 * @returns Auth response with token and user data
 */
export async function loginUser(
  request: APIRequestContext,
  email: string,
  password: string
): Promise<AuthResponse> {
  const loginData: LoginInput = {
    email,
    password,
  };

  const response = await request.post(`${API_URL}/auth/login`, {
    data: loginData,
  });

  if (!response.ok()) {
    const error = await response.text();
    throw new Error(`Failed to login user: ${response.status()} - ${error}`);
  }

  const data = await response.json();
  return data.data; // Backend wraps response in { data: ... }
}

/**
 * Waits for the backend to be ready by polling the /health endpoint
 * @param maxAttempts - Maximum number of polling attempts (default: 30)
 * @param delayMs - Delay between attempts in milliseconds (default: 1000)
 * @throws Error if backend is not ready after maxAttempts
 */
export async function waitForBackend(
  maxAttempts: number = 30,
  delayMs: number = 1000
): Promise<void> {
  const healthUrl = 'http://localhost:8080/health';

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(healthUrl);
      if (response.ok) {
        console.log(`Backend is ready (attempt ${attempt}/${maxAttempts})`);
        return;
      }
    } catch (error) {
      // Backend not ready yet, continue polling
    }

    if (attempt < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  throw new Error(
    `Backend not ready after ${maxAttempts} attempts (${(maxAttempts * delayMs) / 1000}s)`
  );
}
