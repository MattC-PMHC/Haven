"use client"

// CemeteryForm — shared form for creating and editing cemeteries.
//
// Uses react-hook-form + zod for validation. Submits via server action.
// The form layout uses Haven's ghost-bordered inputs on surface-container-low.

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
import { createCemeteryAction, updateCemeteryAction } from "@/lib/actions/cemeteries"
import type { Cemetery } from "@/lib/types/database"

interface CemeteryFormProps {
  cemetery?: Cemetery // If provided, we're editing; otherwise creating
}

const AU_STATES = [
  { value: "ACT", label: "ACT" },
  { value: "NSW", label: "NSW" },
  { value: "NT", label: "NT" },
  { value: "QLD", label: "QLD" },
  { value: "SA", label: "SA" },
  { value: "TAS", label: "TAS" },
  { value: "VIC", label: "VIC" },
  { value: "WA", label: "WA" },
]

export function CemeteryForm({ cemetery }: CemeteryFormProps) {
  const isEditing = !!cemetery
  const action = isEditing ? updateCemeteryAction : createCemeteryAction

  const [state, formAction, isPending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-8">
      {/* Hidden ID field for editing */}
      {cemetery && <input type="hidden" name="id" value={cemetery.id} />}

      {/* Error banner */}
      {state?.error && (
        <div className="rounded-lg bg-destructive/5 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      {/* Success banner */}
      {state?.success && (
        <div className="rounded-lg bg-success-bg border border-success-border px-4 py-3 text-sm text-success">
          {state.success}
        </div>
      )}

      {/* ── Basic Info ── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
          Basic Information
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name">Cemetery Name *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={cemetery?.name ?? ""}
              placeholder="e.g. Riverside Memorial Park"
              required
              aria-invalid={!!state?.fieldErrors?.name}
            />
            {state?.fieldErrors?.name && (
              <p className="text-xs text-destructive">{state.fieldErrors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select name="status" defaultValue={cemetery?.status ?? "active"}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={cemetery?.phone ?? ""}
              placeholder="(03) 9555 1234"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={cemetery?.email ?? ""}
              placeholder="cemetery@council.gov.au"
              aria-invalid={!!state?.fieldErrors?.email}
            />
            {state?.fieldErrors?.email && (
              <p className="text-xs text-destructive">{state.fieldErrors.email[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="opening_hours">Opening Hours</Label>
            <Input
              id="opening_hours"
              name="opening_hours"
              defaultValue={cemetery?.opening_hours ?? ""}
              placeholder="Mon-Fri 8:00am - 5:00pm"
            />
          </div>
        </div>
      </fieldset>

      {/* ── Address ── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
          Address
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={cemetery?.address ?? ""}
              placeholder="42 Memorial Drive"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="suburb">Suburb</Label>
            <Input
              id="suburb"
              name="suburb"
              defaultValue={cemetery?.suburb ?? ""}
              placeholder="Riverside"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Select name="state" defaultValue={cemetery?.state ?? "VIC"}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  {AU_STATES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode</Label>
              <Input
                id="postcode"
                name="postcode"
                defaultValue={cemetery?.postcode ?? ""}
                placeholder="3000"
                maxLength={4}
                aria-invalid={!!state?.fieldErrors?.postcode}
              />
              {state?.fieldErrors?.postcode && (
                <p className="text-xs text-destructive">{state.fieldErrors.postcode[0]}</p>
              )}
            </div>
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
            defaultValue={cemetery?.notes ?? ""}
            placeholder="Any additional information about this cemetery..."
            rows={3}
          />
        </div>
      </fieldset>

      {/* ── Actions ── */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? isEditing
              ? "Saving..."
              : "Creating..."
            : isEditing
              ? "Save Changes"
              : "Create Cemetery"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <a href="/settings/cemeteries">Cancel</a>
        </Button>
      </div>
    </form>
  )
}
