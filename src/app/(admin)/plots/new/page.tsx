// Create new plot page.

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PlotForm } from "@/components/records/PlotForm"
import { mockSections } from "@/lib/mock/cemeteries"

export default function NewPlotPage() {
  // Only show active sections as options
  const activeSections = mockSections.filter((s) => s.status === "active")

  return (
    <div className="p-10 max-w-[900px] mx-auto w-full space-y-8">
      <div className="animate-fade-up">
        <Link
          href="/plots"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to Plots
        </Link>
        <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
          New Plot
        </h2>
        <p className="text-muted-foreground">
          Add a new plot to a cemetery section.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-card p-8 animate-fade-up stagger-1">
        <PlotForm sections={activeSections} />
      </div>
    </div>
  )
}
