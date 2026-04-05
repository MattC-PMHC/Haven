-- 009_triggers.sql
-- Database triggers that automatically run when data changes.
--
-- Triggers handle things that should ALWAYS happen regardless of which
-- part of the app made the change — they're like "database hooks".

-- ============================================================
-- 1. AUTO-UPDATE updated_at TIMESTAMP
-- ============================================================
-- Every time a row is updated, automatically set updated_at to now().
-- This means the app code never has to remember to set it manually.

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply to all tables that have updated_at
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'tenants', 'profiles', 'cemeteries', 'sections', 'plots',
      'contacts', 'deceased', 'interments', 'rights_of_interment',
      'bookings', 'work_orders', 'memorials', 'memorial_permits',
      'documents', 'fee_schedules', 'invoices'
    ])
  LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION public.update_updated_at()',
      tbl
    );
  END LOOP;
END;
$$;

-- ============================================================
-- 2. AUDIT LOG TRIGGER
-- ============================================================
-- Automatically creates an audit_log entry whenever a row is
-- inserted, updated, or deleted on key tables. This is required
-- for compliance — every change is tracked with before/after values.

CREATE OR REPLACE FUNCTION public.audit_log_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  changes_json JSONB;
  action_type TEXT;
  t_id UUID;
BEGIN
  -- Determine the action
  action_type := TG_OP;

  -- Build the changes JSON
  IF TG_OP = 'DELETE' THEN
    changes_json := to_jsonb(OLD);
    t_id := OLD.tenant_id;
  ELSIF TG_OP = 'INSERT' THEN
    changes_json := to_jsonb(NEW);
    t_id := NEW.tenant_id;
  ELSE -- UPDATE
    -- Only record fields that actually changed
    changes_json := jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    );
    t_id := NEW.tenant_id;
  END IF;

  INSERT INTO audit_logs (
    tenant_id,
    entity_type,
    entity_id,
    action,
    user_id,
    changes,
    created_at
  ) VALUES (
    t_id,
    TG_TABLE_NAME,
    CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END,
    lower(action_type),
    auth.uid(),
    changes_json,
    now()
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Apply audit triggers to tables that need compliance tracking
-- (not audit_logs itself, not notifications — those are ephemeral)
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'cemeteries', 'sections', 'plots', 'contacts',
      'deceased', 'interments', 'rights_of_interment',
      'bookings', 'work_orders', 'memorials', 'memorial_permits',
      'documents', 'fee_schedules', 'invoices'
    ])
  LOOP
    EXECUTE format(
      'CREATE TRIGGER audit_log AFTER INSERT OR UPDATE OR DELETE ON %I
       FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger()',
      tbl
    );
  END LOOP;
END;
$$;

-- ============================================================
-- 3. PLOT OCCUPANCY COUNTER
-- ============================================================
-- When an interment is created or cancelled, automatically update the
-- plot's remaining_capacity and status. This keeps plot data consistent
-- without the app having to manually sync it.

CREATE OR REPLACE FUNCTION public.update_plot_occupancy()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'completed' THEN
    -- A new completed interment: decrement remaining capacity
    UPDATE plots SET
      remaining_capacity = remaining_capacity - 1,
      status = CASE
        WHEN remaining_capacity - 1 <= 0 THEN 'full'::plot_status
        ELSE 'occupied'::plot_status
      END
    WHERE id = NEW.plot_id;

  ELSIF TG_OP = 'UPDATE' THEN
    -- If interment status changed TO completed
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
      UPDATE plots SET
        remaining_capacity = remaining_capacity - 1,
        status = CASE
          WHEN remaining_capacity - 1 <= 0 THEN 'full'::plot_status
          ELSE 'occupied'::plot_status
        END
      WHERE id = NEW.plot_id;

    -- If interment status changed FROM completed (e.g. cancelled)
    ELSIF OLD.status = 'completed' AND NEW.status != 'completed' THEN
      UPDATE plots SET
        remaining_capacity = remaining_capacity + 1,
        status = CASE
          WHEN remaining_capacity + 1 >= capacity THEN 'available'::plot_status
          ELSE 'occupied'::plot_status
        END
      WHERE id = NEW.plot_id;
    END IF;

  ELSIF TG_OP = 'DELETE' AND OLD.status = 'completed' THEN
    -- Deleted a completed interment: restore capacity
    UPDATE plots SET
      remaining_capacity = remaining_capacity + 1,
      status = CASE
        WHEN remaining_capacity + 1 >= capacity THEN 'available'::plot_status
        ELSE 'occupied'::plot_status
      END
    WHERE id = OLD.plot_id;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

CREATE TRIGGER update_plot_occupancy
  AFTER INSERT OR UPDATE OR DELETE ON interments
  FOR EACH ROW EXECUTE FUNCTION public.update_plot_occupancy();
