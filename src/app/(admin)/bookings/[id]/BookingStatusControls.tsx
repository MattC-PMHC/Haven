"use client"

// BookingStatusControls — status transition buttons for a booking.
//
// Shows available next-status actions based on the current status.
// Uses the existing updateBookingStatusAction server action.

import { Button } from "@/components/ui/button"
import { updateBookingStatusAction } from "@/lib/actions/bookings"
import {
  CheckCircle2,
  PlayCircle,
  XCircle,
  ThumbsUp,
} from "lucide-react"

interface BookingStatusControlsProps {
  bookingId: string
  currentStatus: string
}

// Define which transitions are valid from each status
const transitions: Record<
  string,
  { status: string; label: string; icon: React.ReactNode; variant: "default" | "outline" | "destructive" }[]
> = {
  pending: [
    {
      status: "confirmed",
      label: "Confirm Booking",
      icon: <ThumbsUp className="size-4" />,
      variant: "default",
    },
    {
      status: "cancelled",
      label: "Cancel",
      icon: <XCircle className="size-4" />,
      variant: "destructive",
    },
  ],
  confirmed: [
    {
      status: "in_progress",
      label: "Start",
      icon: <PlayCircle className="size-4" />,
      variant: "default",
    },
    {
      status: "cancelled",
      label: "Cancel",
      icon: <XCircle className="size-4" />,
      variant: "destructive",
    },
  ],
  in_progress: [
    {
      status: "completed",
      label: "Mark Complete",
      icon: <CheckCircle2 className="size-4" />,
      variant: "default",
    },
  ],
  completed: [],
  cancelled: [],
}

export function BookingStatusControls({
  bookingId,
  currentStatus,
}: BookingStatusControlsProps) {
  const available = transitions[currentStatus] ?? []

  if (available.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No further actions available for this booking.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {available.map((t) => (
        <form key={t.status} action={updateBookingStatusAction}>
          <input type="hidden" name="id" value={bookingId} />
          <input type="hidden" name="status" value={t.status} />
          <Button
            type="submit"
            variant={t.variant}
            className="w-full justify-start gap-2"
          >
            {t.icon}
            {t.label}
          </Button>
        </form>
      ))}
    </div>
  )
}
