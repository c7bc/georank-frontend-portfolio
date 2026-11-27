import { describe, it, expect, beforeAll } from 'vitest';
import { apiFetch, createUserAndGetToken, isBackendAvailable } from '../setup';

describe('Auth API Integration', () => {
  beforeAll(async () => {
    const available = await isBackendAvailable();
    if (!available) {
      throw new Error('Backend is not running. Start it with: cd backend && go run cmd/server/main.go');
    }
  });

  it('should signup a new user', async () => {
    const email = `auth-signup-${Date.now()}@example.com`;
    const { data, status } = await apiFetch<{ token: string; user: { id: number; email: string; name: string } }>(
      '/auth/signup',
      {
        method: 'POST',
        body: { name: 'Signup Test', email, password: 'password123' },
      }
    );

    expect(status).toBe(201);
    expect(data.token).toBeTruthy();
    expect(data.user).toBeDefined();
    expect(data.user.email).toBe(email);
  });

  it('should reject signup with invalid email', async () => {
    const { status } = await apiFetch('/auth/signup', {
      method: 'POST',
      body: { name: 'Test', email: 'invalid', password: 'password123' },
    });

    expect(status).toBe(400);
  });

  it('should reject signup with short password', async () => {
    const email = `auth-shortpw-${Date.now()}@example.com`;
    const { status } = await apiFetch('/auth/signup', {
      method: 'POST',
      body: { name: 'Test', email, password: 'short' },
    });

    expect(status).toBe(400);
  });

  it('should reject duplicate email signup', async () => {
    const email = `auth-dup-${Date.now()}@example.com`;
    await apiFetch('/auth/signup', {
      method: 'POST',
      body: { name: 'First', email, password: 'password123' },
    });

    const { status } = await apiFetch('/auth/signup', {
      method: 'POST',
      body: { name: 'Second', email, password: 'password123' },
    });

    expect(status).toBe(400);
  });

  it('should login with valid credentials', async () => {
    const email = `auth-login-${Date.now()}@example.com`;
    await apiFetch('/auth/signup', {
      method: 'POST',
      body: { name: 'Login Test', email, password: 'password123' },
    });

    const { data, status } = await apiFetch<{ token: string }>('/auth/login', {
      method: 'POST',
      body: { email, password: 'password123' },
    });

    expect(status).toBe(200);
    expect(data.token).toBeTruthy();
  });

  it('should reject login with wrong password', async () => {
    const email = `auth-wrongpw-${Date.now()}@example.com`;
    await apiFetch('/auth/signup', {
      method: 'POST',
      body: { name: 'Test', email, password: 'password123' },
    });

    const { status } = await apiFetch('/auth/login', {
      method: 'POST',
      body: { email, password: 'wrongpassword' },
    });

    expect(status).toBe(401);
  });

  it('should get current user with /auth/me', async () => {
    const token = await createUserAndGetToken('auth-me');

    const { data, status } = await apiFetch<{ id: number; email: string; name: string }>(
      '/auth/me',
      { token }
    );

    expect(status).toBe(200);
    expect(data.id).toBeDefined();
    expect(data.email).toBeTruthy();
    expect(data.name).toBeTruthy();
  });

  it('should reject /auth/me without token', async () => {
    const { status } = await apiFetch('/auth/me');
    expect(status).toBe(401);
  });

  it('should logout', async () => {
    const token = await createUserAndGetToken('auth-logout');

    const { status } = await apiFetch('/auth/logout', {
      method: 'POST',
      token,
    });

    expect(status).toBe(200);
  });

  it('should handle forgot password', async () => {
    const email = `auth-forgot-${Date.now()}@example.com`;
    await apiFetch('/auth/signup', {
      method: 'POST',
      body: { name: 'Forgot Test', email, password: 'password123' },
    });

    const { status } = await apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });

    expect(status).toBe(200);
  });
});
