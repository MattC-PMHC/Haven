// Mason Portal — New Permit Application (server component)
//
// Fetches available plots from Supabase for the plot selector,
// then renders the client-side form.

import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/get-session"
import { getAvailablePlots } from "@/lib/queries/fd-portal"
import { MasonApplyForm } from "./MasonApplyForm"

export default async function MasonApplyPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const plots = await getAvailablePlots()

  return <MasonApplyForm plots={plots} />
}
