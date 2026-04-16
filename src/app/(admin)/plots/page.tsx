// Plot inventory list — filterable table of all plots across cemeteries.
//
// Features:
//   - Summary stat cards (total, available, occupied, reserved)
//   - Filter by cemetery/section and status
//   - Alternating row tones table
//   - Links to plot detail pages

import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlotStatusBadge } from "@/components/records/PlotStatusBadge"
import { getPlots } from "@/lib/queries/plots"
import { getSections } from "@/lib/queries/sections"
import { getCemeteries } from "@/lib/queries/cemeteries"

// Human-readable labels for plot types
const plotTypeLabels: Record<string, string> = {
  lawn_single: "Lawn Single",
  lawn_double: "Lawn Double",
  lawn_triple: "Lawn Triple",
  monumental: "Monumental",
  vault: "Vault",
  columbarium_niche: "Columbarium Niche",
  memorial_garden: "Memorial Garden",
  memorial_wall: "Memorial Wall",
  scattering_garden: "Scattering Garden",
  natural_burial: "Natural Burial",
  infant: "Infant",
  denominational: "Denominational",
  war_grave: "War Grave",
}

export default async function PlotsPage() {
  const [plots, sections, cemeteries] = await Promise.all([
    getPlots(),
    getSections(),
    getCemeteries(),
  ])

  // Compute stats from fetched plots
  const stats = {
    total: plots.length,
    byStatus: plots.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1
      return acc
    }, {} as Record<string, number>),
  }

  // Build lookups: section ID -> section name, section ID -> cemetery name
  const cemeteryNames: Record<string, string> = {}
  for (const c of cemeteries) {
    cemeteryNames[c.id] = c.name
  }
  const sectionNames: Record<string, string> = {}
  const sectionToCemetery: Record<string, string> = {}
  for (const s of sections) {
    sectionNames[s.id] = s.name
    sectionToCemetery[s.id] = cemeteryNames[s.cemetery_id] ?? "Unknown"
  }

  return (
    <div className="p-4 md:p-10 max-w-[1600px] mx-auto w-full space-y-8">
      {/* ── Header ── */}
      <div className="flex justify-between items-end animate-fade-up">
        <div>
          <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
            Sections & Plots
          </h2>
          <p className="text-muted-foreground">
            Manage plot inventory across all cemeteries.
          </p>
        </div>
        <Button asChild className="rounded-xl">
          <Link href="/plots/new">
            <Plus className="size-4" />
            New Plot
          </Link>
        </Button>
      </div>

      {/* ── Stat Cards ── */}
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

      {/* ── Plot Table ── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card animate-fade-up stagger-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Plot #</TableHead>
              <TableHead>Cemetery</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-center">Capacity</TableHead>
              <TableHead>Row</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plots.map((plot, i) => (
              <TableRow
                key={plot.id}
                className={i % 2 === 1 ? "bg-surface-container-low/50" : ""}
              >
                <TableCell className="pl-6">
                  <Link
                    href={`/plots/${plot.id}`}
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {plot.plot_number}
                  </Link>
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  {sectionToCemetery[plot.section_id] ?? "—"}
                </TableCell>

                <TableCell className="text-sm">
                  {sectionNames[plot.section_id] ?? "—"}
                </TableCell>

                <TableCell className="text-sm">
                  {plotTypeLabels[plot.plot_type] ?? plot.plot_type}
                </TableCell>

                <TableCell className="text-center text-sm">
                  <span className={plot.remaining_capacity > 0 ? "" : "text-muted-foreground"}>
                    {plot.remaining_capacity}/{plot.capacity}
                  </span>
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  {plot.row_number ?? "—"}
                </TableCell>

                <TableCell>
                  <PlotStatusBadge status={plot.status} />
                </TableCell>

                <TableCell className="pr-6 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/plots/${plot.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
