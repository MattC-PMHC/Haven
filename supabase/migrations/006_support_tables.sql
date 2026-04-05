-- 006_support_tables.sql
-- Supporting tables for documents, finances, auditing, and notifications:
--   documents      -> file uploads linked to any record (polymorphic)
--   fee_schedules  -> configurable pricing per cemetery and service type
--   invoices       -> billing for services rendered
--   audit_logs     -> immutable record of every data change
--   notifications  -> in-app notification feed for users

-- ============================================================
-- DOCUMENTS
-- ============================================================
-- Stores metadata about uploaded files (the actual files live in
-- Supabase Storage). Uses polymorphic linking so any record type
-- can have documents attached to it.
CREATE TABLE documents (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,            -- display name
  category            document_category NOT NULL DEFAULT 'other',
  file_url            TEXT NOT NULL,            -- Supabase Storage URL
  file_type           TEXT,                     -- MIME type e.g. "application/pdf"
  file_size_bytes     BIGINT,
  linked_entity_type  TEXT NOT NULL,            -- e.g. "plot", "deceased", "booking"
  linked_entity_id    UUID NOT NULL,            -- the ID of that record
  uploaded_by         UUID REFERENCES profiles(id),
  created_at          TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Now wire up the FK references that were deferred from earlier tables
ALTER TABLE rights_of_interment
  ADD CONSTRAINT fk_roi_contract_document
  FOREIGN KEY (contract_document_id) REFERENCES documents(id);

ALTER TABLE memorial_permits
  ADD CONSTRAINT fk_permit_design_document
  FOREIGN KEY (design_document_id) REFERENCES documents(id);

-- ============================================================
-- FEE SCHEDULES
-- ============================================================
-- Configurable pricing per cemetery. Councils set fees for different
-- service types with effective date ranges and GST handling.
CREATE TABLE fee_schedules (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  cemetery_id     UUID REFERENCES cemeteries(id),  -- NULL = applies to all cemeteries
  service_type    TEXT NOT NULL,                -- e.g. "burial_single", "ashes_interment"
  description     TEXT NOT NULL,
  amount          DECIMAL(10,2) NOT NULL,
  gst_inclusive   BOOLEAN DEFAULT true,
  effective_from  DATE NOT NULL,
  effective_to    DATE,                         -- NULL = still current
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by      UUID REFERENCES profiles(id),
  updated_by      UUID REFERENCES profiles(id)
);

-- ============================================================
-- INVOICES
-- ============================================================
-- Billing records generated from bookings, rights purchases, permits, etc.
CREATE TABLE invoices (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_number  TEXT NOT NULL,                -- human-readable e.g. "INV-2026-0042"
  contact_id      UUID NOT NULL REFERENCES contacts(id),
  booking_id      UUID REFERENCES bookings(id),
  line_items      JSONB NOT NULL DEFAULT '[]'::jsonb,  -- [{description, qty, unit_price, total}]
  subtotal        DECIMAL(10,2) NOT NULL DEFAULT 0,
  gst             DECIMAL(10,2) NOT NULL DEFAULT 0,
  total           DECIMAL(10,2) NOT NULL DEFAULT 0,
  status          invoice_status NOT NULL DEFAULT 'draft',
  issued_date     DATE,
  due_date        DATE,
  paid_date       DATE,
  payment_method  TEXT,                         -- "cash", "eft", "card", "cheque"
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by      UUID REFERENCES profiles(id),
  updated_by      UUID REFERENCES profiles(id),
  UNIQUE (tenant_id, invoice_number)
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
-- Immutable record of every create/update/delete across the system.
-- Required for compliance — retained for 7+ years.
-- Stores the full before/after JSON so changes can be reviewed.
CREATE TABLE audit_logs (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  entity_type     TEXT NOT NULL,                -- e.g. "plot", "deceased", "booking"
  entity_id       UUID NOT NULL,
  action          TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  user_id         UUID REFERENCES profiles(id),
  changes         JSONB,                        -- {field: {old: ..., new: ...}}
  ip_address      INET,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
-- In-app notifications shown in the bell icon dropdown.
-- Each notification belongs to a single user.
CREATE TABLE notifications (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type                notification_type NOT NULL DEFAULT 'system',
  title               TEXT NOT NULL,
  body                TEXT,
  read                BOOLEAN DEFAULT false,
  linked_entity_type  TEXT,                     -- e.g. "booking", "work_order"
  linked_entity_id    UUID,
  created_at          TIMESTAMPTZ DEFAULT now() NOT NULL
);
