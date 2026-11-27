'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import type { InviteMemberRequest, TeamRole, TeamMemberResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface ActionResult {
  success: boolean;
  error?: string;
}

interface TeamMemberActionResult extends ActionResult {
  member?: TeamMemberResponse;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Invite a new team member
 */
export async function inviteTeamMember(data: InviteMemberRequest): Promise<TeamMemberActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/team/members/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to invite member' };
    }

    const json = await response.json();
    const member: TeamMemberResponse = json.data ?? json;

    revalidateTag('team', 'max');

    return { success: true, member };
  } catch (error) {
    console.error('Invite team member error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Update team member role
 */
export async function updateMemberRole(memberId: number, role: TeamRole): Promise<TeamMemberActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/team/members/${memberId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to update role' };
    }

    const json = await response.json();
    const member: TeamMemberResponse = json.data ?? json;

    revalidateTag('team', 'max');

    return { success: true, member };
  } catch (error) {
    console.error('Update member role error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Remove team member
 */
export async function removeTeamMember(memberId: number): Promise<ActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/team/members/${memberId}`, {
      method: 'DELETE',
      headers: authHeader,
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to remove member' };
    }

    revalidateTag('team', 'max');

    return { success: true };
  } catch (error) {
    console.error('Remove team member error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
