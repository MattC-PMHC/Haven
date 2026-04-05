// Mock data for work orders.
//
// Used by both the admin work orders page and the grounds crew portal.

import type { WorkOrder } from "@/lib/types/database"

const TENANT_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"

export const mockWorkOrders: WorkOrder[] = [
  {
    id: "wo-001",
    tenant_id: TENANT_ID,
    title: "Grave preparation — Morrison (RMP-A-001)",
    description: "Prepare single depth grave for burial on 20 Sep. Standard timber coffin.",
    work_order_type: "grave_preparation",
    priority: "high",
    status: "completed",
    plot_id: "plot-rmp-a-0001",
    booking_id: "bk-0001",
    cemetery_id: "cem-001-aaaa-bbbb-cccc-ddddeeee0001",
    assigned_to: "crew-001",
    due_date: "2025-09-19",
    estimated_hours: 4,
    started_at: "2025-09-19T07:00:00Z",
    completed_at: "2025-09-19T11:30:00Z",
    checklist: [],
    photos: [],
    completion_notes: "Grave prepared to 1.8m depth. Shoring boards in place.",
    created_at: "2025-09-17T08:00:00Z",
    updated_at: "2025-09-19T11:30:00Z",
    created_by: "user-admin-001",
    updated_by: "crew-001",
  },
  {
    id: "wo-002",
    tenant_id: TENANT_ID,
    title: "Backfill after Morrison interment",
    description: "Backfill grave and mound. Family requested rosemary planting near grave.",
    work_order_type: "grave_backfill",
    priority: "normal",
    status: "completed",
    plot_id: "plot-rmp-a-0001",
    booking_id: "bk-0001",
    cemetery_id: "cem-001-aaaa-bbbb-cccc-ddddeeee0001",
    assigned_to: "crew-001",
    due_date: "2025-09-20",
    estimated_hours: 2,
    started_at: "2025-09-20T14:30:00Z",
    completed_at: "2025-09-20T16:00:00Z",
    checklist: [],
    photos: [],
    completion_notes: "Backfilled and mounded. Rosemary planted as requested.",
    created_at: "2025-09-20T14:00:00Z",
    updated_at: "2025-09-20T16:00:00Z",
    created_by: "user-admin-001",
    updated_by: "crew-001",
  },
  {
    id: "wo-003",
    tenant_id: TENANT_ID,
    title: "Memorial garden plaque installation — Chen",
    description: "Install bronze plaque on memorial wall position MG-001.",
    work_order_type: "memorial_installation",
    priority: "normal",
    status: "completed",
    plot_id: "plot-rmp-mg-0001",
    booking_id: null,
    cemetery_id: "cem-001-aaaa-bbbb-cccc-ddddeeee0001",
    assigned_to: "crew-002",
    due_date: "2025-11-15",
    estimated_hours: 2,
    started_at: "2025-11-15T09:00:00Z",
    completed_at: "2025-11-15T10:30:00Z",
    checklist: [],
    photos: [],
    completion_notes: "Bronze plaque installed and levelled.",
    created_at: "2025-11-05T08:00:00Z",
    updated_at: "2025-11-15T10:30:00Z",
    created_by: "user-admin-001",
    updated_by: "crew-002",
  },
  {
    id: "wo-004",
    tenant_id: TENANT_ID,
    title: "Tree pruning — Riverside main avenue",
    description: "Annual pruning of heritage elm avenue. Arborist report attached.",
    work_order_type: "tree_management",
    priority: "normal",
    status: "completed",
    plot_id: null,
    booking_id: null,
    cemetery_id: "cem-001-aaaa-bbbb-cccc-ddddeeee0001",
    assigned_to: "crew-001",
    due_date: "2026-02-10",
    estimated_hours: 8,
    started_at: "2026-02-10T07:00:00Z",
    completed_at: "2026-02-10T15:00:00Z",
    checklist: [],
    photos: [],
    completion_notes: "All elms pruned. No signs of Dutch Elm Disease.",
    created_at: "2026-01-20T09:00:00Z",
    updated_at: "2026-02-10T15:00:00Z",
    created_by: "user-admin-001",
    updated_by: "crew-001",
  },
  {
    id: "wo-005",
    tenant_id: TENANT_ID,
    title: "Grave preparation — Papadopoulos (RMP-B-005)",
    description: "Prepare monumental plot for burial on 10 Apr. Extended service — allow 90 min.",
    work_order_type: "grave_preparation",
    priority: "high",
    status: "assigned",
    plot_id: "plot-rmp-b-0005",
    booking_id: "bk-0007",
    cemetery_id: "cem-001-aaaa-bbbb-cccc-ddddeeee0001",
    assigned_to: "crew-001",
    due_date: "2026-04-09",
    estimated_hours: 5,
    started_at: null,
    completed_at: null,
    checklist: [],
    photos: [],
    completion_notes: null,
    created_at: "2026-03-08T15:00:00Z",
    updated_at: "2026-03-08T15:00:00Z",
    created_by: "user-admin-001",
    updated_by: null,
  },
  {
    id: "wo-006",
    tenant_id: TENANT_ID,
    title: "Mowing — Greenhill Lawn Section 1",
    description: "Fortnightly mowing cycle. Include edging along pathways.",
    work_order_type: "grounds_maintenance",
    priority: "normal",
    status: "in_progress",
    plot_id: null,
    booking_id: null,
    cemetery_id: "cem-003-aaaa-bbbb-cccc-ddddeeee0003",
    assigned_to: "crew-002",
    due_date: "2026-04-07",
    estimated_hours: 6,
    started_at: "2026-04-06T07:30:00Z",
    completed_at: null,
    checklist: [],
    photos: [],
    completion_notes: null,
    created_at: "2026-04-01T08:00:00Z",
    updated_at: "2026-04-06T07:30:00Z",
    created_by: "user-admin-001",
    updated_by: "crew-002",
  },
  {
    id: "wo-007",
    tenant_id: TENANT_ID,
    title: "Memorial inspection — St. Mary's Section A",
    description: "Annual safety inspection of all headstones in Section A. Flag any that are unstable.",
    work_order_type: "memorial_inspection",
    priority: "normal",
    status: "created",
    plot_id: null,
    booking_id: null,
    cemetery_id: "cem-002-aaaa-bbbb-cccc-ddddeeee0002",
    assigned_to: null,
    due_date: "2026-04-20",
    estimated_hours: 8,
    started_at: null,
    completed_at: null,
    checklist: [],
    photos: [],
    completion_notes: null,
    created_at: "2026-03-25T09:00:00Z",
    updated_at: "2026-03-25T09:00:00Z",
    created_by: "user-admin-001",
    updated_by: null,
  },
  {
    id: "wo-008",
    tenant_id: TENANT_ID,
    title: "Path repair — Greenhill entrance",
    description: "Pothole repair near main entrance gate. Trip hazard reported.",
    work_order_type: "infrastructure",
    priority: "urgent",
    status: "assigned",
    plot_id: null,
    booking_id: null,
    cemetery_id: "cem-003-aaaa-bbbb-cccc-ddddeeee0003",
    assigned_to: "crew-001",
    due_date: "2026-04-08",
    estimated_hours: 3,
    started_at: null,
    completed_at: null,
    checklist: [],
    photos: [],
    completion_notes: null,
    created_at: "2026-04-04T10:00:00Z",
    updated_at: "2026-04-04T10:00:00Z",
    created_by: "user-officer-001",
    updated_by: null,
  },
]

