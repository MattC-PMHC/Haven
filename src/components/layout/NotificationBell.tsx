"use client"

// Notification bell with unread count badge and popover dropdown.
//
// Shows the most recent notifications in a dropdown. Users can mark
// individual items or all items as read. Links to the full inbox page.
//
// Uses mock data — will switch to Supabase Realtime when connected.

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
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { mockNotifications } from "@/lib/mock/notifications"
import type { Notification, NotificationType } from "@/lib/types/database"

/** Icon and colour for each notification type. */
const typeConfig: Record<
  NotificationType,
  { icon: React.ElementType; color: string; bg: string }
> = {
  booking: { icon: BookOpen, color: "text-info", bg: "bg-info-bg" },
  work_order: { icon: Wrench, color: "text-warning", bg: "bg-warning-bg" },
  permit: { icon: FileCheck, color: "text-success", bg: "bg-success-bg" },
  payment: { icon: CreditCard, color: "text-primary", bg: "bg-primary-fixed" },
  renewal: { icon: RefreshCw, color: "text-status-occupied", bg: "bg-status-occupied-bg" },
  system: { icon: Settings, color: "text-muted-foreground", bg: "bg-surface-container-low" },
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString("en-AU", { day: "numeric", month: "short" })
}

function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: Notification
  onMarkRead: (id: string) => void
}) {
  const config = typeConfig[notification.type]
  const Icon = config.icon

  return (
    <div
      className={`flex gap-3 p-3 rounded-lg transition-colors ${
        notification.read
          ? "opacity-60"
          : "bg-surface-container-low/50"
      }`}
    >
      {/* Type icon */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${config.bg}`}
      >
        <Icon className={`size-4 ${config.color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            notification.read ? "text-muted-foreground" : "text-foreground font-medium"
          }`}
        >
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatTimeAgo(notification.created_at)}
        </p>
      </div>

      {/* Mark-as-read button */}
      {!notification.read && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onMarkRead(notification.id)
          }}
          className="shrink-0 p-1 rounded-full hover:bg-surface-container-high transition-colors text-muted-foreground hover:text-foreground"
          aria-label={`Mark "${notification.title}" as read`}
          title="Mark as read"
        >
          <Check className="size-3.5" />
        </button>
      )}
    </div>
  )
}

export function NotificationBell() {
  // Local state for mock — in production this would come from a query/realtime
  const [notifications, setNotifications] = useState(mockNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  // Show the 6 most recent in the dropdown
  const recentNotifications = notifications.slice(0, 6)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        >
          <Bell className="size-5" />
          {/* Unread count badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-destructive text-white text-[10px] font-bold rounded-full px-1 shadow-sm">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-96 p-0 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-sm text-foreground">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* Notification list */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-border/50">
          {recentNotifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={markAsRead}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2.5">
          <Link
            href="/notifications"
            className="block text-center text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
