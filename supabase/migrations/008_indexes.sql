-- 008_indexes.sql
-- Performance indexes to speed up common queries.
--
-- WHY INDEXES MATTER:
-- Without indexes, PostgreSQL has to scan every row in a table to find
-- matches. With indexes, it can jump straight to the relevant rows.
-- Think of it like a book index vs reading every page.

-- ============================================================
-- SPATIAL INDEXES (GiST)
-- ============================================================
-- GiST indexes make PostGIS spatial queries fast — e.g. "find all
-- plots within this map viewport" or "which section contains this point?"
CREATE INDEX idx_cemeteries_boundary ON cemeteries USING gist (boundary);
CREATE INDEX idx_sections_boundary ON sections USING gist (boundary);
CREATE INDEX idx_plots_centroid ON plots USING gist (centroid);

-- ============================================================
-- TENANT ISOLATION INDEXES (btree)
-- ============================================================
-- Every query hits tenant_id (via RLS). These indexes make that fast.
CREATE INDEX idx_profiles_tenant ON profiles (tenant_id);
CREATE INDEX idx_cemeteries_tenant ON cemeteries (tenant_id);
CREATE INDEX idx_sections_tenant ON sections (tenant_id);
CREATE INDEX idx_plots_tenant ON plots (tenant_id);
CREATE INDEX idx_contacts_tenant ON contacts (tenant_id);
CREATE INDEX idx_deceased_tenant ON deceased (tenant_id);
CREATE INDEX idx_interments_tenant ON interments (tenant_id);
CREATE INDEX idx_rights_tenant ON rights_of_interment (tenant_id);
CREATE INDEX idx_bookings_tenant ON bookings (tenant_id);
CREATE INDEX idx_work_orders_tenant ON work_orders (tenant_id);
CREATE INDEX idx_memorials_tenant ON memorials (tenant_id);
CREATE INDEX idx_memorial_permits_tenant ON memorial_permits (tenant_id);
CREATE INDEX idx_documents_tenant ON documents (tenant_id);
CREATE INDEX idx_fee_schedules_tenant ON fee_schedules (tenant_id);
CREATE INDEX idx_invoices_tenant ON invoices (tenant_id);
CREATE INDEX idx_audit_logs_tenant ON audit_logs (tenant_id);
CREATE INDEX idx_notifications_tenant ON notifications (tenant_id);

-- ============================================================
-- STATUS & LOOKUP INDEXES
-- ============================================================
-- These speed up filtered views like "show me all available plots"
-- or "show me all pending bookings".
CREATE INDEX idx_plots_status ON plots (tenant_id, status);
CREATE INDEX idx_plots_section ON plots (section_id);
CREATE INDEX idx_bookings_status ON bookings (tenant_id, status);
CREATE INDEX idx_bookings_date ON bookings (tenant_id, requested_date);
CREATE INDEX idx_work_orders_status ON work_orders (tenant_id, status);
CREATE INDEX idx_work_orders_assigned ON work_orders (assigned_to);
CREATE INDEX idx_work_orders_due ON work_orders (tenant_id, due_date);
CREATE INDEX idx_memorial_permits_status ON memorial_permits (tenant_id, status);
CREATE INDEX idx_invoices_status ON invoices (tenant_id, status);
CREATE INDEX idx_notifications_user ON notifications (user_id, read);
CREATE INDEX idx_interments_plot ON interments (plot_id);
CREATE INDEX idx_interments_date ON interments (tenant_id, interment_date);
CREATE INDEX idx_rights_plot ON rights_of_interment (plot_id);
CREATE INDEX idx_rights_status ON rights_of_interment (tenant_id, status);
CREATE INDEX idx_sections_cemetery ON sections (cemetery_id);

-- ============================================================
-- FULL-TEXT / FUZZY SEARCH INDEXES (GIN + pg_trgm)
-- ============================================================
-- These power the "Curator" search bar — searching for deceased by
-- name with fuzzy matching (handles typos and partial matches).
CREATE INDEX idx_deceased_surname_trgm ON deceased USING gin (surname gin_trgm_ops);
CREATE INDEX idx_deceased_given_trgm ON deceased USING gin (given_names gin_trgm_ops);
CREATE INDEX idx_contacts_name_trgm ON contacts USING gin (last_name gin_trgm_ops);
CREATE INDEX idx_plots_number_trgm ON plots USING gin (plot_number gin_trgm_ops);

-- ============================================================
-- AUDIT LOG INDEXES
-- ============================================================
-- Audit queries often filter by entity or time range.
CREATE INDEX idx_audit_entity ON audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs (tenant_id, created_at DESC);

-- ============================================================
-- POLYMORPHIC LINK INDEXES (documents)
-- ============================================================
-- Documents are linked to any entity type via linked_entity_type + id.
CREATE INDEX idx_documents_linked ON documents (linked_entity_type, linked_entity_id);
