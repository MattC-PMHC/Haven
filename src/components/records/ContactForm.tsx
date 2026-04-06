"use client"

// ContactForm — reusable form for creating and editing contacts.
//
// In create mode, submits via createContactAction.
// In edit mode, includes a hidden "id" field and submits via updateContactAction.

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
import { createContactAction, updateContactAction } from "@/lib/actions/contacts"
import type { Contact } from "@/lib/types/database"

interface ContactFormProps {
  contact?: Contact | null
}

const CONTACT_TYPES = [
  { value: "rights_holder", label: "Rights Holder" },
  { value: "next_of_kin", label: "Next of Kin" },
  { value: "funeral_director", label: "Funeral Director" },
  { value: "mason", label: "Mason" },
  { value: "contractor", label: "Contractor" },
  { value: "supplier", label: "Supplier" },
  { value: "other", label: "Other" },
]

const AU_STATES = [
  { value: "NSW", label: "NSW" },
  { value: "VIC", label: "VIC" },
  { value: "QLD", label: "QLD" },
  { value: "WA", label: "WA" },
  { value: "SA", label: "SA" },
  { value: "TAS", label: "TAS" },
  { value: "ACT", label: "ACT" },
  { value: "NT", label: "NT" },
]

export function ContactForm({ contact }: ContactFormProps) {
  const isEdit = !!contact
  const action = isEdit ? updateContactAction : createContactAction
  const [state, formAction, isPending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-8">
      {isEdit && <input type="hidden" name="id" value={contact.id} />}

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

      {/* ── Contact Details ── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
          Contact Details
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact_type">Contact Type *</Label>
            <Select name="contact_type" defaultValue={contact?.contact_type ?? ""}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {CONTACT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.fieldErrors?.contact_type && (
              <p className="text-xs text-destructive">{state.fieldErrors.contact_type[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organisation">Organisation</Label>
            <Input
              id="organisation"
              name="organisation"
              placeholder="Company or organisation"
              defaultValue={contact?.organisation ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              name="first_name"
              required
              defaultValue={contact?.first_name ?? ""}
              aria-invalid={!!state?.fieldErrors?.first_name}
            />
            {state?.fieldErrors?.first_name && (
              <p className="text-xs text-destructive">{state.fieldErrors.first_name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              name="last_name"
              required
              defaultValue={contact?.last_name ?? ""}
              aria-invalid={!!state?.fieldErrors?.last_name}
            />
            {state?.fieldErrors?.last_name && (
              <p className="text-xs text-destructive">{state.fieldErrors.last_name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email@example.com"
              defaultValue={contact?.email ?? ""}
              aria-invalid={!!state?.fieldErrors?.email}
            />
            {state?.fieldErrors?.email && (
              <p className="text-xs text-destructive">{state.fieldErrors.email[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="04XX XXX XXX"
              defaultValue={contact?.phone ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="licence_number">Licence Number</Label>
            <Input
              id="licence_number"
              name="licence_number"
              placeholder="FD or mason licence #"
              defaultValue={contact?.licence_number ?? ""}
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
            <Label htmlFor="address_line1">Address Line 1</Label>
            <Input
              id="address_line1"
              name="address_line1"
              placeholder="Street address"
              defaultValue={contact?.address_line1 ?? ""}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address_line2">Address Line 2</Label>
            <Input
              id="address_line2"
              name="address_line2"
              placeholder="Unit, apartment, etc."
              defaultValue={contact?.address_line2 ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="suburb">Suburb</Label>
            <Input
              id="suburb"
              name="suburb"
              defaultValue={contact?.suburb ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select name="state" defaultValue={contact?.state ?? ""}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select state" />
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
              placeholder="2000"
              defaultValue={contact?.postcode ?? ""}
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
          <Label htmlFor="notes">Internal Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Any additional notes about this contact..."
            rows={3}
            defaultValue={contact?.notes ?? ""}
          />
        </div>
      </fieldset>

      {/* ── Actions ── */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? isEdit ? "Saving..." : "Creating..."
            : isEdit ? "Save Changes" : "Create Contact"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <a href="/contacts">Cancel</a>
        </Button>
      </div>
    </form>
  )
}
