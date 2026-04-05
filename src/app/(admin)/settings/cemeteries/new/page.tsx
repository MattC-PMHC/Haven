// Create new cemetery page.
//
// Simple page wrapper around the shared CemeteryForm component.

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CemeteryForm } from "@/components/records/CemeteryForm"

export default function NewCemeteryPage() {
  return (
    <div className="p-10 max-w-[900px] mx-auto w-full space-y-8">
      {/* ── Breadcrumb / Back ── */}
      <div className="animate-fade-up">
        <Link
          href="/settings/cemeteries"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to Cemeteries
        </Link>
        <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
          New Cemetery
        </h2>
        <p className="text-muted-foreground">
          Add a new cemetery to your council&apos;s management system.
        </p>
      </div>

      {/* ── Form Card ── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card p-8 animate-fade-up stagger-1">
        <CemeteryForm />
      </div>
    </div>
  )
}
