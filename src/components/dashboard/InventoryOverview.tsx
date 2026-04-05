// InventoryOverview — plot inventory breakdown by status.
//
// Shows a horizontal stacked bar visualising how many plots are
// in each status, plus a summary table underneath.
// PRD specifies "Inventory status by section and cemetery" as a
// key dashboard widget for council admins.
// Will be wired to real plot queries in Milestone 6.

import Link from "next/link"

// Placeholder data — replaced with Supabase queries in M6
const statusData = [
  { status: "Available", count: 1245, color: "bg-status-available", textColor: "text-status-available" },
  { status: "Reserved", count: 320, color: "bg-status-reserved", textColor: "text-status-reserved" },
  { status: "Occupied", count: 6480, color: "bg-status-occupied", textColor: "text-status-occupied" },
  { status: "Restricted", count: 85, color: "bg-status-restricted", textColor: "text-status-restricted" },
  { status: "Maintenance", count: 42, color: "bg-status-maintenance", textColor: "text-status-maintenance" },
  { status: "Expired", count: 248, color: "bg-status-expired", textColor: "text-status-expired" },
]

const total = statusData.reduce((sum, s) => sum + s.count, 0)

export function InventoryOverview() {
  return (
    <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-bold text-primary">Plot Inventory</h4>
        <span className="text-sm text-muted-foreground font-medium">
          {total.toLocaleString()} total plots
        </span>
      </div>

      {/* Stacked horizontal bar */}
      <div className="flex h-4 rounded-full overflow-hidden">
        {statusData.map((item) => (
          <div
            key={item.status}
            className={`${item.color} transition-all`}
            style={{ width: `${(item.count / total) * 100}%` }}
            title={`${item.status}: ${item.count.toLocaleString()}`}
          />
        ))}
      </div>

      {/* Legend / summary grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {statusData.map((item) => (
          <div key={item.status} className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${item.color} shrink-0`} />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {item.count.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">{item.status}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Link to full inventory */}
      <Link
        href="/plots"
        className="block text-center text-sm font-bold text-primary py-2 hover:underline"
      >
        View Full Inventory
      </Link>
    </section>
  )
}
