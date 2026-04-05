// PlotStatusBadge — full-rounded status badges using the design system
// status color tokens from globals.css.

import { Badge } from "@/components/ui/badge"
import type { PlotStatus } from "@/lib/types/database"

const statusStyles: Record<PlotStatus, string> = {
  available: "bg-status-available-bg text-status-available border-status-available/20",
  reserved: "bg-status-reserved-bg text-status-reserved border-status-reserved/20",
  sold: "bg-info-bg text-info border-info-border",
  occupied: "bg-status-occupied-bg text-status-occupied border-status-occupied/20",
  full: "bg-status-occupied-bg text-status-occupied border-status-occupied/20",
  expired: "bg-status-expired-bg text-status-expired border-status-expired/20",
  surrendered: "bg-surface-container-high text-muted-foreground",
  unavailable: "bg-status-restricted-bg text-status-restricted border-status-restricted/20",
}

const statusLabels: Record<PlotStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
  occupied: "Occupied",
  full: "Full",
  expired: "Expired",
  surrendered: "Surrendered",
  unavailable: "Unavailable",
}

interface PlotStatusBadgeProps {
  status: PlotStatus
}

export function PlotStatusBadge({ status }: PlotStatusBadgeProps) {
  return (
    <Badge className={statusStyles[status]}>
      {statusLabels[status]}
    </Badge>
  )
}
