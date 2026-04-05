// Cemetery list page — shows all cemeteries in a table.
//
// Uses alternating row tones (no borders) per DESIGN.md.
// Links to detail/edit pages. "New Cemetery" button in header.

import Link from "next/link"
import { Plus, Building2, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { mockCemeteries, getMockSectionCounts } from "@/lib/mock/cemeteries"

export default function CemeteriesPage() {
  // In production this would be a Supabase query
  const cemeteries = mockCemeteries
  const sectionCounts = getMockSectionCounts()

  return (
    <div className="p-10 max-w-[1600px] mx-auto w-full space-y-8">
      {/* ── Header ── */}
      <div className="flex justify-between items-end animate-fade-up">
        <div>
          <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
            Cemetery Setup
          </h2>
          <p className="text-muted-foreground">
            Manage your cemeteries, sections, and their configuration.
          </p>
        </div>
        <Button asChild className="rounded-xl">
          <Link href="/settings/cemeteries/new">
            <Plus className="size-4" />
            New Cemetery
          </Link>
        </Button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up stagger-1">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Total Cemeteries</p>
          <p className="text-2xl font-bold text-primary">{cemeteries.length}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Active</p>
          <p className="text-2xl font-bold text-success">
            {cemeteries.filter((c) => c.status === "active").length}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Closed</p>
          <p className="text-2xl font-bold text-muted-foreground">
            {cemeteries.filter((c) => c.status === "closed").length}
          </p>
        </div>
      </div>

      {/* ── Cemetery Table ── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card animate-fade-up stagger-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Cemetery</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-center">Sections</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cemeteries.map((cemetery, i) => (
              <TableRow
                key={cemetery.id}
                className={i % 2 === 1 ? "bg-surface-container-low/50" : ""}
              >
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center shrink-0">
                      <Building2 className="size-4 text-primary" />
                    </div>
                    <div>
                      <Link
                        href={`/settings/cemeteries/${cemetery.id}`}
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {cemetery.name}
                      </Link>
                      {cemetery.notes && (
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-[260px]">
                          {cemetery.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0" />
                    <span>
                      {[cemetery.suburb, cemetery.state, cemetery.postcode]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  {cemetery.phone ? (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Phone className="size-3.5 shrink-0" />
                      <span>{cemetery.phone}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>

                <TableCell className="text-center">
                  <span className="text-sm font-medium">
                    {sectionCounts[cemetery.id] ?? 0}
                  </span>
                </TableCell>

                <TableCell>
                  <Badge
                    className={
                      cemetery.status === "active"
                        ? "bg-success-bg text-success border-success-border"
                        : "bg-surface-container-high text-muted-foreground"
                    }
                  >
                    {cemetery.status === "active" ? "Active" : "Closed"}
                  </Badge>
                </TableCell>

                <TableCell className="pr-6 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/settings/cemeteries/${cemetery.id}`}>
                      View
                    </Link>
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
