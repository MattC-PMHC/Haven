// ActivityTimeline — a vertical timeline of recent system events.
//
// Each event has a colored dot, a timestamp, a title, and a subtitle.
// The vertical line connecting dots uses the timeline-line utility
// defined in globals.css.

import { CheckCircle, FileText, AlertTriangle, CalendarCheck } from "lucide-react"
import { cn } from "@/lib/utils"

// Placeholder data — will be replaced with real audit_log queries later
const activities = [
  {
    id: "1",
    time: "10 minutes ago",
    title: "Interment Booking Confirmed",
    subtitle: "Eleanor Vance — Section A, Plot 402",
    icon: CalendarCheck,
    dotColor: "bg-success-bg",
    iconColor: "text-success",
  },
  {
    id: "2",
    time: "2 hours ago",
    title: "Right of Interment Renewed",
    subtitle: "Plot B-118 — Extended to 2050",
    icon: FileText,
    dotColor: "bg-info-bg",
    iconColor: "text-info",
  },
  {
    id: "3",
    time: "4 hours ago",
    title: "Work Order Completed",
    subtitle: "Grounds crew — Section C lawn restoration",
    icon: CheckCircle,
    dotColor: "bg-success-bg",
    iconColor: "text-success",
  },
  {
    id: "4",
    time: "Yesterday",
    title: "Memorial Inspection Overdue",
    subtitle: "Section D — 3 headstones require assessment",
    icon: AlertTriangle,
    dotColor: "bg-warning-bg",
    iconColor: "text-warning",
  },
]

export function ActivityTimeline() {
  return (
    <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
      <h4 className="text-xl font-bold text-primary mb-6">Recent Activity</h4>

      {/* Timeline list with vertical connecting line */}
      <div className="relative space-y-8 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-surface-container-high">
        {activities.map((item) => (
          <div key={item.id} className="relative pl-10">
            {/* Colored dot */}
            <div
              className={cn(
                "absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ring-2 ring-surface-container-lowest",
                item.dotColor
              )}
            >
              <item.icon className={cn("size-3.5", item.iconColor)} />
            </div>

            {/* Event details */}
            <p className="text-xs text-muted-foreground mb-1">{item.time}</p>
            <p className="text-sm font-semibold text-foreground">
              {item.title}
            </p>
            <p className="text-xs text-muted-foreground">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
