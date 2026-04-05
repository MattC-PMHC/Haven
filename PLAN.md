# Haven Cemetery Management Platform - Implementation Plan

## Context

Haven is a cloud-based cemetery management platform for Australian local government councils. It replaces fragmented paper records and legacy software with a modern SaaS platform connecting all cemetery stakeholders. The PRD defines a comprehensive system; we're building **Phase 1 (MVP) + Phase 2 (Stakeholder Portals)**.

**Design approach:** Follow Haven's "Silent Steward" design system (DESIGN.md) for visual identity, but mirror the Signal CRM's architecture patterns: token-driven CSS custom properties, shadcn/ui + Radix, CVA variants, Supabase SSR helpers, and server actions.

**Theme:** Light only (per user's choice), following DESIGN.md's earth-tone/navy palette with Public Sans typography.

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Database:** Supabase (PostgreSQL + PostGIS + Auth + Storage + Realtime)
- **Mapping:** Mapbox GL JS (or Leaflet as fallback)
- **Styling:** Tailwind CSS with CSS custom property tokens
- **Components:** shadcn/ui + Radix UI + CVA
- **Forms:** react-hook-form + zod
- **Data:** @tanstack/react-query
- **Charts:** recharts
- **Icons:** lucide-react
- **Dates:** date-fns

---

## Milestone 0: Project Scaffolding & Design System

**Goal:** Fresh Next.js project with Haven's design token system, Tailwind config, shadcn/ui base components, and Supabase client helpers. Developer can run `npm run dev` and see a styled page.

**Key files:**
- `tailwind.config.ts` - All colors reference `var(--haven-*)` CSS variables (no hardcoded hex)
- `src/app/globals.css` - Single source of truth for all design tokens from DESIGN.md: primary (#162839), surface (#f6fafe), etc. Plus shadow tokens, glass tokens, gradient tokens, spacing, typography scale
- `src/app/layout.tsx` - Root layout loading Public Sans, applying `bg-surface text-on-surface`
- `src/lib/utils.ts` - `cn()` helper (clsx + tailwind-merge)
- `src/components/ui/button.tsx` - CVA button: premium gradient default, secondary, ghost, destructive
- `src/components/ui/card.tsx` - No border (No-Line Rule), shadow-ambient, rounded-xl
- `src/components/ui/badge.tsx` - Full rounding (9999px), status variants for plot states
- `src/components/ui/input.tsx` - surface-container-low fill, ghost border, primary/40 focus
- `src/components/ui/skeleton.tsx` - Shimmer loading
- `src/lib/supabase/client.ts` - Browser client factory
- `src/lib/supabase/server.ts` - Server client factory using cookies()
- `.env.local.example` - Template with all env vars
- Additional shadcn components: dialog, dropdown-menu, select, label, popover, separator, tabs, textarea, tooltip, table, sheet, command, checkbox, avatar

**Verification:** `npm run dev` starts, page renders with Haven palette, fonts are Public Sans, all colors from CSS vars.

---

## Milestone 1: Database Schema & Multi-Tenant Foundation

**Goal:** Complete Supabase schema with all core tables, PostGIS, RLS policies, and seed data. SQL-only work.

**Key files (all in `supabase/migrations/`):**
- `001_extensions.sql` - Enable postgis, pg_trgm, uuid-ossp
- `002_enums.sql` - plot_status, plot_type, booking_status, work_order_status/priority, permit_status, user_role, document_type, notification_type
- `003_core_tables.sql` - tenants, profiles, cemeteries (with PostGIS geometry), sections, plots (with PostGIS point), contacts
- `004_records_tables.sql` - deceased, interments, right_of_interment
- `005_operations_tables.sql` - bookings, work_orders, memorial_permits
- `006_support_tables.sql` - documents, fee_schedules, invoices, audit_logs, notifications
- `007_rls_policies.sql` - `get_tenant_id()` helper reading JWT, enable RLS on all tables, tenant_id isolation policies
- `008_indexes.sql` - GiST on geometry columns, btree on tenant_id/status, pg_trgm GIN on names
- `009_triggers.sql` - updated_at auto-update, audit log trigger, plot occupancy counter
- `supabase/seed.sql` - Sample council, cemetery, 3 sections, ~50 plots, 10 deceased, 5 interments, 3 bookings
- `src/lib/types/database.ts` - TypeScript types matching schema

**Supabase setup instructions:**
1. Create project at supabase.com
2. Copy URL + anon key + service role key to `.env.local`
3. Enable PostGIS extension (Database > Extensions)
4. Run migrations 001-009 in SQL Editor in order
5. Run seed.sql
6. Set site URL to `http://localhost:3000` in Auth settings

**Verification:** All migrations run clean, seed data queryable, RLS blocks cross-tenant access.

---

## Milestone 2: Authentication & Role-Based Access

**Goal:** Login/register/reset pages, middleware routing by role, session management.

**Key files:**
- `src/middleware.ts` - Public paths (login, register, public/*), admin paths require council_admin/super_admin, portal paths require matching role
- `src/app/(auth)/login/page.tsx` - Haven-styled login form, supabase.auth.signInWithPassword()
- `src/app/(auth)/register/page.tsx` - Registration with profile creation
- `src/app/(auth)/forgot-password/page.tsx` - Password reset flow
- `src/app/(auth)/layout.tsx` - Centered auth layout, Haven branding
- `src/app/api/auth/callback/route.ts` - Supabase auth callback
- `src/lib/auth/get-session.ts` - Server helper returning { user, profile, role, tenantId }
- `src/lib/auth/require-role.ts` - Role gate helper

**Roles:** super_admin, council_admin, council_officer, funeral_director, mason, grounds_crew, finance_officer, public

**Verification:** Register -> login -> redirect to correct portal. Logged-out users redirected to login. Role enforcement works.

---

## Milestone 3: Admin Shell & Dashboard

**Goal:** Admin layout (sidebar + top bar) and dashboard matching the HTML prototype.

**Key files:**
- `src/app/(admin)/layout.tsx` - Server component, session check, renders HavenShell
- `src/components/layout/HavenShell.tsx` - Flex layout: fixed sidebar + main area
- `src/components/layout/Sidebar.tsx` - Matches prototype: surface-container-low bg, nav items (Dashboard, Registry, Grave Maps, Maintenance, Permits, Reports, Settings), active border-r-2 pattern, premium gradient "New Record" CTA
- `src/components/layout/TopBar.tsx` - Glassmorphic (bg-surface-container-lowest/80 backdrop-blur-md), "Curator" search bar, notification bell, user avatar
- `src/components/layout/SearchBar.tsx` - Command palette searching deceased/plots/sections
- `src/app/(admin)/dashboard/page.tsx` - Hero header, 4 StatCards, map placeholder, Pending Interments, Activity Timeline, Insight Banner
- `src/components/dashboard/StatCard.tsx` - bg-surface-container-lowest, colored 4px bottom border, value + label + trend badge
- `src/components/dashboard/PendingInterments.tsx` - Card list with date blocks
- `src/components/dashboard/ActivityTimeline.tsx` - Vertical timeline with colored dots
- `src/components/dashboard/InsightBanner.tsx` - Dark bg-primary banner with CTA

**Verification:** Dashboard matches the screen.png prototype. Sidebar nav works. Search opens command palette. Responsive on mobile.

---

## Milestone 4: Cemetery & Section Setup

**Goal:** Admin CRUD pages for managing cemeteries and their sections.

**Key files:**
- `src/app/(admin)/settings/cemeteries/page.tsx` - Cemetery list table (alternating row tones, no borders)
- `src/app/(admin)/settings/cemeteries/[id]/page.tsx` - Cemetery detail/edit with tabs
- `src/app/(admin)/settings/cemeteries/new/page.tsx` - Create cemetery form
- `src/components/records/CemeteryForm.tsx` - Shared form (ghost-bordered inputs)
- `src/components/records/SectionForm.tsx` - Section create/edit
- `src/lib/actions/cemeteries.ts` - Server actions with zod validation + audit logging
- `src/lib/actions/sections.ts` - Section CRUD server actions

**Verification:** Create/edit/delete cemeteries and sections. Audit log entries created.

---

## Milestone 5: Interactive Cemetery Map (GIS)

**Goal:** The signature map interface - view plots, click for details, filter by status.

**Key files:**
- `src/components/map/CemeteryMap.tsx` - Mapbox GL JS, GeoJSON plot source, status-colored polygons, click handler
- `src/components/map/MapLegend.tsx` - Glassmorphic floating legend (available/reserved/occupied/restricted)
- `src/components/map/MapControls.tsx` - Zoom, layers, fullscreen (glassmorphic)
- `src/components/map/PlotDetailPanel.tsx` - Slide-in sheet on plot click: full details, interments, documents
- `src/components/map/PlotGrid.tsx` - Schematic fallback for cemeteries without GPS data
- `src/app/(admin)/maps/page.tsx` - Cemetery selector + map + filters
- `src/lib/queries/plots-geojson.ts` - PostGIS ST_AsGeoJSON query

**Verification:** Map renders with colored plots. Click plot -> detail panel. Filter by status. Search zooms to plot.

---

## Milestone 6: Plot Inventory Management

**Goal:** Full CRUD for plots - list, detail, create/edit, status management.

**Key files:**
- `src/app/(admin)/plots/page.tsx` - Plot list with tabs per section, filters, pagination
- `src/app/(admin)/plots/[id]/page.tsx` - Plot detail: Overview, Interments, Documents, History tabs
- `src/app/(admin)/plots/new/page.tsx` - Create plot form with "Pick on Map" option
- `src/components/records/PlotForm.tsx` - react-hook-form + zod
- `src/components/records/PlotStatusBadge.tsx` - Full-rounded status badges
- `src/components/records/PlotTable.tsx` - Alternating row tones (no borders)
- `src/lib/actions/plots.ts` - CRUD + bulkImport + audit logging
- `src/lib/queries/plots.ts` - Filtered/paginated queries + stats aggregation

**Verification:** Create plots, edit, change status. Status changes reflect on map. Audit trail visible.

---

## Milestone 7: Deceased Records & Interment Bookings

**Goal:** The "Registry" for deceased persons, interment recording, and booking workflow.

**Key files:**
- `src/app/(admin)/registry/page.tsx` - Searchable deceased list with fuzzy matching
- `src/app/(admin)/registry/[id]/page.tsx` - Deceased detail: Personal, Interment, Rights, Documents, History
- `src/app/(admin)/registry/new/page.tsx` - Create deceased record
- `src/components/records/DeceasedForm.tsx` - Personal + death info + next of kin
- `src/components/records/IntermentForm.tsx` - Plot selection, date, type, depth
- `src/app/(admin)/bookings/page.tsx` - Booking list/board: Pending > Confirmed > In Progress > Completed
- `src/app/(admin)/bookings/new/page.tsx` - Multi-step booking wizard
- `src/components/records/BookingWorkflow.tsx` - Step-by-step form
- `src/lib/actions/deceased.ts`, `interments.ts`, `bookings.ts` - Server actions with business rules

**Verification:** Create deceased -> create interment -> plot occupancy updates. Booking workflow: Pending > Confirmed > Completed creates interment automatically.

---

## Milestone 8: Documents, Audit Trail & Reporting

**Goal:** File uploads via Supabase Storage, audit trail viewer, and basic reports.

**Key files:**
- `src/components/records/DocumentUpload.tsx` - Drag-and-drop upload to Supabase Storage
- `src/components/records/DocumentList.tsx` - File list with download/delete
- `src/app/(admin)/reports/page.tsx` - Reports hub with cards
- `src/app/(admin)/reports/interments/page.tsx` - Interments by period (Recharts bar chart + table + CSV export)
- `src/app/(admin)/reports/inventory/page.tsx` - Plot status distribution (pie chart + table)
- `src/app/(admin)/audit/page.tsx` - Filterable audit trail viewer
- `src/components/reports/ReportChart.tsx` - Recharts wrapper with Haven colors
- `src/lib/actions/documents.ts` - Upload/delete with Storage bucket

**Verification:** Upload PDF to a record, download it, delete it. Audit trail shows all operations. Reports render charts with real data. CSV exports correctly.

---

## Milestone 9: Stakeholder Portals (Phase 2)

**Goal:** Four external portals with role-specific features.

### Funeral Director Portal (`src/app/(portal)/funeral-director/`)
- Dashboard: upcoming bookings, pending requests
- New booking request form (submits as "Pending" for council review)
- Plot availability search with map view
- Document submission

### Mason Portal (`src/app/(portal)/mason/`)
- Dashboard: active permits, pending applications
- New permit application form with photo upload
- Permit status tracking

### Grounds Crew Portal (`src/app/(portal)/grounds/`)
- Mobile-first work order dashboard
- Work order detail with location map
- Photo capture from device camera
- Status update (Start/Complete) with large tap targets

### Public Portal (`src/app/(public)/`)
- No auth required
- Grave search by name/date
- Walk-to-grave map directions
- Cemetery information pages

**Verification:** Each role sees only their portal. FD booking request -> appears in admin. Mason permit -> appears in admin. Grounds crew can capture photos on mobile. Public can search graves without login.

---

## Milestone 10: Notifications & Polish

**Goal:** Email notifications, real-time notification bell, animations, accessibility.

**Key files:**
- `src/lib/notifications/send.ts` - Write to notifications table + send email
- `src/lib/notifications/templates.ts` - Email templates with Haven branding
- `src/components/layout/NotificationBell.tsx` - Unread count, dropdown, Supabase Realtime subscription
- `src/app/(admin)/notifications/page.tsx` - Full notification inbox

**Polish:**
- Staggered entrance animations on dashboard cards
- Skeleton loading states on all data pages
- Responsive audit (375px, 768px, 1024px, 1440px)
- WCAG 2.1 AA: focus indicators, 4.5:1 contrast, alt text, labels, keyboard nav

**Verification:** Booking creates notification for FD. Notification bell updates in real-time. Lighthouse accessibility >= 90. All pages work on mobile.

---

## Dependency Graph

```
M0 (Scaffold + Tokens)
 |
M1 (Database Schema)
 |
M2 (Auth + Roles)
 |
M3 (Admin Shell + Dashboard)
 |
M4 (Cemetery/Section CRUD)
 |
M5 (Interactive Map) ---+
 |                      |
M6 (Plot Management) --+
 |
M7 (Deceased + Bookings)
 |
M8 (Documents + Reports + Audit)
 |
M9 (Stakeholder Portals)
 |
M10 (Notifications + Polish)
```

---

## Key Architecture Patterns (from Signal CRM)

1. **Token-driven CSS:** All visual values in `globals.css` as CSS custom properties. Tailwind config references vars. Zero hardcoded hex in components.
2. **Server Components default:** Pages/layouts are Server Components. `'use client'` only where interactivity needed (forms, map, sidebar state).
3. **Server Actions for mutations:** All writes via `src/lib/actions/`. Each validates with zod, writes audit log, revalidates path.
4. **Supabase SSR pattern:** Browser client + Server client factories. Middleware handles token refresh.
5. **RLS as security backbone:** Every table has tenant_id RLS. JWT-based `get_tenant_id()` avoids extra queries.
6. **No borders, tonal layering:** Background color shifts define sections (DESIGN.md "No-Line Rule"). Cards use ambient shadows.
7. **Map-first navigation:** Clicking a plot opens everything related to it.

---

## Reference Files

- PRD: `C:\Users\Nebula PC\Haven\Haven-PRD-v1.0.docx`
- Design System: `C:\Users\Nebula PC\Haven\DESIGN.md`
- HTML Prototype: `C:\Users\Nebula PC\Haven\code.html`
- Screenshot: `C:\Users\Nebula PC\Haven\screen.png`
- CRM Design Reference: `C:\Users\Nebula PC\pmhc-crm-prd\docs\design-system.md`
- CRM Tokens: `C:\Users\Nebula PC\pmhc-crm-prd\app\globals.css`
- CRM Tailwind Config: `C:\Users\Nebula PC\pmhc-crm-prd\tailwind.config.ts`
