// NeedsAttention — items requiring action (overdue, unassigned, flagged).
//
// This is the "inbox zero" widget — when empty, everything is on track.
// Shows overdue work orders and flagged items so officers know what
// needs their attention first thing in the morning.
// Will be wired to real data in later milestones.

import Link from "next/link"
import { AlertTriangle, Clock, CircleDot } from "lucide-react"
import { cn } from "@/lib/utils"

// Placeholder data — matches mock work orders that are overdue as of 16 Apr 2026
const attentionItems = [
  {
    id: "1",
    title: "Path repair — Greenhill entrance",
    subtitle: "Assigned to Team Alpha, due 8 Apr",
    daysOverdue: 8,
    icon: AlertTriangle,
    dotColor: "bg-destructive/10",
    iconColor: "text-destructive",
  },
  {
    id: "2",
    title: "Grave prep — Papadopoulos",
    subtitle: "Assigned to Team Alpha, due 9 Apr",
    daysOverdue: 7,
    icon: AlertTriangle,
    dotColor: "bg-destructive/10",
    iconColor: "text-destructive",
  },
  {
    id: "3",
    title: "Mowing — Greenhill Lawn Sec. 1",
    subtitle: "In progress, due 7 Apr",
    daysOverdue: 9,
    icon: Clock,
    dotColor: "bg-warning-bg",
    iconColor: "text-warning",
  },
  {
    id: "4",
    title: "Memorial inspection — St. Mary's",
    subtitle: "Unassigned, due 20 Apr",
    daysOverdue: 0,
    icon: CircleDot,
    dotColor: "bg-info-bg",
    iconColor: "text-info",
  },
]

export function NeedsAttention() {
  const overdueCount = attentionItems.filter((i) => i.daysOverdue > 0).length

  return (
    <section className="bg-surface-container-low rounded-3xl p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-bold text-primary">Needs Attention</h4>
        {overdueCount > 0 && (
          <span className="text-xs font-bold text-warning px-3 py-1 bg-warning-bg rounded-full">
            {overdueCount} Overdue
          </span>
        )}
      </div>

      {/* Items */}
      <div className="space-y-3">
        {attentionItems.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 rounded-2xl bg-surface-container-lowest hover:shadow-sm transition-shadow cursor-pointer"
          >
            {/* Icon dot */}
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                item.dotColor,
              )}
            >
              <item.icon className={cn("size-3.5", item.iconColor)} />
            </div>

            {/* Details */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {item.subtitle}
              </p>
            </div>

            {/* Overdue badge */}
            {item.daysOverdue > 0 ? (
              <span className="text-[10px] font-bold text-destructive shrink-0 mt-1">
                {item.daysOverdue}d overdue
              </span>
            ) : (
              <span className="text-[10px] font-bold text-info shrink-0 mt-1">
                Due soon
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Footer link */}
      <Link
        href="/work-orders"
        className="block w-full text-center text-sm font-bold text-primary py-2 hover:underline"
      >
        View All Work Orders
      </Link>
    </section>
  )
}
