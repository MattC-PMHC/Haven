"use client"

// HavenShell — the outer layout wrapper for admin pages.
//
// This is a client component because the Sidebar and TopBar need
// client-side hooks (usePathname, event handlers). The actual session
// check happens in the server-side (admin)/layout.tsx before this
// component ever renders.
//
// Structure:
//   ┌──────────┬──────────────────────────────┐
//   │          │  TopBar (sticky)              │
//   │ Sidebar  ├──────────────────────────────┤
//   │ (fixed)  │  Main content (children)     │
//   │          │                              │
//   └──────────┴──────────────────────────────┘

import { Sidebar } from "./Sidebar"
import { TopBar } from "./TopBar"

interface HavenShellProps {
  children: React.ReactNode
  userName: string
  userRole: string
  avatarUrl?: string | null
}

export function HavenShell({
  children,
  userName,
  userRole,
  avatarUrl,
}: HavenShellProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar is fixed-position, so it doesn't scroll with the page */}
      <Sidebar />

      {/* Main area starts after the sidebar's 256px (w-64) width */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <TopBar
          userName={userName}
          userRole={userRole}
          avatarUrl={avatarUrl}
        />

        {/* Page content — each admin page renders here */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
