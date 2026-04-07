// Mason Portal — Dashboard
//
// Shows active permits, pending applications, and quick stats.
// Fetches real data from Supabase filtered by the mason's contact record.

import Link from "next/link"
import { redirect } from "next/navigation"
import { Plus, Landmark, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSession } from "@/lib/auth/get-session"
import {
  getMasonContactForUser,
  getPermitsForMason,
  getPermitStats,
} from "@/lib/queries/mason-portal"

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const workTypeLabels: Record<string, string> = {
  new_memorial: "New Memorial",
  additional_inscription: "Additional Inscription",
  repair: "Repair",
  restoration: "Restoration",
  removal: "Removal",
}

const statusStyles: Record<string, string> = {
  submitted: "bg-warning-bg text-warning border-warning-border",
  under_review: "bg-info-bg text-info border-info-border",
  approved: "bg-success-bg text-success border-success-border",
  rejected: "bg-status-restricted-bg text-destructive border-status-restricted-border",
  completed: "bg-surface-container-high text-muted-foreground",
}

const statusLabels: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
}

export default async function MasonDashboard() {
  const session = await getSession()
  if (!session) redirect("/login")

  const masonContact = await getMasonContactForUser(session.user.email)

  // If no contact record found, show a helpful message
  if (!masonContact) {
    return (
      <div className="p-6 md:p-10 space-y-6 text-center">
        <h2 className="text-2xl font-bold text-primary">Account Not Linked</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your login isn&apos;t linked to a mason contact record yet.
          Please contact the council administrator to set up your account.
        </p>
      </div>
    )
  }

  const permits = await getPermitsForMason(masonContact.id)
  const stats = await getPermitStats(masonContact.id)

  const active = permits.filter(
    (p) => p.status === "submitted" || p.status === "under_review" || p.status === "approved"
  )
  const completed = permits.filter((p) => p.status === "completed")

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* ── Header ── */}
      <div className="flex justify-between items-end animate-fade-up">
        <div>
          <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
            Welcome Back
          </h2>
          <p className="text-muted-foreground">
            Manage your memorial permit applications and track approvals.
          </p>
        </div>
        <Button asChild className="rounded-xl">
          <Link href="/mason/apply">
            <Plus className="size-4" />
            New Application
          </Link>
        </Button>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-up stagger-1">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Submitted</p>
          <p className="text-2xl font-bold text-warning">{stats.byStatus.submitted ?? 0}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Under Review</p>
          <p className="text-2xl font-bold text-info">{stats.byStatus.under_review ?? 0}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Approved</p>
          <p className="text-2xl font-bold text-success">{stats.byStatus.approved ?? 0}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Total</p>
          <p className="text-2xl font-bold text-primary">{stats.total}</p>
        </div>
      </div>

      {/* ── Active Permits ── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card animate-fade-up stagger-2">
        <div className="flex items-center gap-2 p-5 pb-3">
          <Clock className="size-5 text-info" />
          <h3 className="font-semibold text-foreground">Active Applications</h3>
          <span className="text-sm text-muted-foreground">({active.length})</span>
        </div>
        <div className="divide-y divide-border">
          {active.map((permit) => (
            <div key={permit.id} className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Landmark className="size-4 text-muted-foreground shrink-0" />
                  <p className="font-medium text-foreground truncate">
                    {workTypeLabels[permit.work_type] ?? permit.work_type}
                    {permit.plot_number ? ` — ${permit.plot_number}` : ""}
                  </p>
                </div>
                {permit.description && (
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                    {permit.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  Submitted {formatDate(permit.submitted_at)}
                </p>
              </div>
              <Badge className={statusStyles[permit.status] ?? ""}>
                {statusLabels[permit.status] ?? permit.status}
              </Badge>
            </div>
          ))}
          {active.length === 0 && (
            <div className="px-5 py-8 text-center text-muted-foreground text-sm">
              No active applications.
            </div>
          )}
        </div>
      </div>

      {/* ── Completed ── */}
      {completed.length > 0 && (
        <div className="bg-surface-container-lowest rounded-xl shadow-card animate-fade-up stagger-3">
          <div className="flex items-center gap-2 p-5 pb-3">
            <CheckCircle2 className="size-5 text-success" />
            <h3 className="font-semibold text-foreground">Completed</h3>
          </div>
          <div className="divide-y divide-border">
            {completed.map((permit) => (
              <div key={permit.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {workTypeLabels[permit.work_type] ?? permit.work_type}
                    {permit.plot_number ? ` — ${permit.plot_number}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Completed {formatDate(permit.completed_at)}
                  </p>
                </div>
                <Badge className="bg-surface-container-high text-muted-foreground">
                  Completed
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
