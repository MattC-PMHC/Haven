-- 005_operations_tables.sql
-- Operational tables for day-to-day cemetery management:
--   bookings         -> scheduling interments, services, and maintenance
--   work_orders      -> tasks for grounds crew (auto-generated from bookings or manual)
--   memorials        -> headstones, plaques, and monuments on plots
--   memorial_permits -> mason applications to install/modify memorials

-- ============================================================
-- BOOKINGS
-- ============================================================
-- A booking represents a scheduled cemetery event — most commonly an
-- interment, but also memorial services, exhumations, etc.
-- Funeral directors submit bookings via their portal; council staff
-- confirm and manage them.
CREATE TABLE bookings (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  cemetery_id         UUID NOT NULL REFERENCES cemeteries(id) ON DELETE CASCADE,
  plot_id             UUID REFERENCES plots(id),  -- can be NULL initially for pending bookings
  booking_type        booking_type NOT NULL DEFAULT 'burial',
  status              booking_status NOT NULL DEFAULT 'pending',
  requested_date      DATE NOT NULL,
  requested_time      TIME,
  confirmed_date      DATE,                     -- actual confirmed date (may differ from requested)
  confirmed_time      TIME,
  duration_minutes    INT DEFAULT 60,
  funeral_director_contact_id UUID REFERENCES contacts(id),
  applicant_contact_id UUID REFERENCES contacts(id),
  deceased_name       TEXT,                     -- quick reference before deceased record exists
  special_requirements TEXT,
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by          UUID REFERENCES profiles(id),
  updated_by          UUID REFERENCES profiles(id)
);

-- Now add the FK from interments -> bookings (couldn't do it in 004
-- because bookings table didn't exist yet)
ALTER TABLE interments
  ADD CONSTRAINT fk_interments_booking
  FOREIGN KEY (booking_id) REFERENCES bookings(id);

-- ============================================================
-- WORK ORDERS
-- ============================================================
-- Tasks for grounds crew and maintenance teams. Some are auto-generated
-- from bookings (e.g. "prepare grave for interment on Thursday"),
-- others are created manually (e.g. "mow Section B").
CREATE TABLE work_orders (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  work_order_type work_order_type NOT NULL DEFAULT 'general_maintenance',
  priority        work_order_priority NOT NULL DEFAULT 'normal',
  status          work_order_status NOT NULL DEFAULT 'created',
  plot_id         UUID REFERENCES plots(id),
  booking_id      UUID REFERENCES bookings(id),
  cemetery_id     UUID REFERENCES cemeteries(id),
  assigned_to     UUID REFERENCES profiles(id),
  due_date        DATE,
  estimated_hours DECIMAL(4,1),
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  checklist       JSONB DEFAULT '[]'::jsonb,    -- configurable checklist items
  photos          JSONB DEFAULT '[]'::jsonb,    -- array of photo URLs
  completion_notes TEXT,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by      UUID REFERENCES profiles(id),
  updated_by      UUID REFERENCES profiles(id)
);

-- ============================================================
-- MEMORIALS
-- ============================================================
-- Headstones, plaques, and monuments placed on plots.
-- Tracked for safety inspections and mason permit management.
CREATE TABLE memorials (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  plot_id             UUID NOT NULL REFERENCES plots(id) ON DELETE CASCADE,
  memorial_type       TEXT NOT NULL,            -- e.g. "headstone", "plaque", "monument"
  material            TEXT,                     -- e.g. "granite", "bronze", "marble"
  length_m            DECIMAL(5,2),
  width_m             DECIMAL(5,2),
  height_m            DECIMAL(5,2),
  inscription         TEXT,
  condition           TEXT DEFAULT 'good' CHECK (condition IN ('good', 'fair', 'poor', 'unsafe')),
  last_inspection_date DATE,
  mason_contact_id    UUID REFERENCES contacts(id),
  photos              JSONB DEFAULT '[]'::jsonb,
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by          UUID REFERENCES profiles(id),
  updated_by          UUID REFERENCES profiles(id)
);

-- ============================================================
-- MEMORIAL PERMITS
-- ============================================================
-- Applications from masons to install, repair, or modify memorials.
-- Council reviews and approves/rejects via the admin portal.
CREATE TABLE memorial_permits (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  memorial_id         UUID REFERENCES memorials(id),  -- NULL until memorial is created
  plot_id             UUID NOT NULL REFERENCES plots(id),
  mason_contact_id    UUID NOT NULL REFERENCES contacts(id),
  work_type           permit_work_type NOT NULL DEFAULT 'new_memorial',
  status              permit_status NOT NULL DEFAULT 'submitted',
  description         TEXT,                     -- what the mason wants to do
  dimensions_notes    TEXT,                     -- proposed dimensions
  material_notes      TEXT,                     -- proposed material
  design_document_id  UUID,                     -- FK to documents (added later)
  submitted_at        TIMESTAMPTZ DEFAULT now(),
  reviewed_at         TIMESTAMPTZ,
  approved_by         UUID REFERENCES profiles(id),
  approval_notes      TEXT,
  completed_at        TIMESTAMPTZ,
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by          UUID REFERENCES profiles(id),
  updated_by          UUID REFERENCES profiles(id)
);
