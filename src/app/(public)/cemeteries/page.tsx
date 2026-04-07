// Public Portal — Cemetery Information
//
// Lists all cemeteries with basic info, hours, and contact details.
// No authentication required. Fetches real data from Supabase.

import { MapPin, Clock, Phone, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getPublicCemeteries } from "@/lib/queries/public-portal"

export default async function PublicCemeteriesPage() {
  const cemeteries = await getPublicCemeteries()

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* ── Header ── */}
      <div className="text-center py-6 animate-fade-up">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight mb-3">
          Our Cemeteries
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Information about council-managed cemeteries in the area.
        </p>
      </div>

      {/* ── Cemetery Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {cemeteries.map((cemetery, i) => (
          <div
            key={cemetery.id}
            className={`bg-surface-container-lowest rounded-xl shadow-card p-6 animate-fade-up stagger-${i + 1}`}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <h3 className="text-xl font-bold text-foreground">{cemetery.name}</h3>
              <Badge className="bg-success-bg text-success border-success-border shrink-0">
                Open
              </Badge>
            </div>

            <div className="space-y-3">
              {/* Address */}
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  {cemetery.address}
                  {cemetery.suburb && `, ${cemetery.suburb}`}
                  {cemetery.state && ` ${cemetery.state}`}
                  {cemetery.postcode && ` ${cemetery.postcode}`}
                </span>
              </div>

              {/* Hours */}
              {cemetery.opening_hours && (
                <div className="flex items-start gap-2 text-sm">
                  <Clock className="size-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{cemetery.opening_hours}</span>
                </div>
              )}

              {/* Phone */}
              {cemetery.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="size-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">{cemetery.phone}</span>
                </div>
              )}

              {/* Email */}
              {cemetery.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">{cemetery.email}</span>
                </div>
              )}
            </div>

            {/* Notes */}
            {cemetery.notes && (
              <p className="text-sm text-muted-foreground/80 mt-4 pt-3 border-t border-border italic">
                {cemetery.notes}
              </p>
            )}

            {/* Map placeholder */}
            <div className="mt-4 bg-surface-container-low rounded-lg p-4 text-center border border-dashed border-border">
              <MapPin className="size-5 text-muted-foreground/40 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Map directions coming soon</p>
            </div>
          </div>
        ))}

        {cemeteries.length === 0 && (
          <div className="col-span-2 text-center py-12 text-muted-foreground">
            No cemeteries found.
          </div>
        )}
      </div>
    </div>
  )
}
