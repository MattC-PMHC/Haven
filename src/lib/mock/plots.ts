// Mock data for plots.
//
// Used until Supabase is connected. Plots are linked to sections
// from the cemeteries mock data.

import type { Plot, PlotStatus, PlotType } from "@/lib/types/database"

const TENANT_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"

// Generate a batch of plots for a section
function makePlots(
  sectionId: string,
  sectionCode: string,
  count: number,
  plotType: PlotType,
  statusMix: { status: PlotStatus; weight: number }[]
): Plot[] {
  const plots: Plot[] = []
  let statusIndex = 0
  let statusCounter = 0

  for (let i = 1; i <= count; i++) {
    // Distribute statuses according to weights
    const currentStatus = statusMix[statusIndex]
    const status = currentStatus.status
    statusCounter++
    if (statusCounter >= currentStatus.weight && statusIndex < statusMix.length - 1) {
      statusIndex++
      statusCounter = 0
    }

    const isOccupied = status === "occupied" || status === "full"

    plots.push({
      id: `plot-${sectionCode.toLowerCase()}-${String(i).padStart(4, "0")}`,
      tenant_id: TENANT_ID,
      section_id: sectionId,
      plot_number: `${sectionCode}-${String(i).padStart(3, "0")}`,
      plot_type: plotType,
      status,
      capacity: plotType === "lawn_double" ? 2 : plotType === "lawn_triple" ? 3 : 1,
      remaining_capacity: isOccupied ? 0 : plotType === "lawn_double" ? 2 : 1,
      length_m: 2.4,
      width_m: 1.2,
      depth_m: 1.8,
      centroid: null,
      row_number: `Row ${Math.ceil(i / 10)}`,
      position: `${String(i).padStart(3, "0")}`,
      soil_type: "clay loam",
      infrastructure_notes: null,
      notes: null,
      created_at: "2024-03-15T10:00:00Z",
      updated_at: "2025-12-01T09:00:00Z",
      created_by: null,
      updated_by: null,
    })
  }
  return plots
}

// Riverside Memorial Park — Section A (Lawn)
const sectionAPlots = makePlots(
  "sec-001-aaaa-bbbb-cccc-ddddeeee0001",
  "RMP-A",
  30,
  "lawn_single",
  [
    { status: "occupied", weight: 15 },
    { status: "reserved", weight: 3 },
    { status: "available", weight: 10 },
    { status: "unavailable", weight: 2 },
  ]
)

// Riverside Memorial Park — Section B (Monumental)
const sectionBPlots = makePlots(
  "sec-002-aaaa-bbbb-cccc-ddddeeee0002",
  "RMP-B",
  15,
  "monumental",
  [
    { status: "occupied", weight: 8 },
    { status: "available", weight: 5 },
    { status: "reserved", weight: 2 },
  ]
)

// Riverside Memorial Park — Memorial Garden
const memorialGardenPlots = makePlots(
  "sec-003-aaaa-bbbb-cccc-ddddeeee0003",
  "RMP-MG",
  12,
  "memorial_garden",
  [
    { status: "occupied", weight: 5 },
    { status: "available", weight: 6 },
    { status: "reserved", weight: 1 },
  ]
)

// St Mary's — Main Burial Ground
const stMarysPlots = makePlots(
  "sec-004-aaaa-bbbb-cccc-ddddeeee0004",
  "STM-A",
  20,
  "lawn_double",
  [
    { status: "occupied", weight: 10 },
    { status: "sold", weight: 3 },
    { status: "available", weight: 5 },
    { status: "reserved", weight: 2 },
  ]
)

// Greenhill — Lawn Section 1
const greenhillL1Plots = makePlots(
  "sec-006-aaaa-bbbb-cccc-ddddeeee0006",
  "GH-L1",
  20,
  "lawn_single",
  [
    { status: "available", weight: 12 },
    { status: "reserved", weight: 3 },
    { status: "occupied", weight: 5 },
  ]
)

// Greenhill — Natural Burial
const naturalBurialPlots = makePlots(
  "sec-007-aaaa-bbbb-cccc-ddddeeee0007",
  "GH-NB",
  10,
  "natural_burial",
  [
    { status: "available", weight: 7 },
    { status: "occupied", weight: 2 },
    { status: "reserved", weight: 1 },
  ]
)

export const mockPlots: Plot[] = [
  ...sectionAPlots,
  ...sectionBPlots,
  ...memorialGardenPlots,
  ...stMarysPlots,
  ...greenhillL1Plots,
  ...naturalBurialPlots,
]

// ── Helpers ──

export function getPlotsForSection(sectionId: string): Plot[] {
  return mockPlots.filter((p) => p.section_id === sectionId)
}

export function getPlotById(plotId: string): Plot | undefined {
  return mockPlots.find((p) => p.id === plotId)
}

export function getPlotStats() {
  const total = mockPlots.length
  const byStatus: Record<string, number> = {}
  for (const plot of mockPlots) {
    byStatus[plot.status] = (byStatus[plot.status] || 0) + 1
  }
  return { total, byStatus }
}

// Map section IDs to cemetery names for display
export const sectionToCemetery: Record<string, string> = {
  "sec-001-aaaa-bbbb-cccc-ddddeeee0001": "Riverside Memorial Park",
  "sec-002-aaaa-bbbb-cccc-ddddeeee0002": "Riverside Memorial Park",
  "sec-003-aaaa-bbbb-cccc-ddddeeee0003": "Riverside Memorial Park",
  "sec-004-aaaa-bbbb-cccc-ddddeeee0004": "St. Mary's Catholic Cemetery",
  "sec-005-aaaa-bbbb-cccc-ddddeeee0005": "St. Mary's Catholic Cemetery",
  "sec-006-aaaa-bbbb-cccc-ddddeeee0006": "Greenhill Lawn Cemetery",
  "sec-007-aaaa-bbbb-cccc-ddddeeee0007": "Greenhill Lawn Cemetery",
  "sec-008-aaaa-bbbb-cccc-ddddeeee0008": "Greenhill Lawn Cemetery",
  "sec-009-aaaa-bbbb-cccc-ddddeeee0009": "Old Township Cemetery",
}
