"use client"

// Funeral Director — New Booking Request form.
//
// Submits a booking as "Pending" for council review.
// Uses the same form patterns as admin booking form.

import { useState } from "react"
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
import { mockCemeteries } from "@/lib/mock/cemeteries"

export default function FDBookingRequestPage() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="p-6 md:p-10 max-w-2xl mx-auto text-center space-y-6 animate-fade-up">
        <div className="bg-success-bg rounded-full size-16 flex items-center justify-center mx-auto">
          <Send className="size-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-primary">Booking Request Submitted</h2>
        <p className="text-muted-foreground">
          Your booking request has been sent to the council for review.
          You will receive a confirmation once it has been approved.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild variant="secondary" className="rounded-xl">
            <Link href="/funeral-director">Back to Dashboard</Link>
          </Button>
          <Button className="rounded-xl" onClick={() => setSubmitted(false)}>
            Submit Another
          </Button>
        </div>
      </div>
    )
  }

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
      <div className="bg-surface-container-lowest rounded-xl shadow-card p-6 space-y-6 animate-fade-up stagger-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Deceased Surname</Label>
            <Input placeholder="e.g. Morrison" />
          </div>
          <div className="space-y-2">
            <Label>Deceased Given Names</Label>
            <Input placeholder="e.g. Harold James" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Cemetery</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select cemetery" />
              </SelectTrigger>
              <SelectContent>
                {mockCemeteries.filter((c) => c.status === "active").map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Service Type</Label>
            <Select>
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
            <Label>Requested Date</Label>
            <Input type="date" />
          </div>
          <div className="space-y-2">
            <Label>Requested Time</Label>
            <Input type="time" />
          </div>
          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            <Input type="number" defaultValue="60" min="15" step="15" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Special Requirements</Label>
          <Textarea
            placeholder="Any religious ceremonies, accessibility needs, or special arrangements..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Additional Notes</Label>
          <Textarea
            placeholder="Any other information the council should know..."
            rows={2}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" asChild className="rounded-xl">
            <Link href="/funeral-director">Cancel</Link>
          </Button>
          <Button className="rounded-xl" onClick={() => setSubmitted(true)}>
            <Send className="size-4" />
            Submit Request
          </Button>
        </div>
      </div>
    </div>
  )
}
