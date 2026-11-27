import { describe, it, expect, beforeAll } from 'vitest';
import { apiFetch, createUserAndGetToken, isBackendAvailable } from '../setup';

describe('API Keys Integration', () => {
  let token: string;

  beforeAll(async () => {
    const available = await isBackendAvailable();
    if (!available) {
      throw new Error('Backend is not running.');
    }
    token = await createUserAndGetToken('apikeys');
  });

  it('should list API keys', async () => {
    const { data, status } = await apiFetch<unknown[]>('/api-keys', { token });

    expect(status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('should create an API key', async () => {
    const { data, status } = await apiFetch<{ key: string; api_key: { id: number; name: string } }>(
      '/api-keys',
      {
        method: 'POST',
        token,
        body: { name: 'Test Key', type: 'test' },
      }
    );

    expect(status).toBe(201);
    expect(data.key).toBeTruthy();
    expect(data.api_key.id).toBeDefined();
  });

  it('should create and delete an API key', async () => {
    const { data: created } = await apiFetch<{ key: string; api_key: { id: number } }>(
      '/api-keys',
      {
        method: 'POST',
        token,
        body: { name: 'Delete Me', type: 'test' },
      }
    );

    const { status } = await apiFetch(`/api-keys/${created.api_key.id}`, {
      method: 'DELETE',
      token,
    });

    expect(status).toBe(204);
  });

  it('should reject creating API key with invalid type', async () => {
    const { status } = await apiFetch('/api-keys', {
      method: 'POST',
      token,
      body: { name: 'Bad Key', type: 'invalid' },
    });

    expect(status).toBe(400);
  });

  it('should reject unauthenticated requests', async () => {
    const { status } = await apiFetch('/api-keys');
    expect(status).toBe(401);
  });
});
