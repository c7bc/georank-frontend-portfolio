import { describe, it, expect, beforeAll } from 'vitest';
import { apiFetch, createUserAndGetToken, isBackendAvailable } from '../setup';

describe('Recommendations API Integration', () => {
  let token: string;

  beforeAll(async () => {
    const available = await isBackendAvailable();
    if (!available) {
      throw new Error('Backend is not running.');
    }
    token = await createUserAndGetToken('recommendations');
  });

  it('should list recommendations', async () => {
    const { data, status } = await apiFetch<{ recommendations: unknown[]; total: number }>('/recommendations', { token });

    expect(status).toBe(200);
    expect(Array.isArray(data.recommendations)).toBe(true);
    expect(data.total).toBeDefined();
  });

  it('should list recommendations with pagination', async () => {
    const { status } = await apiFetch('/recommendations?page=1&per_page=5', { token });
    expect(status).toBe(200);
  });

  it('should handle update status for non-existent recommendation', async () => {
    const { status } = await apiFetch('/recommendations/99999/status', {
      method: 'PATCH',
      token,
      body: { status: 'in_progress' },
    });

    // Non-existent recommendation - should return 400 or 404
    expect([400, 404]).toContain(status);
  });

  it('should reject unauthenticated requests', async () => {
    const { status } = await apiFetch('/recommendations');
    expect(status).toBe(401);
  });
});
