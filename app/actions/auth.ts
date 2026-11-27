'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  TokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface ActionResult {
  success: boolean;
  error?: string;
}

interface LoginResult extends ActionResult {
  user?: AuthResponse['user'];
  requiresVerification?: boolean;
  email?: string;
}

/**
 * Login action - authenticates user and sets HTTP-only cookies
 */
export async function login(data: LoginRequest): Promise<LoginResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error?.message || 'Invalid credentials' };
    }

    const rawResult = await response.json();

    // Handle wrapped response format: { success: true, data: { token, ... } }
    const result: AuthResponse = rawResult.data || rawResult;

    // Calculate maxAge from expires_at
    const expiresAt = new Date(result.expires_at);
    const maxAge = Math.floor((expiresAt.getTime() - Date.now()) / 1000);

    // Set HTTP-only cookie for security
    const cookieStore = await cookies();
    const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

    cookieStore.set('access_token', result.token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge > 0 ? maxAge : 60 * 60 * 24, // fallback 24h
      path: '/',
      domain: cookieDomain,
    });

    // Set locale cookie from user's language preference
    const userLanguage = result.user?.language || 'en';
    cookieStore.set('NEXT_LOCALE', userLanguage, {
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      domain: cookieDomain,
    });

    // Revalidate all cached data
    revalidatePath('/', 'layout');

    return { success: true, user: result.user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Signup action - registers new user and sets cookies
 */
export async function signup(data: SignupRequest): Promise<LoginResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error?.message || 'Registration failed' };
    }

    const rawResult = await response.json();
    const result = rawResult.data || rawResult;

    // Flow 1: Normal signup requires email verification
    if (result.message === 'verification_required') {
      return { success: true, requiresVerification: true, email: result.email };
    }

    // Flow 2: LP signup with skip_verify - signup complete with token
    if (result.message === 'signup_complete' && result.token) {
      const expiresAt = result.expires_at ? new Date(result.expires_at) : new Date(Date.now() + 24 * 60 * 60 * 1000);
      const maxAge = Math.floor((expiresAt.getTime() - Date.now()) / 1000);

      const cookieStore = await cookies();

      cookieStore.set('access_token', result.token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: maxAge > 0 ? maxAge : 60 * 60 * 24,
        path: '/',
        domain: process.env.COOKIE_DOMAIN || undefined,
      });

      cookieStore.set('NEXT_LOCALE', data.language || result.user?.language || 'en', {
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        domain: process.env.COOKIE_DOMAIN || undefined,
      });

      revalidatePath('/', 'layout');

      return { success: true, user: result.user };
    }

    // Fallback: legacy token response
    const authResult: AuthResponse = result;
    const expiresAt = new Date(authResult.expires_at);
    const maxAge = Math.floor((expiresAt.getTime() - Date.now()) / 1000);

    const cookieStore = await cookies();

    cookieStore.set('access_token', authResult.token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge > 0 ? maxAge : 60 * 60 * 24,
      path: '/',
      domain: process.env.COOKIE_DOMAIN || undefined,
    });

    cookieStore.set('NEXT_LOCALE', data.language || 'en', {
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      domain: process.env.COOKIE_DOMAIN || undefined,
    });

    revalidatePath('/', 'layout');

    return { success: true, user: authResult.user };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Signup verify action - verifies 6-digit code and completes registration
 */
export async function signupVerify(email: string, code: string, language: string, domain?: string): Promise<LoginResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, ...(domain && { domain }) }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error?.message || 'Verification failed' };
    }

    const rawResult = await response.json();
    const result: AuthResponse = rawResult.data || rawResult;

    const expiresAt = new Date(result.expires_at);
    const maxAge = Math.floor((expiresAt.getTime() - Date.now()) / 1000);

    const cookieStore = await cookies();

    cookieStore.set('access_token', result.token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge > 0 ? maxAge : 60 * 60 * 24,
      path: '/',
      domain: process.env.COOKIE_DOMAIN || undefined,
    });

    cookieStore.set('NEXT_LOCALE', language || 'en', {
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      domain: process.env.COOKIE_DOMAIN || undefined,
    });

    revalidatePath('/', 'layout');

    return { success: true, user: result.user };
  } catch (error) {
    console.error('Signup verify error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Logout action - clears cookies and redirects
 */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  // Call backend logout if we have a token
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Ignore errors, we're logging out anyway
    }
  }

  // Clear cookies
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');

  // Revalidate and redirect
  revalidatePath('/', 'layout');
  redirect("/login");
}

/**
 * Refresh token action - refreshes access token using refresh token
 */
export async function refreshToken(): Promise<ActionResult> {
  const cookieStore = await cookies();
  const refreshTokenValue = cookieStore.get('refresh_token')?.value;

  if (!refreshTokenValue) {
    return { success: false, error: 'No refresh token' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshTokenValue }),
    });

    if (!response.ok) {
      // Clear invalid tokens
      cookieStore.delete('access_token');
      cookieStore.delete('refresh_token');
      return { success: false, error: 'Session expired' };
    }

    const result: TokenResponse = await response.json();

    cookieStore.set('access_token', result.access_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: result.expires_in,
      path: '/',
      domain: process.env.COOKIE_DOMAIN || undefined,
    });

    cookieStore.set('refresh_token', result.refresh_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      domain: process.env.COOKIE_DOMAIN || undefined,
    });

    return { success: true };
  } catch (error) {
    console.error('Refresh token error:', error);
    return { success: false, error: 'Failed to refresh session' };
  }
}

/**
 * Forgot password action - sends password reset email
 */
export async function forgotPassword(data: ForgotPasswordRequest): Promise<ActionResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to send reset email' };
    }

    return { success: true };
  } catch (error) {
    console.error('Forgot password error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Reset password action - resets password with token
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<ActionResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to reset password' };
    }

    return { success: true };
  } catch (error) {
    console.error('Reset password error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Get current user from token - for server-side auth checks
 */
export async function getCurrentUser(): Promise<AuthResponse['user'] | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return null;
  }

  // Decode JWT to get user info (basic implementation)
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));

    // Check expiration
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      // Token expired, try to refresh
      const refreshResult = await refreshToken();
      if (!refreshResult.success) {
        return null;
      }
      // Get new token and decode again
      const newCookieStore = await cookies();
      const newToken = newCookieStore.get('access_token')?.value;
      if (!newToken) return null;

      const newPayload = newToken.split('.')[1];
      const newDecoded = JSON.parse(atob(newPayload));
      return newDecoded.user || null;
    }

    return decoded.user || null;
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Update user language preference
 */
export async function updateLanguage(language: string): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }

    const response = await fetch(`${API_BASE_URL}/auth/language`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ language }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error?.message || 'Failed to update language' };
    }

    // Set NEXT_LOCALE cookie for next-intl routing priority
    cookieStore.set('NEXT_LOCALE', language, {
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Update language error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
