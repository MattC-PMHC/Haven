// Query functions for bookings.

import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { Booking, BookingStatus } from "@/lib/types/database"

export async function getBookings(): Promise<Booking[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("requested_date", { ascending: false })

  if (error) {
    console.error("getBookings error:", error)
    return []
  }
  return data as Booking[]
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("getBookingById error:", error)
    return null
  }
  return data as Booking
}

export async function getBookingsForFD(contactId: string): Promise<Booking[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("funeral_director_contact_id", contactId)
    .order("requested_date", { ascending: false })

  if (error) {
    console.error("getBookingsForFD error:", error)
    return []
  }
  return data as Booking[]
}

export async function getBookingStats() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("bookings")
    .select("status")

  if (error) {
    console.error("getBookingStats error:", error)
    return { total: 0, byStatus: {} as Record<string, number> }
  }

  const byStatus: Record<string, number> = {}
  for (const row of data) {
    byStatus[row.status] = (byStatus[row.status] ?? 0) + 1
  }

  return {
    total: data.length,
    byStatus,
  }
}
