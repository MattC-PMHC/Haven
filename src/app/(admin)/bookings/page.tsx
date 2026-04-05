// Bookings list — shows all interment bookings grouped by status.
//
// Displays as a table with status-colored badges.
// Links to create new booking.

import Link from "next/link"
import { Plus, CalendarCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { mockBookings, getBookingStats } from "@/lib/mock/deceased"
import { mockCemeteries } from "@/lib/mock/cemeteries"

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const bookingStatusStyles: Record<string, string> = {
  pending: "bg-warning-bg text-warning border-warning-border",
  confirmed: "bg-info-bg text-info border-info-border",
  in_progress: "bg-status-maintenance-bg text-status-maintenance border-status-maintenance/20",
  completed: "bg-success-bg text-success border-success-border",
  cancelled: "bg-surface-container-high text-muted-foreground",
}

const bookingStatusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
}

const bookingTypeLabels: Record<string, string> = {
  burial: "Burial",
  ashes_interment: "Ashes Interment",
  ashes_scattering: "Ashes Scattering",
  memorial_service: "Memorial Service",
  exhumation: "Exhumation",
  monumental_works: "Monumental Works",
  grounds_maintenance: "Grounds Maintenance",
}

export default function BookingsPage() {
  const bookings = mockBookings
  const stats = getBookingStats()

  // Cemetery name lookup
  const cemeteryNames: Record<string, string> = {}
  for (const c of mockCemeteries) {
    cemeteryNames[c.id] = c.name
  }

  // Sort: pending/confirmed first, then by date descending
  const sorted = [...bookings].sort((a, b) => {
    const statusOrder: Record<string, number> = {
      pending: 0,
      confirmed: 1,
      in_progress: 2,
      completed: 3,
      cancelled: 4,
    }
    const diff = (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9)
    if (diff !== 0) return diff
    return (b.requested_date ?? "").localeCompare(a.requested_date ?? "")
  })

  return (
    <div className="p-4 md:p-10 max-w-[1600px] mx-auto w-full space-y-8">
      {/* ── Header ── */}
      <div className="flex justify-between items-end animate-fade-up">
        <div>
          <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
            Interment Bookings
          </h2>
          <p className="text-muted-foreground">
            Manage all upcoming and past interment bookings.
          </p>
        </div>
        <Button asChild className="rounded-xl">
          <Link href="/bookings/new">
            <Plus className="size-4" />
            New Booking
          </Link>
        </Button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 animate-fade-up stagger-1">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Total</p>
          <p className="text-2xl font-bold text-primary">{stats.total}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Pending</p>
          <p className="text-2xl font-bold text-warning">{stats.byStatus.pending ?? 0}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Confirmed</p>
          <p className="text-2xl font-bold text-info">{stats.byStatus.confirmed ?? 0}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Completed</p>
          <p className="text-2xl font-bold text-success">{stats.byStatus.completed ?? 0}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Cancelled</p>
          <p className="text-2xl font-bold text-muted-foreground">{stats.byStatus.cancelled ?? 0}</p>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card animate-fade-up stagger-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Deceased</TableHead>
              <TableHead>Cemetery</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Requested Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((booking, i) => (
              <TableRow
                key={booking.id}
                className={i % 2 === 1 ? "bg-surface-container-low/50" : ""}
              >
                <TableCell className="pl-6">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="size-4 text-muted-foreground shrink-0" />
                    <span className="font-medium">{booking.deceased_name ?? "—"}</span>
                  </div>
                  {booking.special_requirements && (
                    <p className="text-xs text-muted-foreground mt-0.5 ml-6 line-clamp-1">
                      {booking.special_requirements}
                    </p>
                  )}
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  {cemeteryNames[booking.cemetery_id] ?? "—"}
                </TableCell>

                <TableCell className="text-sm">
                  {bookingTypeLabels[booking.booking_type] ?? booking.booking_type}
                </TableCell>

                <TableCell className="text-sm">
                  {formatDate(booking.requested_date)}
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  {booking.requested_time ?? "—"}
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  {booking.duration_minutes} min
                </TableCell>

                <TableCell>
                  <Badge className={bookingStatusStyles[booking.status] ?? ""}>
                    {bookingStatusLabels[booking.status] ?? booking.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
