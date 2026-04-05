"use server"

// Server actions for plot CRUD.
//
// Currently mock — will connect to Supabase later.

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { plotSchema } from "@/lib/schemas/plots"

export interface ActionResult {
  error?: string
  success?: string
  fieldErrors?: Record<string, string[]>
}

export async function createPlotAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
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

  // TODO: Insert into Supabase + write audit log
  console.log("Creating plot:", result.data)

  revalidatePath("/plots")
  redirect("/plots")
}

export async function updatePlotAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
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

  // TODO: Update in Supabase + write audit log
  console.log("Updating plot:", id, result.data)

  revalidatePath(`/plots/${id}`)
  revalidatePath("/plots")
  return { success: "Plot updated successfully." }
}

export async function deletePlotAction(formData: FormData): Promise<void> {
  const id = formData.get("id") as string

  // TODO: Delete from Supabase + write audit log
  console.log("Deleting plot:", id)

  revalidatePath("/plots")
  redirect("/plots")
}
