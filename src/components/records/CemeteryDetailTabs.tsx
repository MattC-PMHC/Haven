"use client"

// CemeteryDetailTabs — tabbed view for cemetery detail page.
//
// Tabs:
//   Overview  — notes + details card
//   Sections  — section table with add/edit dialog
//   Settings  — cemetery edit form

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Grid3x3 } from "lucide-react"
import { CemeteryForm } from "@/components/records/CemeteryForm"
import { SectionForm } from "@/components/records/SectionForm"
import type { Cemetery, Section } from "@/lib/types/database"

interface CemeteryDetailTabsProps {
  cemetery: Cemetery
  sections: Section[]
  plotCounts: Record<string, { total: number; available: number }>
}

// Human-readable labels for section types
const sectionTypeLabels: Record<string, string> = {
  lawn: "Lawn",
  monumental: "Monumental",
  columbarium: "Columbarium",
  memorial_garden: "Memorial Garden",
  memorial_wall: "Memorial Wall",
  scattering_garden: "Scattering Garden",
  natural_burial: "Natural Burial",
  vault: "Vault",
  infant: "Infant",
  denominational: "Denominational",
  war_grave: "War Grave",
}

// Badge colours for section status
function sectionStatusBadge(status: string) {
  switch (status) {
    case "active":
      return "bg-success-bg text-success border-success-border"
    case "full":
      return "bg-warning-bg text-warning border-warning-border"
    case "closed":
      return "bg-surface-container-high text-muted-foreground"
    default:
      return ""
  }
}

export function CemeteryDetailTabs({
  cemetery,
  sections,
  plotCounts,
}: CemeteryDetailTabsProps) {
  const [addSectionOpen, setAddSectionOpen] = useState(false)
  const [editSection, setEditSection] = useState<Section | null>(null)

  return (
    <>
      <Tabs defaultValue="sections">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sections">
            Sections ({sections.length})
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* ── Overview Tab ── */}
        <TabsContent value="overview" className="mt-6">
          <div className="bg-surface-container-lowest rounded-xl shadow-card p-8">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Cemetery Details
            </h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-sm mt-0.5">{cemetery.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="text-sm mt-0.5 capitalize">{cemetery.status}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                <dd className="text-sm mt-0.5">
                  {[cemetery.address, cemetery.suburb, cemetery.state, cemetery.postcode]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                <dd className="text-sm mt-0.5">{cemetery.phone || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="text-sm mt-0.5">{cemetery.email || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Opening Hours</dt>
                <dd className="text-sm mt-0.5">{cemetery.opening_hours || "—"}</dd>
              </div>
              {cemetery.notes && (
                <div className="md:col-span-2">
                  <dt className="text-sm font-medium text-muted-foreground">Notes</dt>
                  <dd className="text-sm mt-0.5 whitespace-pre-line">{cemetery.notes}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                <dd className="text-sm mt-0.5">
                  {new Date(cemetery.created_at).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                <dd className="text-sm mt-0.5">
                  {new Date(cemetery.updated_at).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </dd>
              </div>
            </dl>
          </div>
        </TabsContent>

        {/* ── Sections Tab ── */}
        <TabsContent value="sections" className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Manage the sections within this cemetery.
            </p>
            <Button
              onClick={() => setAddSectionOpen(true)}
              className="rounded-xl"
              size="sm"
            >
              <Plus className="size-4" />
              Add Section
            </Button>
          </div>

          {sections.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl shadow-card p-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center mx-auto mb-4">
                <Grid3x3 className="size-5 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">
                No sections have been added yet.
              </p>
              <Button
                onClick={() => setAddSectionOpen(true)}
                variant="outline"
                size="sm"
              >
                <Plus className="size-4" />
                Add First Section
              </Button>
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-xl shadow-card">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6">Section</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Total Plots</TableHead>
                    <TableHead className="text-center">Available</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sections.map((section, i) => {
                    const counts = plotCounts[section.id]
                    return (
                      <TableRow
                        key={section.id}
                        className={i % 2 === 1 ? "bg-surface-container-low/50" : ""}
                      >
                        <TableCell className="pl-6 font-medium">
                          {section.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {section.code || "—"}
                        </TableCell>
                        <TableCell>
                          {sectionTypeLabels[section.section_type ?? ""] ?? section.section_type ?? "—"}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {counts?.total ?? 0}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={
                              (counts?.available ?? 0) > 0
                                ? "text-success font-medium"
                                : "text-muted-foreground"
                            }
                          >
                            {counts?.available ?? 0}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={sectionStatusBadge(section.status)}>
                            {section.status === "active"
                              ? "Active"
                              : section.status === "full"
                                ? "Full"
                                : "Closed"}
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditSection(section)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* ── Settings Tab ── */}
        <TabsContent value="settings" className="mt-6">
          <div className="bg-surface-container-lowest rounded-xl shadow-card p-8">
            <h3 className="text-lg font-semibold text-primary mb-6">
              Edit Cemetery
            </h3>
            <CemeteryForm cemetery={cemetery} />
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Add Section Dialog ── */}
      <Dialog open={addSectionOpen} onOpenChange={setAddSectionOpen}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
            <DialogDescription>
              Create a new section in {cemetery.name}.
            </DialogDescription>
          </DialogHeader>
          <SectionForm
            cemeteryId={cemetery.id}
            onSuccess={() => setAddSectionOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* ── Edit Section Dialog ── */}
      <Dialog
        open={!!editSection}
        onOpenChange={(open) => !open && setEditSection(null)}
      >
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>
              Update section details for {editSection?.name}.
            </DialogDescription>
          </DialogHeader>
          {editSection && (
            <SectionForm
              cemeteryId={cemetery.id}
              section={editSection}
              onSuccess={() => setEditSection(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
