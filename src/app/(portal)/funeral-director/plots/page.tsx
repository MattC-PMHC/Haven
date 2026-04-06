// Funeral Director — Plot Availability Search
//
// Shows available plots from Supabase with cemetery/section names.
// Map view is deferred (M5 skipped), so this shows a table view.

import { redirect } from "next/navigation"
import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getSession } from "@/lib/auth/get-session"
import { getAvailablePlots } from "@/lib/queries/fd-portal"

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

export default async function FDPlotSearchPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const available = await getAvailablePlots()

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* ── Header ── */}
      <div className="animate-fade-up">
        <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
          Plot Availability
        </h2>
        <p className="text-muted-foreground">
          Search available plots across all cemeteries. {available.length} plots currently available.
        </p>
      </div>

      {/* ── Search (visual placeholder) ── */}
      <div className="relative max-w-md animate-fade-up stagger-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input placeholder="Search by plot number, section, or type..." className="pl-10" disabled />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          Live search coming soon
        </span>
      </div>

      {/* ── Map Placeholder ── */}
      <div className="bg-surface-container-low rounded-xl p-8 text-center border border-dashed border-border animate-fade-up stagger-2">
        <MapPin className="size-8 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Interactive map view coming soon</p>
        <p className="text-xs text-muted-foreground/60">Available plots shown in table below</p>
      </div>

      {/* ── Table ── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card animate-fade-up stagger-3">
        {available.length === 0 ? (
          <div className="p-12 text-center">
            <MapPin className="size-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No available plots found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Plot Number</TableHead>
                <TableHead>Cemetery</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead className="pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {available.map((plot, i) => (
                <TableRow
                  key={plot.id}
                  className={i % 2 === 1 ? "bg-surface-container-low/50" : ""}
                >
                  <TableCell className="pl-6 font-medium font-mono">
                    {plot.plot_number}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {plot.cemetery_name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {plot.section_name}
                  </TableCell>
                  <TableCell className="text-sm">
                    {plotTypeLabels[plot.plot_type] ?? plot.plot_type}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {plot.capacity}
                  </TableCell>
                  <TableCell className="pr-6">
                    <Badge className="bg-success-bg text-success border-success-border">
                      Available
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {available.length >= 50 && (
          <div className="px-6 py-3 text-sm text-muted-foreground text-center border-t border-border">
            Showing first 50 available plots
          </div>
        )}
      </div>
    </div>
  )
}
