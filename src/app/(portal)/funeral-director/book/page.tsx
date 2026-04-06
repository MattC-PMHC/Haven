// Funeral Director — New Booking Request page.
//
// Server component that fetches active cemeteries from Supabase
// and passes them to the client form component.

import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/get-session"
import { getActiveCemeteries } from "@/lib/queries/cemeteries"
import { FDBookingForm } from "./FDBookingForm"

export default async function FDBookingRequestPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const cemeteries = await getActiveCemeteries()

  return <FDBookingForm cemeteries={cemeteries} />
}
