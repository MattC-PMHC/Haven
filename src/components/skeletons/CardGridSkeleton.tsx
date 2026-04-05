// Skeleton for card grid layouts (e.g. reports hub, portal dashboards).
//
// Renders a grid of card-shaped shimmer blocks.

import { Skeleton } from "@/components/ui/skeleton"

interface CardGridSkeletonProps {
  /** Number of cards */
  count?: number
  /** Grid columns (tailwind class) */
  columns?: string
}

export function CardGridSkeleton({
  count = 6,
  columns = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
}: CardGridSkeletonProps) {
  return (
    <div className={`grid ${columns} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-surface-container-lowest rounded-xl shadow-card p-6 space-y-3 animate-fade-up ${
            i < 6 ? `stagger-${i + 1}` : ""
          }`}
        >
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-3 w-48 rounded" />
          <Skeleton className="h-3 w-36 rounded" />
        </div>
      ))}
    </div>
  )
}
