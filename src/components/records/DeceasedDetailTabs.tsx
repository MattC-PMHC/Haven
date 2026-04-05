"use client"

// DeceasedDetailTabs — tabbed view for the deceased detail page.
//
// Tabs: Personal, Interments, Documents (M8 placeholder), Settings (edit form)

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileText } from "lucide-react"
import { DeceasedForm } from "@/components/records/DeceasedForm"
import type { Deceased, Interment } from "@/lib/types/database"

interface DeceasedDetailTabsProps {
  deceased: Deceased
  interments: Interment[]
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const intermentTypeLabels: Record<string, string> = {
  burial: "Burial",
  ashes_interment: "Ashes Interment",
  ashes_scattering: "Ashes Scattering",
  mausoleum_placement: "Mausoleum Placement",
}

const intermentStatusStyles: Record<string, string> = {
  scheduled: "bg-info-bg text-info border-info-border",
  completed: "bg-success-bg text-success border-success-border",
  cancelled: "bg-surface-container-high text-muted-foreground",
}

export function DeceasedDetailTabs({ deceased, interments }: DeceasedDetailTabsProps) {
  return (
    <Tabs defaultValue="personal">
      <TabsList variant="line">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="interments">Interments ({interments.length})</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      {/* ── Personal Tab ── */}
      <TabsContent value="personal" className="mt-6">
        <div className="bg-surface-container-lowest rounded-xl shadow-card p-8">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Personal Details
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Surname</dt>
              <dd className="text-sm mt-0.5">{deceased.surname}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Given Names</dt>
              <dd className="text-sm mt-0.5">{deceased.given_names}</dd>
            </div>
            {deceased.maiden_name && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Maiden Name</dt>
                <dd className="text-sm mt-0.5">{deceased.maiden_name}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Gender</dt>
              <dd className="text-sm mt-0.5">{deceased.gender ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Date of Birth</dt>
              <dd className="text-sm mt-0.5">{formatDate(deceased.date_of_birth)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Date of Death</dt>
              <dd className="text-sm mt-0.5">{formatDate(deceased.date_of_death)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Place of Death</dt>
              <dd className="text-sm mt-0.5">{deceased.place_of_death ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Religion</dt>
              <dd className="text-sm mt-0.5">{deceased.religion ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Cultural Background</dt>
              <dd className="text-sm mt-0.5">{deceased.cultural_background ?? "—"}</dd>
            </div>

            {/* Official References */}
            <div className="md:col-span-2 pt-4">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">
                Official References
              </h4>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Death Certificate #</dt>
              <dd className="text-sm mt-0.5 font-mono">{deceased.death_cert_number ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Burial Order #</dt>
              <dd className="text-sm mt-0.5 font-mono">{deceased.burial_order_number ?? "—"}</dd>
            </div>
            {deceased.doctor_coroner_ref && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Doctor/Coroner Ref</dt>
                <dd className="text-sm mt-0.5 font-mono">{deceased.doctor_coroner_ref}</dd>
              </div>
            )}
            {deceased.notes && (
              <div className="md:col-span-2 pt-2">
                <dt className="text-sm font-medium text-muted-foreground">Notes</dt>
                <dd className="text-sm mt-0.5 whitespace-pre-line">{deceased.notes}</dd>
              </div>
            )}
          </dl>
        </div>
      </TabsContent>

      {/* ── Interments Tab ── */}
      <TabsContent value="interments" className="mt-6">
        {interments.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl shadow-card p-12 text-center">
            <p className="text-muted-foreground">
              No interment records linked to this person.
            </p>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl shadow-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Plot</TableHead>
                  <TableHead>Depth</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interments.map((interment, i) => (
                  <TableRow
                    key={interment.id}
                    className={i % 2 === 1 ? "bg-surface-container-low/50" : ""}
                  >
                    <TableCell className="pl-6 font-medium">
                      {formatDate(interment.interment_date)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {interment.interment_time ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {intermentTypeLabels[interment.interment_type] ?? interment.interment_type}
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {interment.plot_id ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {interment.depth ? `${interment.depth}m` : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge className={intermentStatusStyles[interment.status] ?? ""}>
                        {interment.status.charAt(0).toUpperCase() + interment.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>

      {/* ── Documents Tab (M8 placeholder) ── */}
      <TabsContent value="documents" className="mt-6">
        <div className="bg-surface-container-lowest rounded-xl shadow-card p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center mx-auto mb-4">
            <FileText className="size-5 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Document uploads will be available in Milestone 8.
          </p>
        </div>
      </TabsContent>

      {/* ── Settings Tab ── */}
      <TabsContent value="settings" className="mt-6">
        <div className="bg-surface-container-lowest rounded-xl shadow-card p-8">
          <h3 className="text-lg font-semibold text-primary mb-6">
            Edit Record
          </h3>
          <DeceasedForm deceased={deceased} />
        </div>
      </TabsContent>
    </Tabs>
  )
}
