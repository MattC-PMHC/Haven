// Zod validation schema for booking notes.

import { z } from "zod/v4"

export const bookingNoteSchema = z.object({
  booking_id: z.string().min(1, "Booking ID is required"),
  content: z.string().min(1, "Note content is required"),
  is_internal: z.coerce.boolean().default(true),
})

export type BookingNoteFormValues = z.infer<typeof bookingNoteSchema>
