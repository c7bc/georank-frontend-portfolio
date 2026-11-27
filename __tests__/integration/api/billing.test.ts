import { describe, it, expect, beforeAll } from 'vitest';
import { apiFetch, createUserAndGetToken, isBackendAvailable } from '../setup';

describe('Billing API Integration', () => {
  let token: string;

  beforeAll(async () => {
    const available = await isBackendAvailable();
    if (!available) {
      throw new Error('Backend is not running.');
    }
    token = await createUserAndGetToken('billing');
  });

  it('should get current plan', async () => {
    const { data, status } = await apiFetch<{
      name: string;
      keyword_limit: number;
      price: number;
    }>('/billing/plan', { token });

    expect(status).toBe(200);
    expect(data.name).toBeTruthy();
    expect(data).toHaveProperty('keyword_limit');
    expect(data).toHaveProperty('price');
  });

  it('should get usage data', async () => {
    const { data, status } = await apiFetch<Record<string, unknown>>('/billing/usage', { token });

    expect(status).toBe(200);
    expect(data).toBeDefined();
  });

  it('should list invoices', async () => {
    const { data, status } = await apiFetch<{ invoices: unknown[]; total: number }>('/billing/invoices', { token });

    expect(status).toBe(200);
    expect(Array.isArray(data.invoices)).toBe(true);
    expect(data.total).toBeDefined();
  });

  it('should reject unauthenticated requests', async () => {
    const { status } = await apiFetch('/billing/plan');
    expect(status).toBe(401);
  });
});
