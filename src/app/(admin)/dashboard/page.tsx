// Dashboard page — the main landing page after login.
//
// Focused on current work: today's services, active work orders,
// items needing attention, and recent activity.

import { requireRole } from "@/lib/auth/require-role"
import { StatCard } from "@/components/dashboard/StatCard"
import { TodaysSchedule } from "@/components/dashboard/TodaysSchedule"
import { NeedsAttention } from "@/components/dashboard/NeedsAttention"
import { ActiveWorkOrders } from "@/components/dashboard/ActiveWorkOrders"
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline"
import { getBookings, getBookingStats } from "@/lib/queries/bookings"
import { getPlots } from "@/lib/queries/plots"

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

  const [bookings, bookingStats, plots] = await Promise.all([
    getBookings(),
    getBookingStats(),
    getPlots(),
  ])

  // Today's services
  const today = new Date().toISOString().slice(0, 10)
  const todaysBookings = bookings.filter(
    (b) =>
      ((b.confirmed_date ?? b.requested_date) === today) &&
      b.status !== "cancelled",
  )
  const todaysTypeCounts: Record<string, number> = {}
  for (const b of todaysBookings) {
    const label = b.booking_type === "ashes_interment" ? "Ashes" : b.booking_type === "burial" ? "Burial" : b.booking_type.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    todaysTypeCounts[label] = (todaysTypeCounts[label] || 0) + 1
  }
  const todaysFootnote =
    todaysBookings.length === 0
      ? "No services scheduled"
      : Object.entries(todaysTypeCounts).map(([t, c]) => `${c} ${t}`).join(", ")

  // This week's bookings (Mon–Fri)
  const now = new Date()
  const dayOfWeek = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7))
  monday.setHours(0, 0, 0, 0)
  const friday = new Date(monday)
  friday.setDate(monday.getDate() + 4)
  friday.setHours(23, 59, 59, 999)
  const monStr = monday.toISOString().slice(0, 10)
  const friStr = friday.toISOString().slice(0, 10)
  const thisWeekBookings = bookings.filter((b) => {
    const d = b.confirmed_date ?? b.requested_date
    return d && d >= monStr && d <= friStr && b.status !== "cancelled"
  })
  const weekLabel = `Mon–Fri, ${monday.getDate()}–${friday.getDate()} ${monday.toLocaleDateString("en-AU", { month: "short" })}`

  // Pending bookings needing action
  const pendingCount = bookingStats.byStatus["pending"] ?? 0

  // Plot availability
  const availablePlots = plots.filter((p) => p.status === "available").length

  // Build today's schedule data for the component
  const bookingTypeLabels: Record<string, string> = {
    burial: "Burial",
    ashes_interment: "Ashes",
    ashes_scattering: "Scattering",
    memorial_service: "Memorial",
    exhumation: "Exhumation",
    monumental_works: "Monumental",
    grounds_maintenance: "Maintenance",
  }
  const todaysScheduleItems = todaysBookings.map((b) => ({
    id: b.id,
    time: b.confirmed_time ?? b.requested_time ?? "TBD",
    name: b.deceased_name ?? "Unnamed",
    type: bookingTypeLabels[b.booking_type] ?? b.booking_type,
    status: b.status === "confirmed" ? "Confirmed" : b.status === "in_progress" ? "In Progress" : "Pending",
  }))

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
          {todaysBookings.length === 0
            ? "No services scheduled for today."
            : `You have ${todaysBookings.length} service${todaysBookings.length !== 1 ? "s" : ""} today${pendingCount > 0 ? ` and ${pendingCount} booking${pendingCount !== 1 ? "s" : ""} pending review` : ""}.`}
        </p>
      </div>

      {/* ── Row 1: Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Today's Services"
          value={String(todaysBookings.length)}
          footnote={todaysFootnote}
          badgeText={todaysBookings.length > 0 ? "On Schedule" : "Clear Day"}
          accent="primary"
          className="animate-fade-up stagger-1"
        />
        <StatCard
          label="Pending Bookings"
          value={String(pendingCount)}
          footnote={pendingCount > 0 ? "Awaiting confirmation" : "All confirmed"}
          badgeText={pendingCount > 0 ? "Review Needed" : "Up to Date"}
          accent="secondary"
          className="animate-fade-up stagger-2"
        />
        <StatCard
          label="Available Plots"
          value={String(availablePlots)}
          footnote={`${plots.length} total across all sections`}
          badgeText={`${Math.round((availablePlots / Math.max(plots.length, 1)) * 100)}% Available`}
          accent="tertiary"
          className="animate-fade-up stagger-3"
        />
        <StatCard
          label="This Week's Bookings"
          value={String(thisWeekBookings.length)}
          footnote={weekLabel}
          badgeText={`${bookingStats.total} total`}
          accent="success"
          className="animate-fade-up stagger-4"
        />
      </div>

      {/* ── Row 2: Today's Schedule + Needs Attention ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-up stagger-5">
        <div className="lg:col-span-2">
          <TodaysSchedule items={todaysScheduleItems} />
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
