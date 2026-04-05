// WorkOrdersSummary — work orders grouped by status.
//
// PRD specifies "Work orders by status, type, and assignee" as
// a dashboard widget. This shows a compact summary with counts
// per status. Will be wired to real data in later milestones.

import Link from "next/link"
import { CircleDot, UserCheck, Loader, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Placeholder data
const statuses = [
  {
    label: "Open",
    count: 12,
    icon: CircleDot,
    color: "text-info",
    bg: "bg-info-bg",
  },
  {
    label: "Assigned",
    count: 8,
    icon: UserCheck,
    color: "text-warning",
    bg: "bg-warning-bg",
  },
  {
    label: "In Progress",
    count: 5,
    icon: Loader,
    color: "text-secondary",
    bg: "bg-secondary-container",
  },
  {
    label: "Completed",
    count: 34,
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success-bg",
  },
]

export function WorkOrdersSummary() {
  return (
    <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-bold text-primary">Work Orders</h4>
        <span className="text-xs font-bold text-warning px-3 py-1 bg-warning-bg rounded-full">
          3 Overdue
        </span>
      </div>

      {/* Status grid */}
      <div className="grid grid-cols-2 gap-4">
        {statuses.map((s) => (
          <div
            key={s.label}
            className={cn("rounded-2xl p-4 flex items-center gap-3", s.bg)}
          >
            <s.icon className={cn("size-5 shrink-0", s.color)} />
            <div>
              <p className="text-2xl font-bold text-foreground">{s.count}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Link */}
      <Link
        href="/work-orders"
        className="block text-center text-sm font-bold text-primary py-2 hover:underline"
      >
        View All Work Orders
      </Link>
    </section>
  )
}
