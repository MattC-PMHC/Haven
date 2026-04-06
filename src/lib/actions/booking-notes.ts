"use server"

// Server actions for booking notes.

import { revalidatePath } from "next/cache"
import { bookingNoteSchema } from "@/lib/schemas/booking-notes"
import { getSession } from "@/lib/auth/get-session"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export interface ActionResult {
  error?: string
  success?: string
}

export async function createBookingNoteAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) {
    return { error: "You must be logged in." }
  }

  const raw = {
    booking_id: formData.get("booking_id") as string,
    content: formData.get("content") as string,
    is_internal: formData.get("is_internal") as string,
  }

  const result = bookingNoteSchema.safeParse(raw)
  if (!result.success) {
    return { error: "Please enter a note." }
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("booking_notes").insert({
    tenant_id: session.tenantId,
    booking_id: result.data.booking_id,
    author_id: session.user.id,
    content: result.data.content,
    is_internal: result.data.is_internal,
  })

  if (error) {
    console.error("createBookingNoteAction error:", error)
    return { error: "Failed to add note. Please try again." }
  }

  revalidatePath(`/bookings/${result.data.booking_id}`)
  return { success: "Note added." }
}
