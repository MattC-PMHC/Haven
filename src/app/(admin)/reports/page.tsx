// Reports hub — card links to individual report pages.

import Link from "next/link"
import { BarChart3, PieChart, FileText, TrendingUp } from "lucide-react"

const reports = [
  {
    title: "Interments by Period",
    description: "Monthly breakdown of interments with trends and CSV export.",
    href: "/reports/interments",
    icon: BarChart3,
    accent: "text-info",
    accentBg: "bg-info-bg",
  },
  {
    title: "Plot Inventory Status",
    description: "Distribution of plot statuses across all cemeteries.",
    href: "/reports/inventory",
    icon: PieChart,
    accent: "text-success",
    accentBg: "bg-success-bg",
  },
]

export default function ReportsPage() {
  return (
    <div className="p-10 max-w-[1600px] mx-auto w-full space-y-8">
      {/* ── Header ── */}
      <div className="animate-fade-up">
        <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
          Reports
        </h2>
        <p className="text-muted-foreground">
          Standard reports and analytics for your cemetery operations.
        </p>
      </div>

      {/* ── Report Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, i) => (
          <Link
            key={report.href}
            href={report.href}
            className={`group bg-surface-container-lowest rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 animate-fade-up stagger-${i + 1}`}
          >
            <div className={`inline-flex items-center justify-center size-10 rounded-lg ${report.accentBg} mb-4`}>
              <report.icon className={`size-5 ${report.accent}`} />
            </div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
              {report.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {report.description}
            </p>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <TrendingUp className="size-4" />
              View Report
            </div>
          </Link>
        ))}

        {/* Placeholder for future reports */}
        <div className="bg-surface-container-low/50 rounded-xl p-6 border border-dashed border-border flex flex-col items-center justify-center text-center animate-fade-up stagger-3">
          <FileText className="size-8 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">More reports coming soon</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Financial, compliance, and capacity reports
          </p>
        </div>
      </div>
    </div>
  )
}
