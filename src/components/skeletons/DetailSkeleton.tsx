// Skeleton for detail/form pages (e.g. cemetery detail, plot detail).
//
// Shows a header area, a row of tab-like bars, and content blocks.

import { Skeleton } from "@/components/ui/skeleton"

export function DetailSkeleton() {
  return (
    <div className="p-10 max-w-[1200px] mx-auto w-full space-y-8">
      {/* Back link */}
      <Skeleton className="h-4 w-32 rounded animate-fade-up" />

      {/* Header */}
      <div className="space-y-2 animate-fade-up stagger-1">
        <Skeleton className="h-8 w-64 rounded" />
        <Skeleton className="h-4 w-96 rounded" />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 animate-fade-up stagger-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-lg" />
        ))}
      </div>

      {/* Content card */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card p-6 space-y-4 animate-fade-up stagger-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-4 flex-1 max-w-xs rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
