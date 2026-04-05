"use client"

// PlotForm — shared form for creating and editing plots.
//
// Uses react-hook-form pattern with server actions.
// Section selector is pre-populated from mock data.

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
import { createPlotAction, updatePlotAction } from "@/lib/actions/plots"
import type { Plot, Section } from "@/lib/types/database"

interface PlotFormProps {
  plot?: Plot
  sections: Section[]
  defaultSectionId?: string
}

const PLOT_TYPES = [
  { value: "lawn_single", label: "Lawn Single" },
  { value: "lawn_double", label: "Lawn Double" },
  { value: "lawn_triple", label: "Lawn Triple" },
  { value: "monumental", label: "Monumental" },
  { value: "vault", label: "Vault" },
  { value: "columbarium_niche", label: "Columbarium Niche" },
  { value: "memorial_garden", label: "Memorial Garden" },
  { value: "memorial_wall", label: "Memorial Wall" },
  { value: "scattering_garden", label: "Scattering Garden" },
  { value: "natural_burial", label: "Natural Burial" },
  { value: "infant", label: "Infant" },
  { value: "denominational", label: "Denominational" },
  { value: "war_grave", label: "War Grave" },
]

const PLOT_STATUSES = [
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "sold", label: "Sold" },
  { value: "occupied", label: "Occupied" },
  { value: "full", label: "Full" },
  { value: "expired", label: "Expired" },
  { value: "surrendered", label: "Surrendered" },
  { value: "unavailable", label: "Unavailable" },
]

export function PlotForm({ plot, sections, defaultSectionId }: PlotFormProps) {
  const isEditing = !!plot
  const action = isEditing ? updatePlotAction : createPlotAction

  const [state, formAction, isPending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-8">
      {plot && <input type="hidden" name="id" value={plot.id} />}

      {state?.error && (
        <div className="rounded-lg bg-destructive/5 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="rounded-lg bg-success-bg border border-success-border px-4 py-3 text-sm text-success">
          {state.success}
        </div>
      )}

      {/* ── Identity ── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
          Plot Identity
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="section_id">Section *</Label>
            <Select name="section_id" defaultValue={plot?.section_id ?? defaultSectionId ?? ""}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} ({s.code || s.id.slice(-4)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.fieldErrors?.section_id && (
              <p className="text-xs text-destructive">{state.fieldErrors.section_id[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="plot_number">Plot Number *</Label>
            <Input
              id="plot_number"
              name="plot_number"
              defaultValue={plot?.plot_number ?? ""}
              placeholder="e.g. RMP-A-001"
              required
              aria-invalid={!!state?.fieldErrors?.plot_number}
            />
            {state?.fieldErrors?.plot_number && (
              <p className="text-xs text-destructive">{state.fieldErrors.plot_number[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="plot_type">Plot Type *</Label>
            <Select name="plot_type" defaultValue={plot?.plot_type ?? "lawn_single"}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {PLOT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select name="status" defaultValue={plot?.status ?? "available"}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {PLOT_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity *</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min={1}
              defaultValue={plot?.capacity ?? 1}
              required
            />
          </div>
        </div>
      </fieldset>

      {/* ── Location & Dimensions ── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
          Location & Dimensions
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="row_number">Row</Label>
            <Input
              id="row_number"
              name="row_number"
              defaultValue={plot?.row_number ?? ""}
              placeholder="e.g. Row 5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              name="position"
              defaultValue={plot?.position ?? ""}
              placeholder="e.g. 012"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="soil_type">Soil Type</Label>
            <Input
              id="soil_type"
              name="soil_type"
              defaultValue={plot?.soil_type ?? ""}
              placeholder="e.g. clay loam"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="length_m">Length (m)</Label>
            <Input
              id="length_m"
              name="length_m"
              type="number"
              step="0.1"
              defaultValue={plot?.length_m ?? ""}
              placeholder="2.4"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="width_m">Width (m)</Label>
            <Input
              id="width_m"
              name="width_m"
              type="number"
              step="0.1"
              defaultValue={plot?.width_m ?? ""}
              placeholder="1.2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="depth_m">Depth (m)</Label>
            <Input
              id="depth_m"
              name="depth_m"
              type="number"
              step="0.1"
              defaultValue={plot?.depth_m ?? ""}
              placeholder="1.8"
            />
          </div>
        </div>
      </fieldset>

      {/* ── Notes ── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
          Notes
        </legend>
        <div className="space-y-2">
          <Label htmlFor="infrastructure_notes">Infrastructure Notes</Label>
          <Textarea
            id="infrastructure_notes"
            name="infrastructure_notes"
            defaultValue={plot?.infrastructure_notes ?? ""}
            placeholder="e.g. Near water main, tree roots present..."
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">General Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            defaultValue={plot?.notes ?? ""}
            placeholder="Any additional notes..."
            rows={2}
          />
        </div>
      </fieldset>

      {/* ── Actions ── */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? isEditing ? "Saving..." : "Creating..."
            : isEditing ? "Save Changes" : "Create Plot"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <a href="/plots">Cancel</a>
        </Button>
      </div>
    </form>
  )
}
