"use server"

// Server action for mason permit application submission.
//
// Similar pattern to FD bookings: mason_contact_id is auto-set
// from the logged-in mason's contact record, status is always
// 'submitted'.

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/get-session"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getMasonContactForUser } from "@/lib/queries/mason-portal"
import { permitApplicationSchema } from "@/lib/schemas/permits"

export interface MasonActionResult {
  error?: string
  success?: string
  fieldErrors?: Record<string, string[]>
}

export async function submitPermitApplication(
  _prevState: MasonActionResult | null,
  formData: FormData
): Promise<MasonActionResult> {
  const session = await getSession()
  if (!session) {
    return { error: "You must be logged in." }
  }

  const masonContact = await getMasonContactForUser(session.user.email)
  if (!masonContact) {
    return {
      error:
        "No mason contact record found for your account. Please contact the council.",
    }
  }

  const raw = {
    plot_id: formData.get("plot_id") as string,
    work_type: formData.get("work_type") as string,
    description: formData.get("description") as string,
    dimensions_notes: formData.get("dimensions_notes") as string,
    material_notes: formData.get("material_notes") as string,
    notes: formData.get("notes") as string,
  }

  const result = permitApplicationSchema.safeParse(raw)
  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("memorial_permits").insert({
    tenant_id: session.tenantId,
    plot_id: result.data.plot_id,
    mason_contact_id: masonContact.id,
    work_type: result.data.work_type,
    status: "submitted",
    description: result.data.description || null,
    dimensions_notes: result.data.dimensions_notes || null,
    material_notes: result.data.material_notes || null,
    notes: result.data.notes || null,
    created_by: session.user.id,
    updated_by: session.user.id,
  })

  if (error) {
    console.error("submitPermitApplication error:", error)
    return { error: "Failed to submit application. Please try again." }
  }

  revalidatePath("/mason")
  revalidatePath("/mason/permits")
  redirect("/mason")
}
