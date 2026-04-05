"use server"

// Server actions for section CRUD.
//
// Currently uses mock data — will connect to Supabase later.

import { revalidatePath } from "next/cache"
import { sectionSchema } from "@/lib/schemas/cemeteries"

export interface ActionResult {
  error?: string
  success?: string
  fieldErrors?: Record<string, string[]>
}

export async function createSectionAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
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

  // TODO: Insert into Supabase + write audit log
  console.log("Creating section for cemetery:", cemeteryId, result.data)

  revalidatePath(`/settings/cemeteries/${cemeteryId}`)
  return { success: "Section created successfully." }
}

export async function updateSectionAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
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

  // TODO: Update in Supabase + write audit log
  console.log("Updating section:", id, result.data)

  revalidatePath(`/settings/cemeteries/${cemeteryId}`)
  return { success: "Section updated successfully." }
}

export async function deleteSectionAction(
  formData: FormData
): Promise<void> {
  const id = formData.get("id") as string
  const cemeteryId = formData.get("cemetery_id") as string

  // TODO: Delete from Supabase + write audit log
  // Should check for existing plots before deletion
  console.log("Deleting section:", id)

  revalidatePath(`/settings/cemeteries/${cemeteryId}`)
}
