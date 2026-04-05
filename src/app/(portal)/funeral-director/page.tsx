// Funeral Director Portal — Dashboard
//
// Shows upcoming bookings, pending requests, and quick actions.
// Uses mock booking data filtered for this portal's context.

import Link from "next/link"
import { CalendarCheck, Plus, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockBookings } from "@/lib/mock/deceased"

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const statusStyles: Record<string, string> = {
  pending: "bg-warning-bg text-warning border-warning-border",
  confirmed: "bg-info-bg text-info border-info-border",
  in_progress: "bg-status-occupied-bg text-status-occupied",
  completed: "bg-success-bg text-success border-success-border",
  cancelled: "bg-surface-container-high text-muted-foreground",
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
}

export default function FuneralDirectorDashboard() {
  // In production, filter by FD's contact ID. For mock, show all.
  const upcoming = mockBookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed"
  )
  const recent = mockBookings
    .filter((b) => b.status === "completed")
    .slice(-3)
    .reverse()

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* ── Header ── */}
      <div className="flex justify-between items-end animate-fade-up">
        <div>
          <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
            Welcome Back
          </h2>
          <p className="text-muted-foreground">
            Manage your interment bookings and plot reservations.
          </p>
        </div>
        <Button asChild className="rounded-xl">
          <Link href="/funeral-director/book">
            <Plus className="size-4" />
            New Booking Request
          </Link>
        </Button>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-up stagger-1">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Pending</p>
          <p className="text-2xl font-bold text-warning">
            {mockBookings.filter((b) => b.status === "pending").length}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Confirmed</p>
          <p className="text-2xl font-bold text-info">
            {mockBookings.filter((b) => b.status === "confirmed").length}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Completed</p>
          <p className="text-2xl font-bold text-success">
            {mockBookings.filter((b) => b.status === "completed").length}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Total</p>
          <p className="text-2xl font-bold text-primary">{mockBookings.length}</p>
        </div>
      </div>

      {/* ── Upcoming Bookings ── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card animate-fade-up stagger-2">
        <div className="flex items-center gap-2 p-5 pb-3">
          <Clock className="size-5 text-info" />
          <h3 className="font-semibold text-foreground">Upcoming Bookings</h3>
          <span className="text-sm text-muted-foreground">({upcoming.length})</span>
        </div>
        <div className="divide-y divide-border">
          {upcoming.map((booking) => (
            <div key={booking.id} className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{booking.deceased_name ?? "—"}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(booking.requested_date)}
                  {booking.requested_time ? ` at ${booking.requested_time}` : ""}
                </p>
                {booking.special_requirements && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {booking.special_requirements}
                  </p>
                )}
              </div>
              <Badge className={statusStyles[booking.status] ?? ""}>
                {statusLabels[booking.status] ?? booking.status}
              </Badge>
            </div>
          ))}
          {upcoming.length === 0 && (
            <div className="px-5 py-8 text-center text-muted-foreground text-sm">
              No upcoming bookings.
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Completed ── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card animate-fade-up stagger-3">
        <div className="flex items-center gap-2 p-5 pb-3">
          <CheckCircle2 className="size-5 text-success" />
          <h3 className="font-semibold text-foreground">Recently Completed</h3>
        </div>
        <div className="divide-y divide-border">
          {recent.map((booking) => (
            <div key={booking.id} className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{booking.deceased_name ?? "—"}</p>
                <p className="text-sm text-muted-foreground">{formatDate(booking.confirmed_date)}</p>
              </div>
              <Badge className="bg-success-bg text-success border-success-border">
                Completed
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
