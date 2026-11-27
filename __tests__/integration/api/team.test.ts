import { describe, it, expect, beforeAll } from 'vitest';
import { apiFetch, createUserAndGetToken, isBackendAvailable } from '../setup';

describe('Team API Integration', () => {
  let token: string;

  beforeAll(async () => {
    const available = await isBackendAvailable();
    if (!available) {
      throw new Error('Backend is not running.');
    }
    token = await createUserAndGetToken('team');
  });

  it('should list team members', async () => {
    const { data, status } = await apiFetch<unknown[]>('/team/members', { token });

    expect(status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('should invite a team member', async () => {
    const email = `invite-${Date.now()}@example.com`;
    const { data, status } = await apiFetch<{ id: number; invite_email: string }>(
      '/team/members/invite',
      {
        method: 'POST',
        token,
        body: { email, role: 'member' },
      }
    );

    expect(status).toBe(201);
    expect(data.id).toBeDefined();
  });

  it('should reject invite with invalid email', async () => {
    const { status } = await apiFetch('/team/members/invite', {
      method: 'POST',
      token,
      body: { email: 'not-an-email', role: 'member' },
    });

    expect(status).toBe(400);
  });

  it('should reject unauthenticated requests', async () => {
    const { status } = await apiFetch('/team/members');
    expect(status).toBe(401);
  });
});
