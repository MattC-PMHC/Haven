"use client"

// PortalShell — lightweight layout wrapper for stakeholder portals.
//
// Structure:
//   ┌──────────────────────────────────────────┐
//   │  Top nav bar (Haven brand + portal nav)  │
//   ├──────────────────────────────────────────┤
//   │  Main content (children)                 │
//   └──────────────────────────────────────────┘

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  CalendarCheck,
  Search,
  FileText,
  LayoutDashboard,
  Landmark,
  ClipboardList,
  Camera,
  LogOut,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logoutAction } from "@/lib/actions/auth"

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

interface PortalShellProps {
  children: React.ReactNode
  userName?: string
  userRole?: string
}

// Each portal has its own navigation links
const portalNavs: Record<string, { title: string; role: string; items: NavItem[] }> = {
  "/funeral-director": {
    title: "Funeral Director Portal",
    role: "Funeral Director",
    items: [
      { label: "Dashboard", href: "/funeral-director", icon: LayoutDashboard },
      { label: "New Booking", href: "/funeral-director/book", icon: CalendarCheck },
      { label: "Plot Search", href: "/funeral-director/plots", icon: Search },
      { label: "Documents", href: "/funeral-director/documents", icon: FileText },
    ],
  },
  "/mason": {
    title: "Mason Portal",
    role: "Mason",
    items: [
      { label: "Dashboard", href: "/mason", icon: LayoutDashboard },
      { label: "New Application", href: "/mason/apply", icon: Landmark },
      { label: "My Permits", href: "/mason/permits", icon: FileText },
    ],
  },
  "/grounds": {
    title: "Grounds Crew Portal",
    role: "Grounds Crew",
    items: [
      { label: "Work Orders", href: "/grounds", icon: ClipboardList },
      { label: "Capture Photo", href: "/grounds/photo", icon: Camera },
    ],
  },
}

function getPortalConfig(pathname: string) {
  for (const [prefix, config] of Object.entries(portalNavs)) {
    if (pathname.startsWith(prefix)) return { prefix, ...config }
  }
  return null
}

export function PortalShell({ children, userName, userRole }: PortalShellProps) {
  const pathname = usePathname()
  const portal = getPortalConfig(pathname)

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand + portal name */}
          <div className="flex items-center gap-4">
            <Link href={portal?.items[0]?.href ?? "/"} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-extrabold">H</span>
              </div>
              <span className="font-bold text-white">Haven</span>
            </Link>
            {portal && (
              <>
                <span className="text-white/30">|</span>
                <span className="text-white/80 text-sm font-medium">{portal.title}</span>
              </>
            )}
          </div>

          {/* Nav items */}
          {portal && (
            <nav className="hidden md:flex items-center gap-1">
              {portal.items.map((item) => {
                const isActive =
                  item.href === portal.prefix
                    ? pathname === portal.prefix
                    : pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                      isActive
                        ? "bg-white/15 text-white font-medium"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <item.icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          )}

          {/* User area */}
          <div className="flex items-center gap-2">
            {userName && (
              <span className="text-white/80 text-sm hidden sm:inline font-medium">
                {userName}
              </span>
            )}
            <span className="text-white/60 text-sm hidden sm:inline">
              {portal?.role ?? userRole ?? "Portal"}
            </span>
            <form action={logoutAction}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10"
                aria-label="Log out"
              >
                <LogOut className="size-4" aria-hidden="true" />
              </Button>
            </form>
          </div>
        </div>

        {/* Mobile nav */}
        {portal && (
          <nav className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
            {portal.items.map((item) => {
              const isActive =
                item.href === portal.prefix
                  ? pathname === portal.prefix
                  : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                    isActive
                      ? "bg-white/15 text-white font-medium"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  )}
                >
                  <item.icon className="size-3.5" aria-hidden="true" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        )}
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-[1400px] mx-auto">{children}</main>
    </div>
  )
}
