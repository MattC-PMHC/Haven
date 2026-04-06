"use server"

// Server actions for booking CRUD.

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { bookingSchema } from "@/lib/schemas/deceased"
import { getSession } from "@/lib/auth/get-session"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export interface ActionResult {
  error?: string
  success?: string
  fieldErrors?: Record<string, string[]>
}

export async function createBookingAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) {
    return { error: "You must be logged in." }
  }

  const raw = {
    cemetery_id: formData.get("cemetery_id") as string,
    plot_id: formData.get("plot_id") as string,
    booking_type: formData.get("booking_type") as string,
    status: formData.get("status") as string,
    requested_date: formData.get("requested_date") as string,
    requested_time: formData.get("requested_time") as string,
    duration_minutes: formData.get("duration_minutes") as string,
    deceased_name: formData.get("deceased_name") as string,
    special_requirements: formData.get("special_requirements") as string,
    notes: formData.get("notes") as string,
  }

  const result = bookingSchema.safeParse(raw)
  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("bookings").insert({
    tenant_id: session.tenantId,
    cemetery_id: result.data.cemetery_id,
    plot_id: result.data.plot_id || null,
    booking_type: result.data.booking_type,
    status: result.data.status,
    requested_date: result.data.requested_date,
    requested_time: result.data.requested_time || null,
    duration_minutes: result.data.duration_minutes,
    deceased_name: result.data.deceased_name || null,
    special_requirements: result.data.special_requirements || null,
    notes: result.data.notes || null,
    created_by: session.user.id,
    updated_by: session.user.id,
  })

  if (error) {
    console.error("createBookingAction error:", error)
    return { error: "Failed to create booking. Please try again." }
  }

  revalidatePath("/bookings")
  redirect("/bookings")
}

export async function updateBookingStatusAction(
  formData: FormData
): Promise<void> {
  const session = await getSession()
  if (!session) return

  const id = formData.get("id") as string
  const status = formData.get("status") as string

  const supabase = await createSupabaseServerClient()

  // Build update payload — if confirming, also set confirmed date/time
  const updateData: Record<string, unknown> = {
    status,
    updated_by: session.user.id,
  }

  if (status === "confirmed") {
    updateData.confirmed_date = new Date().toISOString().split("T")[0]
    updateData.confirmed_time = new Date().toTimeString().slice(0, 5)
  }

  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", id)

  if (error) {
    console.error("updateBookingStatusAction error:", error)
  }

  revalidatePath("/bookings")
  revalidatePath(`/bookings/${id}`)
}
