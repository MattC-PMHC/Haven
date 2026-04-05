// Document list table — reusable for any entity's documents tab.

import { FileText, Image, Map, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Document } from "@/lib/types/database"
import { getCategoryLabel, formatFileSize } from "@/lib/mock/documents"

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function FileIcon({ fileType }: { fileType: string | null }) {
  if (fileType?.startsWith("image/")) return <Image className="size-4 text-info" />
  if (fileType === "application/pdf") return <FileText className="size-4 text-destructive" />
  if (fileType?.includes("map")) return <Map className="size-4 text-success" />
  return <FileText className="size-4 text-muted-foreground" />
}

const categoryStyles: Record<string, string> = {
  statutory: "bg-info-bg text-info border-info-border",
  contractual: "bg-warning-bg text-warning border-warning-border",
  correspondence: "bg-surface-container-high text-foreground",
  photo: "bg-success-bg text-success border-success-border",
  map: "bg-status-reserved-bg text-status-reserved border-status-reserved-border",
  report: "bg-surface-container-high text-secondary",
  other: "bg-surface-container-high text-muted-foreground",
}

export function DocumentList({ documents }: { documents: Document[] }) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="size-8 mx-auto mb-3 opacity-40" />
        <p className="text-sm">No documents uploaded yet.</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="pl-6">File</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Linked To</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Uploaded</TableHead>
          <TableHead className="pr-6 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc, i) => (
          <TableRow
            key={doc.id}
            className={i % 2 === 1 ? "bg-surface-container-low/50" : ""}
          >
            <TableCell className="pl-6">
              <div className="flex items-center gap-2">
                <FileIcon fileType={doc.file_type} />
                <span className="font-medium text-sm">{doc.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge className={categoryStyles[doc.category] ?? ""}>
                {getCategoryLabel(doc.category)}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground capitalize">
              {doc.linked_entity_type}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatFileSize(doc.file_size_bytes)}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDate(doc.created_at)}
            </TableCell>
            <TableCell className="pr-6 text-right">
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="sm" disabled title="Download (placeholder)">
                  <Download className="size-4" />
                </Button>
                <Button variant="ghost" size="sm" disabled title="Delete (placeholder)">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
