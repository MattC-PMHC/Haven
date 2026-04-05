"use client"

// Mason Portal — New Permit Application
//
// Submit a memorial permit application for council review.

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
import { DocumentUpload } from "@/components/records/DocumentUpload"

export default function MasonApplyPage() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="p-6 md:p-10 max-w-2xl mx-auto text-center space-y-6 animate-fade-up">
        <div className="bg-success-bg rounded-full size-16 flex items-center justify-center mx-auto">
          <Send className="size-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-primary">Application Submitted</h2>
        <p className="text-muted-foreground">
          Your memorial permit application has been submitted for council review.
          You&apos;ll be notified when a decision is made.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild variant="secondary" className="rounded-xl">
            <Link href="/mason">Back to Dashboard</Link>
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
          <Link href="/mason">
            <ArrowLeft className="size-4" />
            Dashboard
          </Link>
        </Button>
        <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
          New Permit Application
        </h2>
        <p className="text-muted-foreground">
          Apply for a memorial works permit. Provide design details and dimensions.
        </p>
      </div>

      {/* ── Form ── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card p-6 space-y-6 animate-fade-up stagger-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Plot Number</Label>
            <Input placeholder="e.g. RMP-A-001" />
          </div>
          <div className="space-y-2">
            <Label>Work Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select work type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_memorial">New Memorial</SelectItem>
                <SelectItem value="additional_inscription">Additional Inscription</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="restoration">Restoration</SelectItem>
                <SelectItem value="removal">Removal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description of Works</Label>
          <Textarea
            placeholder="Describe the memorial work to be carried out..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Height (mm)</Label>
            <Input type="number" placeholder="e.g. 900" />
          </div>
          <div className="space-y-2">
            <Label>Width (mm)</Label>
            <Input type="number" placeholder="e.g. 600" />
          </div>
          <div className="space-y-2">
            <Label>Depth (mm)</Label>
            <Input type="number" placeholder="e.g. 150" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Material Details</Label>
          <Input placeholder="e.g. Harcourt Grey granite, polished face" />
        </div>

        <div className="space-y-2">
          <Label>Design Drawing / Photo</Label>
          <DocumentUpload />
        </div>

        <div className="space-y-2">
          <Label>Additional Notes</Label>
          <Textarea
            placeholder="Any other information for the council reviewer..."
            rows={2}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" asChild className="rounded-xl">
            <Link href="/mason">Cancel</Link>
          </Button>
          <Button className="rounded-xl" onClick={() => setSubmitted(true)}>
            <Send className="size-4" />
            Submit Application
          </Button>
        </div>
      </div>
    </div>
  )
}
