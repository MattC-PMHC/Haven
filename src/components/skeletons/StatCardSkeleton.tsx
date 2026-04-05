// Skeleton for the dashboard stat cards.
//
// Mimics the StatCard layout: value, label, footnote, and accent bar.

import { Skeleton } from "@/components/ui/skeleton"

export function StatCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-card p-6 space-y-3">
      <Skeleton className="h-3 w-28 rounded" />
      <Skeleton className="h-8 w-16 rounded" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-36 rounded" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  )
}

/** A row of 4 stat card skeletons for the dashboard. */
export function StatCardRowSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={`animate-fade-up stagger-${i + 1}`}>
          <StatCardSkeleton />
        </div>
      ))}
    </div>
  )
}
