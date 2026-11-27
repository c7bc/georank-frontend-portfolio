import { describe, it, expect, beforeAll } from 'vitest';
import { apiFetch, createUserAndGetToken, isBackendAvailable } from '../setup';

describe('Integrations API Integration', () => {
  let token: string;

  beforeAll(async () => {
    const available = await isBackendAvailable();
    if (!available) {
      throw new Error('Backend is not running.');
    }
    token = await createUserAndGetToken('integrations');
  });

  it('should list integrations', async () => {
    const { data, status } = await apiFetch<unknown[]>('/integrations', { token });

    expect(status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('should toggle an integration', async () => {
    const { status } = await apiFetch('/integrations/slack/toggle', {
      method: 'PATCH',
      token,
      body: { enabled: true },
    });

    expect(status).toBe(200);
  });

  it('should reject unauthenticated requests', async () => {
    const { status } = await apiFetch('/integrations');
    expect(status).toBe(401);
  });
});
