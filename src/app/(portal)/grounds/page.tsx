// Grounds Crew Portal — Work Order Dashboard (server component)
//
// Fetches real work orders from Supabase and renders an interactive
// client component for the mobile-first dashboard.

import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/get-session"
import { getWorkOrdersForCrew } from "@/lib/queries/grounds-portal"
import { GroundsDashboardClient } from "./GroundsDashboardClient"

export default async function GroundsCrewDashboard() {
  const session = await getSession()
  if (!session) redirect("/login")

  const workOrders = await getWorkOrdersForCrew(session.user.id)

  return <GroundsDashboardClient workOrders={workOrders} />
}
