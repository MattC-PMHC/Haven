"use server"

// Server actions for deceased record CRUD.

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { deceasedSchema } from "@/lib/schemas/deceased"
import { getSession } from "@/lib/auth/get-session"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export interface ActionResult {
  error?: string
  success?: string
  fieldErrors?: Record<string, string[]>
}

export async function createDeceasedAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) {
    return { error: "You must be logged in." }
  }

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

  const supabase = await createSupabaseServerClient()

  // Calculate age at death if both dates provided
  let ageAtDeath: number | null = null
  if (result.data.date_of_birth && result.data.date_of_death) {
    const dob = new Date(result.data.date_of_birth)
    const dod = new Date(result.data.date_of_death)
    ageAtDeath = Math.floor(
      (dod.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    )
  }

  const { error } = await supabase.from("deceased").insert({
    tenant_id: session.tenantId,
    surname: result.data.surname,
    given_names: result.data.given_names,
    maiden_name: result.data.maiden_name || null,
    date_of_birth: result.data.date_of_birth || null,
    date_of_death: result.data.date_of_death,
    age_at_death: ageAtDeath,
    gender: result.data.gender || null,
    place_of_death: result.data.place_of_death || null,
    religion: result.data.religion || null,
    cultural_background: result.data.cultural_background || null,
    death_cert_number: result.data.death_cert_number || null,
    burial_order_number: result.data.burial_order_number || null,
    doctor_coroner_ref: result.data.doctor_coroner_ref || null,
    notes: result.data.notes || null,
    created_by: session.user.id,
    updated_by: session.user.id,
  })

  if (error) {
    console.error("createDeceasedAction error:", error)
    return { error: "Failed to create record. Please try again." }
  }

  revalidatePath("/registry")
  redirect("/registry")
}

export async function updateDeceasedAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession()
  if (!session) {
    return { error: "You must be logged in." }
  }

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

  const supabase = await createSupabaseServerClient()

  let ageAtDeath: number | null = null
  if (result.data.date_of_birth && result.data.date_of_death) {
    const dob = new Date(result.data.date_of_birth)
    const dod = new Date(result.data.date_of_death)
    ageAtDeath = Math.floor(
      (dod.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    )
  }

  const { error } = await supabase
    .from("deceased")
    .update({
      surname: result.data.surname,
      given_names: result.data.given_names,
      maiden_name: result.data.maiden_name || null,
      date_of_birth: result.data.date_of_birth || null,
      date_of_death: result.data.date_of_death,
      age_at_death: ageAtDeath,
      gender: result.data.gender || null,
      place_of_death: result.data.place_of_death || null,
      religion: result.data.religion || null,
      cultural_background: result.data.cultural_background || null,
      death_cert_number: result.data.death_cert_number || null,
      burial_order_number: result.data.burial_order_number || null,
      doctor_coroner_ref: result.data.doctor_coroner_ref || null,
      notes: result.data.notes || null,
      updated_by: session.user.id,
    })
    .eq("id", id)

  if (error) {
    console.error("updateDeceasedAction error:", error)
    return { error: "Failed to update record. Please try again." }
  }

  revalidatePath(`/registry/${id}`)
  revalidatePath("/registry")
  return { success: "Record updated successfully." }
}
