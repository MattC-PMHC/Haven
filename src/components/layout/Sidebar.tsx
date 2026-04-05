"use client"

// Sidebar navigation for the admin shell.
//
// Navigation is grouped by PRD module categories:
//   - Cemetery Management, Records, Operations, Finance, Compliance, Reports
// Finance and some Compliance items are disabled (Phase 3+).
// Uses the dark navy sidebar tokens (--sidebar-*) from globals.css.

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  Building2,
  Grid3x3,
  Map,
  BookUser,
  ScrollText,
  CalendarCheck,
  ClipboardList,
  Landmark,
  FileText,
  Users,
  DollarSign,
  Receipt,
  CreditCard,
  History,
  ShieldCheck,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/lib/actions/auth"

// ── Types ──

interface NavItem {
  label: string
  icon: LucideIcon
  href: string
  disabled?: boolean // greyed out for future phases
}

interface NavGroup {
  label: string | null // null = no group header (used for Dashboard)
  items: NavItem[]
}

// ── Navigation structure (from PRD) ──

const navGroups: NavGroup[] = [
  {
    label: null,
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    ],
  },
  {
    label: "Cemetery Management",
    items: [
      { label: "Cemetery Setup", icon: Building2, href: "/settings/cemeteries" },
      { label: "Sections & Plots", icon: Grid3x3, href: "/plots" },
      { label: "Interactive Map", icon: Map, href: "/maps" },
    ],
  },
  {
    label: "Records",
    items: [
      { label: "Deceased Records", icon: BookUser, href: "/registry" },
      { label: "Rights of Interment", icon: ScrollText, href: "/rights" },
      { label: "Interment Bookings", icon: CalendarCheck, href: "/bookings" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Work Orders", icon: ClipboardList, href: "/work-orders" },
      { label: "Memorial Works", icon: Landmark, href: "/memorials" },
      { label: "Documents", icon: FileText, href: "/documents" },
      { label: "Contacts", icon: Users, href: "/contacts" },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Fees & Charges", icon: DollarSign, href: "/finance/fees", disabled: true },
      { label: "Invoicing", icon: Receipt, href: "/finance/invoices", disabled: true },
      { label: "Payments", icon: CreditCard, href: "/finance/payments", disabled: true },
    ],
  },
  {
    label: "Compliance",
    items: [
      { label: "Audit Trail", icon: History, href: "/audit" },
      { label: "Compliance Reports", icon: ShieldCheck, href: "/compliance/reports", disabled: true },
    ],
  },
  {
    label: "Reports",
    items: [
      { label: "Standard Reports", icon: BarChart3, href: "/reports" },
    ],
  },
]

// ── Component ──

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 z-50 flex flex-col bg-sidebar-bg">
      {/* ── Brand header (fixed at top) ── */}
      <div className="py-6 px-6 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 premium-gradient rounded-lg flex items-center justify-center">
          <span className="text-white text-xl font-extrabold">H</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-sidebar-text-active leading-tight">
          Haven
        </h1>
      </div>

      {/* ── Scrollable nav area ── */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 no-scrollbar">
        {navGroups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-5" : ""}>
            {/* Group label */}
            {group.label && (
              <p className="px-3 mb-1 text-[10px] uppercase tracking-widest text-sidebar-text font-bold">
                {group.label}
              </p>
            )}

            {/* Nav items */}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href)

                if (item.disabled) {
                  return (
                    <span
                      key={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-text opacity-40 cursor-not-allowed"
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span>{item.label}</span>
                      <span className="ml-auto text-[9px] bg-sidebar-accent-bg rounded-full px-1.5 py-0.5 font-bold">
                        Soon
                      </span>
                    </span>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all",
                      isActive
                        ? "text-sidebar-text-active bg-sidebar-accent-bg font-medium border-r-2 border-sidebar-accent-text"
                        : "text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-accent-bg/50"
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Bottom section (fixed) ── */}
      <div className="px-3 py-4 space-y-0.5 shrink-0 border-t border-sidebar-border">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all",
            pathname.startsWith("/settings")
              ? "text-sidebar-text-active bg-sidebar-accent-bg font-medium"
              : "text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-accent-bg/50"
          )}
        >
          <Settings className="size-4 shrink-0" />
          <span>Settings</span>
        </Link>

        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-accent-bg/50 transition-all"
          >
            <LogOut className="size-4 shrink-0" />
            <span>Log Out</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
