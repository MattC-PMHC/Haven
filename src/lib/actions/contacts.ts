"use server"

// Server actions for contact CRUD.

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { contactSchema } from "@/lib/schemas/contacts"
import { getSession } from "@/lib/auth/get-session"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export interface ActionResult {
  error?: string
  success?: string
  fieldErrors?: Record<string, string[]>
}

export async function createContactAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) {
    return { error: "You must be logged in." }
  }

  const raw = {
    contact_type: formData.get("contact_type") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    organisation: formData.get("organisation") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    address_line1: formData.get("address_line1") as string,
    address_line2: formData.get("address_line2") as string,
    suburb: formData.get("suburb") as string,
    state: formData.get("state") as string,
    postcode: formData.get("postcode") as string,
    licence_number: formData.get("licence_number") as string,
    notes: formData.get("notes") as string,
  }

  const result = contactSchema.safeParse(raw)
  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("contacts").insert({
    tenant_id: session.tenantId,
    contact_type: result.data.contact_type,
    first_name: result.data.first_name,
    last_name: result.data.last_name,
    organisation: result.data.organisation || null,
    email: result.data.email || null,
    phone: result.data.phone || null,
    address_line1: result.data.address_line1 || null,
    address_line2: result.data.address_line2 || null,
    suburb: result.data.suburb || null,
    state: result.data.state || null,
    postcode: result.data.postcode || null,
    licence_number: result.data.licence_number || null,
    notes: result.data.notes || null,
    created_by: session.user.id,
    updated_by: session.user.id,
  })

  if (error) {
    console.error("createContactAction error:", error)
    return { error: "Failed to create contact. Please try again." }
  }

  revalidatePath("/contacts")
  redirect("/contacts")
}

export async function updateContactAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) {
    return { error: "You must be logged in." }
  }

  const id = formData.get("id") as string

  const raw = {
    contact_type: formData.get("contact_type") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    organisation: formData.get("organisation") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    address_line1: formData.get("address_line1") as string,
    address_line2: formData.get("address_line2") as string,
    suburb: formData.get("suburb") as string,
    state: formData.get("state") as string,
    postcode: formData.get("postcode") as string,
    licence_number: formData.get("licence_number") as string,
    notes: formData.get("notes") as string,
  }

  const result = contactSchema.safeParse(raw)
  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from("contacts")
    .update({
      contact_type: result.data.contact_type,
      first_name: result.data.first_name,
      last_name: result.data.last_name,
      organisation: result.data.organisation || null,
      email: result.data.email || null,
      phone: result.data.phone || null,
      address_line1: result.data.address_line1 || null,
      address_line2: result.data.address_line2 || null,
      suburb: result.data.suburb || null,
      state: result.data.state || null,
      postcode: result.data.postcode || null,
      licence_number: result.data.licence_number || null,
      notes: result.data.notes || null,
      updated_by: session.user.id,
    })
    .eq("id", id)

  if (error) {
    console.error("updateContactAction error:", error)
    return { error: "Failed to update contact. Please try again." }
  }

  revalidatePath(`/contacts/${id}`)
  revalidatePath("/contacts")
  return { success: "Contact updated successfully." }
}

export async function deleteContactAction(
  formData: FormData
): Promise<void> {
  const session = await getSession()
  if (!session) return

  const id = formData.get("id") as string
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("deleteContactAction error:", error)
  }

  revalidatePath("/contacts")
  redirect("/contacts")
}
