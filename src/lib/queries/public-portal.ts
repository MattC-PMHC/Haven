// Query functions for the public portal (no auth required).
//
// These use the Supabase anon client which respects RLS.
// The public portal should have RLS policies that allow
// read access to certain tables.

import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { Cemetery } from "@/lib/types/database"

export interface PublicDeceasedResult {
  id: string
  surname: string
  given_names: string | null
  maiden_name: string | null
  date_of_birth: string | null
  date_of_death: string | null
  religion: string | null
  // From joined interment/plot/cemetery data
  cemetery_name?: string
  section_name?: string
  plot_number?: string
  interment_date?: string
}

/**
 * Searches deceased records by name. Returns results with
 * interment location info joined in.
 */
export async function searchDeceased(
  query: string
): Promise<PublicDeceasedResult[]> {
  if (!query || query.length < 2) return []

  const supabase = await createSupabaseServerClient()

  // Search by surname or given names using ilike
  const pattern = `%${query}%`
  const { data, error } = await supabase
    .from("deceased")
    .select(`
      id, surname, given_names, maiden_name,
      date_of_birth, date_of_death, religion,
      interments(
        interment_date,
        plots(
          plot_number,
          sections(
            name,
            cemeteries(name)
          )
        )
      )
    `)
    .or(`surname.ilike.${pattern},given_names.ilike.${pattern}`)
    .order("surname")
    .limit(50)

  if (error) {
    console.error("searchDeceased error:", error)
    return []
  }

  return (data ?? []).map((row: Record<string, unknown>) => {
    const interments = row.interments as Array<{
      interment_date: string
      plots: {
        plot_number: string
        sections: { name: string; cemeteries: { name: string } }
      } | null
    }> | null

    const firstInterment = interments?.[0]
    const plot = firstInterment?.plots

    return {
      id: row.id as string,
      surname: row.surname as string,
      given_names: row.given_names as string | null,
      maiden_name: row.maiden_name as string | null,
      date_of_birth: row.date_of_birth as string | null,
      date_of_death: row.date_of_death as string | null,
      religion: row.religion as string | null,
      cemetery_name: plot?.sections?.cemeteries?.name,
      section_name: plot?.sections?.name,
      plot_number: plot?.plot_number,
      interment_date: firstInterment?.interment_date,
    }
  })
}

/**
 * Returns active cemeteries for public display.
 */
export async function getPublicCemeteries(): Promise<Cemetery[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("cemeteries")
    .select("*")
    .eq("status", "active")
    .order("name")

  if (error) {
    console.error("getPublicCemeteries error:", error)
    return []
  }

  return data as Cemetery[]
}
