// Skeleton loading state for data tables.
//
// Renders a placeholder header row and N body rows that shimmer,
// matching the alternating row tone pattern used throughout Haven.

import { Skeleton } from "@/components/ui/skeleton"

interface TableSkeletonProps {
  /** Number of columns */
  columns?: number
  /** Number of rows */
  rows?: number
}

export function TableSkeleton({ columns = 5, rows = 6 }: TableSkeletonProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-card overflow-hidden animate-fade-up">
      {/* Header */}
      <div className="flex gap-4 px-6 py-3 bg-surface-container-low">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-4 rounded"
            style={{ width: `${Math.max(60, 100 - i * 10)}px` }}
          />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className={`flex gap-4 px-6 py-4 ${
            rowIdx % 2 === 1 ? "bg-surface-container-low/50" : ""
          }`}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              className="h-4 rounded"
              style={{
                width: `${60 + ((colIdx * 37 + rowIdx * 13) % 60)}px`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
