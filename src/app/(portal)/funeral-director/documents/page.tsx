// Funeral Director — Document Submission
//
// Allows FDs to view/upload documents related to their bookings.
// Upload is a placeholder until Supabase Storage is connected.

import { FileText } from "lucide-react"
import { DocumentUpload } from "@/components/records/DocumentUpload"
import { DocumentList } from "@/components/records/DocumentList"
import { mockDocuments } from "@/lib/mock/documents"

export default function FDDocumentsPage() {
  // In production, filter by FD's contact ID. For mock, show a few.
  const fdDocs = mockDocuments.filter(
    (d) => d.category === "statutory" || d.category === "correspondence"
  )

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* ── Header ── */}
      <div className="animate-fade-up">
        <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
          Documents
        </h2>
        <p className="text-muted-foreground">
          Upload and manage documents for your booking requests.
        </p>
      </div>

      {/* ── Upload Area ── */}
      <div className="animate-fade-up stagger-1">
        <DocumentUpload />
      </div>

      {/* ── Document List ── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card animate-fade-up stagger-2">
        <div className="flex items-center gap-2 p-5 pb-0">
          <FileText className="size-5 text-primary" />
          <h3 className="font-semibold text-foreground">Your Documents</h3>
          <span className="text-sm text-muted-foreground">({fdDocs.length})</span>
        </div>
        <div className="pt-4">
          <DocumentList documents={fdDocs} />
        </div>
      </div>
    </div>
  )
}
