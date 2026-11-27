import { describe, it, expect, beforeAll } from 'vitest';
import { apiFetch, createUserAndGetToken, isBackendAvailable } from '../setup';

describe('Competitors API Integration', () => {
  let token: string;

  beforeAll(async () => {
    const available = await isBackendAvailable();
    if (!available) {
      throw new Error('Backend is not running.');
    }
    // Note: competitor creation requires pro plan.
    // With a fresh user (starter plan, 0 competitor limit), create/delete will be rejected.
    // These tests verify the API contract, not business logic bypasses.
    token = await createUserAndGetToken('competitors');
  });

  it('should list competitors', async () => {
    const { data, status } = await apiFetch<unknown[]>('/competitors', { token });

    expect(status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('should reject creating competitor on starter plan', async () => {
    const { status } = await apiFetch('/competitors', {
      method: 'POST',
      token,
      body: { domain: 'example.com', name: 'Example' },
    });

    // Starter plan has 0 competitor limit
    expect(status).toBe(400);
  });

  it('should reject creating competitor without domain', async () => {
    const { status } = await apiFetch('/competitors', {
      method: 'POST',
      token,
      body: { name: 'No Domain' },
    });

    expect(status).toBe(400);
  });

  it('should reject unauthenticated requests', async () => {
    const { status } = await apiFetch('/competitors');
    expect(status).toBe(401);
  });
});
