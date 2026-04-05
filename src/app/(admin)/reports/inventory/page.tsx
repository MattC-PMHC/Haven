"use client"

// Plot inventory status report — pie chart + data table.
//
// Shows distribution of plot statuses across all cemeteries
// using mock data from plots.ts.

import { useMemo } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { mockPlots, getPlotStats } from "@/lib/mock/plots"

const statusConfig: Record<string, { label: string; color: string }> = {
  available: { label: "Available", color: "var(--status-available)" },
  reserved: { label: "Reserved", color: "var(--status-reserved)" },
  sold: { label: "Sold", color: "#8b5cf6" },
  occupied: { label: "Occupied", color: "var(--status-occupied)" },
  full: { label: "Full", color: "var(--warning)" },
  expired: { label: "Expired", color: "var(--muted-foreground)" },
  surrendered: { label: "Surrendered", color: "#6b7280" },
  unavailable: { label: "Unavailable", color: "var(--destructive)" },
}

interface StatusRow {
  status: string
  label: string
  count: number
  percentage: string
  color: string
}

export default function InventoryReportPage() {
  const stats = useMemo(() => getPlotStats(), [])

  const rows: StatusRow[] = useMemo(() => {
    return Object.entries(stats.byStatus)
      .map(([status, count]) => ({
        status,
        label: statusConfig[status]?.label ?? status,
        count,
        percentage: ((count / stats.total) * 100).toFixed(1),
        color: statusConfig[status]?.color ?? "#9ca3af",
      }))
      .sort((a, b) => b.count - a.count)
  }, [stats])

  const chartData = rows.map((r) => ({
    name: r.label,
    value: r.count,
    color: r.color,
  }))

  return (
    <div className="p-10 max-w-[1600px] mx-auto w-full space-y-8">
      {/* ── Header ── */}
      <div className="animate-fade-up">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/reports">
              <ArrowLeft className="size-4" />
              Reports
            </Link>
          </Button>
        </div>
        <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
          Plot Inventory Status
        </h2>
        <p className="text-muted-foreground">
          Distribution of plot statuses across all {mockPlots.length} plots.
        </p>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-up stagger-1">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Total Plots</p>
          <p className="text-2xl font-bold text-primary">{stats.total}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Available</p>
          <p className="text-2xl font-bold text-success">{stats.byStatus.available ?? 0}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Occupied</p>
          <p className="text-2xl font-bold text-warning">{stats.byStatus.occupied ?? 0}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Reserved</p>
          <p className="text-2xl font-bold text-info">{stats.byStatus.reserved ?? 0}</p>
        </div>
      </div>

      {/* ── Chart + Table Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-surface-container-lowest rounded-xl shadow-card p-6 animate-fade-up stagger-2">
          <h3 className="font-semibold text-foreground mb-4">Status Distribution</h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--surface-container-lowest)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                    boxShadow: "var(--shadow-md)",
                  }}
                  formatter={(value) => [`${value} plots`, ""]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: string) => (
                    <span style={{ color: "var(--foreground)", fontSize: "0.8rem" }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-card animate-fade-up stagger-3">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Status</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead className="text-right pr-6">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow
                  key={row.status}
                  className={i % 2 === 1 ? "bg-surface-container-low/50" : ""}
                >
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-3 rounded-full shrink-0"
                        style={{ backgroundColor: row.color }}
                      />
                      <span className="font-medium">{row.label}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{row.count}</TableCell>
                  <TableCell className="text-right pr-6">{row.percentage}%</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-surface-container-low font-semibold">
                <TableCell className="pl-6">Total</TableCell>
                <TableCell className="text-right">{stats.total}</TableCell>
                <TableCell className="text-right pr-6">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
