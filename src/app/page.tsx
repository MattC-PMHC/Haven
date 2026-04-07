// Root page — redirects to the appropriate home based on auth state and role.
//
// Authenticated users go to their role-specific home (dashboard or portal).
// Unauthenticated users go to /login.
// Middleware also handles this, but this covers the server-component path.

import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/get-session"
import { getHomeForRole } from "@/lib/auth/roles"

export default async function RootPage() {
  const session = await getSession().catch(() => null)

  if (!session) {
    redirect("/login")
  }

  redirect(getHomeForRole(session.role))
}
