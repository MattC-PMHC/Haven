"use client"

// Public Portal — Grave Search
//
// Search for deceased persons by name or date.
// No authentication required. Uses mock data.

import { useState, useMemo } from "react"
import { Search, MapPin, Calendar, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { mockDeceased } from "@/lib/mock/deceased"
import { mockInterments } from "@/lib/mock/deceased"
import { mockPlots, sectionToCemetery } from "@/lib/mock/plots"

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function PublicSearchPage() {
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    if (query.length < 2) return []
    const q = query.toLowerCase()
    return mockDeceased.filter(
      (d) =>
        d.surname.toLowerCase().includes(q) ||
        d.given_names.toLowerCase().includes(q)
    )
  }, [query])

  // Build plot/cemetery lookup for interments
  const plotMap = useMemo(() => {
    const map: Record<string, { plotNumber: string; cemetery: string }> = {}
    for (const plot of mockPlots) {
      map[plot.id] = {
        plotNumber: plot.plot_number,
        cemetery: sectionToCemetery[plot.section_id] ?? "Unknown",
      }
    }
    return map
  }, [])

  const intermentMap = useMemo(() => {
    const map: Record<string, { plotNumber: string; cemetery: string; date: string }> = {}
    for (const int of mockInterments) {
      const plot = plotMap[int.plot_id]
      if (plot) {
        map[int.deceased_id] = {
          plotNumber: plot.plotNumber,
          cemetery: plot.cemetery,
          date: int.interment_date,
        }
      }
    }
    return map
  }, [plotMap])

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* ── Hero ── */}
      <div className="text-center py-8 md:py-12 animate-fade-up">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight mb-3">
          Find a Grave
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Search our cemetery records to find the resting place of a loved one.
        </p>
      </div>

      {/* ── Search Box ── */}
      <div className="max-w-xl mx-auto animate-fade-up stagger-1">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <Input
            placeholder="Search by surname or given name..."
            className="pl-12 h-14 text-lg rounded-xl shadow-card"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {query.length > 0 && query.length < 2 && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Type at least 2 characters to search
          </p>
        )}
      </div>

      {/* ── Results ── */}
      {results.length > 0 && (
        <div className="max-w-2xl mx-auto space-y-3 animate-fade-up stagger-2">
          <p className="text-sm text-muted-foreground">
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </p>
          {results.map((deceased) => {
            const interment = intermentMap[deceased.id]
            return (
              <div
                key={deceased.id}
                className="bg-surface-container-lowest rounded-xl shadow-card p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {deceased.surname}, {deceased.given_names}
                    </h3>
                    {deceased.maiden_name && (
                      <p className="text-sm text-muted-foreground">
                        n&eacute;e {deceased.maiden_name}
                      </p>
                    )}
                  </div>
                  {deceased.religion && (
                    <span className="text-xs text-muted-foreground bg-surface-container-low px-2 py-1 rounded-full">
                      {deceased.religion}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="size-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">
                      {formatDate(deceased.date_of_birth)} — {formatDate(deceased.date_of_death)}
                    </span>
                  </div>
                  {interment && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="size-4 text-primary shrink-0" />
                        <span className="font-medium text-foreground">
                          {interment.cemetery} — Plot {interment.plotNumber}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {interment && (
                  <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="size-3.5" />
                    Interred {formatDate(interment.date)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── No Results ── */}
      {query.length >= 2 && results.length === 0 && (
        <div className="max-w-xl mx-auto text-center py-8 animate-fade-up">
          <Search className="size-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground">
            No records found for &ldquo;{query}&rdquo;
          </p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            Try a different spelling or search by surname only.
          </p>
        </div>
      )}

      {/* ── When no search ── */}
      {query.length === 0 && (
        <div className="max-w-xl mx-auto text-center py-4 text-sm text-muted-foreground animate-fade-up stagger-2">
          <p>Enter a name above to search our records.</p>
          <p className="mt-1 text-muted-foreground/60">
            Results include records from all council-managed cemeteries.
          </p>
        </div>
      )}
    </div>
  )
}
