// database.ts
// TypeScript types matching the Haven database schema.
//
// These types are used throughout the app to ensure type safety when
// working with Supabase queries. They mirror the SQL tables exactly.
//
// NOTE: In production you'd auto-generate these with `supabase gen types`.
// These manual types give us something to work with before Supabase is set up.

// ============================================================
// ENUM TYPES
// ============================================================

export type PlotStatus =
  | "available"
  | "reserved"
  | "sold"
  | "occupied"
  | "full"
  | "expired"
  | "surrendered"
  | "unavailable";

export type PlotType =
  | "lawn_single"
  | "lawn_double"
  | "lawn_triple"
  | "monumental"
  | "vault"
  | "columbarium_niche"
  | "memorial_garden"
  | "memorial_wall"
  | "scattering_garden"
  | "natural_burial"
  | "infant"
  | "denominational"
  | "war_grave";

export type IntermentType =
  | "burial"
  | "ashes_interment"
  | "ashes_scattering"
  | "mausoleum_placement";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type BookingType =
  | "burial"
  | "ashes_interment"
  | "ashes_scattering"
  | "memorial_service"
  | "exhumation"
  | "monumental_works"
  | "grounds_maintenance";

export type WorkOrderStatus =
  | "created"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export type WorkOrderPriority = "urgent" | "high" | "normal" | "low";

export type WorkOrderType =
  | "grave_preparation"
  | "grave_backfill"
  | "memorial_installation"
  | "memorial_inspection"
  | "grounds_maintenance"
  | "tree_management"
  | "infrastructure"
  | "general_maintenance";

export type PermitStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "completed";

export type PermitWorkType =
  | "new_memorial"
  | "repair"
  | "additional_inscription"
  | "restoration"
  | "removal";

export type UserRole =
  | "super_admin"
  | "council_admin"
  | "council_officer"
  | "funeral_director"
  | "mason"
  | "grounds_crew"
  | "finance_officer"
  | "public";

export type RightType = "perpetual" | "renewable";

export type RightStatus = "active" | "expired" | "surrendered" | "transferred";

export type ContactType =
  | "rights_holder"
  | "next_of_kin"
  | "funeral_director"
  | "mason"
  | "contractor"
  | "supplier"
  | "other";

export type DocumentCategory =
  | "statutory"
  | "contractual"
  | "correspondence"
  | "photo"
  | "map"
  | "report"
  | "other";

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "paid"
  | "overdue"
  | "cancelled";

export type NotificationType =
  | "booking"
  | "work_order"
  | "permit"
  | "payment"
  | "renewal"
  | "system";

