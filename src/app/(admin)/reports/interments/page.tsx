"use client"

// Interments by period report — bar chart + data table + CSV export.
//
// Aggregates mock interment data by month and displays as a recharts
// bar chart with Haven design tokens.

import { useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { mockInterments } from "@/lib/mock/deceased"

interface MonthData {
  month: string
  label: string
  burials: number
  ashes: number
  total: number
}

function aggregateByMonth(): MonthData[] {
  const months: Record<string, { burials: number; ashes: number }> = {}

  for (const interment of mockInterments) {
    const date = new Date(interment.interment_date)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

    if (!months[key]) {
      months[key] = { burials: 0, ashes: 0 }
    }

    if (interment.interment_type === "burial") {
      months[key].burials++
    } else {
      months[key].ashes++
    }
  }

  // Sort by date and format labels
  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, values]) => {
      const [year, month] = key.split("-")
      const date = new Date(Number(year), Number(month) - 1)
      return {
        month: key,
        label: date.toLocaleDateString("en-AU", { month: "short", year: "2-digit" }),
        burials: values.burials,
        ashes: values.ashes,
        total: values.burials + values.ashes,
      }
    })
}

function downloadCsv(data: MonthData[]) {
  const header = "Month,Burials,Ashes Interments,Total\n"
  const rows = data.map((d) => `${d.month},${d.burials},${d.ashes},${d.total}`).join("\n")
  const csv = header + rows

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "interments_by_period.csv"
  link.click()
  URL.revokeObjectURL(url)
}

export default function IntermentsReportPage() {
  const data = useMemo(() => aggregateByMonth(), [])
  const totalInterments = data.reduce((sum, d) => sum + d.total, 0)
  const totalBurials = data.reduce((sum, d) => sum + d.burials, 0)
  const totalAshes = data.reduce((sum, d) => sum + d.ashes, 0)

  return (
    <div className="p-4 md:p-10 max-w-[1600px] mx-auto w-full space-y-8">
      {/* ── Header ── */}
      <div className="flex justify-between items-end animate-fade-up">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/reports">
                <ArrowLeft className="size-4" />
                Reports
              </Link>
            </Button>
          </div>
          <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
            Interments by Period
          </h2>
          <p className="text-muted-foreground">
            Monthly breakdown of all interment activity.
          </p>
        </div>
        <Button
          variant="secondary"
          className="rounded-xl"
          onClick={() => downloadCsv(data)}
        >
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-3 gap-4 animate-fade-up stagger-1">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Total Interments</p>
          <p className="text-2xl font-bold text-primary">{totalInterments}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Burials</p>
          <p className="text-2xl font-bold text-primary">{totalBurials}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Ashes Interments</p>
          <p className="text-2xl font-bold text-secondary">{totalAshes}</p>
        </div>
      </div>

      {/* ── Bar Chart ── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card p-6 animate-fade-up stagger-2">
        <h3 className="font-semibold text-foreground mb-6">Monthly Interments</h3>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={{ stroke: "var(--border)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--surface-container-lowest)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.75rem",
                  boxShadow: "var(--shadow-md)",
                }}
                labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
              />
              <Bar
                dataKey="burials"
                name="Burials"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="ashes"
                name="Ashes"
                fill="var(--secondary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card animate-fade-up stagger-3">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Month</TableHead>
              <TableHead className="text-right">Burials</TableHead>
              <TableHead className="text-right">Ashes Interments</TableHead>
              <TableHead className="text-right pr-6">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow
                key={row.month}
                className={i % 2 === 1 ? "bg-surface-container-low/50" : ""}
              >
                <TableCell className="pl-6 font-medium">{row.label}</TableCell>
                <TableCell className="text-right">{row.burials}</TableCell>
                <TableCell className="text-right">{row.ashes}</TableCell>
                <TableCell className="text-right pr-6 font-semibold">{row.total}</TableCell>
              </TableRow>
            ))}
            {/* Totals row */}
            <TableRow className="bg-surface-container-low font-semibold">
              <TableCell className="pl-6">Total</TableCell>
              <TableCell className="text-right">{totalBurials}</TableCell>
              <TableCell className="text-right">{totalAshes}</TableCell>
              <TableCell className="text-right pr-6">{totalInterments}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
