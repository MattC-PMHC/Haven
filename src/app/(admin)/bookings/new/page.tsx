// Create new booking page.
//
// Fetches active cemeteries from Supabase for the dropdown.

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BookingForm } from "@/components/records/BookingForm"
import { getActiveCemeteries } from "@/lib/queries/cemeteries"

export default async function NewBookingPage() {
  const cemeteries = await getActiveCemeteries()

  return (
    <div className="p-4 md:p-10 max-w-[900px] mx-auto w-full space-y-8">
      <div className="animate-fade-up">
        <Link
          href="/bookings"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to Bookings
        </Link>
        <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
          New Booking
        </h2>
        <p className="text-muted-foreground">
          Schedule a new interment or service booking.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-card p-8 animate-fade-up stagger-1">
        <BookingForm cemeteries={cemeteries} />
      </div>
    </div>
  )
}
