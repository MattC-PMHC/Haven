// UpcomingBookings — shows bookings in the next 7 days.
//
// Each entry has a date block (day + month), the person's name,
// booking type badge, location, and a chevron.
// Will be wired to Supabase booking queries in Milestone 7.

import Link from "next/link"
import { ChevronRight } from "lucide-react"

// Placeholder data — replaced with real queries in M7
const bookings = [
  {
    id: "1",
    day: "14",
    month: "APR",
    name: "Eleanor Vance",
    type: "Burial",
    location: "Section A, Plot 402",
    time: "10:30 AM",
  },
  {
    id: "2",
    day: "15",
    month: "APR",
    name: "Samuel Thorne",
    type: "Ashes",
    location: "North Lawn, Plot 12",
    time: "02:00 PM",
  },
]

export function UpcomingBookings() {
  return (
    <section className="bg-surface-container-low rounded-3xl p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-bold text-primary">Upcoming Bookings</h4>
        <span className="text-xs font-bold text-primary px-3 py-1 bg-primary-fixed rounded-full">
          {bookings.length} This Week
        </span>
      </div>

      {/* Booking list */}
      <div className="space-y-4">
        {bookings.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-surface-container-lowest rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            {/* Date block */}
            <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shrink-0">
              <span className="text-xs font-bold text-center leading-tight">
                {item.day}
                <br />
                {item.month}
              </span>
            </div>

            {/* Details */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-foreground truncate">
                  {item.name}
                </p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed shrink-0">
                  {item.type}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {item.location} &bull; {item.time}
              </p>
            </div>

            <ChevronRight className="ml-auto size-5 text-muted-foreground shrink-0" />
          </div>
        ))}
      </div>

      {/* Footer link */}
      <Link
        href="/bookings"
        className="block w-full text-center text-sm font-bold text-primary py-2 hover:underline"
      >
        View All Bookings
      </Link>
    </section>
  )
}
