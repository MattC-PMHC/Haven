-- 004_records_tables.sql
-- Record-keeping tables — the statutory core of the system:
--   deceased           -> every person interred across all cemeteries
--   interments         -> the actual interment event linking a deceased to a plot
--   rights_of_interment -> legal rights (perpetual/renewable) linking a rights holder to a plot

-- ============================================================
-- DECEASED
-- ============================================================
-- A record for every person interred. This is the main thing council
-- staff, the public, and genealogy researchers search for.
CREATE TABLE deceased (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  surname             TEXT NOT NULL,
  given_names         TEXT NOT NULL,
  maiden_name         TEXT,                     -- also used for aliases
  date_of_birth       DATE,
  date_of_death       DATE,
  age_at_death        INT,
  gender              TEXT,
  place_of_death      TEXT,
  cause_of_death      TEXT,                     -- optional, for historical records
  religion            TEXT,                     -- optional
  cultural_background TEXT,                     -- for cultural burial requirements
  death_cert_number   TEXT,
  burial_order_number TEXT,
  doctor_coroner_ref  TEXT,
  next_of_kin_contact_id UUID REFERENCES contacts(id),
  funeral_director_contact_id UUID REFERENCES contacts(id),
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by          UUID REFERENCES profiles(id),
  updated_by          UUID REFERENCES profiles(id)
);

-- ============================================================
-- INTERMENTS
-- ============================================================
-- An interment is the actual event of placing remains in a plot.
-- It links a deceased person to a specific plot with details about
-- the interment (date, type, depth, etc.).
-- A plot can have multiple interments (e.g. double-depth grave).
CREATE TABLE interments (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  plot_id             UUID NOT NULL REFERENCES plots(id) ON DELETE CASCADE,
  deceased_id         UUID NOT NULL REFERENCES deceased(id) ON DELETE CASCADE,
  booking_id          UUID,                     -- filled in by 005 FK after bookings table exists
  interment_type      interment_type NOT NULL DEFAULT 'burial',
  interment_date      DATE NOT NULL,
  interment_time      TIME,
  depth               DECIMAL(4,2),             -- depth in metres
  coffin_details      TEXT,                     -- coffin/casket or urn description
  applicant_contact_id UUID REFERENCES contacts(id),
  status              TEXT DEFAULT 'completed' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by          UUID REFERENCES profiles(id),
  updated_by          UUID REFERENCES profiles(id)
);

-- ============================================================
-- RIGHTS OF INTERMENT
-- ============================================================
-- A legal right granting someone the right to be interred at a specific
-- plot. Can be perpetual (forever) or renewable (25, 50, 99 years).
-- Managed under the NSW Cemeteries and Crematoria Act 2013 and
-- equivalent state legislation.
CREATE TABLE rights_of_interment (
  id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id               UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  plot_id                 UUID NOT NULL REFERENCES plots(id) ON DELETE CASCADE,
  rights_holder_contact_id UUID NOT NULL REFERENCES contacts(id),
  right_type              right_type NOT NULL DEFAULT 'perpetual',
  status                  right_status NOT NULL DEFAULT 'active',
  grant_date              DATE NOT NULL,
  expiry_date             DATE,                 -- NULL for perpetual rights
  renewal_period_years    INT,                  -- e.g. 25, 50, 99 for renewable
  contract_document_id    UUID,                 -- FK to documents table (added later)
  notes                   TEXT,
  created_at              TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at              TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by              UUID REFERENCES profiles(id),
  updated_by              UUID REFERENCES profiles(id)
);
