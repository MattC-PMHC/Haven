// Documents page — list of all uploaded documents across entities.
//
// Uses mock data. Upload/download/delete are visual placeholders
// until Supabase Storage is connected.

import { FileText } from "lucide-react"
import { DocumentUpload } from "@/components/records/DocumentUpload"
import { DocumentList } from "@/components/records/DocumentList"
import { mockDocuments, getDocumentStats, getCategoryLabel } from "@/lib/mock/documents"
import type { DocumentCategory } from "@/lib/types/database"

export default function DocumentsPage() {
  const stats = getDocumentStats()

  return (
    <div className="p-4 md:p-10 max-w-[1600px] mx-auto w-full space-y-8">
      {/* ── Header ── */}
      <div className="flex justify-between items-end animate-fade-up">
        <div>
          <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
            Documents
          </h2>
          <p className="text-muted-foreground">
            All uploaded files across cemeteries, plots, and records.
          </p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-up stagger-1">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Total Files</p>
          <p className="text-2xl font-bold text-primary">{stats.total}</p>
        </div>
        {(["statutory", "contractual", "photo"] as DocumentCategory[]).map((cat) => (
          <div key={cat} className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
            <p className="text-muted-foreground text-sm font-medium">{getCategoryLabel(cat)}</p>
            <p className="text-2xl font-bold text-primary">{stats.byCategory[cat] ?? 0}</p>
          </div>
        ))}
      </div>

      {/* ── Upload Area ── */}
      <div className="animate-fade-up stagger-2">
        <DocumentUpload />
      </div>

      {/* ── Document Table ── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card animate-fade-up stagger-3">
        <div className="flex items-center gap-2 p-5 pb-0">
          <FileText className="size-5 text-primary" />
          <h3 className="font-semibold text-foreground">All Documents</h3>
          <span className="text-sm text-muted-foreground">({stats.total})</span>
        </div>
        <div className="pt-4">
          <DocumentList documents={mockDocuments} />
        </div>
      </div>
    </div>
  )
}
