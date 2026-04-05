"use client"

// SectionForm — form for creating and editing cemetery sections.
//
// Rendered inside a Dialog on the cemetery detail page.
// Uses server actions for submission.

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
import { createSectionAction, updateSectionAction } from "@/lib/actions/sections"
import type { Section } from "@/lib/types/database"

interface SectionFormProps {
  cemeteryId: string
  section?: Section // If provided, we're editing
  onSuccess?: () => void
}

const SECTION_TYPES = [
  { value: "lawn", label: "Lawn" },
  { value: "monumental", label: "Monumental" },
  { value: "columbarium", label: "Columbarium" },
  { value: "memorial_garden", label: "Memorial Garden" },
  { value: "memorial_wall", label: "Memorial Wall" },
  { value: "scattering_garden", label: "Scattering Garden" },
  { value: "natural_burial", label: "Natural Burial" },
  { value: "vault", label: "Vault" },
  { value: "infant", label: "Infant" },
  { value: "denominational", label: "Denominational" },
  { value: "war_grave", label: "War Grave" },
]

export function SectionForm({ cemeteryId, section, onSuccess }: SectionFormProps) {
  const isEditing = !!section
  const action = isEditing ? updateSectionAction : createSectionAction

  const [state, formAction, isPending] = useActionState(
    async (prevState: Awaited<ReturnType<typeof action>> | null, formData: FormData) => {
      const result = await action(prevState, formData)
      if (result?.success && onSuccess) {
        onSuccess()
      }
      return result
    },
    null
  )

  return (
    <form action={formAction} className="space-y-4">
      {/* Hidden fields */}
      <input type="hidden" name="cemetery_id" value={cemeteryId} />
      {section && <input type="hidden" name="id" value={section.id} />}

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="section-name">Section Name *</Label>
          <Input
            id="section-name"
            name="name"
            defaultValue={section?.name ?? ""}
            placeholder="e.g. Section A - Lawn"
            required
            aria-invalid={!!state?.fieldErrors?.name}
          />
          {state?.fieldErrors?.name && (
            <p className="text-xs text-destructive">{state.fieldErrors.name[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="section-code">Section Code</Label>
          <Input
            id="section-code"
            name="code"
            defaultValue={section?.code ?? ""}
            placeholder="e.g. RMP-A"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="section-type">Type *</Label>
          <Select name="section_type" defaultValue={section?.section_type ?? "lawn"}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {SECTION_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="section-status">Status *</Label>
          <Select name="status" defaultValue={section?.status ?? "active"}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="full">Full</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="section-notes">Notes</Label>
        <Textarea
          id="section-notes"
          name="notes"
          defaultValue={section?.notes ?? ""}
          placeholder="Any additional notes about this section..."
          rows={2}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? isEditing
              ? "Saving..."
              : "Creating..."
            : isEditing
              ? "Save Changes"
              : "Add Section"}
        </Button>
      </div>
    </form>
  )
}
