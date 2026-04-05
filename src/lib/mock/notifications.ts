// Mock data for notifications.
//
// Covers all notification types: booking, work_order, permit, payment, renewal, system.
// Mix of read and unread for the bell indicator and inbox page.

import type { Notification } from "@/lib/types/database"

const TENANT_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"

export const mockNotifications: Notification[] = [
  // ── Unread notifications (most recent first) ──
  {
    id: "notif-001",
    tenant_id: TENANT_ID,
    user_id: "user-admin-001",
    type: "booking",
    title: "New booking request submitted",
    body: "Funeral director Grace & Sons submitted a booking request for Margaret Wilson — burial at Riverside Lawn, Section A.",
    read: false,
    linked_entity_type: "booking",
    linked_entity_id: "bk-0006",
    created_at: "2025-10-14T09:30:00Z",
  },
  {
    id: "notif-002",
    tenant_id: TENANT_ID,
    user_id: "user-admin-001",
    type: "work_order",
    title: "Work order marked overdue",
    body: "WO-0023 (headstone levelling at Section C, Row 12) has passed its due date. Assigned to grounds crew member Tom Barrett.",
    read: false,
    linked_entity_type: "work_order",
    linked_entity_id: "wo-0023",
    created_at: "2025-10-14T08:15:00Z",
  },
  {
    id: "notif-003",
    tenant_id: TENANT_ID,
    user_id: "user-admin-001",
    type: "permit",
    title: "Memorial permit application received",
    body: "Mason Heritage Memorials submitted a permit application for a granite headstone at Plot A-042.",
    read: false,
    linked_entity_type: "permit",
    linked_entity_id: "mp-0008",
    created_at: "2025-10-13T16:45:00Z",
  },
  {
    id: "notif-004",
    tenant_id: TENANT_ID,
    user_id: "user-admin-001",
    type: "renewal",
    title: "Right of interment expiring soon",
    body: "ROI for Plot B-017 (holder: James Patterson) expires in 30 days. A renewal notice should be sent.",
    read: false,
    linked_entity_type: "right_of_interment",
    linked_entity_id: "roi-0012",
    created_at: "2025-10-13T10:00:00Z",
  },
  {
    id: "notif-005",
    tenant_id: TENANT_ID,
    user_id: "user-admin-001",
    type: "system",
    title: "System maintenance scheduled",
    body: "Haven will undergo scheduled maintenance on 20 Oct 2025 from 02:00–04:00 AEST. The system may be briefly unavailable.",
    read: false,
    linked_entity_type: null,
    linked_entity_id: null,
    created_at: "2025-10-12T14:00:00Z",
  },

  // ── Read notifications (older) ──
  {
    id: "notif-006",
    tenant_id: TENANT_ID,
    user_id: "user-admin-001",
    type: "booking",
    title: "Booking confirmed",
    body: "Booking BK-0004 for Harold James Morrison has been confirmed. Interment scheduled for 18 Oct 2025 at 10:00 AM.",
    read: true,
    linked_entity_type: "booking",
    linked_entity_id: "bk-0004",
    created_at: "2025-10-11T11:30:00Z",
  },
  {
    id: "notif-007",
    tenant_id: TENANT_ID,
    user_id: "user-admin-001",
    type: "payment",
    title: "Payment received",
    body: "Payment of $3,250.00 received from the Patterson family for Plot B-017 renewal (Invoice INV-0089).",
    read: true,
    linked_entity_type: "invoice",
    linked_entity_id: "inv-0089",
    created_at: "2025-10-10T15:20:00Z",
  },
  {
    id: "notif-008",
    tenant_id: TENANT_ID,
    user_id: "user-admin-001",
    type: "work_order",
    title: "Work order completed",
    body: "WO-0021 (grave preparation at Section A, Row 5, Plot 3) has been marked complete by Tom Barrett.",
    read: true,
    linked_entity_type: "work_order",
    linked_entity_id: "wo-0021",
    created_at: "2025-10-10T09:45:00Z",
  },
  {
    id: "notif-009",
    tenant_id: TENANT_ID,
    user_id: "user-admin-001",
    type: "permit",
    title: "Memorial permit approved",
    body: "Permit MP-0006 for a bronze plaque at Plot C-108 has been approved. Mason notified.",
    read: true,
    linked_entity_type: "permit",
    linked_entity_id: "mp-0006",
    created_at: "2025-10-09T14:10:00Z",
  },
  {
    id: "notif-010",
    tenant_id: TENANT_ID,
    user_id: "user-admin-001",
    type: "renewal",
    title: "Renewal notice sent",
    body: "Automated renewal notice sent to Sarah Mitchell for Plot A-029 (expires 15 Nov 2025).",
    read: true,
    linked_entity_type: "right_of_interment",
    linked_entity_id: "roi-0008",
    created_at: "2025-10-08T10:30:00Z",
  },
  {
    id: "notif-011",
    tenant_id: TENANT_ID,
    user_id: "user-admin-001",
    type: "system",
    title: "Monthly backup completed",
    body: "October automated backup completed successfully. All records archived.",
    read: true,
    linked_entity_type: null,
    linked_entity_id: null,
    created_at: "2025-10-07T03:00:00Z",
  },
  {
    id: "notif-012",
    tenant_id: TENANT_ID,
    user_id: "user-admin-001",
    type: "booking",
    title: "Booking cancelled",
    body: "Booking BK-0003 for Elizabeth Harper has been cancelled at the family's request.",
    read: true,
    linked_entity_type: "booking",
    linked_entity_id: "bk-0003",
    created_at: "2025-10-06T13:50:00Z",
  },
]

/** Get the count of unread notifications. */
export function getUnreadCount(): number {
  return mockNotifications.filter((n) => !n.read).length
}

/** Get notifications filtered by type. Pass "all" or undefined for no filter. */
export function getFilteredNotifications(
  typeFilter?: string
): Notification[] {
  if (!typeFilter || typeFilter === "all") return mockNotifications
  return mockNotifications.filter((n) => n.type === typeFilter)
}
