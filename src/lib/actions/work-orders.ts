"use server"

// Server actions for grounds crew work order status updates.

import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth/get-session"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export interface WorkOrderActionResult {
  error?: string
  success?: string
}

/**
 * Starts a work order — sets status to 'in_progress' and records started_at.
 */
export async function startWorkOrder(
  workOrderId: string
): Promise<WorkOrderActionResult> {
  const session = await getSession()
  if (!session) {
    return { error: "You must be logged in." }
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from("work_orders")
    .update({
      status: "in_progress",
      started_at: new Date().toISOString(),
      assigned_to: session.user.id,
      updated_by: session.user.id,
    })
    .eq("id", workOrderId)

  if (error) {
    console.error("startWorkOrder error:", error)
    return { error: "Failed to start work order." }
  }

  revalidatePath("/grounds")
  return { success: "Work order started." }
}

/**
 * Completes a work order — sets status to 'completed', records completed_at
 * and optional completion notes.
 */
export async function completeWorkOrder(
  workOrderId: string,
  completionNotes?: string
): Promise<WorkOrderActionResult> {
  const session = await getSession()
  if (!session) {
    return { error: "You must be logged in." }
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from("work_orders")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      completion_notes: completionNotes || null,
      updated_by: session.user.id,
    })
    .eq("id", workOrderId)

  if (error) {
    console.error("completeWorkOrder error:", error)
    return { error: "Failed to complete work order." }
  }

  revalidatePath("/grounds")
  return { success: "Work order completed." }
}
