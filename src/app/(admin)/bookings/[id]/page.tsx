// Booking detail page — shows booking info, status controls, plot
// assignment, and activity feed for admin-FD communication.

import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  CalendarCheck,
  MapPin,
  Clock,
  Timer,
  AlertCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getBookingById } from "@/lib/queries/bookings"
import { getNotesForBooking } from "@/lib/queries/booking-notes"
import { getCemeteries } from "@/lib/queries/cemeteries"
import { getPlotById } from "@/lib/queries/plots"
import { BookingStatusControls } from "./BookingStatusControls"
import { ActivityFeed } from "@/components/records/ActivityFeed"

interface BookingDetailPageProps {
  params: Promise<{ id: string }>
}

const bookingStatusStyles: Record<string, string> = {
  pending: "bg-warning-bg text-warning border-warning-border",
  confirmed: "bg-info-bg text-info border-info-border",
  in_progress:
    "bg-status-maintenance-bg text-status-maintenance border-status-maintenance/20",
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

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default async function BookingDetailPage({
  params,
}: BookingDetailPageProps) {
  const { id } = await params

  const [booking, notes, cemeteries] = await Promise.all([
    getBookingById(id),
    getNotesForBooking(id),
    getCemeteries(),
  ])

  if (!booking) notFound()

  // Look up cemetery name
  const cemetery = cemeteries.find((c) => c.id === booking.cemetery_id)

  // Look up plot if assigned
  const plot = booking.plot_id ? await getPlotById(booking.plot_id) : null

  return (
    <div className="p-4 md:p-10 max-w-[1200px] mx-auto w-full space-y-8">
      {/* ── Breadcrumb ── */}
      <div className="animate-fade-up">
        <Link
          href="/bookings"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to Bookings
        </Link>
      </div>

      {/* ── Header ── */}
      <div className="flex items-start justify-between animate-fade-up stagger-1">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary-fixed flex items-center justify-center">
            <CalendarCheck className="size-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-extrabold text-primary tracking-tight">
                {booking.deceased_name ?? "Unnamed Booking"}
              </h2>
              <Badge className={bookingStatusStyles[booking.status] ?? ""}>
                {bookingStatusLabels[booking.status] ?? booking.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {bookingTypeLabels[booking.booking_type] ?? booking.booking_type}
              {cemetery ? ` at ${cemetery.name}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* ── Info Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up stagger-2">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <CalendarCheck className="size-4" />
            <p className="text-sm font-medium">Requested Date</p>
          </div>
          <p className="text-lg font-bold text-foreground">
            {formatDate(booking.requested_date)}
          </p>
          {booking.requested_time && (
            <p className="text-sm text-muted-foreground mt-0.5">
              at {booking.requested_time}
            </p>
          )}
        </div>

        {booking.confirmed_date && (
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="size-4" />
              <p className="text-sm font-medium">Confirmed Date</p>
            </div>
            <p className="text-lg font-bold text-foreground">
              {formatDate(booking.confirmed_date)}
            </p>
            {booking.confirmed_time && (
              <p className="text-sm text-muted-foreground mt-0.5">
                at {booking.confirmed_time}
              </p>
            )}
          </div>
        )}

        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Timer className="size-4" />
            <p className="text-sm font-medium">Duration</p>
          </div>
          <p className="text-lg font-bold text-foreground">
            {booking.duration_minutes} min
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <MapPin className="size-4" />
            <p className="text-sm font-medium">Plot</p>
          </div>
          <p className="text-lg font-bold text-foreground">
            {plot ? `Plot ${plot.plot_number}` : "Not assigned"}
          </p>
        </div>
      </div>

      {/* ── Special Requirements ── */}
      {booking.special_requirements && (
        <div className="bg-warning-bg/30 border border-warning-border rounded-xl p-5 animate-fade-up stagger-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="size-4 text-warning" />
            <p className="text-sm font-bold text-warning">Special Requirements</p>
          </div>
          <p className="text-sm text-foreground/90">
            {booking.special_requirements}
          </p>
        </div>
      )}

      {/* ── Status Controls + Activity Feed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-up stagger-3">
        {/* Status Controls — left column */}
        <div className="bg-surface-container-lowest rounded-xl shadow-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
            Actions
          </h3>
          <BookingStatusControls
            bookingId={booking.id}
            currentStatus={booking.status}
          />
        </div>

        {/* Activity Feed — right 2 columns */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-card p-6">
          <ActivityFeed bookingId={booking.id} notes={notes} />
        </div>
      </div>

      {/* ── Internal Notes ── */}
      {booking.notes && (
        <div className="bg-surface-container-lowest rounded-xl shadow-card p-6 animate-fade-up stagger-4">
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">
            Internal Notes
          </h3>
          <p className="text-sm text-foreground/90 whitespace-pre-wrap">
            {booking.notes}
          </p>
        </div>
      )}
    </div>
  )
}
