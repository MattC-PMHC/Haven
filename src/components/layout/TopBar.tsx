"use client"

// Top bar for the admin shell.
//
// Glassmorphic (surface-glass) sticky header sitting above the main content.
// Contains:
//   - "Curator" search bar (placeholder — will become command palette in M5+)
//   - Help button
//   - Notification bell with unread dot
//   - User avatar + name

import { Search, HelpCircle, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationBell } from "@/components/layout/NotificationBell"

interface TopBarProps {
  userName: string
  userRole: string
  avatarUrl?: string | null
  onMobileMenuToggle?: () => void
}

export function TopBar({ userName, userRole, avatarUrl, onMobileMenuToggle }: TopBarProps) {
  // Build initials from the user's name for the avatar fallback
  // e.g. "Admin Steward" -> "AS"
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  // Format the role for display: "council_admin" -> "Council Admin"
  const displayRole = userRole
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

  return (
    <header className="w-full sticky top-0 z-30 surface-glass shadow-sm flex items-center justify-between px-4 md:px-8 h-16 gap-4">
      {/* ── Mobile menu toggle ── */}
      {onMobileMenuToggle && (
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 shrink-0"
          aria-label="Toggle navigation menu"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      )}

      {/* ── Search bar ── */}
      <div className="flex items-center bg-surface-container-low px-4 py-2 rounded-full w-full max-w-96 group focus-within:ring-2 ring-primary/20 transition-all hidden sm:flex">
        <Search className="size-4 text-muted-foreground mr-2 shrink-0" aria-hidden="true" />
        <label htmlFor="haven-search" className="sr-only">Search registry or plot number</label>
        <input
          id="haven-search"
          type="search"
          placeholder="Search registry or plot number..."
          className="bg-transparent border-none focus:outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* ── Right side: help, notifications, user ── */}
      <div className="flex items-center gap-3 md:gap-6 shrink-0">
        <div className="flex items-center gap-1">
          {/* Help button */}
          <button
            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            aria-label="Help"
          >
            <HelpCircle className="size-5" aria-hidden="true" />
          </button>

          {/* Notification bell with unread count + dropdown */}
          <NotificationBell />
        </div>

        {/* Vertical divider */}
        <div className="h-8 w-px bg-surface-container-high hidden sm:block" role="separator" aria-orientation="vertical" />

        {/* User info + avatar */}
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground">{userName}</p>
            <p className="text-[10px] text-muted-foreground font-medium">
              {displayRole}
            </p>
          </div>
          <Avatar size="lg">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={userName} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
