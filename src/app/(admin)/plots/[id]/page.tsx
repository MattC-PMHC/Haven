// Plot detail page — shows plot info with tabbed sub-views.
//
// Tabs: Overview, Interments (placeholder), Documents (placeholder), History (placeholder)

import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Grid3x3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PlotStatusBadge } from "@/components/records/PlotStatusBadge"
import { PlotDetailTabs } from "@/components/records/PlotDetailTabs"
import { getPlotById, sectionToCemetery } from "@/lib/mock/plots"
import { mockSections } from "@/lib/mock/cemeteries"

interface PlotDetailPageProps {
  params: Promise<{ id: string }>
}

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

export default async function PlotDetailPage({ params }: PlotDetailPageProps) {
  const { id } = await params

  const plot = getPlotById(id)
  if (!plot) notFound()

  const section = mockSections.find((s) => s.id === plot.section_id)
  const cemeteryName = sectionToCemetery[plot.section_id] ?? "Unknown"
  const activeSections = mockSections.filter((s) => s.status === "active")

  return (
    <div className="p-4 md:p-10 max-w-[1600px] mx-auto w-full space-y-8">
      {/* ── Breadcrumb ── */}
      <div className="animate-fade-up">
        <Link
          href="/plots"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to Plots
        </Link>
      </div>

      {/* ── Header ── */}
      <div className="flex items-start justify-between animate-fade-up stagger-1">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary-fixed flex items-center justify-center">
            <Grid3x3 className="size-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-extrabold text-primary tracking-tight">
                {plot.plot_number}
              </h2>
              <PlotStatusBadge status={plot.status} />
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span>{cemeteryName}</span>
              <span className="text-border">|</span>
              <span>{section?.name ?? "Unknown Section"}</span>
              <span className="text-border">|</span>
              <Badge variant="outline" className="text-xs">
                {plotTypeLabels[plot.plot_type] ?? plot.plot_type}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 animate-fade-up stagger-2">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Capacity</p>
          <p className="text-2xl font-bold text-primary">{plot.capacity}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Remaining</p>
          <p className={`text-2xl font-bold ${plot.remaining_capacity > 0 ? "text-success" : "text-muted-foreground"}`}>
            {plot.remaining_capacity}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Dimensions</p>
          <p className="text-sm font-medium text-foreground mt-1">
            {plot.length_m && plot.width_m
              ? `${plot.length_m}m × ${plot.width_m}m × ${plot.depth_m ?? "?"}m`
              : "Not specified"}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Row / Position</p>
          <p className="text-sm font-medium text-foreground mt-1">
            {plot.row_number ?? "—"} / {plot.position ?? "—"}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Soil Type</p>
          <p className="text-sm font-medium text-foreground mt-1 capitalize">
            {plot.soil_type ?? "—"}
          </p>
        </div>
      </div>

      {/* ── Tabs (client component) ── */}
      <div className="animate-fade-up stagger-3">
        <PlotDetailTabs plot={plot} sections={activeSections} />
      </div>
    </div>
  )
}
