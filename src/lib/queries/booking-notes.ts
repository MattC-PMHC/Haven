// Query functions for booking notes.

import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { BookingNote } from "@/lib/types/database"

export interface BookingNoteWithAuthor extends BookingNote {
  author_name: string | null
}

export async function getNotesForBooking(
  bookingId: string
): Promise<BookingNoteWithAuthor[]> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("booking_notes")
    .select("*, profiles!author_id(full_name)")
    .eq("booking_id", bookingId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("getNotesForBooking error:", error)
    return []
  }

  return (data ?? []).map((note: Record<string, unknown>) => ({
    ...(note as unknown as BookingNote),
    author_name:
      (note.profiles as { full_name: string | null } | null)?.full_name ?? null,
  }))
}
