"use server"

// Server actions for cemetery CRUD.
//
// Currently uses mock data — will connect to Supabase later.
// Each action validates with zod and returns a result object
// (same pattern as auth actions).

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cemeterySchema } from "@/lib/schemas/cemeteries"

export interface ActionResult {
  error?: string
  success?: string
  fieldErrors?: Record<string, string[]>
}

export async function createCemeteryAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name: formData.get("name") as string,
    address: formData.get("address") as string,
    suburb: formData.get("suburb") as string,
    state: formData.get("state") as string,
    postcode: formData.get("postcode") as string,
    status: formData.get("status") as string,
    opening_hours: formData.get("opening_hours") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    notes: formData.get("notes") as string,
  }

  const result = cemeterySchema.safeParse(raw)
  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  // TODO: Insert into Supabase + write audit log
  // For now, just simulate success
  console.log("Creating cemetery:", result.data)

  revalidatePath("/settings/cemeteries")
  redirect("/settings/cemeteries")
}

export async function updateCemeteryAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const id = formData.get("id") as string

  const raw = {
    name: formData.get("name") as string,
    address: formData.get("address") as string,
    suburb: formData.get("suburb") as string,
    state: formData.get("state") as string,
    postcode: formData.get("postcode") as string,
    status: formData.get("status") as string,
    opening_hours: formData.get("opening_hours") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    notes: formData.get("notes") as string,
  }

  const result = cemeterySchema.safeParse(raw)
  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  // TODO: Update in Supabase + write audit log
  console.log("Updating cemetery:", id, result.data)

  revalidatePath(`/settings/cemeteries/${id}`)
  revalidatePath("/settings/cemeteries")
  return { success: "Cemetery updated successfully." }
}

export async function deleteCemeteryAction(
  formData: FormData
): Promise<void> {
  const id = formData.get("id") as string

  // TODO: Delete from Supabase + write audit log
  // Should check for existing sections/plots before deletion
  console.log("Deleting cemetery:", id)

  revalidatePath("/settings/cemeteries")
  redirect("/settings/cemeteries")
}
