"use client"

// FDBookingForm — client form for FD booking requests.
//
// Uses useActionState with createFDBookingAction.
// On success, the action redirects to the dashboard.

import { useActionState } from "react"
import Link from "next/link"
import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createFDBookingAction } from "@/lib/actions/fd-bookings"
import type { Cemetery } from "@/lib/types/database"

interface FDBookingFormProps {
  cemeteries: Cemetery[]
}

export function FDBookingForm({ cemeteries }: FDBookingFormProps) {
  const [state, formAction, isPending] = useActionState(createFDBookingAction, null)

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-8">
      {/* ── Header ── */}
      <div className="animate-fade-up">
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/funeral-director">
            <ArrowLeft className="size-4" />
            Dashboard
          </Link>
        </Button>
        <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
          New Booking Request
        </h2>
        <p className="text-muted-foreground">
          Submit a request for council review. You&apos;ll be notified once approved.
        </p>
      </div>

      {/* ── Form ── */}
      <form
        action={formAction}
        className="bg-surface-container-lowest rounded-xl shadow-card p-6 space-y-6 animate-fade-up stagger-1"
      >
        {state?.error && (
          <div className="rounded-lg bg-destructive/5 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {state.error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="deceased_surname">Deceased Surname *</Label>
            <Input
              id="deceased_surname"
              name="deceased_surname"
              placeholder="e.g. Morrison"
              required
              aria-invalid={!!state?.fieldErrors?.deceased_surname}
            />
            {state?.fieldErrors?.deceased_surname && (
              <p className="text-xs text-destructive">{state.fieldErrors.deceased_surname[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="deceased_given_names">Deceased Given Names</Label>
            <Input
              id="deceased_given_names"
              name="deceased_given_names"
              placeholder="e.g. Harold James"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cemetery_id">Cemetery *</Label>
            <Select name="cemetery_id">
              <SelectTrigger>
                <SelectValue placeholder="Select cemetery" />
              </SelectTrigger>
              <SelectContent>
                {cemeteries.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.fieldErrors?.cemetery_id && (
              <p className="text-xs text-destructive">{state.fieldErrors.cemetery_id[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking_type">Service Type *</Label>
            <Select name="booking_type" defaultValue="burial">
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="burial">Burial</SelectItem>
                <SelectItem value="ashes_interment">Ashes Interment</SelectItem>
                <SelectItem value="ashes_scattering">Ashes Scattering</SelectItem>
                <SelectItem value="memorial_service">Memorial Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <Input id="requested_time" name="requested_time" type="time" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration_minutes">Duration (min)</Label>
            <Input
              id="duration_minutes"
              name="duration_minutes"
              type="number"
              defaultValue="60"
              min="15"
              step="15"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="special_requirements">Special Requirements</Label>
          <Textarea
            id="special_requirements"
            name="special_requirements"
            placeholder="Any religious ceremonies, accessibility needs, or special arrangements..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Any other information the council should know..."
            rows={2}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" asChild className="rounded-xl">
            <Link href="/funeral-director">Cancel</Link>
          </Button>
          <Button type="submit" className="rounded-xl" disabled={isPending}>
            <Send className="size-4" />
            {isPending ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </div>
  )
}
