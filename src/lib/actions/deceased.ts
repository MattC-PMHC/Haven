"use server"

// Server actions for deceased record CRUD.

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { deceasedSchema } from "@/lib/schemas/deceased"

export interface ActionResult {
  error?: string
  success?: string
  fieldErrors?: Record<string, string[]>
}

export async function createDeceasedAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    surname: formData.get("surname") as string,
    given_names: formData.get("given_names") as string,
    maiden_name: formData.get("maiden_name") as string,
    date_of_birth: formData.get("date_of_birth") as string,
    date_of_death: formData.get("date_of_death") as string,
    gender: formData.get("gender") as string,
    place_of_death: formData.get("place_of_death") as string,
    religion: formData.get("religion") as string,
    cultural_background: formData.get("cultural_background") as string,
    death_cert_number: formData.get("death_cert_number") as string,
    burial_order_number: formData.get("burial_order_number") as string,
    doctor_coroner_ref: formData.get("doctor_coroner_ref") as string,
    notes: formData.get("notes") as string,
  }

  const result = deceasedSchema.safeParse(raw)
  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  // TODO: Insert into Supabase + audit log
  console.log("Creating deceased record:", result.data)

  revalidatePath("/registry")
  redirect("/registry")
}

export async function updateDeceasedAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const id = formData.get("id") as string

  const raw = {
    surname: formData.get("surname") as string,
    given_names: formData.get("given_names") as string,
    maiden_name: formData.get("maiden_name") as string,
    date_of_birth: formData.get("date_of_birth") as string,
    date_of_death: formData.get("date_of_death") as string,
    gender: formData.get("gender") as string,
    place_of_death: formData.get("place_of_death") as string,
    religion: formData.get("religion") as string,
    cultural_background: formData.get("cultural_background") as string,
    death_cert_number: formData.get("death_cert_number") as string,
    burial_order_number: formData.get("burial_order_number") as string,
    doctor_coroner_ref: formData.get("doctor_coroner_ref") as string,
    notes: formData.get("notes") as string,
  }

  const result = deceasedSchema.safeParse(raw)
  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  // TODO: Update in Supabase + audit log
  console.log("Updating deceased:", id, result.data)

  revalidatePath(`/registry/${id}`)
  revalidatePath("/registry")
  return { success: "Record updated successfully." }
}
