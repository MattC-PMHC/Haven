// TodaysSchedule — today's interment services with time slots.
//
// Focuses on what's happening TODAY specifically, giving officers
// a clear view of the day's scheduled services when they log in.
// Will be wired to Supabase booking queries in later milestones.

import Link from "next/link"
import { ChevronRight } from "lucide-react"

// Placeholder data — replaced with real queries later
const todaysServices = [
  {
    id: "1",
    time: "10:30 AM",
    name: "Eleanor Vance",
    type: "Burial",
    location: "Riverside Memorial Park — Section A, Plot 402",
    status: "Confirmed",
    funeralDirector: "Greenwood & Sons",
  },
  {
    id: "2",
    time: "02:00 PM",
    name: "Samuel Thorne",
    type: "Ashes",
    location: "Greenhill Lawn — North Garden, Niche 12",
    status: "Confirmed",
    funeralDirector: "Heritage Funerals",
  },
]

export function TodaysSchedule() {
  return (
    <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-bold text-primary">Today&apos;s Schedule</h4>
        <span className="text-xs font-bold text-primary px-3 py-1 bg-primary-fixed rounded-full">
          {todaysServices.length} Service{todaysServices.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Service list */}
      {todaysServices.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No services scheduled for today.
        </p>
      ) : (
        <div className="space-y-4">
          {todaysServices.map((service) => (
            <div
              key={service.id}
              className="p-4 bg-surface-container-low rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Time block */}
              <div className="w-20 shrink-0 text-center">
                <span className="text-sm font-bold text-primary">
                  {service.time}
                </span>
              </div>

              {/* Details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-foreground truncate">
                    {service.name}
                  </p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed shrink-0">
                    {service.type}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {service.location}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {service.funeralDirector}
                </p>
              </div>

              {/* Status + chevron */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success-bg text-success">
                  {service.status}
                </span>
                <ChevronRight className="size-5 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      )}

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
