"use client"

// ActivityFeed — timeline of booking notes for admin-FD communication.
//
// Shows notes chronologically with author name, timestamp, and an
// "Internal" badge for notes not visible to external stakeholders.
// Includes a form to add new notes at the bottom.

import { useActionState } from "react"
import { MessageSquare, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createBookingNoteAction } from "@/lib/actions/booking-notes"
import type { BookingNoteWithAuthor } from "@/lib/queries/booking-notes"

interface ActivityFeedProps {
  bookingId: string
  notes: BookingNoteWithAuthor[]
}

function formatTimestamp(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function ActivityFeed({ bookingId, notes }: ActivityFeedProps) {
  const [state, formAction, isPending] = useActionState(createBookingNoteAction, null)

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
        Activity & Notes
      </h3>

      {/* ── Timeline ── */}
      {notes.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="size-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No notes yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="relative pl-6 border-l-2 border-border pb-4 last:pb-0"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary" />

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-foreground">
                    {note.author_name ?? "Unknown"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(note.created_at)}
                  </span>
                  {note.is_internal && (
                    <Badge
                      variant="outline"
                      className="text-xs gap-1 text-muted-foreground"
                    >
                      <Lock className="size-3" />
                      Internal
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                  {note.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add Note Form ── */}
      <form action={formAction} className="space-y-3 pt-4 border-t border-border">
        <input type="hidden" name="booking_id" value={bookingId} />
        <input type="hidden" name="is_internal" value="true" />

        {state?.error && (
          <p className="text-xs text-destructive">{state.error}</p>
        )}
        {state?.success && (
          <p className="text-xs text-success">{state.success}</p>
        )}

        <div className="space-y-2">
          <Label htmlFor="content">Add a note</Label>
          <Textarea
            id="content"
            name="content"
            placeholder="Type a note for the team..."
            rows={3}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Lock className="size-3" />
            Internal notes are only visible to staff
          </p>
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Adding..." : "Add Note"}
          </Button>
        </div>
      </form>
    </div>
  )
}
