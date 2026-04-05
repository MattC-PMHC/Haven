"use client"

// DeceasedForm — form for creating/editing deceased records.
//
// Covers personal info, death details, and reference numbers.

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
import { createDeceasedAction, updateDeceasedAction } from "@/lib/actions/deceased"
import type { Deceased } from "@/lib/types/database"

interface DeceasedFormProps {
  deceased?: Deceased
}

export function DeceasedForm({ deceased }: DeceasedFormProps) {
  const isEditing = !!deceased
  const action = isEditing ? updateDeceasedAction : createDeceasedAction

  const [state, formAction, isPending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-8">
      {deceased && <input type="hidden" name="id" value={deceased.id} />}

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

      {/* ── Personal Information ── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
          Personal Information
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="surname">Surname *</Label>
            <Input
              id="surname"
              name="surname"
              defaultValue={deceased?.surname ?? ""}
              placeholder="e.g. Morrison"
              required
              aria-invalid={!!state?.fieldErrors?.surname}
            />
            {state?.fieldErrors?.surname && (
              <p className="text-xs text-destructive">{state.fieldErrors.surname[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="given_names">Given Names *</Label>
            <Input
              id="given_names"
              name="given_names"
              defaultValue={deceased?.given_names ?? ""}
              placeholder="e.g. Harold James"
              required
              aria-invalid={!!state?.fieldErrors?.given_names}
            />
            {state?.fieldErrors?.given_names && (
              <p className="text-xs text-destructive">{state.fieldErrors.given_names[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maiden_name">Maiden Name</Label>
            <Input
              id="maiden_name"
              name="maiden_name"
              defaultValue={deceased?.maiden_name ?? ""}
              placeholder="If applicable"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select name="gender" defaultValue={deceased?.gender ?? ""}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                <SelectItem value="Unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              defaultValue={deceased?.date_of_birth ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_death">Date of Death *</Label>
            <Input
              id="date_of_death"
              name="date_of_death"
              type="date"
              defaultValue={deceased?.date_of_death ?? ""}
              required
              aria-invalid={!!state?.fieldErrors?.date_of_death}
            />
            {state?.fieldErrors?.date_of_death && (
              <p className="text-xs text-destructive">{state.fieldErrors.date_of_death[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="place_of_death">Place of Death</Label>
            <Input
              id="place_of_death"
              name="place_of_death"
              defaultValue={deceased?.place_of_death ?? ""}
              placeholder="Hospital or address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="religion">Religion</Label>
            <Input
              id="religion"
              name="religion"
              defaultValue={deceased?.religion ?? ""}
              placeholder="e.g. Anglican, Catholic"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cultural_background">Cultural Background</Label>
            <Input
              id="cultural_background"
              name="cultural_background"
              defaultValue={deceased?.cultural_background ?? ""}
              placeholder="e.g. Australian"
            />
          </div>
        </div>
      </fieldset>

      {/* ── Official References ── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
          Official References
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="death_cert_number">Death Certificate #</Label>
            <Input
              id="death_cert_number"
              name="death_cert_number"
              defaultValue={deceased?.death_cert_number ?? ""}
              placeholder="VIC-2026-XXXXXX"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="burial_order_number">Burial Order #</Label>
            <Input
              id="burial_order_number"
              name="burial_order_number"
              defaultValue={deceased?.burial_order_number ?? ""}
              placeholder="BO-2026-XXXX"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor_coroner_ref">Doctor/Coroner Ref</Label>
            <Input
              id="doctor_coroner_ref"
              name="doctor_coroner_ref"
              defaultValue={deceased?.doctor_coroner_ref ?? ""}
              placeholder="If applicable"
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
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            defaultValue={deceased?.notes ?? ""}
            placeholder="Any additional information..."
            rows={3}
          />
        </div>
      </fieldset>

      {/* ── Actions ── */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? isEditing ? "Saving..." : "Creating..."
            : isEditing ? "Save Changes" : "Create Record"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <a href="/registry">Cancel</a>
        </Button>
      </div>
    </form>
  )
}
