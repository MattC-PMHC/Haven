// StatCard — a single stat card for the dashboard "bento grid".
//
// Each card has:
//   - A colored 4px bottom border (the "accent" color)
//   - A large numeric value
//   - A label and a small trend/status badge
//
// Uses surface-container-lowest (white) background with ambient shadow
// to create the "lifted" effect described in DESIGN.md.

import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string
  footnote: string
  badgeText: string
  // The accent color for the bottom border and value text.
  // Maps to Tailwind color classes like "primary", "success", "tertiary", "secondary"
  accent: "primary" | "success" | "tertiary" | "secondary"
  className?: string
}

// Map accent names to Tailwind border + text + badge color classes
const accentStyles = {
  primary: {
    border: "border-b-primary",
    text: "text-primary",
    badge: "bg-primary-fixed text-on-primary-fixed",
  },
  success: {
    border: "border-b-success",
    text: "text-success",
    badge: "bg-success-bg text-success",
  },
  tertiary: {
    border: "border-b-tertiary",
    text: "text-tertiary",
    badge: "bg-tertiary-fixed text-tertiary",
  },
  secondary: {
    border: "border-b-secondary",
    text: "text-secondary",
    badge: "bg-secondary-container text-on-secondary-fixed",
  },
}

export function StatCard({
  label,
  value,
  footnote,
  badgeText,
  accent,
  className,
}: StatCardProps) {
  const styles = accentStyles[accent]

  return (
    <div
      className={cn(
        "bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between border-b-4",
        styles.border,
        className
      )}
    >
      <div>
        <p className="text-muted-foreground text-sm font-medium mb-1">
          {label}
        </p>
        <h3 className={cn("text-3xl font-bold", styles.text)}>{value}</h3>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">
          {footnote}
        </span>
        <span
          className={cn(
            "text-[10px] px-2 py-1 rounded-full font-bold",
            styles.badge
          )}
        >
          {badgeText}
        </span>
      </div>
    </div>
  )
}
