// Query functions for the Mason portal.
//
// Masons log in as auth users; their permits link to a contact record
// via mason_contact_id. We bridge by matching the user's email against
// contacts with contact_type = 'mason'.

import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { Contact, MemorialPermit } from "@/lib/types/database"

/**
 * Finds the mason's contact record by email.
 */
export async function getMasonContactForUser(
  email: string
): Promise<Contact | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("contact_type", "mason")
    .eq("email", email)
    .single()

  if (error) {
    console.error("getMasonContactForUser error:", error)
    return null
  }
  return data as Contact
}

/**
 * Fetches all permits for a mason contact, joined with plot numbers.
 */
export async function getPermitsForMason(
  contactId: string
): Promise<(MemorialPermit & { plot_number?: string })[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("memorial_permits")
    .select("*, plots(plot_number)")
    .eq("mason_contact_id", contactId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("getPermitsForMason error:", error)
    return []
  }

  return (data ?? []).map((row: Record<string, unknown>) => {
    const plot = row.plots as { plot_number: string } | null
    const { plots: _plots, ...permit } = row
    return {
      ...(permit as unknown as MemorialPermit),
      plot_number: plot?.plot_number ?? undefined,
    }
  })
}

/**
 * Returns permit counts by status for the mason's dashboard stats.
 */
export async function getPermitStats(contactId: string) {
  const permits = await getPermitsForMason(contactId)

  const byStatus: Record<string, number> = {}
  for (const p of permits) {
    byStatus[p.status] = (byStatus[p.status] ?? 0) + 1
  }

  return { total: permits.length, byStatus }
}
