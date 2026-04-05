import { redirect } from "next/navigation"
import { getSession, type HavenSession } from "./get-session"
import type { UserRole } from "@/lib/types/database"

/**
 * Ensures the current user has one of the allowed roles.
 * If not logged in -> redirects to /login.
 * If logged in but wrong role -> redirects to /unauthorized.
 *
 * Use this at the top of server components or server actions
 * that should only be accessible to certain roles:
 *
 *   const session = await requireRole(["council_admin", "super_admin"])
 *   // If we get here, session is guaranteed to exist with the right role
 */
export async function requireRole(
  allowedRoles: UserRole[]
): Promise<HavenSession> {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (!allowedRoles.includes(session.role)) {
    redirect("/unauthorized")
  }

  return session
}

/**
 * Shortcut: requires any authenticated user (any role).
 * Redirects to /login if not authenticated.
 */
export async function requireAuth(): Promise<HavenSession> {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return session
}
