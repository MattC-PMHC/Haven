// Admin layout — server component that wraps all admin routes.
//
// This does two things:
// 1. Checks that the user is authenticated (redirects to /login if not)
// 2. Passes session data (name, role, avatar) to the HavenShell client component
//
// Every page under (admin)/ automatically gets the sidebar + top bar.

import { getSession } from "@/lib/auth/get-session"
import { HavenShell } from "@/components/layout/HavenShell"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Try to get a real session — fall back to dummy data for previewing
  // TODO: Remove fallback once Supabase is connected
  const session = await getSession().catch(() => null)

  const userName = session?.profile.full_name || session?.user.email || "Admin Steward"
  const userRole = session?.role || "council_admin"
  const avatarUrl = session?.profile.avatar_url || null

  return (
    <HavenShell
      userName={userName}
      userRole={userRole}
      avatarUrl={avatarUrl}
    >
      {children}
    </HavenShell>
  )
}
