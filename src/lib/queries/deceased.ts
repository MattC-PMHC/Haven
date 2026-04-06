// Query functions for deceased records.

import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { Deceased, Interment } from "@/lib/types/database"

export async function getDeceasedRecords(): Promise<Deceased[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("deceased")
    .select("*")
    .order("date_of_death", { ascending: false })

  if (error) {
    console.error("getDeceasedRecords error:", error)
    return []
  }
  return data as Deceased[]
}

export async function getDeceasedById(id: string): Promise<Deceased | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("deceased")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("getDeceasedById error:", error)
    return null
  }
  return data as Deceased
}

export async function getIntermentsForDeceased(deceasedId: string): Promise<Interment[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("interments")
    .select("*")
    .eq("deceased_id", deceasedId)
    .order("interment_date", { ascending: false })

  if (error) {
    console.error("getIntermentsForDeceased error:", error)
    return []
  }
  return data as Interment[]
}

export async function getDeceasedStats() {
  const supabase = await createSupabaseServerClient()

  const { count: total } = await supabase
    .from("deceased")
    .select("*", { count: "exact", head: true })

  const currentYear = new Date().getFullYear()
  const { count: thisYear } = await supabase
    .from("deceased")
    .select("*", { count: "exact", head: true })
    .gte("date_of_death", `${currentYear}-01-01`)

  return {
    total: total ?? 0,
    thisYear: thisYear ?? 0,
  }
}
