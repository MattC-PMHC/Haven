// Zod validation schemas for plot forms.

import { z } from "zod/v4"

export const plotSchema = z.object({
  section_id: z.string().min(1, "Please select a section"),
  plot_number: z.string().min(1, "Plot number is required"),
  plot_type: z.enum(
    [
      "lawn_single",
      "lawn_double",
      "lawn_triple",
      "monumental",
      "vault",
      "columbarium_niche",
      "memorial_garden",
      "memorial_wall",
      "scattering_garden",
      "natural_burial",
      "infant",
      "denominational",
      "war_grave",
    ],
    { error: "Please select a plot type" }
  ),
  status: z.enum(
    ["available", "reserved", "sold", "occupied", "full", "expired", "surrendered", "unavailable"],
    { error: "Please select a status" }
  ),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
  length_m: z.coerce.number().positive("Must be positive").optional().or(z.literal("")),
  width_m: z.coerce.number().positive("Must be positive").optional().or(z.literal("")),
  depth_m: z.coerce.number().positive("Must be positive").optional().or(z.literal("")),
  row_number: z.string().optional().or(z.literal("")),
  position: z.string().optional().or(z.literal("")),
  soil_type: z.string().optional().or(z.literal("")),
  infrastructure_notes: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
})

export type PlotFormValues = z.infer<typeof plotSchema>
