import { describe, it, expect, beforeAll } from 'vitest';
import { apiFetch, createUserAndGetToken, isBackendAvailable } from '../setup';

describe('Dashboard API Integration', () => {
  let token: string;

  beforeAll(async () => {
    const available = await isBackendAvailable();
    if (!available) {
      throw new Error('Backend is not running.');
    }
    token = await createUserAndGetToken('dashboard');
  });

  it('should get metrics', async () => {
    const { data, status } = await apiFetch<{
      geo_score: number;
      keyword_count: number;
      total_mentions: number;
      average_position: number;
    }>('/dashboard/metrics', { token });

    expect(status).toBe(200);
    expect(data).toHaveProperty('geo_score');
    expect(data).toHaveProperty('keyword_count');
    expect(data).toHaveProperty('total_mentions');
    expect(data).toHaveProperty('average_position');
  });

  it('should get visibility data', async () => {
    const { data, status } = await apiFetch<unknown[]>('/dashboard/visibility', { token });

    expect(status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('should get visibility with period parameter', async () => {
    const { status } = await apiFetch('/dashboard/visibility?period=week', { token });
    expect(status).toBe(200);
  });

  it('should get recent mentions', async () => {
    const { data, status } = await apiFetch<unknown[]>('/dashboard/mentions/recent', { token });

    expect(status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('should get recent mentions with limit', async () => {
    const { status } = await apiFetch('/dashboard/mentions/recent?limit=5', { token });
    expect(status).toBe(200);
  });

  it('should get top keywords', async () => {
    const { data, status } = await apiFetch<unknown[]>('/dashboard/keywords/top', { token });

    expect(status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('should get competitor comparison', async () => {
    const { data, status } = await apiFetch<unknown[]>('/dashboard/competitors/comparison', { token });

    expect(status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('should reject unauthenticated requests', async () => {
    const { status } = await apiFetch('/dashboard/metrics');
    expect(status).toBe(401);
  });
});
