// Dashboard page — the main landing page after login.
//
// Focused on current work: today's services, active work orders,
// items needing attention, and recent activity.
// All data is placeholder — will connect to Supabase in later milestones.

import { requireRole } from "@/lib/auth/require-role"
import { StatCard } from "@/components/dashboard/StatCard"
import { TodaysSchedule } from "@/components/dashboard/TodaysSchedule"
import { NeedsAttention } from "@/components/dashboard/NeedsAttention"
import { ActiveWorkOrders } from "@/components/dashboard/ActiveWorkOrders"
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function DashboardPage() {
  const session = await requireRole([
    "super_admin",
    "council_admin",
    "council_officer",
    "finance_officer",
  ])

  const firstName =
    session.profile.full_name?.split(" ")[0] ?? session.user.email

  return (
    <div className="p-4 md:p-10 max-w-[1600px] mx-auto w-full space-y-8">
      {/* ── Hero Greeting ── */}
      <div className="animate-fade-up">
        <p className="text-sm font-medium text-muted-foreground mb-1">
          {getFormattedDate()}
        </p>
        <h2 className="text-4xl font-extrabold text-primary tracking-tight mb-2">
          {getGreeting()}, {firstName}
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          You have 2 services today and 3 items that need attention.
        </p>
      </div>

      {/* ── Row 1: Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Today's Services"
          value="2"
          footnote="1 Burial, 1 Ashes"
          badgeText="On Schedule"
          accent="primary"
          className="animate-fade-up stagger-1"
        />
        <StatCard
          label="Open Work Orders"
          value="4"
          footnote="2 assigned, 1 in progress, 1 unassigned"
          badgeText="2 Overdue"
          accent="secondary"
          className="animate-fade-up stagger-2"
        />
        <StatCard
          label="Overdue Items"
          value="3"
          footnote="2 work orders, 1 inspection"
          badgeText="Action Needed"
          accent="tertiary"
          className="animate-fade-up stagger-3"
        />
        <StatCard
          label="This Week's Bookings"
          value="5"
          footnote="Mon–Fri, 14–18 Apr"
          badgeText="+2 vs last week"
          accent="success"
          className="animate-fade-up stagger-4"
        />
      </div>

      {/* ── Row 2: Today's Schedule + Needs Attention ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-up stagger-5">
        <div className="lg:col-span-2">
          <TodaysSchedule />
        </div>
        <NeedsAttention />
      </div>

      {/* ── Row 3: Active Work Orders ── */}
      <div className="animate-fade-up stagger-6">
        <ActiveWorkOrders />
      </div>

      {/* ── Row 4: Recent Activity ── */}
      <div className="animate-fade-up">
        <ActivityTimeline />
      </div>
    </div>
  )
}
