// Cemetery detail page — shows cemetery info with tabbed sections.
//
// Tabs:
//   1. Overview — summary stats + details card
//   2. Sections — list of sections with add/edit
//   3. Settings — edit cemetery form
//
// This is a server component that reads mock data and passes it
// to client sub-components.

import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Building2, MapPin, Phone, Mail, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  mockCemeteries,
  getSectionsForCemetery,
  getMockPlotCounts,
} from "@/lib/mock/cemeteries"
import { CemeteryDetailTabs } from "@/components/records/CemeteryDetailTabs"

interface CemeteryDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function CemeteryDetailPage({ params }: CemeteryDetailPageProps) {
  const { id } = await params

  // In production: Supabase query with RLS
  const cemetery = mockCemeteries.find((c) => c.id === id)
  if (!cemetery) notFound()

  const sections = getSectionsForCemetery(id)
  const plotCounts = getMockPlotCounts()

  // Calculate total plots and available plots across all sections
  const totalPlots = sections.reduce(
    (sum, s) => sum + (plotCounts[s.id]?.total ?? 0),
    0
  )
  const availablePlots = sections.reduce(
    (sum, s) => sum + (plotCounts[s.id]?.available ?? 0),
    0
  )

  return (
    <div className="p-4 md:p-10 max-w-[1600px] mx-auto w-full space-y-8">
      {/* ── Breadcrumb / Back ── */}
      <div className="animate-fade-up">
        <Link
          href="/settings/cemeteries"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to Cemeteries
        </Link>
      </div>

      {/* ── Header ── */}
      <div className="flex items-start justify-between animate-fade-up stagger-1">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary-fixed flex items-center justify-center">
            <Building2 className="size-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-extrabold text-primary tracking-tight">
                {cemetery.name}
              </h2>
              <Badge
                className={
                  cemetery.status === "active"
                    ? "bg-success-bg text-success border-success-border"
                    : "bg-surface-container-high text-muted-foreground"
                }
              >
                {cemetery.status === "active" ? "Active" : "Closed"}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              {cemetery.suburb && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {[cemetery.address, cemetery.suburb, cemetery.state, cemetery.postcode]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              )}
              {cemetery.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="size-3.5" />
                  {cemetery.phone}
                </span>
              )}
              {cemetery.email && (
                <span className="flex items-center gap-1">
                  <Mail className="size-3.5" />
                  {cemetery.email}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 animate-fade-up stagger-2">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Sections</p>
          <p className="text-2xl font-bold text-primary">{sections.length}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Total Plots</p>
          <p className="text-2xl font-bold text-primary">{totalPlots.toLocaleString()}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Available Plots</p>
          <p className="text-2xl font-bold text-success">{availablePlots.toLocaleString()}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Opening Hours</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock className="size-3.5 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              {cemetery.opening_hours || "Not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Tabs (client component) ── */}
      <div className="animate-fade-up stagger-3">
        <CemeteryDetailTabs
          cemetery={cemetery}
          sections={sections}
          plotCounts={plotCounts}
        />
      </div>
    </div>
  )
}
