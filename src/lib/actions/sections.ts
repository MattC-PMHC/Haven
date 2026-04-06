"use server"

// Server actions for section CRUD.

import { revalidatePath } from "next/cache"
import { sectionSchema } from "@/lib/schemas/cemeteries"
import { getSession } from "@/lib/auth/get-session"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export interface ActionResult {
  error?: string
  success?: string
  fieldErrors?: Record<string, string[]>
}

export async function createSectionAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) {
    return { error: "You must be logged in." }
  }

  const cemeteryId = formData.get("cemetery_id") as string

  const raw = {
    name: formData.get("name") as string,
    code: formData.get("code") as string,
    section_type: formData.get("section_type") as string,
    status: formData.get("status") as string,
    notes: formData.get("notes") as string,
  }

  const result = sectionSchema.safeParse(raw)
  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("sections").insert({
    tenant_id: session.tenantId,
    cemetery_id: cemeteryId,
    name: result.data.name,
    code: result.data.code || null,
    section_type: result.data.section_type,
    status: result.data.status,
    notes: result.data.notes || null,
    created_by: session.user.id,
    updated_by: session.user.id,
  })

  if (error) {
    console.error("createSectionAction error:", error)
    return { error: "Failed to create section. Please try again." }
  }

  revalidatePath(`/settings/cemeteries/${cemeteryId}`)
  return { success: "Section created successfully." }
}

export async function updateSectionAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) {
    return { error: "You must be logged in." }
  }

  const id = formData.get("id") as string
  const cemeteryId = formData.get("cemetery_id") as string

  const raw = {
    name: formData.get("name") as string,
    code: formData.get("code") as string,
    section_type: formData.get("section_type") as string,
    status: formData.get("status") as string,
    notes: formData.get("notes") as string,
  }

  const result = sectionSchema.safeParse(raw)
  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from("sections")
    .update({
      name: result.data.name,
      code: result.data.code || null,
      section_type: result.data.section_type,
      status: result.data.status,
      notes: result.data.notes || null,
      updated_by: session.user.id,
    })
    .eq("id", id)

  if (error) {
    console.error("updateSectionAction error:", error)
    return { error: "Failed to update section. Please try again." }
  }

  revalidatePath(`/settings/cemeteries/${cemeteryId}`)
  return { success: "Section updated successfully." }
}

export async function deleteSectionAction(
  formData: FormData
): Promise<void> {
  const session = await getSession()
  if (!session) return

  const id = formData.get("id") as string
  const cemeteryId = formData.get("cemetery_id") as string

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from("sections")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("deleteSectionAction error:", error)
  }

  revalidatePath(`/settings/cemeteries/${cemeteryId}`)
}
