// Mock data for documents.
//
// Placeholder until Supabase Storage is connected. Documents are
// linked to various entity types (deceased, plot, booking, cemetery).

import type { Document, DocumentCategory } from "@/lib/types/database"

const TENANT_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"

export const mockDocuments: Document[] = [
  {
    id: "doc-001",
    tenant_id: TENANT_ID,
    name: "Morrison_BurialOrder.pdf",
    category: "statutory",
    file_url: "/placeholder/Morrison_BurialOrder.pdf",
    file_type: "application/pdf",
    file_size_bytes: 245_760,
    linked_entity_type: "deceased",
    linked_entity_id: "dec-0001",
    uploaded_by: "user-admin-001",
    created_at: "2025-09-16T08:30:00Z",
    updated_at: "2025-09-16T08:30:00Z",
  },
  {
    id: "doc-002",
    tenant_id: TENANT_ID,
    name: "Morrison_DeathCertificate.pdf",
    category: "statutory",
    file_url: "/placeholder/Morrison_DeathCertificate.pdf",
    file_type: "application/pdf",
    file_size_bytes: 512_000,
    linked_entity_type: "deceased",
    linked_entity_id: "dec-0001",
    uploaded_by: "user-admin-001",
    created_at: "2025-09-16T08:35:00Z",
    updated_at: "2025-09-16T08:35:00Z",
  },
  {
    id: "doc-003",
    tenant_id: TENANT_ID,
    name: "Chen_AshesPermit.pdf",
    category: "statutory",
    file_url: "/placeholder/Chen_AshesPermit.pdf",
    file_type: "application/pdf",
    file_size_bytes: 189_440,
    linked_entity_type: "deceased",
    linked_entity_id: "dec-0002",
    uploaded_by: "user-officer-001",
    created_at: "2025-10-24T10:00:00Z",
    updated_at: "2025-10-24T10:00:00Z",
  },
  {
    id: "doc-004",
    tenant_id: TENANT_ID,
    name: "RiversidePark_SitePlan_2024.pdf",
    category: "map",
    file_url: "/placeholder/RiversidePark_SitePlan_2024.pdf",
    file_type: "application/pdf",
    file_size_bytes: 2_048_000,
    linked_entity_type: "cemetery",
    linked_entity_id: "cem-001-aaaa-bbbb-cccc-ddddeeee0001",
    uploaded_by: "user-admin-001",
    created_at: "2025-06-15T09:00:00Z",
    updated_at: "2025-06-15T09:00:00Z",
  },
  {
    id: "doc-005",
    tenant_id: TENANT_ID,
    name: "OBrien_FuneralDirectorLetter.pdf",
    category: "correspondence",
    file_url: "/placeholder/OBrien_FuneralDirectorLetter.pdf",
    file_type: "application/pdf",
    file_size_bytes: 98_304,
    linked_entity_type: "booking",
    linked_entity_id: "bk-0003",
    uploaded_by: "user-officer-001",
    created_at: "2025-11-12T14:00:00Z",
    updated_at: "2025-11-12T14:00:00Z",
  },
  {
    id: "doc-006",
    tenant_id: TENANT_ID,
    name: "PlotRMP-A-001_Photo.jpg",
    category: "photo",
    file_url: "/placeholder/PlotRMP-A-001_Photo.jpg",
    file_type: "image/jpeg",
    file_size_bytes: 1_536_000,
    linked_entity_type: "plot",
    linked_entity_id: "plot-rmp-a-0001",
    uploaded_by: "user-officer-001",
    created_at: "2025-09-21T09:00:00Z",
    updated_at: "2025-09-21T09:00:00Z",
  },
  {
    id: "doc-007",
    tenant_id: TENANT_ID,
    name: "Thompson_RightOfInterment.pdf",
    category: "contractual",
    file_url: "/placeholder/Thompson_RightOfInterment.pdf",
    file_type: "application/pdf",
    file_size_bytes: 320_000,
    linked_entity_type: "deceased",
    linked_entity_id: "dec-0004",
    uploaded_by: "user-admin-001",
    created_at: "2025-12-05T10:00:00Z",
    updated_at: "2025-12-05T10:00:00Z",
  },
  {
    id: "doc-008",
    tenant_id: TENANT_ID,
    name: "Nguyen_CoronerClearance.pdf",
    category: "statutory",
    file_url: "/placeholder/Nguyen_CoronerClearance.pdf",
    file_type: "application/pdf",
    file_size_bytes: 156_672,
    linked_entity_type: "deceased",
    linked_entity_id: "dec-0005",
    uploaded_by: "user-admin-001",
    created_at: "2026-01-25T11:00:00Z",
    updated_at: "2026-01-25T11:00:00Z",
  },
  {
    id: "doc-009",
    tenant_id: TENANT_ID,
    name: "Greenhill_AnnualReport_2025.pdf",
    category: "report",
    file_url: "/placeholder/Greenhill_AnnualReport_2025.pdf",
    file_type: "application/pdf",
    file_size_bytes: 4_096_000,
    linked_entity_type: "cemetery",
    linked_entity_id: "cem-003-aaaa-bbbb-cccc-ddddeeee0003",
    uploaded_by: "user-admin-001",
    created_at: "2026-02-01T09:00:00Z",
    updated_at: "2026-02-01T09:00:00Z",
  },
  {
    id: "doc-010",
    tenant_id: TENANT_ID,
    name: "Williams_NaturalBurialConsent.pdf",
    category: "contractual",
    file_url: "/placeholder/Williams_NaturalBurialConsent.pdf",
    file_type: "application/pdf",
    file_size_bytes: 204_800,
    linked_entity_type: "deceased",
    linked_entity_id: "dec-0006",
    uploaded_by: "user-officer-001",
    created_at: "2026-02-16T10:00:00Z",
    updated_at: "2026-02-16T10:00:00Z",
  },
]

// ── Helpers ──

const categoryLabels: Record<DocumentCategory, string> = {
  statutory: "Statutory",
  contractual: "Contractual",
  correspondence: "Correspondence",
  photo: "Photo",
  map: "Map / Plan",
  report: "Report",
  other: "Other",
}

export function getCategoryLabel(cat: DocumentCategory): string {
  return categoryLabels[cat] ?? cat
}

export function formatFileSize(bytes: number | null): string {
  if (!bytes) return "—"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function getDocumentStats() {
  const byCategory: Record<string, number> = {}
  for (const doc of mockDocuments) {
    byCategory[doc.category] = (byCategory[doc.category] || 0) + 1
  }
  return { total: mockDocuments.length, byCategory }
}

export function getDocumentsForEntity(entityType: string, entityId: string): Document[] {
  return mockDocuments.filter(
    (d) => d.linked_entity_type === entityType && d.linked_entity_id === entityId
  )
}
