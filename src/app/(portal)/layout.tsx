// Portal layout — simplified shell for external stakeholder portals.
//
// Instead of the full admin sidebar, portals get a compact top navigation
// bar with Haven branding and role-specific nav links. Each portal sub-route
// (funeral-director, mason, grounds) adds its own nav items.
//
// In production, this would check the user's role and redirect if they
// don't belong to the portal they're trying to access.

import { PortalShell } from "@/components/layout/PortalShell"

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PortalShell>{children}</PortalShell>
}
