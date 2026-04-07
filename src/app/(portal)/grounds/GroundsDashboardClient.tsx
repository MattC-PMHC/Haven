"use client"

// Grounds crew interactive dashboard — client component for
// expand/collapse and work order status actions.

import { useState, useTransition } from "react"
import Link from "next/link"
import {
  ClipboardList,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Play,
  ChevronRight,
  Loader2,
  Camera,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { startWorkOrder, completeWorkOrder } from "@/lib/actions/work-orders"
import { toast } from "sonner"
import type { WorkOrderWithCemetery } from "@/lib/queries/grounds-portal"

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

const priorityStyles: Record<string, string> = {
  urgent: "bg-status-restricted-bg text-destructive border-status-restricted-border",
  high: "bg-warning-bg text-warning border-warning-border",
  normal: "bg-info-bg text-info border-info-border",
  low: "bg-surface-container-high text-muted-foreground",
}

const priorityLabels: Record<string, string> = {
  urgent: "Urgent",
  high: "High",
  normal: "Normal",
  low: "Low",
}

const statusStyles: Record<string, string> = {
  created: "bg-surface-container-high text-muted-foreground",
  assigned: "bg-info-bg text-info border-info-border",
  in_progress: "bg-warning-bg text-warning border-warning-border",
  completed: "bg-success-bg text-success border-success-border",
  cancelled: "bg-surface-container-high text-muted-foreground",
}

const statusLabels: Record<string, string> = {
  created: "New",
  assigned: "Assigned",
  in_progress: "In Progress",
  completed: "Done",
  cancelled: "Cancelled",
}

const typeLabels: Record<string, string> = {
  grave_preparation: "Grave Prep",
  grave_backfill: "Backfill",
  memorial_installation: "Memorial Install",
  memorial_inspection: "Inspection",
  grounds_maintenance: "Mowing / Grounds",
  tree_management: "Tree Works",
  infrastructure: "Infrastructure",
  general_maintenance: "General",
}

interface Props {
  workOrders: WorkOrderWithCemetery[]
}

export function GroundsDashboardClient({ workOrders }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [actionId, setActionId] = useState<string | null>(null)

  const active = workOrders.filter((wo) => wo.status !== "completed" && wo.status !== "cancelled")
  const completedCount = workOrders.filter((wo) => wo.status === "completed").length

  // Sort: urgent first, then by due date
  const sorted = [...active].sort((a, b) => {
    const priorityOrder: Record<string, number> = { urgent: 0, high: 1, normal: 2, low: 3 }
    const diff = (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9)
    if (diff !== 0) return diff
    return (a.due_date ?? "").localeCompare(b.due_date ?? "")
  })

  function handleStart(workOrderId: string) {
    setActionId(workOrderId)
    startTransition(async () => {
      const result = await startWorkOrder(workOrderId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Work order started")
      }
      setActionId(null)
    })
  }

  function handleComplete(workOrderId: string) {
    setActionId(workOrderId)
    startTransition(async () => {
      const result = await completeWorkOrder(workOrderId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Work order completed")
      }
      setActionId(null)
    })
  }

  return (
    <div className="p-4 md:p-10 space-y-6">
      {/* ── Header ── */}
      <div className="animate-fade-up">
        <h2 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight mb-1">
          Today&apos;s Work
        </h2>
        <p className="text-muted-foreground text-sm">
          {active.length} active work order{active.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Quick Stats (large, tappable) ── */}
      <div className="grid grid-cols-3 gap-3 animate-fade-up stagger-1">
        <div className="bg-warning-bg rounded-xl p-4 text-center shadow-card">
          <AlertTriangle className="size-6 text-warning mx-auto mb-1" />
          <p className="text-xl font-bold text-warning">
            {active.filter((wo) => wo.priority === "urgent" || wo.priority === "high").length}
          </p>
          <p className="text-xs text-warning/80">Urgent/High</p>
        </div>
        <div className="bg-info-bg rounded-xl p-4 text-center shadow-card">
          <Play className="size-6 text-info mx-auto mb-1" />
          <p className="text-xl font-bold text-info">
            {active.filter((wo) => wo.status === "in_progress").length}
          </p>
          <p className="text-xs text-info/80">In Progress</p>
        </div>
        <div className="bg-success-bg rounded-xl p-4 text-center shadow-card">
          <CheckCircle2 className="size-6 text-success mx-auto mb-1" />
          <p className="text-xl font-bold text-success">
            {completedCount}
          </p>
          <p className="text-xs text-success/80">Completed</p>
        </div>
      </div>

      {/* ── Work Order Cards (mobile-friendly, large tap targets) ── */}
      <div className="space-y-3 animate-fade-up stagger-2">
        {sorted.map((wo) => {
          const isExpanded = expandedId === wo.id
          const isActioning = actionId === wo.id && isPending

          return (
            <div
              key={wo.id}
              className="bg-surface-container-lowest rounded-xl shadow-card overflow-hidden"
            >
              {/* Main row — tappable */}
              <button
                className="w-full px-4 py-4 flex items-center gap-3 text-left"
                onClick={() => setExpandedId(isExpanded ? null : wo.id)}
              >
                {/* Priority indicator */}
                <div
                  className={`shrink-0 size-3 rounded-full ${
                    wo.priority === "urgent" ? "bg-destructive" :
                    wo.priority === "high" ? "bg-warning" :
                    "bg-info"
                  }`}
                />

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm line-clamp-1">
                    {wo.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`text-xs ${statusStyles[wo.status]}`}>
                      {statusLabels[wo.status]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Due {formatDate(wo.due_date)}
                    </span>
                  </div>
                </div>

                <ChevronRight
                  className={`size-5 text-muted-foreground transition-transform ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                  {wo.description && (
                    <p className="text-sm text-muted-foreground">{wo.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {wo.cemetery_name ?? "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        ~{wo.estimated_hours ?? "?"}h
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ClipboardList className="size-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {typeLabels[wo.work_order_type] ?? wo.work_order_type}
                      </span>
                    </div>
                    <div>
                      <Badge className={`text-xs ${priorityStyles[wo.priority]}`}>
                        {priorityLabels[wo.priority]}
                      </Badge>
                    </div>
                  </div>

                  {/* Large action buttons for mobile */}
                  <div className="flex gap-2 pt-1">
                    {(wo.status === "created" || wo.status === "assigned") && (
                      <Button
                        className="flex-1 rounded-xl h-12 text-base"
                        onClick={() => handleStart(wo.id)}
                        disabled={isActioning}
                      >
                        {isActioning ? (
                          <Loader2 className="size-5 animate-spin" />
                        ) : (
                          <Play className="size-5" />
                        )}
                        Start Work
                      </Button>
                    )}
                    {wo.status === "in_progress" && (
                      <Button
                        className="flex-1 rounded-xl h-12 text-base bg-success hover:bg-success/90"
                        onClick={() => handleComplete(wo.id)}
                        disabled={isActioning}
                      >
                        {isActioning ? (
                          <Loader2 className="size-5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="size-5" />
                        )}
                        Mark Complete
                      </Button>
                    )}
                    <Button variant="secondary" className="rounded-xl h-12" asChild>
                      <Link href="/grounds/photo">
                        <Camera className="size-4" />
                        Photo
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {sorted.length === 0 && (
          <div className="bg-surface-container-lowest rounded-xl shadow-card p-8 text-center">
            <CheckCircle2 className="size-8 text-success mx-auto mb-3" />
            <p className="text-muted-foreground">All caught up! No active work orders.</p>
          </div>
        )}
      </div>
    </div>
  )
}
