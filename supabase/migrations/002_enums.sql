-- 002_enums.sql
-- Custom enum types used across Haven's tables.
-- Enums enforce valid values at the database level, so even if the app
-- has a bug, invalid data can't sneak into the database.

-- Plot lifecycle status
CREATE TYPE plot_status AS ENUM (
  'available',
  'reserved',
  'sold',
  'occupied',
  'full',
  'expired',
  'surrendered',
  'unavailable'
);

-- Types of plots a cemetery can have
CREATE TYPE plot_type AS ENUM (
  'lawn_single',
  'lawn_double',
  'lawn_triple',
  'monumental',
  'vault',
  'columbarium_niche',
  'memorial_garden',
  'memorial_wall',
  'scattering_garden',
  'natural_burial',
  'infant',
  'denominational',
  'war_grave'
);

-- How remains are placed
CREATE TYPE interment_type AS ENUM (
  'burial',
  'ashes_interment',
  'ashes_scattering',
  'mausoleum_placement'
);

-- Booking lifecycle
CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled'
);

-- What the booking is for
CREATE TYPE booking_type AS ENUM (
  'burial',
  'ashes_interment',
  'ashes_scattering',
  'memorial_service',
  'exhumation',
  'monumental_works',
  'grounds_maintenance'
);

-- Work order lifecycle
CREATE TYPE work_order_status AS ENUM (
  'created',
  'assigned',
  'in_progress',
  'completed',
  'cancelled'
);

-- Work order urgency
CREATE TYPE work_order_priority AS ENUM (
  'urgent',
  'high',
  'normal',
  'low'
);

-- What kind of work order
CREATE TYPE work_order_type AS ENUM (
  'grave_preparation',
  'grave_backfill',
  'memorial_installation',
  'memorial_inspection',
  'grounds_maintenance',
  'tree_management',
  'infrastructure',
  'general_maintenance'
);

-- Memorial permit lifecycle
CREATE TYPE permit_status AS ENUM (
  'submitted',
  'under_review',
  'approved',
  'rejected',
  'completed'
);

-- Memorial works type
CREATE TYPE permit_work_type AS ENUM (
  'new_memorial',
  'repair',
  'additional_inscription',
  'restoration',
  'removal'
);

-- User roles across all portals
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'council_admin',
  'council_officer',
  'funeral_director',
  'mason',
  'grounds_crew',
  'finance_officer',
  'public'
);

-- Interment right duration type
CREATE TYPE right_type AS ENUM (
  'perpetual',
  'renewable'
);

-- Interment right lifecycle
CREATE TYPE right_status AS ENUM (
  'active',
  'expired',
  'surrendered',
  'transferred'
);

-- Who/what a contact represents
CREATE TYPE contact_type AS ENUM (
  'rights_holder',
  'next_of_kin',
  'funeral_director',
  'mason',
  'contractor',
  'supplier',
  'other'
);

-- Document filing categories
CREATE TYPE document_category AS ENUM (
  'statutory',
  'contractual',
  'correspondence',
  'photo',
  'map',
  'report',
  'other'
);

-- Invoice lifecycle
CREATE TYPE invoice_status AS ENUM (
  'draft',
  'sent',
  'paid',
  'overdue',
  'cancelled'
);

-- What triggered the notification
CREATE TYPE notification_type AS ENUM (
  'booking',
  'work_order',
  'permit',
  'payment',
  'renewal',
  'system'
);