// ── Helpers ──

const crewNames: Record<string, string> = {
  "crew-001": "Team Alpha (Dave & Tony)",
  "crew-002": "Team Bravo (Sam & Lin)",
}

export function getCrewName(crewId: string | null): string {
  if (!crewId) return "Unassigned"
  return crewNames[crewId] ?? crewId
}

const cemeteryNames: Record<string, string> = {
  "cem-001-aaaa-bbbb-cccc-ddddeeee0001": "Riverside Memorial Park",
  "cem-002-aaaa-bbbb-cccc-ddddeeee0002": "St. Mary's Catholic Cemetery",
  "cem-003-aaaa-bbbb-cccc-ddddeeee0003": "Greenhill Lawn Cemetery",
}

export function getCemeteryName(cemId: string | null): string {
  if (!cemId) return "—"
  return cemeteryNames[cemId] ?? cemId
}

export function getWorkOrderStats() {
  const byStatus: Record<string, number> = {}
  const byPriority: Record<string, number> = {}
  for (const wo of mockWorkOrders) {
    byStatus[wo.status] = (byStatus[wo.status] || 0) + 1
    byPriority[wo.priority] = (byPriority[wo.priority] || 0) + 1
  }
  return { total: mockWorkOrders.length, byStatus, byPriority }
}

export function getActiveWorkOrders(): WorkOrder[] {
  return mockWorkOrders.filter(
    (wo) => wo.status === "created" || wo.status === "assigned" || wo.status === "in_progress"
  )
}

export function getWorkOrderById(id: string): WorkOrder | undefined {
  return mockWorkOrders.find((wo) => wo.id === id)
}
