"use client"

// PlotDetailTabs — tabbed view for the plot detail page.
//
// Tabs:
//   Overview   — details card with all plot info
//   Interments — placeholder for M7
//   Documents  — placeholder for M8
//   Settings   — edit plot form

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PlotForm } from "@/components/records/PlotForm"
import type { Plot, Section } from "@/lib/types/database"
import { BookUser, FileText } from "lucide-react"

interface PlotDetailTabsProps {
  plot: Plot
  sections: Section[]
}

export function PlotDetailTabs({ plot, sections }: PlotDetailTabsProps) {
  return (
    <Tabs defaultValue="overview">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="interments">Interments</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      {/* ── Overview Tab ── */}
      <TabsContent value="overview" className="mt-6">
        <div className="bg-surface-container-lowest rounded-xl shadow-card p-8">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Plot Details
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Plot Number</dt>
              <dd className="text-sm mt-0.5">{plot.plot_number}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Status</dt>
              <dd className="text-sm mt-0.5 capitalize">{plot.status}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Plot Type</dt>
              <dd className="text-sm mt-0.5 capitalize">{plot.plot_type.replace(/_/g, " ")}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Capacity</dt>
              <dd className="text-sm mt-0.5">
                {plot.remaining_capacity} remaining of {plot.capacity}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Dimensions (L × W × D)</dt>
              <dd className="text-sm mt-0.5">
                {plot.length_m && plot.width_m
                  ? `${plot.length_m}m × ${plot.width_m}m × ${plot.depth_m ?? "?"}m`
                  : "Not specified"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Row / Position</dt>
              <dd className="text-sm mt-0.5">
                {plot.row_number ?? "—"} / {plot.position ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Soil Type</dt>
              <dd className="text-sm mt-0.5 capitalize">{plot.soil_type ?? "—"}</dd>
            </div>
            {plot.infrastructure_notes && (
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">Infrastructure Notes</dt>
                <dd className="text-sm mt-0.5 whitespace-pre-line">{plot.infrastructure_notes}</dd>
              </div>
            )}
            {plot.notes && (
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">Notes</dt>
                <dd className="text-sm mt-0.5 whitespace-pre-line">{plot.notes}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Created</dt>
              <dd className="text-sm mt-0.5">
                {new Date(plot.created_at).toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
              <dd className="text-sm mt-0.5">
                {new Date(plot.updated_at).toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </dd>
            </div>
          </dl>
        </div>
      </TabsContent>

      {/* ── Interments Tab (M7 placeholder) ── */}
      <TabsContent value="interments" className="mt-6">
        <div className="bg-surface-container-lowest rounded-xl shadow-card p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center mx-auto mb-4">
            <BookUser className="size-5 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Interment records will be available in Milestone 7.
          </p>
        </div>
      </TabsContent>

      {/* ── Documents Tab (M8 placeholder) ── */}
      <TabsContent value="documents" className="mt-6">
        <div className="bg-surface-container-lowest rounded-xl shadow-card p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center mx-auto mb-4">
            <FileText className="size-5 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Document uploads will be available in Milestone 8.
          </p>
        </div>
      </TabsContent>

      {/* ── Settings Tab ── */}
      <TabsContent value="settings" className="mt-6">
        <div className="bg-surface-container-lowest rounded-xl shadow-card p-8">
          <h3 className="text-lg font-semibold text-primary mb-6">
            Edit Plot
          </h3>
          <PlotForm plot={plot} sections={sections} />
        </div>
      </TabsContent>
    </Tabs>
  )
}
