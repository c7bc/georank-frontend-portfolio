import { api } from './client';
import type {
  TeamMemberListResponse,
  TeamMemberResponse,
  InviteMemberRequest,
  TeamRole,
} from '@/types';

/**
 * Team API - Manage team members
 */
export const teamApi = {
  /**
   * List all team members
   */
  async listMembers(): Promise<TeamMemberListResponse> {
    return api.get<TeamMemberListResponse>('/team/members', {
      next: { revalidate: 60, tags: ['team'] },
    });
  },

  /**
   * Invite a new team member
   * Use in Server Action or Client Component
   */
  async inviteMember(data: InviteMemberRequest): Promise<TeamMemberResponse> {
    return api.post<TeamMemberResponse>('/team/members/invite', data);
  },

  /**
   * Update member role
   * Use in Server Action or Client Component
   */
  async updateRole(memberId: number, role: TeamRole): Promise<TeamMemberResponse> {
    return api.patch<TeamMemberResponse>(`/team/members/${memberId}/role`, { role });
  },

  /**
   * Remove a team member
   * Use in Server Action or Client Component
   */
  async removeMember(memberId: number): Promise<void> {
    return api.delete(`/team/members/${memberId}`);
  },
};
