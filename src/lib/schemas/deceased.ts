// Zod validation schemas for deceased and booking forms.

import { z } from "zod/v4"

export const deceasedSchema = z.object({
  surname: z.string().min(1, "Surname is required"),
  given_names: z.string().min(1, "Given names are required"),
  maiden_name: z.string().optional().or(z.literal("")),
  date_of_birth: z.string().optional().or(z.literal("")),
  date_of_death: z.string().min(1, "Date of death is required"),
  gender: z.string().optional().or(z.literal("")),
  place_of_death: z.string().optional().or(z.literal("")),
  religion: z.string().optional().or(z.literal("")),
  cultural_background: z.string().optional().or(z.literal("")),
  death_cert_number: z.string().optional().or(z.literal("")),
  burial_order_number: z.string().optional().or(z.literal("")),
  doctor_coroner_ref: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
})

export type DeceasedFormValues = z.infer<typeof deceasedSchema>

export const bookingSchema = z.object({
  cemetery_id: z.string().min(1, "Please select a cemetery"),
  plot_id: z.string().optional().or(z.literal("")),
  booking_type: z.enum(
    ["burial", "ashes_interment", "ashes_scattering", "memorial_service", "exhumation", "monumental_works", "grounds_maintenance"],
    { error: "Please select a booking type" }
  ),
  status: z.enum(
    ["pending", "confirmed", "in_progress", "completed", "cancelled"],
    { error: "Please select a status" }
  ),
  requested_date: z.string().min(1, "Requested date is required"),
  requested_time: z.string().optional().or(z.literal("")),
  duration_minutes: z.coerce.number().int().min(15, "Minimum 15 minutes"),
  deceased_name: z.string().optional().or(z.literal("")),
  special_requirements: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
})

export type BookingFormValues = z.infer<typeof bookingSchema>
