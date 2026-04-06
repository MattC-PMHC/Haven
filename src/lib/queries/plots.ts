// Query functions for plots.

import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { Plot } from "@/lib/types/database"

export async function getPlots(filters?: {
  sectionId?: string
  status?: string
}): Promise<Plot[]> {
  const supabase = await createSupabaseServerClient()
  let query = supabase.from("plots").select("*")

  if (filters?.sectionId) {
    query = query.eq("section_id", filters.sectionId)
  }
  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  const { data, error } = await query.order("plot_number")

  if (error) {
    console.error("getPlots error:", error)
    return []
  }
  return data as Plot[]
}

export async function getPlotById(id: string): Promise<Plot | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("plots")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("getPlotById error:", error)
    return null
  }
  return data as Plot
}

export async function getPlotByNumber(plotNumber: string): Promise<Plot | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("plots")
    .select("*")
    .eq("plot_number", plotNumber)
    .single()

  if (error) {
    console.error("getPlotByNumber error:", error)
    return null
  }
  return data as Plot
}
