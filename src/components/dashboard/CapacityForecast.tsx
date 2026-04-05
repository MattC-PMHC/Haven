// CapacityForecast — dark banner showing years of capacity remaining.
//
// Uses bg-primary (deep navy) with a "Capacity Forecast" label.
// The PRD specifies capacity forecast as a key dashboard widget —
// councils need to plan expansions years in advance.
// Will be calculated from real plot data in later milestones.

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CapacityForecast() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-primary text-primary-foreground rounded-3xl p-12 overflow-hidden relative">
      <div className="space-y-6 z-10">
        {/* Category label */}
        <span className="px-4 py-1.5 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-primary-fixed inline-block">
          Capacity Forecast
        </span>

        {/* Headline */}
        <h2 className="text-3xl font-bold leading-tight">
          Your current plot inventory will sustain city requirements for
          approximately 4.2 years.
        </h2>

        {/* Supporting text */}
        <p className="text-on-primary-container text-lg">
          Based on average annual interment rates across all managed cemeteries.
          Consider planning expansion for high-demand sections.
        </p>

        {/* CTA */}
        <Button
          asChild
          variant="secondary"
          className="bg-white text-primary hover:bg-white/90 px-8 py-3 h-auto rounded-xl font-bold"
        >
          <Link href="/reports">View Capacity Report</Link>
        </Button>
      </div>

      {/* Right side — decorative area */}
      <div className="relative h-64 md:h-full min-h-[200px] rounded-3xl bg-primary-container/30" />

      {/* Decorative blur circle */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
    </div>
  )
}
