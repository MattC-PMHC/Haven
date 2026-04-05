-- 007_rls_policies.sql
-- Row-Level Security (RLS) policies for multi-tenant data isolation.
--
-- HOW IT WORKS:
-- 1. Every table (except tenants) has a tenant_id column
-- 2. When a user logs in, their JWT token contains their tenant_id
--    (set during sign-up in the profiles table)
-- 3. The get_tenant_id() function reads the tenant_id from the JWT
-- 4. RLS policies on every table only allow rows where
--    row.tenant_id = JWT.tenant_id
--
-- This means even if the app code has a bug, a user from Council A
-- can NEVER see data belonging to Council B. The database enforces it.

-- Helper function: extract tenant_id from the current user's JWT
CREATE OR REPLACE FUNCTION public.get_tenant_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid;
$$;

-- Helper function: extract user role from JWT
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'role')::user_role;
$$;

-- ============================================================
-- Enable RLS on ALL tables
-- ============================================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cemeteries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deceased ENABLE ROW LEVEL SECURITY;
ALTER TABLE interments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rights_of_interment ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorial_permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- TENANT ISOLATION POLICIES
-- ============================================================
-- Each policy follows the same pattern:
--   SELECT/INSERT/UPDATE/DELETE WHERE tenant_id = get_tenant_id()
-- This ensures every query is automatically filtered to the current tenant.

-- Tenants: users can only see their own tenant
CREATE POLICY tenant_isolation ON tenants
  FOR ALL USING (id = get_tenant_id());

-- Profiles: users see profiles within their tenant
CREATE POLICY tenant_isolation ON profiles
  FOR ALL USING (tenant_id = get_tenant_id());

-- Cemeteries
CREATE POLICY tenant_isolation ON cemeteries
  FOR ALL USING (tenant_id = get_tenant_id());

-- Sections
CREATE POLICY tenant_isolation ON sections
  FOR ALL USING (tenant_id = get_tenant_id());

-- Plots
CREATE POLICY tenant_isolation ON plots
  FOR ALL USING (tenant_id = get_tenant_id());

-- Contacts
CREATE POLICY tenant_isolation ON contacts
  FOR ALL USING (tenant_id = get_tenant_id());

-- Deceased
CREATE POLICY tenant_isolation ON deceased
  FOR ALL USING (tenant_id = get_tenant_id());

-- Interments
CREATE POLICY tenant_isolation ON interments
  FOR ALL USING (tenant_id = get_tenant_id());

-- Rights of Interment
CREATE POLICY tenant_isolation ON rights_of_interment
  FOR ALL USING (tenant_id = get_tenant_id());

-- Bookings
CREATE POLICY tenant_isolation ON bookings
  FOR ALL USING (tenant_id = get_tenant_id());

-- Work Orders
CREATE POLICY tenant_isolation ON work_orders
  FOR ALL USING (tenant_id = get_tenant_id());

-- Memorials
CREATE POLICY tenant_isolation ON memorials
  FOR ALL USING (tenant_id = get_tenant_id());

-- Memorial Permits
CREATE POLICY tenant_isolation ON memorial_permits
  FOR ALL USING (tenant_id = get_tenant_id());

-- Documents
CREATE POLICY tenant_isolation ON documents
  FOR ALL USING (tenant_id = get_tenant_id());

-- Fee Schedules
CREATE POLICY tenant_isolation ON fee_schedules
  FOR ALL USING (tenant_id = get_tenant_id());

-- Invoices
CREATE POLICY tenant_isolation ON invoices
  FOR ALL USING (tenant_id = get_tenant_id());

-- Audit Logs (read-only for most users — inserts happen via triggers)
CREATE POLICY tenant_isolation ON audit_logs
  FOR ALL USING (tenant_id = get_tenant_id());

-- Notifications: users only see their own notifications
CREATE POLICY user_notifications ON notifications
  FOR ALL USING (
    tenant_id = get_tenant_id()
    AND user_id = auth.uid()
  );
