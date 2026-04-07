// Admin layout — server component that wraps all admin routes.
//
// Enforces that only admin-level roles can access these pages.
// Portal users are redirected by middleware before reaching here,
// but this is the server-side safety net.

import { requireRole } from "@/lib/auth/require-role"
import { HavenShell } from "@/components/layout/HavenShell"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireRole([
    "super_admin",
    "council_admin",
    "council_officer",
    "finance_officer",
  ])

  return (
    <HavenShell
      userName={session.profile.full_name || session.user.email}
      userRole={session.role}
      avatarUrl={session.profile.avatar_url}
    >
      {children}
    </HavenShell>
  )
}
