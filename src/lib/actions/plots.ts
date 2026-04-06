"use server"

// Server actions for plot CRUD.

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { plotSchema } from "@/lib/schemas/plots"
import { getSession } from "@/lib/auth/get-session"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export interface ActionResult {
  error?: string
  success?: string
  fieldErrors?: Record<string, string[]>
}

export async function createPlotAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) {
    return { error: "You must be logged in." }
  }

  const raw = {
    section_id: formData.get("section_id") as string,
    plot_number: formData.get("plot_number") as string,
    plot_type: formData.get("plot_type") as string,
    status: formData.get("status") as string,
    capacity: formData.get("capacity") as string,
    length_m: formData.get("length_m") as string,
    width_m: formData.get("width_m") as string,
    depth_m: formData.get("depth_m") as string,
    row_number: formData.get("row_number") as string,
    position: formData.get("position") as string,
    soil_type: formData.get("soil_type") as string,
    infrastructure_notes: formData.get("infrastructure_notes") as string,
    notes: formData.get("notes") as string,
  }

  const result = plotSchema.safeParse(raw)
  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("plots").insert({
    tenant_id: session.tenantId,
    section_id: result.data.section_id,
    plot_number: result.data.plot_number,
    plot_type: result.data.plot_type,
    status: result.data.status,
    capacity: result.data.capacity,
    remaining_capacity: result.data.capacity,
    length_m: result.data.length_m || null,
    width_m: result.data.width_m || null,
    depth_m: result.data.depth_m || null,
    row_number: result.data.row_number || null,
    position: result.data.position || null,
    soil_type: result.data.soil_type || null,
    infrastructure_notes: result.data.infrastructure_notes || null,
    notes: result.data.notes || null,
    created_by: session.user.id,
    updated_by: session.user.id,
  })

  if (error) {
    console.error("createPlotAction error:", error)
    return { error: "Failed to create plot. Please try again." }
  }

  revalidatePath("/plots")
  redirect("/plots")
}

export async function updatePlotAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) {
    return { error: "You must be logged in." }
  }

  const id = formData.get("id") as string

  const raw = {
    section_id: formData.get("section_id") as string,
    plot_number: formData.get("plot_number") as string,
    plot_type: formData.get("plot_type") as string,
    status: formData.get("status") as string,
    capacity: formData.get("capacity") as string,
    length_m: formData.get("length_m") as string,
    width_m: formData.get("width_m") as string,
    depth_m: formData.get("depth_m") as string,
    row_number: formData.get("row_number") as string,
    position: formData.get("position") as string,
    soil_type: formData.get("soil_type") as string,
    infrastructure_notes: formData.get("infrastructure_notes") as string,
    notes: formData.get("notes") as string,
  }

  const result = plotSchema.safeParse(raw)
  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from("plots")
    .update({
      section_id: result.data.section_id,
      plot_number: result.data.plot_number,
      plot_type: result.data.plot_type,
      status: result.data.status,
      capacity: result.data.capacity,
      length_m: result.data.length_m || null,
      width_m: result.data.width_m || null,
      depth_m: result.data.depth_m || null,
      row_number: result.data.row_number || null,
      position: result.data.position || null,
      soil_type: result.data.soil_type || null,
      infrastructure_notes: result.data.infrastructure_notes || null,
      notes: result.data.notes || null,
      updated_by: session.user.id,
    })
    .eq("id", id)

  if (error) {
    console.error("updatePlotAction error:", error)
    return { error: "Failed to update plot. Please try again." }
  }

  revalidatePath(`/plots/${id}`)
  revalidatePath("/plots")
  return { success: "Plot updated successfully." }
}

export async function deletePlotAction(formData: FormData): Promise<void> {
  const session = await getSession()
  if (!session) return

  const id = formData.get("id") as string
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from("plots")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("deletePlotAction error:", error)
  }

  revalidatePath("/plots")
  redirect("/plots")
}
