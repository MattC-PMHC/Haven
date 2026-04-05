// Mock data for memorial permits.
//
// Used by admin memorial works page and mason portal.

import type { MemorialPermit } from "@/lib/types/database"

const TENANT_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"

export const mockPermits: MemorialPermit[] = [
  {
    id: "permit-001",
    tenant_id: TENANT_ID,
    memorial_id: null,
    plot_id: "plot-rmp-a-0001",
    mason_contact_id: "mason-001",
    work_type: "new_memorial",
    status: "completed",
    description: "Standard granite headstone — 900mm x 600mm, polished grey.",
    dimensions_notes: "900mm H x 600mm W x 150mm D",
    material_notes: "Harcourt Grey granite, polished face",
    design_document_id: null,
    submitted_at: "2025-10-01T09:00:00Z",
    reviewed_at: "2025-10-03T14:00:00Z",
    approved_by: "user-admin-001",
    approval_notes: "Approved. Complies with Section A headstone regulations.",
    completed_at: "2025-11-10T16:00:00Z",
    notes: null,
    created_at: "2025-10-01T09:00:00Z",
    updated_at: "2025-11-10T16:00:00Z",
    created_by: "mason-001",
    updated_by: "user-admin-001",
  },
  {
    id: "permit-002",
    tenant_id: TENANT_ID,
    memorial_id: null,
    plot_id: "plot-stm-a-0001",
    mason_contact_id: "mason-001",
    work_type: "new_memorial",
    status: "approved",
    description: "Celtic cross headstone — traditional design for Catholic section.",
    dimensions_notes: "1200mm H x 700mm W x 200mm D",
    material_notes: "Black granite, frosted finish with gold lettering",
    design_document_id: null,
    submitted_at: "2025-12-05T10:00:00Z",
    reviewed_at: "2025-12-10T11:00:00Z",
    approved_by: "user-admin-001",
    approval_notes: "Approved. Celtic cross design acceptable in Section A.",
    completed_at: null,
    notes: "Installation scheduled for late January 2026.",
    created_at: "2025-12-05T10:00:00Z",
    updated_at: "2025-12-10T11:00:00Z",
    created_by: "mason-001",
    updated_by: "user-admin-001",
  },
  {
    id: "permit-003",
    tenant_id: TENANT_ID,
    memorial_id: null,
    plot_id: "plot-rmp-b-0004",
    mason_contact_id: "mason-002",
    work_type: "additional_inscription",
    status: "under_review",
    description: "Add inscription for Margaret Rose Thompson alongside existing text.",
    dimensions_notes: null,
    material_notes: "Match existing gold leaf lettering",
    design_document_id: null,
    submitted_at: "2026-01-15T09:00:00Z",
    reviewed_at: null,
    approved_by: null,
    approval_notes: null,
    completed_at: null,
    notes: "Thompson was buried alongside husband — family wants both names on existing stone.",
    created_at: "2026-01-15T09:00:00Z",
    updated_at: "2026-01-15T09:00:00Z",
    created_by: "mason-002",
    updated_by: null,
  },
  {
    id: "permit-004",
    tenant_id: TENANT_ID,
    memorial_id: null,
    plot_id: "plot-rmp-b-0005",
    mason_contact_id: "mason-001",
    work_type: "new_memorial",
    status: "submitted",
    description: "Greek Orthodox marble headstone with cross and icon recess.",
    dimensions_notes: "1100mm H x 800mm W x 200mm D",
    material_notes: "White Thassos marble, with recess for ceramic icon",
    design_document_id: null,
    submitted_at: "2026-03-12T14:00:00Z",
    reviewed_at: null,
    approved_by: null,
    approval_notes: null,
    completed_at: null,
    notes: "Family to provide ceramic icon separately.",
    created_at: "2026-03-12T14:00:00Z",
    updated_at: "2026-03-12T14:00:00Z",
    created_by: "mason-001",
    updated_by: null,
  },
  {
    id: "permit-005",
    tenant_id: TENANT_ID,
    memorial_id: null,
    plot_id: "plot-rmp-a-0005",
    mason_contact_id: "mason-002",
    work_type: "repair",
    status: "submitted",
    description: "Repair cracked base on existing headstone. Reset and re-level.",
    dimensions_notes: null,
    material_notes: "Existing grey granite — epoxy repair and re-anchor",
    design_document_id: null,
    submitted_at: "2026-03-20T10:00:00Z",
    reviewed_at: null,
    approved_by: null,
    approval_notes: null,
    completed_at: null,
    notes: "Flagged during annual inspection.",
    created_at: "2026-03-20T10:00:00Z",
    updated_at: "2026-03-20T10:00:00Z",
    created_by: "mason-002",
    updated_by: null,
  },
]

// ── Helpers ──

const masonNames: Record<string, string> = {
  "mason-001": "Heritage Stone Masonry",
  "mason-002": "Precision Memorials Pty Ltd",
}

export function getMasonName(masonId: string): string {
  return masonNames[masonId] ?? masonId
}

const workTypeLabels: Record<string, string> = {
  new_memorial: "New Memorial",
  repair: "Repair",
  additional_inscription: "Additional Inscription",
  restoration: "Restoration",
  removal: "Removal",
}

export function getWorkTypeLabel(workType: string): string {
  return workTypeLabels[workType] ?? workType
}

const statusLabels: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
}

export function getPermitStatusLabel(status: string): string {
  return statusLabels[status] ?? status
}

export function getPermitStats() {
  const byStatus: Record<string, number> = {}
  for (const p of mockPermits) {
    byStatus[p.status] = (byStatus[p.status] || 0) + 1
  }
  return { total: mockPermits.length, byStatus }
}

export function getPermitsForMason(masonId: string): MemorialPermit[] {
  return mockPermits.filter((p) => p.mason_contact_id === masonId)
}
