// Deceased detail page — full record view with tabs.
//
// Tabs: Personal Info, Interments, Documents (M8), Settings (edit)

import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, BookUser } from "lucide-react"
import { getDeceasedById, getIntermentsForDeceased } from "@/lib/mock/deceased"
import { DeceasedDetailTabs } from "@/components/records/DeceasedDetailTabs"

interface DeceasedDetailPageProps {
  params: Promise<{ id: string }>
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function DeceasedDetailPage({ params }: DeceasedDetailPageProps) {
  const { id } = await params

  const deceased = getDeceasedById(id)
  if (!deceased) notFound()

  const interments = getIntermentsForDeceased(id)

  return (
    <div className="p-4 md:p-10 max-w-[1600px] mx-auto w-full space-y-8">
      {/* ── Breadcrumb ── */}
      <div className="animate-fade-up">
        <Link
          href="/registry"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to Registry
        </Link>
      </div>

      {/* ── Header ── */}
      <div className="flex items-start gap-4 animate-fade-up stagger-1">
        <div className="w-14 h-14 rounded-xl bg-primary-fixed flex items-center justify-center">
          <BookUser className="size-6 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-primary tracking-tight">
            {deceased.surname}, {deceased.given_names}
          </h2>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span>{formatDate(deceased.date_of_birth)} — {formatDate(deceased.date_of_death)}</span>
            {deceased.age_at_death && (
              <>
                <span className="text-border">|</span>
                <span>Age {deceased.age_at_death}</span>
              </>
            )}
            {deceased.death_cert_number && (
              <>
                <span className="text-border">|</span>
                <span className="font-mono">{deceased.death_cert_number}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-up stagger-2">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Gender</p>
          <p className="text-sm font-medium text-foreground mt-1">{deceased.gender ?? "—"}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Religion</p>
          <p className="text-sm font-medium text-foreground mt-1">{deceased.religion ?? "—"}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Interments</p>
          <p className="text-2xl font-bold text-primary">{interments.length}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Place of Death</p>
          <p className="text-sm font-medium text-foreground mt-1 line-clamp-1">
            {deceased.place_of_death ?? "—"}
          </p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="animate-fade-up stagger-3">
        <DeceasedDetailTabs deceased={deceased} interments={interments} />
      </div>
    </div>
  )
}
