// Zod validation schemas for cemetery and section forms.
//
// Used by both server actions (validation) and client forms
// (react-hook-form integration via zodResolver).

import { z } from "zod/v4"

export const cemeterySchema = z.object({
  name: z.string().min(2, "Cemetery name must be at least 2 characters"),
  address: z.string().optional().or(z.literal("")),
  suburb: z.string().optional().or(z.literal("")),
  state: z.enum(["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"], {
    error: "Please select a state",
  }),
  postcode: z
    .string()
    .regex(/^\d{4}$/, "Postcode must be 4 digits")
    .optional()
    .or(z.literal("")),
  status: z.enum(["active", "closed"]),
  opening_hours: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  email: z.email("Please enter a valid email").optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
})

export type CemeteryFormValues = z.infer<typeof cemeterySchema>

export const sectionSchema = z.object({
  name: z.string().min(2, "Section name must be at least 2 characters"),
  code: z.string().optional().or(z.literal("")),
  section_type: z.enum(
    [
      "lawn",
      "monumental",
      "columbarium",
      "memorial_garden",
      "memorial_wall",
      "scattering_garden",
      "natural_burial",
      "vault",
      "infant",
      "denominational",
      "war_grave",
    ],
    { error: "Please select a section type" }
  ),
  status: z.enum(["active", "closed", "full"]),
  notes: z.string().optional().or(z.literal("")),
})

export type SectionFormValues = z.infer<typeof sectionSchema>
