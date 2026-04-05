"use client"

// BookingForm — form for creating interment bookings.
//
// Includes cemetery selection, booking type, date/time, deceased name,
// special requirements.

import { useActionState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createBookingAction } from "@/lib/actions/bookings"
import type { Cemetery } from "@/lib/types/database"

interface BookingFormProps {
  cemeteries: Cemetery[]
}

const BOOKING_TYPES = [
  { value: "burial", label: "Burial" },
  { value: "ashes_interment", label: "Ashes Interment" },
  { value: "ashes_scattering", label: "Ashes Scattering" },
  { value: "memorial_service", label: "Memorial Service" },
  { value: "exhumation", label: "Exhumation" },
  { value: "monumental_works", label: "Monumental Works" },
  { value: "grounds_maintenance", label: "Grounds Maintenance" },
]

export function BookingForm({ cemeteries }: BookingFormProps) {
  const [state, formAction, isPending] = useActionState(createBookingAction, null)

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="rounded-lg bg-destructive/5 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      {/* ── Booking Details ── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
          Booking Details
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cemetery_id">Cemetery *</Label>
            <Select name="cemetery_id" defaultValue="">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select cemetery" />
              </SelectTrigger>
              <SelectContent>
                {cemeteries.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.fieldErrors?.cemetery_id && (
              <p className="text-xs text-destructive">{state.fieldErrors.cemetery_id[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="booking_type">Booking Type *</Label>
            <Select name="booking_type" defaultValue="burial">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {BOOKING_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue="pending">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deceased_name">Deceased Name</Label>
            <Input
              id="deceased_name"
              name="deceased_name"
              placeholder="Full name of deceased"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requested_date">Requested Date *</Label>
            <Input
              id="requested_date"
              name="requested_date"
              type="date"
              required
              aria-invalid={!!state?.fieldErrors?.requested_date}
            />
            {state?.fieldErrors?.requested_date && (
              <p className="text-xs text-destructive">{state.fieldErrors.requested_date[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requested_time">Requested Time</Label>
            <Input
              id="requested_time"
              name="requested_time"
              type="time"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration_minutes">Duration (minutes) *</Label>
            <Input
              id="duration_minutes"
              name="duration_minutes"
              type="number"
              min={15}
              step={15}
              defaultValue={60}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plot_id">Plot (optional)</Label>
            <Input
              id="plot_id"
              name="plot_id"
              placeholder="Plot ID — can be assigned later"
            />
          </div>
        </div>
      </fieldset>

      {/* ── Requirements & Notes ── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
          Requirements & Notes
        </legend>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="special_requirements">Special Requirements</Label>
            <Textarea
              id="special_requirements"
              name="special_requirements"
              placeholder="Religious ceremony requirements, accessibility needs, etc."
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Notes for staff..."
              rows={2}
            />
          </div>
        </div>
      </fieldset>

      {/* ── Actions ── */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Booking"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <a href="/bookings">Cancel</a>
        </Button>
      </div>
    </form>
  )
}
