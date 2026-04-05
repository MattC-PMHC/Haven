// ExpiringRights — rights of interment expiring in 12/24/36 months.
//
// PRD specifies "Rights expiring in next 12/24/36 months" as a
// key dashboard widget. Councils need this for proactive renewal
// outreach — if rights expire unrenewed, the plot can be reclaimed.
// Will be wired to real rights data in Milestone 7.

import Link from "next/link"
import { Clock, AlertTriangle, CalendarClock } from "lucide-react"
import { cn } from "@/lib/utils"

// Placeholder data
const expiryWindows = [
  {
    label: "Within 12 months",
    count: 47,
    icon: AlertTriangle,
    color: "text-destructive",
    bg: "bg-destructive/5",
  },
  {
    label: "Within 24 months",
    count: 128,
    icon: Clock,
    color: "text-warning",
    bg: "bg-warning-bg",
  },
  {
    label: "Within 36 months",
    count: 215,
    icon: CalendarClock,
    color: "text-info",
    bg: "bg-info-bg",
  },
]

export function ExpiringRights() {
  return (
    <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm space-y-6">
      <h4 className="text-xl font-bold text-primary">Expiring Rights</h4>

      {/* Expiry windows */}
      <div className="space-y-3">
        {expiryWindows.map((w) => (
          <div
            key={w.label}
            className={cn("rounded-2xl p-4 flex items-center gap-4", w.bg)}
          >
            <w.icon className={cn("size-5 shrink-0", w.color)} />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{w.label}</p>
            </div>
            <p className={cn("text-2xl font-bold", w.color)}>{w.count}</p>
          </div>
        ))}
      </div>

      {/* Link */}
      <Link
        href="/rights"
        className="block text-center text-sm font-bold text-primary py-2 hover:underline"
      >
        View All Rights
      </Link>
    </section>
  )
}
