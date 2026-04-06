-- Migration 010: booking_notes
-- Notes/activity feed for bookings — enables admin-FD communication.

-- ── Table ──
CREATE TABLE IF NOT EXISTS booking_notes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  booking_id    UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  author_id     UUID NOT NULL REFERENCES auth.users(id),
  content       TEXT NOT NULL,
  is_internal   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Indexes ──
CREATE INDEX idx_booking_notes_booking ON booking_notes(booking_id);
CREATE INDEX idx_booking_notes_tenant  ON booking_notes(tenant_id);

-- ── RLS ──
ALTER TABLE booking_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for booking_notes"
  ON booking_notes
  FOR ALL
  USING (
    tenant_id = (
      SELECT p.tenant_id FROM profiles p WHERE p.id = auth.uid()
    )
  )
  WITH CHECK (
    tenant_id = (
      SELECT p.tenant_id FROM profiles p WHERE p.id = auth.uid()
    )
  );

-- ── Audit trigger ──
-- Reuses the existing audit_log trigger function from 009_triggers.sql.
CREATE TRIGGER trg_booking_notes_audit
  AFTER INSERT OR UPDATE OR DELETE ON booking_notes
  FOR EACH ROW EXECUTE FUNCTION log_audit();
