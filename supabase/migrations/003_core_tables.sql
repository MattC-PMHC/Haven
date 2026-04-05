-- 003_core_tables.sql
-- Core tables that everything else depends on:
--   tenants   -> the council organisations (each is a separate "tenant")
--   profiles  -> extends Supabase Auth users with role + tenant link
--   cemeteries -> physical cemetery sites belonging to a tenant
--   sections  -> areas within a cemetery (e.g. "Lawn Section A")
--   plots     -> individual burial/interment spots within a section
--   contacts  -> people and organisations (funeral directors, masons, rights holders, etc.)

-- ============================================================
-- TENANTS (councils)
-- ============================================================
-- Each council using Haven is a "tenant". All their data is isolated
-- by tenant_id on every other table + Row-Level Security policies.
CREATE TABLE tenants (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,                    -- e.g. "Blue Mountains City Council"
  slug        TEXT NOT NULL UNIQUE,             -- e.g. "blue-mountains" (used in URLs)
  config      JSONB DEFAULT '{}'::jsonb,        -- tenant-specific settings (timezone, etc.)
  logo_url    TEXT,                             -- council logo for branding
  primary_colour TEXT,                          -- council accent colour
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- PROFILES (authenticated users)
-- ============================================================
-- Every Supabase Auth user gets a profile row linking them to a tenant
-- and giving them a role. This is created on sign-up.
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  role        user_role NOT NULL DEFAULT 'council_officer',
  full_name   TEXT,
  avatar_url  TEXT,
  phone       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- CEMETERIES
-- ============================================================
-- A physical cemetery site. A tenant (council) can have multiple cemeteries.
-- The boundary column stores a PostGIS polygon of the cemetery perimeter.
CREATE TABLE cemeteries (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,                    -- e.g. "Blackheath Cemetery"
  address     TEXT,
  suburb      TEXT,
  state       TEXT DEFAULT 'NSW',
  postcode    TEXT,
  lat         DOUBLE PRECISION,                -- latitude of centre point
  lng         DOUBLE PRECISION,                -- longitude of centre point
  boundary    geometry(Polygon, 4326),          -- PostGIS polygon (WGS84)
  status      TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  opening_hours TEXT,
  phone       TEXT,
  email       TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by  UUID REFERENCES profiles(id),
  updated_by  UUID REFERENCES profiles(id)
);

-- ============================================================
-- SECTIONS
-- ============================================================
-- A defined area within a cemetery containing multiple plots.
-- Sections group plots by type, denomination, or physical location.
CREATE TABLE sections (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  cemetery_id UUID NOT NULL REFERENCES cemeteries(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,                    -- e.g. "Lawn Section A"
  code        TEXT,                             -- short code e.g. "LSA"
  section_type TEXT,                            -- e.g. "lawn", "monumental", "ashes"
  boundary    geometry(Polygon, 4326),          -- PostGIS polygon
  status      TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'full')),
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by  UUID REFERENCES profiles(id),
  updated_by  UUID REFERENCES profiles(id)
);

-- ============================================================
-- PLOTS
-- ============================================================
-- An individual burial/interment spot. This is the core record that
-- most other data links back to (interments, rights, memorials, etc.).
CREATE TABLE plots (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  section_id      UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  plot_number     TEXT NOT NULL,                -- human-readable ID e.g. "A-12"
  plot_type       plot_type NOT NULL DEFAULT 'lawn_single',
  status          plot_status NOT NULL DEFAULT 'available',
  capacity        INT NOT NULL DEFAULT 1,      -- total interment positions
  remaining_capacity INT NOT NULL DEFAULT 1,   -- positions still available
  length_m        DECIMAL(5,2),                -- dimensions in metres
  width_m         DECIMAL(5,2),
  depth_m         DECIMAL(5,2),
  centroid        geometry(Point, 4326),        -- PostGIS point (WGS84)
  row_number      TEXT,                         -- row within the section
  position        TEXT,                         -- position within the row
  soil_type       TEXT,                         -- relevant for digging conditions
  infrastructure_notes TEXT,                    -- e.g. "near water main"
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by      UUID REFERENCES profiles(id),
  updated_by      UUID REFERENCES profiles(id),
  UNIQUE (tenant_id, section_id, plot_number)  -- plot numbers unique within section per tenant
);

-- ============================================================
-- CONTACTS
-- ============================================================
-- People and organisations involved with the cemetery: rights holders,
-- funeral directors, masons, next of kin, contractors, etc.
-- This is a lightweight CRM — one table for all contact types.
CREATE TABLE contacts (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  contact_type    contact_type NOT NULL DEFAULT 'other',
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  organisation    TEXT,                         -- e.g. funeral home name
  email           TEXT,
  phone           TEXT,
  address_line1   TEXT,
  address_line2   TEXT,
  suburb          TEXT,
  state           TEXT DEFAULT 'NSW',
  postcode        TEXT,
  licence_number  TEXT,                         -- for funeral directors / masons
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by      UUID REFERENCES profiles(id),
  updated_by      UUID REFERENCES profiles(id)
);
