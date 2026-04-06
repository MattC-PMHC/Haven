// Query functions for the Funeral Director portal.
//
// The key challenge: FD users log in as auth users, but bookings link
// to a contact record via funeral_director_contact_id. We bridge this
// by looking up the contact whose email matches the logged-in user.

import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { Booking, Contact, Plot, Section, Document } from "@/lib/types/database"

/**
 * Finds the FD's contact record by matching the user's email
 * against contacts with contact_type = 'funeral_director'.
 */
export async function getFDContactForUser(
  email: string
): Promise<Contact | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("contact_type", "funeral_director")
    .eq("email", email)
    .single()

  if (error) {
    // No match or multiple matches — both are non-fatal for the portal
    console.error("getFDContactForUser error:", error)
    return null
  }
  return data as Contact
}

/**
 * Fetches bookings linked to the given FD contact ID.
 */
export async function getBookingsForFDContact(
  contactId: string
): Promise<Booking[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("funeral_director_contact_id", contactId)
    .order("requested_date", { ascending: false })

  if (error) {
    console.error("getBookingsForFDContact error:", error)
    return []
  }
  return data as Booking[]
}

/**
 * Returns available plots, optionally filtered by cemetery.
 * Joins through sections to get cemetery and section names.
 */
export async function getAvailablePlots(cemeteryId?: string): Promise<
  (Plot & { section_name: string; cemetery_name: string })[]
> {
  const supabase = await createSupabaseServerClient()

  let query = supabase
    .from("plots")
    .select("*, sections!inner(name, cemetery_id, cemeteries!inner(name))")
    .eq("status", "available")
    .order("plot_number")
    .limit(50)

  if (cemeteryId) {
    query = query.eq("sections.cemetery_id", cemeteryId)
  }

  const { data, error } = await query

  if (error) {
    console.error("getAvailablePlots error:", error)
    return []
  }

  return (data ?? []).map((row: Record<string, unknown>) => {
    const section = row.sections as { name: string; cemetery_id: string; cemeteries: { name: string } }
    const { sections: _sections, ...plot } = row
    return {
      ...(plot as unknown as Plot),
      section_name: section.name,
      cemetery_name: section.cemeteries.name,
    }
  })
}

/**
 * Returns documents linked to the FD's bookings.
 */
export async function getDocumentsForFD(
  contactId: string
): Promise<Document[]> {
  const supabase = await createSupabaseServerClient()

  // Get booking IDs for this FD
  const { data: bookings, error: bErr } = await supabase
    .from("bookings")
    .select("id")
    .eq("funeral_director_contact_id", contactId)

  if (bErr || !bookings?.length) {
    return []
  }

  const bookingIds = bookings.map((b: { id: string }) => b.id)

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("linked_entity_type", "booking")
    .in("linked_entity_id", bookingIds)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("getDocumentsForFD error:", error)
    return []
  }
  return data as Document[]
}
