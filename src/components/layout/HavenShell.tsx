"use client"

// HavenShell — the outer layout wrapper for admin pages.
//
// This is a client component because the Sidebar and TopBar need
// client-side hooks (usePathname, event handlers). The actual session
// check happens in the server-side (admin)/layout.tsx before this
// component ever renders.
//
// On mobile (<768px) the sidebar is hidden behind a hamburger toggle
// with an overlay backdrop. On desktop the sidebar is always visible.

import { useState, useCallback, useEffect } from "react"
import { usePathname } from "next/navigation"
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev)
  }, [])

  return (
    <div className="flex min-h-screen">
      {/* Skip to content link — visible only when focused via keyboard */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:text-sm focus:font-medium focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — hidden on mobile by default, shown via mobileOpen state */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-out md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main area — full width on mobile, offset on desktop */}
      <div className="md:ml-64 flex-1 flex flex-col min-h-screen w-full">
        <TopBar
          userName={userName}
          userRole={userRole}
          avatarUrl={avatarUrl}
          onMobileMenuToggle={toggleMobile}
        />

        {/* Page content */}
        <main id="main-content" className="flex-1">{children}</main>
      </div>
    </div>
  )
}