// ============================================================
// TABLE TYPES
// ============================================================

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  config: Record<string, unknown>;
  logo_url: string | null;
  primary_colour: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  tenant_id: string;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Cemetery {
  id: string;
  tenant_id: string;
  name: string;
  address: string | null;
  suburb: string | null;
  state: string | null;
  postcode: string | null;
  lat: number | null;
  lng: number | null;
  boundary: unknown | null; // PostGIS geometry — handled by map libraries
  status: "active" | "closed";
  opening_hours: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface Section {
  id: string;
  tenant_id: string;
  cemetery_id: string;
  name: string;
  code: string | null;
  section_type: string | null;
  boundary: unknown | null; // PostGIS geometry
  status: "active" | "closed" | "full";
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface Plot {
  id: string;
  tenant_id: string;
  section_id: string;
  plot_number: string;
  plot_type: PlotType;
  status: PlotStatus;
  capacity: number;
  remaining_capacity: number;
  length_m: number | null;
  width_m: number | null;
  depth_m: number | null;
  centroid: unknown | null; // PostGIS point
  row_number: string | null;
  position: string | null;
  soil_type: string | null;
  infrastructure_notes: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface Contact {
  id: string;
  tenant_id: string;
  contact_type: ContactType;
  first_name: string;
  last_name: string;
  organisation: string | null;
  email: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  suburb: string | null;
  state: string | null;
  postcode: string | null;
  licence_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface Deceased {
  id: string;
  tenant_id: string;
  surname: string;
  given_names: string;
  maiden_name: string | null;
  date_of_birth: string | null;
  date_of_death: string | null;
  age_at_death: number | null;
  gender: string | null;
  place_of_death: string | null;
  cause_of_death: string | null;
  religion: string | null;
  cultural_background: string | null;
  death_cert_number: string | null;
  burial_order_number: string | null;
  doctor_coroner_ref: string | null;
  next_of_kin_contact_id: string | null;
  funeral_director_contact_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface Interment {
  id: string;
  tenant_id: string;
  plot_id: string;
  deceased_id: string;
  booking_id: string | null;
  interment_type: IntermentType;
  interment_date: string;
  interment_time: string | null;
  depth: number | null;
  coffin_details: string | null;
  applicant_contact_id: string | null;
  status: "scheduled" | "completed" | "cancelled";
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface RightOfInterment {
  id: string;
  tenant_id: string;
  plot_id: string;
  rights_holder_contact_id: string;
  right_type: RightType;
  status: RightStatus;
  grant_date: string;
  expiry_date: string | null;
  renewal_period_years: number | null;
  contract_document_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface Booking {
  id: string;
  tenant_id: string;
  cemetery_id: string;
  plot_id: string | null;
  booking_type: BookingType;
  status: BookingStatus;
  requested_date: string;
  requested_time: string | null;
  confirmed_date: string | null;
  confirmed_time: string | null;
  duration_minutes: number;
  funeral_director_contact_id: string | null;
  applicant_contact_id: string | null;
  deceased_name: string | null;
  special_requirements: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface WorkOrder {
  id: string;
  tenant_id: string;
  title: string;
  description: string | null;
  work_order_type: WorkOrderType;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  plot_id: string | null;
  booking_id: string | null;
  cemetery_id: string | null;
  assigned_to: string | null;
  due_date: string | null;
  estimated_hours: number | null;
  started_at: string | null;
  completed_at: string | null;
  checklist: unknown[];
  photos: unknown[];
  completion_notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface Memorial {
  id: string;
  tenant_id: string;
  plot_id: string;
  memorial_type: string;
  material: string | null;
  length_m: number | null;
  width_m: number | null;
  height_m: number | null;
  inscription: string | null;
  condition: "good" | "fair" | "poor" | "unsafe";
  last_inspection_date: string | null;
  mason_contact_id: string | null;
  photos: unknown[];
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface MemorialPermit {
  id: string;
  tenant_id: string;
  memorial_id: string | null;
  plot_id: string;
  mason_contact_id: string;
  work_type: PermitWorkType;
  status: PermitStatus;
  description: string | null;
  dimensions_notes: string | null;
  material_notes: string | null;
  design_document_id: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  approved_by: string | null;
  approval_notes: string | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface Document {
  id: string;
  tenant_id: string;
  name: string;
  category: DocumentCategory;
  file_url: string;
  file_type: string | null;
  file_size_bytes: number | null;
  linked_entity_type: string;
  linked_entity_id: string;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface FeeSchedule {
  id: string;
  tenant_id: string;
  cemetery_id: string | null;
  service_type: string;
  description: string;
  amount: number;
  gst_inclusive: boolean;
  effective_from: string;
  effective_to: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface Invoice {
  id: string;
  tenant_id: string;
  invoice_number: string;
  contact_id: string;
  booking_id: string | null;
  line_items: unknown[];
  subtotal: number;
  gst: number;
  total: number;
  status: InvoiceStatus;
  issued_date: string | null;
  due_date: string | null;
  paid_date: string | null;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface AuditLog {
  id: string;
  tenant_id: string;
  entity_type: string;
  entity_id: string;
  action: "create" | "update" | "delete";
  user_id: string | null;
  changes: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface BookingNote {
  id: string;
  tenant_id: string;
  booking_id: string;
  author_id: string;
  content: string;
  is_internal: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  tenant_id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  read: boolean;
  linked_entity_type: string | null;
  linked_entity_id: string | null;
  created_at: string;
}
