import { describe, it, expect, beforeAll } from 'vitest';
import { apiFetch, createUserAndGetToken, isBackendAvailable } from '../setup';

describe('Keywords API Integration', () => {
  let token: string;

  beforeAll(async () => {
    const available = await isBackendAvailable();
    if (!available) {
      throw new Error('Backend is not running.');
    }
    token = await createUserAndGetToken('keywords');
  });

  it('should list keywords (empty initially)', async () => {
    const { data, status } = await apiFetch<{ keywords: unknown[]; total: number }>('/keywords', { token });

    expect(status).toBe(200);
    expect(Array.isArray(data.keywords)).toBe(true);
    expect(data.total).toBeDefined();
  });

  it('should list keywords with pagination', async () => {
    const { status } = await apiFetch('/keywords?page=1&per_page=5', { token });
    expect(status).toBe(200);
  });

  it('should create a keyword', async () => {
    const { data, status } = await apiFetch<{ id: number; keyword: string }>(
      '/keywords',
      {
        method: 'POST',
        token,
        body: { keyword: 'test keyword', category: 'brand' },
      }
    );

    expect(status).toBe(201);
    expect(data.id).toBeDefined();
    expect(data.keyword).toBe('test keyword');
  });

  it('should get a keyword by id', async () => {
    // Create first
    const { data: created } = await apiFetch<{ id: number }>('/keywords', {
      method: 'POST',
      token,
      body: { keyword: 'get-me keyword', category: 'product' },
    });

    const { data, status } = await apiFetch<{ id: number; keyword: string }>(
      `/keywords/${created.id}`,
      { token }
    );

    expect(status).toBe(200);
    expect(data.id).toBe(created.id);
  });

  it('should update a keyword', async () => {
    const { data: created } = await apiFetch<{ id: number }>('/keywords', {
      method: 'POST',
      token,
      body: { keyword: 'update-me', category: 'brand' },
    });

    const { data, status } = await apiFetch<{ id: number; category: string }>(
      `/keywords/${created.id}`,
      {
        method: 'PUT',
        token,
        body: { keyword: 'update-me', category: 'product' },
      }
    );

    expect(status).toBe(200);
    expect(data.category).toBe('product');
  });

  it('should delete a keyword', async () => {
    const { data: created } = await apiFetch<{ id: number }>('/keywords', {
      method: 'POST',
      token,
      body: { keyword: 'delete-me', category: 'brand' },
    });

    const { status } = await apiFetch(`/keywords/${created.id}`, {
      method: 'DELETE',
      token,
    });

    expect(status).toBe(204);
  });

  it('should bulk create keywords', async () => {
    const { data, status } = await apiFetch<unknown[]>('/keywords/bulk', {
      method: 'POST',
      token,
      body: {
        keywords: [
          { keyword: 'bulk-1', category: 'brand' },
          { keyword: 'bulk-2', category: 'product' },
        ],
      },
    });

    expect(status).toBe(201);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);
  });

  it('should reject unauthenticated requests', async () => {
    const { status } = await apiFetch('/keywords');
    expect(status).toBe(401);
  });
});
