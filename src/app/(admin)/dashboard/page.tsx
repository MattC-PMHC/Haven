// Dashboard page — the main landing page after login.
//
// PRD-aligned widgets:
//   - Hero header
//   - 4 stat cards: Interments, Available Plots, Work Orders, Expiring Rights
//   - Inventory Overview (plot status breakdown) + Upcoming Bookings
//   - Work Orders Summary + Expiring Rights detail
//   - Capacity Forecast banner
//   - Recent Activity timeline
//
// All data is placeholder — will connect to Supabase in later milestones.

import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/dashboard/StatCard"
import { InventoryOverview } from "@/components/dashboard/InventoryOverview"
import { UpcomingBookings } from "@/components/dashboard/UpcomingBookings"
import { WorkOrdersSummary } from "@/components/dashboard/WorkOrdersSummary"
import { ExpiringRights } from "@/components/dashboard/ExpiringRights"
import { CapacityForecast } from "@/components/dashboard/CapacityForecast"
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline"

export default function DashboardPage() {
  return (
    <div className="p-10 max-w-[1600px] mx-auto w-full space-y-8">
      {/* ── Hero Header ── */}
      <div className="flex justify-between items-end mb-2 animate-fade-up">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-extrabold text-primary tracking-tight mb-2">
            Haven Overview
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Quietly managing the legacies of our community with precision and
            care. You have 2 upcoming bookings this week.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="rounded-xl">
            <Printer className="size-4" />
            Print Manifest
          </Button>
        </div>
      </div>

      {/* ── Row 1: Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Interments This Month"
          value="18"
          footnote="Avg. 15/month this year"
          badgeText="+3 vs last month"
          accent="primary"
          className="animate-fade-up stagger-1"
        />
        <StatCard
          label="Available Plots"
          value="1,245"
          footnote="14.8% of total inventory"
          badgeText="Stable"
          accent="success"
          className="animate-fade-up stagger-2"
        />
        <StatCard
          label="Active Work Orders"
          value="25"
          footnote="12 open, 8 assigned, 5 in progress"
          badgeText="3 Overdue"
          accent="tertiary"
          className="animate-fade-up stagger-3"
        />
        <StatCard
          label="Rights Expiring"
          value="47"
          footnote="Within next 12 months"
          badgeText="Action Needed"
          accent="secondary"
          className="animate-fade-up stagger-4"
        />
      </div>

      {/* ── Row 2: Inventory Overview + Upcoming Bookings ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-up stagger-5">
        <div className="lg:col-span-2">
          <InventoryOverview />
        </div>
        <UpcomingBookings />
      </div>

      {/* ── Row 3: Work Orders + Expiring Rights ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-up stagger-6">
        <WorkOrdersSummary />
        <ExpiringRights />
      </div>

      {/* ── Row 4: Capacity Forecast banner ── */}
      <div className="animate-fade-up">
        <CapacityForecast />
      </div>

      {/* ── Row 5: Recent Activity ── */}
      <div className="animate-fade-up">
        <ActivityTimeline />
      </div>
    </div>
  )
}
