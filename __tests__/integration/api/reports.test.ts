import { describe, it, expect, beforeAll } from 'vitest';
import { apiFetch, createUserAndGetToken, isBackendAvailable } from '../setup';

describe('Reports API Integration', () => {
  let token: string;

  beforeAll(async () => {
    const available = await isBackendAvailable();
    if (!available) {
      throw new Error('Backend is not running.');
    }
    token = await createUserAndGetToken('reports');
  });

  it('should list reports', async () => {
    const { data, status } = await apiFetch<{ reports: unknown[]; total: number }>('/reports', { token });

    expect(status).toBe(200);
    expect(Array.isArray(data.reports)).toBe(true);
    expect(data.total).toBeDefined();
  });

  it('should generate a report', async () => {
    const { status } = await apiFetch('/reports/generate', {
      method: 'POST',
      token,
      body: { type: 'weekly', format: 'pdf' },
    });

    expect(status).toBe(201);
  });

  it('should reject generating report with invalid type', async () => {
    const { status } = await apiFetch('/reports/generate', {
      method: 'POST',
      token,
      body: { type: 'invalid', format: 'pdf' },
    });

    expect(status).toBe(400);
  });

  it('should get report settings', async () => {
    const { data, status } = await apiFetch<{ frequency: string }>('/reports/settings', { token });

    expect(status).toBe(200);
    expect(data).toHaveProperty('frequency');
  });

  it('should update report settings', async () => {
    const { status } = await apiFetch('/reports/settings', {
      method: 'PUT',
      token,
      body: { frequency: 'weekly', format: 'pdf', recipients: ['test@example.com'] },
    });

    expect(status).toBe(200);
  });

  it('should reject unauthenticated requests', async () => {
    const { status } = await apiFetch('/reports');
    expect(status).toBe(401);
  });
});
