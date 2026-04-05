// Mason Portal — Permit Tracking
//
// Full list of all permits with status tracking.

import { Landmark } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  mockPermits,
  getWorkTypeLabel,
  getPermitStatusLabel,
} from "@/lib/mock/permits"

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const statusStyles: Record<string, string> = {
  submitted: "bg-warning-bg text-warning border-warning-border",
  under_review: "bg-info-bg text-info border-info-border",
  approved: "bg-success-bg text-success border-success-border",
  rejected: "bg-status-restricted-bg text-destructive border-status-restricted-border",
  completed: "bg-surface-container-high text-muted-foreground",
}

export default function MasonPermitsPage() {
  // Sort: active first, then by date
  const sorted = [...mockPermits].sort((a, b) => {
    const statusOrder: Record<string, number> = {
      submitted: 0,
      under_review: 1,
      approved: 2,
      rejected: 3,
      completed: 4,
    }
    const diff = (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9)
    if (diff !== 0) return diff
    return b.submitted_at.localeCompare(a.submitted_at)
  })

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* ── Header ── */}
      <div className="animate-fade-up">
        <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
          My Permits
        </h2>
        <p className="text-muted-foreground">
          Track the status of all your memorial permit applications.
        </p>
      </div>

      {/* ── Table ── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card animate-fade-up stagger-1">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Work Type</TableHead>
              <TableHead>Plot</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Reviewed</TableHead>
              <TableHead className="pr-6">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((permit, i) => (
              <TableRow
                key={permit.id}
                className={i % 2 === 1 ? "bg-surface-container-low/50" : ""}
              >
                <TableCell className="pl-6">
                  <div className="flex items-center gap-2">
                    <Landmark className="size-4 text-muted-foreground shrink-0" />
                    <span className="font-medium text-sm">
                      {getWorkTypeLabel(permit.work_type)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-mono text-muted-foreground">
                  {permit.plot_id}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[250px] truncate">
                  {permit.description}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(permit.submitted_at)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {permit.reviewed_at ? formatDate(permit.reviewed_at) : "—"}
                </TableCell>
                <TableCell className="pr-6">
                  <Badge className={statusStyles[permit.status] ?? ""}>
                    {getPermitStatusLabel(permit.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ── Approval Notes (for reviewed permits) ── */}
      {sorted.some((p) => p.approval_notes) && (
        <div className="space-y-4 animate-fade-up stagger-2">
          <h3 className="font-semibold text-foreground">Council Feedback</h3>
          {sorted
            .filter((p) => p.approval_notes)
            .map((permit) => (
              <div
                key={permit.id}
                className="bg-surface-container-lowest rounded-xl shadow-card p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={statusStyles[permit.status] ?? ""}>
                    {getPermitStatusLabel(permit.status)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {getWorkTypeLabel(permit.work_type)} — {permit.plot_id}
                  </span>
                </div>
                <p className="text-sm text-foreground">{permit.approval_notes}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
