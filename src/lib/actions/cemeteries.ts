"use server"

// Server actions for cemetery CRUD.

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cemeterySchema } from "@/lib/schemas/cemeteries"
import { getSession } from "@/lib/auth/get-session"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export interface ActionResult {
  error?: string
  success?: string
  fieldErrors?: Record<string, string[]>
}

export async function createCemeteryAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) {
    return { error: "You must be logged in." }
  }

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

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("cemeteries").insert({
    tenant_id: session.tenantId,
    name: result.data.name,
    address: result.data.address || null,
    suburb: result.data.suburb || null,
    state: result.data.state,
    postcode: result.data.postcode || null,
    status: result.data.status,
    opening_hours: result.data.opening_hours || null,
    phone: result.data.phone || null,
    email: result.data.email || null,
    notes: result.data.notes || null,
    created_by: session.user.id,
    updated_by: session.user.id,
  })

  if (error) {
    console.error("createCemeteryAction error:", error)
    return { error: "Failed to create cemetery. Please try again." }
  }

  revalidatePath("/settings/cemeteries")
  redirect("/settings/cemeteries")
}

export async function updateCemeteryAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) {
    return { error: "You must be logged in." }
  }

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

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from("cemeteries")
    .update({
      name: result.data.name,
      address: result.data.address || null,
      suburb: result.data.suburb || null,
      state: result.data.state,
      postcode: result.data.postcode || null,
      status: result.data.status,
      opening_hours: result.data.opening_hours || null,
      phone: result.data.phone || null,
      email: result.data.email || null,
      notes: result.data.notes || null,
      updated_by: session.user.id,
    })
    .eq("id", id)

  if (error) {
    console.error("updateCemeteryAction error:", error)
    return { error: "Failed to update cemetery. Please try again." }
  }

  revalidatePath(`/settings/cemeteries/${id}`)
  revalidatePath("/settings/cemeteries")
  return { success: "Cemetery updated successfully." }
}

export async function deleteCemeteryAction(
  formData: FormData
): Promise<void> {
  const session = await getSession()
  if (!session) return

  const id = formData.get("id") as string
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from("cemeteries")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("deleteCemeteryAction error:", error)
  }

  revalidatePath("/settings/cemeteries")
  redirect("/settings/cemeteries")
}
