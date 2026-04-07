import { z } from "zod/v4"

export const permitApplicationSchema = z.object({
  plot_id: z.string().min(1, "Please select a plot"),
  work_type: z.enum(
    ["new_memorial", "repair", "additional_inscription", "restoration", "removal"],
    { error: "Please select a work type" }
  ),
  description: z.string().min(1, "Description of works is required"),
  dimensions_notes: z.string().optional().or(z.literal("")),
  material_notes: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
})
