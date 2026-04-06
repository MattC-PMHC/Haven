// Zod validation schemas for contact forms.

import { z } from "zod/v4"

export const contactSchema = z.object({
  contact_type: z.enum(
    ["rights_holder", "next_of_kin", "funeral_director", "mason", "contractor", "supplier", "other"],
    { error: "Please select a contact type" }
  ),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  organisation: z.string().optional().or(z.literal("")),
  email: z.email("Please enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address_line1: z.string().optional().or(z.literal("")),
  address_line2: z.string().optional().or(z.literal("")),
  suburb: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  postcode: z.string().optional().or(z.literal("")),
  licence_number: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
})

export type ContactFormValues = z.infer<typeof contactSchema>
