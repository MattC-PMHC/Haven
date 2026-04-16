// TodaysSchedule — today's interment services with time slots.
//
// Receives schedule items as props from the server-rendered dashboard page.

import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface ScheduleItem {
  id: string
  time: string
  name: string
  type: string
  status: string
}

interface TodaysScheduleProps {
  items: ScheduleItem[]
}

export function TodaysSchedule({ items }: TodaysScheduleProps) {
  return (
    <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-bold text-primary">Today&apos;s Schedule</h4>
        <span className="text-xs font-bold text-primary px-3 py-1 bg-primary-fixed rounded-full">
          {items.length} Service{items.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Service list */}
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No services scheduled for today.
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((service) => (
            <Link
              key={service.id}
              href={`/bookings/${service.id}`}
              className="p-4 bg-surface-container-low rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer block"
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
              </div>

              {/* Status + chevron */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success-bg text-success">
                  {service.status}
                </span>
                <ChevronRight className="size-5 text-muted-foreground" />
              </div>
            </Link>
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
