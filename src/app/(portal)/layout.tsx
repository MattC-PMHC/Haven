// Portal layout — simplified shell for external stakeholder portals.
//
// Enforces that only portal-level roles can access these pages.
// Middleware handles cross-portal redirection; this is the safety net.

import { getSession } from "@/lib/auth/get-session"
import { redirect } from "next/navigation"
import { PortalShell } from "@/components/layout/PortalShell"

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <PortalShell
      userName={session.profile.full_name || session.user.email}
      userRole={session.role}
    >
      {children}
    </PortalShell>
  )
}
