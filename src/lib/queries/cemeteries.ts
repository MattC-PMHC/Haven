// Query functions for cemeteries.

import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { Cemetery, Section } from "@/lib/types/database"

export async function getCemeteries(): Promise<Cemetery[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("cemeteries")
    .select("*")
    .order("name")

  if (error) {
    console.error("getCemeteries error:", error)
    return []
  }
  return data as Cemetery[]
}

export async function getActiveCemeteries(): Promise<Cemetery[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("cemeteries")
    .select("*")
    .eq("status", "active")
    .order("name")

  if (error) {
    console.error("getActiveCemeteries error:", error)
    return []
  }
  return data as Cemetery[]
}

export async function getCemeteryById(id: string): Promise<Cemetery | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("cemeteries")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("getCemeteryById error:", error)
    return null
  }
  return data as Cemetery
}

export async function getSectionsForCemetery(cemeteryId: string): Promise<Section[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("cemetery_id", cemeteryId)
    .order("name")

  if (error) {
    console.error("getSectionsForCemetery error:", error)
    return []
  }
  return data as Section[]
}
