"use client"

// Mason permit application form — client component with server action.

import { useActionState } from "react"
import Link from "next/link"
import { ArrowLeft, Send, Loader2 } from "lucide-react"
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
import {
  submitPermitApplication,
  type MasonActionResult,
} from "@/lib/actions/mason-permits"

interface Plot {
  id: string
  plot_number: string
  section_name: string
  cemetery_name: string
}

export function MasonApplyForm({ plots }: { plots: Plot[] }) {
  const [state, formAction, isPending] = useActionState<MasonActionResult | null, FormData>(
    submitPermitApplication,
    null
  )

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

      {/* ── Error Banner ── */}
      {state?.error && (
        <div className="bg-status-restricted-bg text-destructive border border-status-restricted-border rounded-xl p-4 text-sm animate-fade-up">
          {state.error}
        </div>
      )}

      {/* ── Form ── */}
      <form action={formAction}>
        <div className="bg-surface-container-lowest rounded-xl shadow-card p-6 space-y-6 animate-fade-up stagger-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plot_id">Plot *</Label>
              <Select name="plot_id">
                <SelectTrigger id="plot_id">
                  <SelectValue placeholder="Select a plot" />
                </SelectTrigger>
                <SelectContent>
                  {plots.map((plot) => (
                    <SelectItem key={plot.id} value={plot.id}>
                      {plot.plot_number} — {plot.cemetery_name}, {plot.section_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.fieldErrors?.plot_id && (
                <p className="text-xs text-destructive">{state.fieldErrors.plot_id[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="work_type">Work Type *</Label>
              <Select name="work_type">
                <SelectTrigger id="work_type">
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
              {state?.fieldErrors?.work_type && (
                <p className="text-xs text-destructive">{state.fieldErrors.work_type[0]}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description of Works *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the memorial work to be carried out..."
              rows={3}
            />
            {state?.fieldErrors?.description && (
              <p className="text-xs text-destructive">{state.fieldErrors.description[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dimensions_notes">Dimensions (height x width x depth)</Label>
            <Input
              id="dimensions_notes"
              name="dimensions_notes"
              placeholder="e.g. 900mm H x 600mm W x 150mm D"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="material_notes">Material Details</Label>
            <Input
              id="material_notes"
              name="material_notes"
              placeholder="e.g. Harcourt Grey granite, polished face"
            />
          </div>

          <div className="space-y-2">
            <Label>Design Drawing / Photo</Label>
            <DocumentUpload />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any other information for the council reviewer..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" asChild className="rounded-xl">
              <Link href="/mason">Cancel</Link>
            </Button>
            <Button type="submit" className="rounded-xl" disabled={isPending}>
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Submit Application
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
