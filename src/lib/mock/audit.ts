// Mock data for audit log entries.
//
// Represents a trail of all create/update/delete operations across entities.

import type { AuditLog } from "@/lib/types/database"

const TENANT_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"

export const mockAuditLogs: AuditLog[] = [
  {
    id: "audit-001",
    tenant_id: TENANT_ID,
    entity_type: "deceased",
    entity_id: "dec-0001",
    action: "create",
    user_id: "user-admin-001",
    changes: { surname: "Morrison", given_names: "Harold James" },
    ip_address: "203.0.113.10",
    user_agent: "Mozilla/5.0",
    created_at: "2025-09-16T08:00:00Z",
  },
  {
    id: "audit-002",
    tenant_id: TENANT_ID,
    entity_type: "booking",
    entity_id: "bk-0001",
    action: "create",
    user_id: "user-admin-001",
    changes: { deceased_name: "Harold James Morrison", booking_type: "burial" },
    ip_address: "203.0.113.10",
    user_agent: "Mozilla/5.0",
    created_at: "2025-09-16T08:15:00Z",
  },
  {
    id: "audit-003",
    tenant_id: TENANT_ID,
    entity_type: "plot",
    entity_id: "plot-rmp-a-0001",
    action: "update",
    user_id: "user-admin-001",
    changes: { status: { from: "reserved", to: "occupied" } },
    ip_address: "203.0.113.10",
    user_agent: "Mozilla/5.0",
    created_at: "2025-09-20T14:00:00Z",
  },
  {
    id: "audit-004",
    tenant_id: TENANT_ID,
    entity_type: "booking",
    entity_id: "bk-0001",
    action: "update",
    user_id: "user-admin-001",
    changes: { status: { from: "confirmed", to: "completed" } },
    ip_address: "203.0.113.10",
    user_agent: "Mozilla/5.0",
    created_at: "2025-09-20T14:05:00Z",
  },
  {
    id: "audit-005",
    tenant_id: TENANT_ID,
    entity_type: "cemetery",
    entity_id: "cem-001-aaaa-bbbb-cccc-ddddeeee0001",
    action: "update",
    user_id: "user-admin-001",
    changes: { opening_hours: { from: "Mon-Fri 8am-4pm", to: "Mon-Fri 8:00am - 5:00pm, Sat-Sun 9:00am - 4:00pm" } },
    ip_address: "203.0.113.10",
    user_agent: "Mozilla/5.0",
    created_at: "2025-10-05T10:30:00Z",
  },
  {
    id: "audit-006",
    tenant_id: TENANT_ID,
    entity_type: "deceased",
    entity_id: "dec-0002",
    action: "create",
    user_id: "user-officer-001",
    changes: { surname: "Chen", given_names: "Mei Lin" },
    ip_address: "203.0.113.22",
    user_agent: "Mozilla/5.0",
    created_at: "2025-10-23T09:00:00Z",
  },
  {
    id: "audit-007",
    tenant_id: TENANT_ID,
    entity_type: "section",
    entity_id: "sec-007-aaaa-bbbb-cccc-ddddeeee0007",
    action: "create",
    user_id: "user-admin-001",
    changes: { name: "Natural Burial Area", code: "GH-NB" },
    ip_address: "203.0.113.10",
    user_agent: "Mozilla/5.0",
    created_at: "2025-11-02T09:00:00Z",
  },
  {
    id: "audit-008",
    tenant_id: TENANT_ID,
    entity_type: "deceased",
    entity_id: "dec-0003",
    action: "create",
    user_id: "user-officer-001",
    changes: { surname: "O'Brien", given_names: "Patrick Michael" },
    ip_address: "203.0.113.22",
    user_agent: "Mozilla/5.0",
    created_at: "2025-11-11T08:00:00Z",
  },
  {
    id: "audit-009",
    tenant_id: TENANT_ID,
    entity_type: "document",
    entity_id: "doc-001",
    action: "create",
    user_id: "user-admin-001",
    changes: { name: "Morrison_BurialOrder.pdf", category: "statutory" },
    ip_address: "203.0.113.10",
    user_agent: "Mozilla/5.0",
    created_at: "2025-11-20T11:00:00Z",
  },
  {
    id: "audit-010",
    tenant_id: TENANT_ID,
    entity_type: "plot",
    entity_id: "plot-rmp-b-0005",
    action: "update",
    user_id: "user-admin-001",
    changes: { status: { from: "available", to: "reserved" } },
    ip_address: "203.0.113.10",
    user_agent: "Mozilla/5.0",
    created_at: "2026-01-10T14:30:00Z",
  },
  {
    id: "audit-011",
    tenant_id: TENANT_ID,
    entity_type: "deceased",
    entity_id: "dec-0005",
    action: "create",
    user_id: "user-officer-001",
    changes: { surname: "Nguyen", given_names: "Tran Duc" },
    ip_address: "203.0.113.22",
    user_agent: "Mozilla/5.0",
    created_at: "2026-01-19T10:00:00Z",
  },
  {
    id: "audit-012",
    tenant_id: TENANT_ID,
    entity_type: "deceased",
    entity_id: "dec-0005",
    action: "update",
    user_id: "user-admin-001",
    changes: { notes: { from: null, to: "Coroner's case — clearance received 2026-01-25." } },
    ip_address: "203.0.113.10",
    user_agent: "Mozilla/5.0",
    created_at: "2026-01-28T09:00:00Z",
  },
  {
    id: "audit-013",
    tenant_id: TENANT_ID,
    entity_type: "booking",
    entity_id: "bk-0007",
    action: "create",
    user_id: "user-officer-001",
    changes: { deceased_name: "Stavros Papadopoulos", booking_type: "burial" },
    ip_address: "203.0.113.22",
    user_agent: "Mozilla/5.0",
    created_at: "2026-03-06T09:00:00Z",
  },
  {
    id: "audit-014",
    tenant_id: TENANT_ID,
    entity_type: "booking",
    entity_id: "bk-0007",
    action: "update",
    user_id: "user-admin-001",
    changes: { status: { from: "pending", to: "confirmed" } },
    ip_address: "203.0.113.10",
    user_agent: "Mozilla/5.0",
    created_at: "2026-03-08T14:00:00Z",
  },
  {
    id: "audit-015",
    tenant_id: TENANT_ID,
    entity_type: "document",
    entity_id: "doc-005",
    action: "delete",
    user_id: "user-admin-001",
    changes: { name: "Duplicate_scan.pdf" },
    ip_address: "203.0.113.10",
    user_agent: "Mozilla/5.0",
    created_at: "2026-03-15T16:00:00Z",
  },
]

// ── Helpers ──

const userNames: Record<string, string> = {
  "user-admin-001": "Sarah Mitchell (Admin)",
  "user-officer-001": "James Cooper (Officer)",
}

export function getUserName(userId: string | null): string {
  if (!userId) return "System"
  return userNames[userId] ?? userId
}

export function getAuditStats() {
  const byAction: Record<string, number> = {}
  const byEntity: Record<string, number> = {}
  for (const log of mockAuditLogs) {
    byAction[log.action] = (byAction[log.action] || 0) + 1
    byEntity[log.entity_type] = (byEntity[log.entity_type] || 0) + 1
  }
  return { total: mockAuditLogs.length, byAction, byEntity }
}
