"use client";

import { useUser } from "@/contexts/user-context";

const ROLE_PERMISSIONS: Record<string, string[]> = {
  owner: [
    "view_dashboard", "manage_keywords", "manage_competitors", "manage_domains",
    "generate_queries", "generate_reports", "generate_recommendations",
    "manage_schedule", "view_reports", "view_recommendations",
    "manage_team", "manage_billing", "manage_integrations", "manage_api_keys", "manage_settings",
  ],
  admin: [
    "view_dashboard", "manage_keywords", "manage_competitors", "manage_domains",
    "generate_queries", "generate_reports", "generate_recommendations",
    "manage_schedule", "view_reports", "view_recommendations",
    "manage_team", "manage_integrations", "manage_api_keys", "manage_settings",
  ],
  editor: [
    "view_dashboard", "manage_keywords", "manage_competitors", "manage_domains",
    "generate_queries", "generate_reports", "generate_recommendations",
    "view_reports", "view_recommendations",
  ],
  viewer: [
    "view_dashboard", "view_reports", "view_recommendations",
  ],
};

export function usePermissions() {
  const user = useUser();
  const role = user.role || "viewer";
  const perms = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.viewer;

  return {
    can: (perm: string) => perms.includes(perm),
    role,
    isOwner: role === "owner",
    isAdmin: role === "admin" || role === "owner",
  };
}
