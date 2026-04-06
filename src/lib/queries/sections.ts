// Query functions for sections.

import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { Section } from "@/lib/types/database"

export async function getSections(): Promise<Section[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .order("name")

  if (error) {
    console.error("getSections error:", error)
    return []
  }
  return data as Section[]
}

export async function getSectionById(id: string): Promise<Section | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("getSectionById error:", error)
    return null
  }
  return data as Section
}
