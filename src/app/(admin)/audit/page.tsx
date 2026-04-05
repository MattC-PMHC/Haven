"use client"

// Audit trail viewer — filterable table of all system operations.
//
// Filters: entity type, action type. All data is mock.

import { useState } from "react"
import { Shield, Filter } from "lucide-react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockAuditLogs, getUserName, getAuditStats } from "@/lib/mock/audit"

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }) + " " + d.toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

const actionStyles: Record<string, string> = {
  create: "bg-success-bg text-success border-success-border",
  update: "bg-info-bg text-info border-info-border",
  delete: "bg-status-restricted-bg text-destructive border-status-restricted-border",
}

const actionLabels: Record<string, string> = {
  create: "Created",
  update: "Updated",
  delete: "Deleted",
}

const entityLabels: Record<string, string> = {
  deceased: "Deceased",
  booking: "Booking",
  plot: "Plot",
  cemetery: "Cemetery",
  section: "Section",
  document: "Document",
}

function ChangeSummary({ changes }: { changes: Record<string, unknown> | null }) {
  if (!changes) return <span className="text-muted-foreground">—</span>

  const entries = Object.entries(changes)
  return (
    <div className="space-y-0.5">
      {entries.slice(0, 2).map(([key, value]) => (
        <div key={key} className="text-xs">
          <span className="text-muted-foreground">{key}:</span>{" "}
          {typeof value === "object" && value !== null && "from" in value ? (
            <span>
              <span className="text-destructive/70 line-through">
                {String((value as Record<string, unknown>).from ?? "null")}
              </span>
              {" → "}
              <span className="text-success font-medium">
                {String((value as Record<string, unknown>).to)}
              </span>
            </span>
          ) : (
            <span className="font-medium">{String(value)}</span>
          )}
        </div>
      ))}
      {entries.length > 2 && (
        <span className="text-xs text-muted-foreground">+{entries.length - 2} more</span>
      )}
    </div>
  )
}

export default function AuditPage() {
  const stats = getAuditStats()
  const [entityFilter, setEntityFilter] = useState<string>("all")
  const [actionFilter, setActionFilter] = useState<string>("all")

  const filtered = mockAuditLogs.filter((log) => {
    if (entityFilter !== "all" && log.entity_type !== entityFilter) return false
    if (actionFilter !== "all" && log.action !== actionFilter) return false
    return true
  })

  // Sort newest first
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="p-4 md:p-10 max-w-[1600px] mx-auto w-full space-y-8">
      {/* ── Header ── */}
      <div className="flex justify-between items-end animate-fade-up">
        <div>
          <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
            Audit Trail
          </h2>
          <p className="text-muted-foreground">
            Complete log of all create, update, and delete operations.
          </p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-up stagger-1">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Total Entries</p>
          <p className="text-2xl font-bold text-primary">{stats.total}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Creates</p>
          <p className="text-2xl font-bold text-success">{stats.byAction.create ?? 0}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Updates</p>
          <p className="text-2xl font-bold text-info">{stats.byAction.update ?? 0}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Deletes</p>
          <p className="text-2xl font-bold text-destructive">{stats.byAction.delete ?? 0}</p>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-4 animate-fade-up stagger-2">
        <Filter className="size-4 text-muted-foreground" />
        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All entities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entities</SelectItem>
            {Object.entries(entityLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {Object.entries(actionLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(entityFilter !== "all" || actionFilter !== "all") && (
          <span className="text-sm text-muted-foreground">
            Showing {sorted.length} of {stats.total}
          </span>
        )}
      </div>

      {/* ── Table ── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card animate-fade-up stagger-3">
        <div className="flex items-center gap-2 p-5 pb-0">
          <Shield className="size-5 text-primary" />
          <h3 className="font-semibold text-foreground">Activity Log</h3>
        </div>
        <div className="pt-4">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead className="pr-6">Changes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((log, i) => (
                <TableRow
                  key={log.id}
                  className={i % 2 === 1 ? "bg-surface-container-low/50" : ""}
                >
                  <TableCell className="pl-6 text-sm whitespace-nowrap">
                    {formatDateTime(log.created_at)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {getUserName(log.user_id)}
                  </TableCell>
                  <TableCell>
                    <Badge className={actionStyles[log.action] ?? ""}>
                      {actionLabels[log.action] ?? log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {entityLabels[log.entity_type] ?? log.entity_type}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">
                    {log.entity_id}
                  </TableCell>
                  <TableCell className="pr-6 max-w-[300px]">
                    <ChangeSummary changes={log.changes} />
                  </TableCell>
                </TableRow>
              ))}
              {sorted.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No audit entries match the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
