// Deceased records list — searchable registry of all deceased persons.

import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getDeceasedRecords, getDeceasedStats } from "@/lib/queries/deceased"
import { RegistrySearch } from "./RegistrySearch"

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function calculateAge(dob: string | null, dod: string | null): string {
  if (!dob || !dod) return "—"
  const birth = new Date(dob)
  const death = new Date(dod)
  let age = death.getFullYear() - birth.getFullYear()
  if (
    death.getMonth() < birth.getMonth() ||
    (death.getMonth() === birth.getMonth() && death.getDate() < birth.getDate())
  ) {
    age--
  }
  return String(age)
}

interface RegistryPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function RegistryPage({ searchParams }: RegistryPageProps) {
  const { q } = await searchParams
  const [allDeceased, stats] = await Promise.all([
    getDeceasedRecords(),
    getDeceasedStats(),
  ])

  // Filter locally if search query provided
  const deceased = q
    ? allDeceased.filter((d) => {
        const term = q.toLowerCase()
        return (
          d.surname?.toLowerCase().includes(term) ||
          d.given_names?.toLowerCase().includes(term) ||
          d.maiden_name?.toLowerCase().includes(term) ||
          d.death_cert_number?.toLowerCase().includes(term)
        )
      })
    : allDeceased

  return (
    <div className="p-4 md:p-10 max-w-[1600px] mx-auto w-full space-y-8">
      {/* ── Header ── */}
      <div className="flex justify-between items-end animate-fade-up">
        <div>
          <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
            Deceased Records
          </h2>
          <p className="text-muted-foreground">
            Registry of all deceased persons across your cemeteries.
          </p>
        </div>
        <Button asChild className="rounded-xl">
          <Link href="/registry/new">
            <Plus className="size-4" />
            New Record
          </Link>
        </Button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fade-up stagger-1">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Total Records</p>
          <p className="text-2xl font-bold text-primary">{stats.total}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">This Year (2026)</p>
          <p className="text-2xl font-bold text-primary">{stats.thisYear}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Showing</p>
          <p className="text-2xl font-bold text-primary">
            {deceased.length}{q ? ` of ${allDeceased.length}` : ""}
          </p>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="animate-fade-up stagger-2">
        <RegistrySearch defaultValue={q ?? ""} />
      </div>

      {/* ── Table ── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card animate-fade-up stagger-3">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Name</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Date of Death</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Death Cert #</TableHead>
              <TableHead>Religion</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deceased.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  {q ? `No records matching "${q}"` : "No deceased records found."}
                </TableCell>
              </TableRow>
            ) : (
              deceased.map((d, i) => (
                <TableRow
                  key={d.id}
                  className={i % 2 === 1 ? "bg-surface-container-low/50" : ""}
                >
                  <TableCell className="pl-6">
                    <Link
                      href={`/registry/${d.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {d.surname}, {d.given_names}
                    </Link>
                    {d.maiden_name && (
                      <span className="text-xs text-muted-foreground ml-1">
                        (née {d.maiden_name})
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(d.date_of_birth)}
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(d.date_of_death)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {calculateAge(d.date_of_birth, d.date_of_death)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">
                    {d.death_cert_number ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {d.religion ?? "—"}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/registry/${d.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
