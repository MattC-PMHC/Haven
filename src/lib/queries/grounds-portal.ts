// Query functions for the Grounds Crew portal.
//
// Grounds crew members see work orders assigned to them plus any
// unassigned orders in their tenant. Orders join with cemeteries
// for location context.

import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { WorkOrder } from "@/lib/types/database"

export interface WorkOrderWithCemetery extends WorkOrder {
  cemetery_name?: string
}

/**
 * Fetches work orders relevant to the logged-in grounds crew member.
 * Includes: assigned to them, or unassigned (created/assigned status).
 */
export async function getWorkOrdersForCrew(
  profileId: string
): Promise<WorkOrderWithCemetery[]> {
  const supabase = await createSupabaseServerClient()

  // Get all non-cancelled work orders that are assigned to this user
  // OR are unassigned and still open
  const { data, error } = await supabase
    .from("work_orders")
    .select("*, cemeteries(name)")
    .or(`assigned_to.eq.${profileId},and(assigned_to.is.null,status.in.(created,assigned))`)
    .neq("status", "cancelled")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("getWorkOrdersForCrew error:", error)
    return []
  }

  return (data ?? []).map((row: Record<string, unknown>) => {
    const cemetery = row.cemeteries as { name: string } | null
    const { cemeteries: _cemeteries, ...wo } = row
    return {
      ...(wo as unknown as WorkOrder),
      cemetery_name: cemetery?.name ?? undefined,
    }
  })
}

/**
 * Fetches a single work order by ID.
 */
export async function getWorkOrderById(
  id: string
): Promise<WorkOrderWithCemetery | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("work_orders")
    .select("*, cemeteries(name)")
    .eq("id", id)
    .single()

  if (error) {
    console.error("getWorkOrderById error:", error)
    return null
  }

  const cemetery = (data as Record<string, unknown>).cemeteries as { name: string } | null
  const { cemeteries: _cemeteries, ...wo } = data as Record<string, unknown>
  return {
    ...(wo as unknown as WorkOrder),
    cemetery_name: cemetery?.name ?? undefined,
  }
}

/**
 * Returns work order counts by status and priority.
 */
export async function getWorkOrderStats(profileId: string) {
  const orders = await getWorkOrdersForCrew(profileId)

  const byStatus: Record<string, number> = {}
  const byPriority: Record<string, number> = {}
  for (const wo of orders) {
    byStatus[wo.status] = (byStatus[wo.status] ?? 0) + 1
    byPriority[wo.priority] = (byPriority[wo.priority] ?? 0) + 1
  }

  const completed = orders.filter((wo) => wo.status === "completed").length
  const active = orders.filter((wo) => wo.status !== "completed").length

  return { total: orders.length, active, completed, byStatus, byPriority }
}
