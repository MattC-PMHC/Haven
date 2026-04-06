"use server"

// Server action for FD portal booking submission.
//
// Differs from admin createBookingAction in that:
// 1. Status is always "pending" (FDs submit requests, admins confirm)
// 2. funeral_director_contact_id is auto-set from the logged-in FD
// 3. deceased_name is built from surname + given names

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod/v4"
import { getSession } from "@/lib/auth/get-session"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getFDContactForUser } from "@/lib/queries/fd-portal"

const fdBookingSchema = z.object({
  cemetery_id: z.string().min(1, "Please select a cemetery"),
  booking_type: z.enum(
    ["burial", "ashes_interment", "ashes_scattering", "memorial_service"],
    { error: "Please select a service type" }
  ),
  requested_date: z.string().min(1, "Requested date is required"),
  requested_time: z.string().optional().or(z.literal("")),
  duration_minutes: z.coerce.number().int().min(15, "Minimum 15 minutes"),
  deceased_surname: z.string().min(1, "Deceased surname is required"),
  deceased_given_names: z.string().optional().or(z.literal("")),
  special_requirements: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
})

export interface FDActionResult {
  error?: string
  success?: string
  fieldErrors?: Record<string, string[]>
}

export async function createFDBookingAction(
  _prevState: FDActionResult | null,
  formData: FormData
): Promise<FDActionResult> {
  const session = await getSession()
  if (!session) {
    return { error: "You must be logged in." }
  }

  // Look up the FD's contact record
  const fdContact = await getFDContactForUser(session.user.email)
  if (!fdContact) {
    return {
      error:
        "No funeral director contact record found for your account. Please contact the council.",
    }
  }

  const raw = {
    cemetery_id: formData.get("cemetery_id") as string,
    booking_type: formData.get("booking_type") as string,
    requested_date: formData.get("requested_date") as string,
    requested_time: formData.get("requested_time") as string,
    duration_minutes: formData.get("duration_minutes") as string,
    deceased_surname: formData.get("deceased_surname") as string,
    deceased_given_names: formData.get("deceased_given_names") as string,
    special_requirements: formData.get("special_requirements") as string,
    notes: formData.get("notes") as string,
  }

  const result = fdBookingSchema.safeParse(raw)
  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  // Build deceased name from surname + given names
  const deceasedName = [result.data.deceased_given_names, result.data.deceased_surname]
    .filter(Boolean)
    .join(" ")

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("bookings").insert({
    tenant_id: session.tenantId,
    cemetery_id: result.data.cemetery_id,
    booking_type: result.data.booking_type,
    status: "pending",
    requested_date: result.data.requested_date,
    requested_time: result.data.requested_time || null,
    duration_minutes: result.data.duration_minutes,
    deceased_name: deceasedName || null,
    special_requirements: result.data.special_requirements || null,
    notes: result.data.notes || null,
    funeral_director_contact_id: fdContact.id,
    created_by: session.user.id,
    updated_by: session.user.id,
  })

  if (error) {
    console.error("createFDBookingAction error:", error)
    return { error: "Failed to submit booking request. Please try again." }
  }

  revalidatePath("/funeral-director")
  redirect("/funeral-director")
}
