// ActiveWorkOrders — list of active work orders with details.
//
// Shows actual work order items (not just status counts) so officers
// can see what's in progress, what's assigned, and what's overdue.
// Imports from existing mock data to avoid duplication.

import Link from "next/link"
import { CircleDot, UserCheck, Loader, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getActiveWorkOrders,
  getCrewName,
  getCemeteryName,
} from "@/lib/mock/work-orders"
import type { WorkOrderStatus, WorkOrderPriority } from "@/lib/types/database"

const priorityStyles: Record<WorkOrderPriority, { dot: string }> = {
  urgent: { dot: "bg-destructive" },
  high: { dot: "bg-warning" },
  normal: { dot: "bg-info" },
  low: { dot: "bg-muted-foreground" },
}

const statusConfig: Record<
  string,
  { label: string; icon: typeof CircleDot; color: string; bg: string }
> = {
  created: {
    label: "Open",
    icon: CircleDot,
    color: "text-info",
    bg: "bg-info-bg",
  },
  assigned: {
    label: "Assigned",
    icon: UserCheck,
    color: "text-warning",
    bg: "bg-warning-bg",
  },
  in_progress: {
    label: "In Progress",
    icon: Loader,
    color: "text-secondary",
    bg: "bg-secondary-container",
  },
}

function formatType(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function formatDueDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-AU", { day: "numeric", month: "short" })
}

function isOverdue(dateStr: string): boolean {
  const due = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  return due < today
}

export function ActiveWorkOrders() {
  const workOrders = getActiveWorkOrders()

  // Count by status for the summary strip
  const statusCounts: Record<string, number> = {}
  let overdueCount = 0
  for (const wo of workOrders) {
    statusCounts[wo.status] = (statusCounts[wo.status] || 0) + 1
    if (wo.due_date && isOverdue(wo.due_date)) overdueCount++
  }

  return (
    <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-bold text-primary">Active Work Orders</h4>
        <div className="flex items-center gap-2">
          {overdueCount > 0 && (
            <span className="text-xs font-bold text-warning px-3 py-1 bg-warning-bg rounded-full">
              {overdueCount} Overdue
            </span>
          )}
          <span className="text-xs font-bold text-primary px-3 py-1 bg-primary-fixed rounded-full">
            {workOrders.length} Active
          </span>
        </div>
      </div>

      {/* Status summary strip */}
      <div className="flex gap-3 flex-wrap">
        {(["created", "assigned", "in_progress"] as const).map((status) => {
          const count = statusCounts[status] || 0
          if (count === 0) return null
          const config = statusConfig[status]
          const Icon = config.icon
          return (
            <div
              key={status}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold",
                config.bg,
                config.color,
              )}
            >
              <Icon className="size-3.5" />
              {count} {config.label}
            </div>
          )
        })}
      </div>

      {/* Work order list */}
      <div className="space-y-3">
        {workOrders.map((wo) => {
          const overdue = wo.due_date ? isOverdue(wo.due_date) : false
          const priority = priorityStyles[wo.priority]
          const status = statusConfig[wo.status as keyof typeof statusConfig]

          return (
            <div
              key={wo.id}
              className={cn(
                "p-4 rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer",
                overdue
                  ? "bg-destructive/[0.03]"
                  : "bg-surface-container-low",
              )}
            >
              {/* Priority dot */}
              <div
                className={cn(
                  "w-2.5 h-2.5 rounded-full shrink-0",
                  priority.dot,
                )}
                title={`${wo.priority} priority`}
              />

              {/* Details */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground truncate">
                  {wo.title}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed">
                    {formatType(wo.work_order_type)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {getCemeteryName(wo.cemetery_id)}
                  </span>
                </div>
              </div>

              {/* Due date */}
              <div className="text-right shrink-0">
                <p
                  className={cn(
                    "text-xs font-bold",
                    overdue ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  {wo.due_date
                    ? overdue
                      ? "Overdue"
                      : `Due ${formatDueDate(wo.due_date)}`
                    : "No due date"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {getCrewName(wo.assigned_to)}
                </p>
              </div>

              <ChevronRight className="size-5 text-muted-foreground shrink-0" />
            </div>
          )
        })}
      </div>

      {/* Footer link */}
      <Link
        href="/work-orders"
        className="block text-center text-sm font-bold text-primary py-2 hover:underline"
      >
        View All Work Orders
      </Link>
    </section>
  )
}
