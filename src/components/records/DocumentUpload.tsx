"use client"

// Placeholder drag-and-drop upload area.
// No actual upload — Supabase Storage not yet connected.

import { Upload } from "lucide-react"

export function DocumentUpload() {
  return (
    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors">
      <Upload className="size-8 text-muted-foreground mx-auto mb-3" />
      <p className="text-sm font-medium text-foreground mb-1">
        Drag & drop files here, or click to browse
      </p>
      <p className="text-xs text-muted-foreground">
        PDF, JPG, PNG up to 10 MB. Upload will be available once storage is connected.
      </p>
    </div>
  )
}
