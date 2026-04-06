// Funeral Director Portal — Dashboard
//
// Shows upcoming bookings, pending requests, and quick actions.
// Fetches real data from Supabase filtered by the FD's contact record.

import Link from "next/link"
import { redirect } from "next/navigation"
import { CalendarCheck, Plus, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSession } from "@/lib/auth/get-session"
import {
  getFDContactForUser,
  getBookingsForFDContact,
} from "@/lib/queries/fd-portal"

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

export default async function FuneralDirectorDashboard() {
  const session = await getSession()
  if (!session) redirect("/login")

  const fdContact = await getFDContactForUser(session.user.email)

  // If no contact record found, show a helpful message
  if (!fdContact) {
    return (
      <div className="p-6 md:p-10 space-y-6 text-center">
        <h2 className="text-2xl font-bold text-primary">Account Not Linked</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your login isn&apos;t linked to a funeral director contact record yet.
          Please contact the council administrator to set up your account.
        </p>
      </div>
    )
  }

  const bookings = await getBookingsForFDContact(fdContact.id)

  const upcoming = bookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed"
  )
  const recent = bookings
    .filter((b) => b.status === "completed")
    .slice(0, 3)

  const stats = {
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    total: bookings.length,
  }

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
          <p className="text-2xl font-bold text-warning">{stats.pending}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Confirmed</p>
          <p className="text-2xl font-bold text-info">{stats.confirmed}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Completed</p>
          <p className="text-2xl font-bold text-success">{stats.completed}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Total</p>
          <p className="text-2xl font-bold text-primary">{stats.total}</p>
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
          {recent.length === 0 ? (
            <div className="px-5 py-8 text-center text-muted-foreground text-sm">
              No completed bookings yet.
            </div>
          ) : (
            recent.map((booking) => (
              <div key={booking.id} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{booking.deceased_name ?? "—"}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(booking.confirmed_date)}</p>
                </div>
                <Badge className="bg-success-bg text-success border-success-border">
                  Completed
                </Badge>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
