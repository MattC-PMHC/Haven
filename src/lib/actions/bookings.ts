"use server"

// Server actions for booking CRUD.

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { bookingSchema } from "@/lib/schemas/deceased"

export interface ActionResult {
  error?: string
  success?: string
  fieldErrors?: Record<string, string[]>
}

export async function createBookingAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
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

  // TODO: Insert into Supabase + audit log
  console.log("Creating booking:", result.data)

  revalidatePath("/bookings")
  redirect("/bookings")
}

export async function updateBookingStatusAction(
  formData: FormData
): Promise<void> {
  const id = formData.get("id") as string
  const status = formData.get("status") as string

  // TODO: Update in Supabase + audit log
  // If status = "completed", auto-create interment record
  console.log("Updating booking status:", id, status)

  revalidatePath("/bookings")
}
