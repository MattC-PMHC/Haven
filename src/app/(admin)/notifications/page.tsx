"use client"

// Notification inbox — full list of all notifications, filterable by type.
//
// Users can filter by notification type (booking, work_order, etc.),
// mark individual or all notifications as read.

import { useState } from "react"
import Link from "next/link"
import {
  Bell,
  BookOpen,
  Wrench,
  FileCheck,
  CreditCard,
  RefreshCw,
  Settings,
  Check,
  CheckCheck,
  Filter,
  ArrowLeft,
  ExternalLink,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { mockNotifications } from "@/lib/mock/notifications"
import type { Notification, NotificationType } from "@/lib/types/database"

/** Icon and label config for each notification type. */
const typeConfig: Record<
  NotificationType,
  { icon: React.ElementType; label: string; color: string; bg: string; badgeBg: string }
> = {
  booking: {
    icon: BookOpen,
    label: "Booking",
    color: "text-info",
    bg: "bg-info-bg",
    badgeBg: "bg-info-bg text-info border-info-border",
  },
  work_order: {
    icon: Wrench,
    label: "Work Order",
    color: "text-warning",
    bg: "bg-warning-bg",
    badgeBg: "bg-warning-bg text-warning border-warning-border",
  },
  permit: {
    icon: FileCheck,
    label: "Permit",
    color: "text-success",
    bg: "bg-success-bg",
    badgeBg: "bg-success-bg text-success border-success-border",
  },
  payment: {
    icon: CreditCard,
    label: "Payment",
    color: "text-primary",
    bg: "bg-primary-fixed",
    badgeBg: "bg-primary-fixed text-primary",
  },
  renewal: {
    icon: RefreshCw,
    label: "Renewal",
    color: "text-status-occupied",
    bg: "bg-status-occupied-bg",
    badgeBg: "bg-status-occupied-bg text-status-occupied border-status-occupied-border",
  },
  system: {
    icon: Settings,
    label: "System",
    color: "text-muted-foreground",
    bg: "bg-surface-container-low",
    badgeBg: "bg-surface-container-low text-muted-foreground",
  },
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr)
  return (
    d.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) +
    " at " +
    d.toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
    })
  )
}

/** Linked entity routes — maps entity types to their admin page paths. */
function getEntityLink(type: string | null, id: string | null): string | null {
  if (!type || !id) return null
  const routes: Record<string, string> = {
    booking: `/bookings/${id}`,
    work_order: `/work-orders/${id}`,
    permit: `/memorials/${id}`,
    right_of_interment: `/rights/${id}`,
    invoice: `/reports`,
  }
  return routes[type] ?? null
}

function NotificationRow({
  notification,
  onMarkRead,
}: {
  notification: Notification
  onMarkRead: (id: string) => void
}) {
  const config = typeConfig[notification.type]
  const Icon = config.icon
  const entityLink = getEntityLink(
    notification.linked_entity_type,
    notification.linked_entity_id
  )

  return (
    <div
      className={`flex gap-4 p-4 rounded-xl transition-colors ${
        notification.read
          ? "bg-surface-container-lowest"
          : "bg-surface-container-low/60 shadow-card"
      }`}
    >
      {/* Type icon */}
      <div
        className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${config.bg}`}
      >
        <Icon className={`size-5 ${config.color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <h3
            className={`text-sm leading-snug ${
              notification.read
                ? "text-muted-foreground"
                : "text-foreground font-semibold"
            }`}
          >
            {notification.title}
          </h3>
          <Badge
            variant="outline"
            className={`shrink-0 text-[10px] ${config.badgeBg}`}
          >
            {config.label}
          </Badge>
        </div>

        {notification.body && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            {notification.body}
          </p>
        )}

        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">
            {formatDateTime(notification.created_at)}
          </span>

          {entityLink && (
            <Link
              href={entityLink}
              className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
            >
              View details
              <ExternalLink className="size-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Mark-as-read button */}
      {!notification.read && (
        <button
          onClick={() => onMarkRead(notification.id)}
          className="shrink-0 self-start p-2 rounded-lg hover:bg-surface-container-high transition-colors text-muted-foreground hover:text-foreground"
          aria-label={`Mark "${notification.title}" as read`}
          title="Mark as read"
        >
          <Check className="size-4" />
        </button>
      )}
    </div>
  )
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [typeFilter, setTypeFilter] = useState("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const filtered =
    typeFilter === "all"
      ? notifications
      : notifications.filter((n) => n.type === typeFilter)

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="p-4 md:p-10 max-w-[1000px] mx-auto w-full space-y-8">
      {/* ── Header ── */}
      <div className="animate-fade-up">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-primary tracking-tight flex items-center gap-3">
              <Bell className="size-8" />
              Notifications
            </h1>
            <p className="text-muted-foreground mt-1">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                : "You're all caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              className="rounded-xl"
              onClick={markAllAsRead}
            >
              <CheckCheck className="size-4" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-3 animate-fade-up stagger-1">
        <Filter className="size-4 text-muted-foreground" />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="booking">Bookings</SelectItem>
            <SelectItem value="work_order">Work Orders</SelectItem>
            <SelectItem value="permit">Permits</SelectItem>
            <SelectItem value="payment">Payments</SelectItem>
            <SelectItem value="renewal">Renewals</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">
          {filtered.length} notification{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Notification list ── */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 animate-fade-up stagger-2">
            <Bell className="size-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              No notifications match this filter.
            </p>
          </div>
        ) : (
          filtered.map((n, i) => (
            <div
              key={n.id}
              className={`animate-fade-up ${
                i < 6 ? `stagger-${(i % 6) + 1}` : ""
              }`}
            >
              <NotificationRow notification={n} onMarkRead={markAsRead} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
