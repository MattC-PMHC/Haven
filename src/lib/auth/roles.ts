// Role classification and home-path mapping used by middleware,
// login redirects, and server components.

import type { UserRole } from "@/lib/types/database"

export const ADMIN_ROLES: UserRole[] = [
  "super_admin",
  "council_admin",
  "council_officer",
  "finance_officer",
]

export const PORTAL_HOMES: Partial<Record<UserRole, string>> = {
  funeral_director: "/funeral-director",
  mason: "/mason",
  grounds_crew: "/grounds",
}

/** Returns the home path for a given role. */
export function getHomeForRole(role: UserRole): string {
  return PORTAL_HOMES[role] ?? "/dashboard"
}
