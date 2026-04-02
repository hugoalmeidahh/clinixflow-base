-- ============================================================
-- Migration: 20260309000000_initial_schema.sql
-- Initial schema for ClinixFlow multi-tenant SaaS platform.
--
-- Creates all enums, tables (in FK-dependency order), helper
-- functions, the handle_new_user trigger, and the minimal RLS
-- policy on tenants.INSERT required by the first patch migration.
--
-- NOTE: Full RLS policies are in 20260311100001_rls_complete.sql
-- NOTE: Immutability triggers are in 20260311100002_clinical_immutability.sql
-- NOTE: Audit triggers are in 20260311100003_audit_trigger.sql
-- ============================================================

-- ============================================================
-- SECTION 1: ENUMS
-- ============================================================

DO $$ BEGIN
  CREATE TYPE public.appointment_status AS ENUM (
    'SCHEDULED',
    'CONFIRMED',
    'ATTENDED',
    'ABSENCE',
    'JUSTIFIED_ABSENCE',
    'CANCELLED',
    'RESCHEDULED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.appointment_type AS ENUM (
    'IN_PERSON',
    'ONLINE',
    'HOME_VISIT'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.care_type AS ENUM (
    'SINGLE_SESSION',
    'ONGOING_TREATMENT'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.clinical_event_type AS ENUM (
    'EVALUATION',
    'NOTE',
    'ATTENDED',
    'ABSENCE',
    'JUSTIFIED_ABSENCE',
    'DOCUMENT'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.document_category AS ENUM (
    'MEDICAL_REQUEST',
    'LAB_RESULT',
    'INSURANCE_AUTHORIZATION',
    'TREATMENT_CONTRACT',
    'ATTENDANCE_CERTIFICATE',
    'OTHER'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.financial_status AS ENUM (
    'PROJECTED',
    'REALIZED',
    'RECEIVED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.module_type AS ENUM (
    'BASE',
    'EVALUATIONS',
    'FINANCIAL',
    'REPORTS',
    'VACCINES'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.org_role AS ENUM (
    'ORG_ADMIN',
    'MANAGER',
    'HEALTH_PROFESSIONAL',
    'RECEPTIONIST',
    'FINANCIAL',
    'PATIENT'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.plan_tier AS ENUM (
    'FREE',
    'STARTER',
    'PROFESSIONAL',
    'ENTERPRISE'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.transaction_type AS ENUM (
    'INCOME',
    'EXPENSE'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- SECTION 2: BASE TABLES (no FK dependencies outside auth)
-- ============================================================

-- ------------------------------------------------------------
-- plans
-- Global reference data for SaaS subscription tiers.
-- No tenant_id; managed by backoffice/admin.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.plans (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name               text NOT NULL,
  tier               public.plan_tier NOT NULL DEFAULT 'FREE',
  price_monthly      integer NOT NULL DEFAULT 0,
  price_yearly       integer NOT NULL DEFAULT 0,
  max_users          integer NOT NULL DEFAULT 1,
  max_patients       integer NULL,
  allowed_modules    public.module_type[] NOT NULL DEFAULT ARRAY['BASE'::public.module_type],
  features           jsonb NULL,
  is_active          boolean NOT NULL DEFAULT true,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- tenants
-- The root multi-tenant entity; one row per clinic/org.
-- plan_id is a soft FK (nullable) — plans must exist first.
-- trial_started_at and trial_duration_days added here directly
-- (later migrations ADD COLUMN IF NOT EXISTS idempotently).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tenants (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  text NOT NULL,
  slug                  text NOT NULL UNIQUE,
  cnpj                  text NULL,
  email                 text NULL,
  phone                 text NULL,
  website               text NULL,
  logo_url              text NULL,
  address               jsonb NULL,
  business_hours        jsonb NULL,
  settings              jsonb NULL,
  active_modules        public.module_type[] NOT NULL DEFAULT ARRAY['BASE'::public.module_type],
  plan_id               uuid NULL REFERENCES public.plans(id) ON DELETE SET NULL,
  subscription_status   text NULL,
  subscription_ends_at  timestamptz NULL,
  trial_started_at      timestamptz NULL,
  trial_duration_days   integer NULL DEFAULT 10,
  onboarding_completed  boolean NOT NULL DEFAULT false,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- profiles
-- One-to-one extension of auth.users for display data.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text NOT NULL,
  full_name   text NULL,
  phone       text NULL,
  avatar_url  text NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- user_roles
-- Maps auth users to tenants with a specific org role.
-- A user can belong to multiple tenants.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id   uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  role        public.org_role NOT NULL,
  is_active   boolean NOT NULL DEFAULT true,
  invited_at  timestamptz NULL,
  accepted_at timestamptz NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, tenant_id)
);

-- ============================================================
-- SECTION 3: TENANT-SCOPED TABLES (depend on tenants)
-- ============================================================

-- ------------------------------------------------------------
-- rooms
-- Physical consultation rooms inside a tenant.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rooms (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name             text NOT NULL,
  capacity         integer NULL,
  equipment_notes  text NULL,
  is_active        boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- conventions
-- Health insurance / convenio payers.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conventions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name              text NOT NULL,
  cnpj              text NULL,
  phone             text NULL,
  email             text NULL,
  contact           text NULL,
  default_fee_table jsonb NULL,
  ans_code          text NULL,
  is_active         boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- specialties
-- Clinical specialties offered by a tenant.
-- tuss_code added inline (later migration ADD COLUMN IF NOT EXISTS is idempotent).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.specialties (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id             uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name                  text NOT NULL,
  category              text NULL,
  default_duration_min  integer NOT NULL DEFAULT 30,
  default_fee           numeric NULL,
  tuss_code             text NULL,
  is_active             boolean NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- evaluation_types
-- Form definitions for clinical evaluations (e.g., assessments).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.evaluation_types (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  code           text NOT NULL,
  name           text NOT NULL,
  description    text NULL,
  form_schema    jsonb NOT NULL DEFAULT '{}',
  scoring_logic  jsonb NULL,
  is_active      boolean NOT NULL DEFAULT true,
  is_custom      boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- expense_categories
-- Categories for financial expense transactions.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.expense_categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name        text NOT NULL,
  color       text NULL,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- vaccines
-- Vaccine catalog for a tenant.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vaccines (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name                text NOT NULL,
  description         text NULL,
  manufacturer        text NULL,
  doses_required      integer NOT NULL DEFAULT 1,
  dose_labels         text[] NULL,
  min_interval_days   integer NULL,
  indications         text NULL,
  contraindications   text NULL,
  is_active           boolean NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- document_templates
-- HTML templates for generated documents (certificates, etc.).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.document_templates (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name           text NOT NULL,
  template_type  text NOT NULL,
  content_html   text NOT NULL,
  variables      text[] NULL,
  is_active      boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- role_permissions
-- Granular permission sets per role within a tenant.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  role        text NOT NULL,
  permissions jsonb NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- SECTION 4: TABLES THAT DEPEND ON TENANTS + OTHER TENANT TABLES
-- ============================================================

-- ------------------------------------------------------------
-- professionals
-- Staff/clinicians linked to a tenant (and optionally to a user).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.professionals (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id             uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name           text NOT NULL,
  email               text NULL,
  phone               text NULL,
  cpf                 text NULL,
  avatar_url          text NULL,
  address             jsonb NULL,
  registration_number text NULL,
  registration_type   text NULL,
  staff_role          text NOT NULL DEFAULT 'HEALTH_PROFESSIONAL',
  is_active           boolean NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- patients
-- Patients registered under a tenant.
-- convention_id is an optional FK to conventions.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.patients (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id             uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id               uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  record_number         text NOT NULL,
  full_name             text NOT NULL,
  email                 text NULL,
  phone                 text NULL,
  cpf                   text NULL,
  date_of_birth         date NULL,
  gender                text NULL,
  avatar_url            text NULL,
  address               jsonb NULL,
  care_type             public.care_type NOT NULL DEFAULT 'SINGLE_SESSION',
  convention_id         uuid NULL REFERENCES public.conventions(id) ON DELETE SET NULL,
  insurance_card_number text NULL,
  insurance_card_expiry date NULL,
  guardian_name         text NULL,
  guardian_relationship text NULL,
  guardian_phone        text NULL,
  guardian_email        text NULL,
  guardian_cpf          text NULL,
  allergy_alerts        text NULL,
  general_observations  text NULL,
  is_active             boolean NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, record_number)
);

-- ============================================================
-- SECTION 5: JUNCTION / CHILD TABLES
-- ============================================================

-- ------------------------------------------------------------
-- professional_availability
-- Weekly availability slots for a professional.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.professional_availability (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id          uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  day_of_week              integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time               text NOT NULL,
  end_time                 text NOT NULL,
  appointment_interval_min integer NOT NULL DEFAULT 30,
  is_active                boolean NOT NULL DEFAULT true,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- professional_blocks
-- Date-range blocks (vacations, absences) for a professional.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.professional_blocks (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  start_date      timestamptz NOT NULL,
  end_date        timestamptz NOT NULL,
  reason          text NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- professional_specialties
-- M-N relation between professionals and specialties,
-- with optional custom fee override.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.professional_specialties (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  specialty_id    uuid NOT NULL REFERENCES public.specialties(id) ON DELETE CASCADE,
  custom_fee      numeric NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (professional_id, specialty_id)
);

-- ------------------------------------------------------------
-- specialty_evaluation_types
-- M-N relation between specialties and evaluation types.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.specialty_evaluation_types (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  specialty_id        uuid NOT NULL REFERENCES public.specialties(id) ON DELETE CASCADE,
  evaluation_type_id  uuid NOT NULL REFERENCES public.evaluation_types(id) ON DELETE CASCADE,
  is_required         boolean NOT NULL DEFAULT false,
  created_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (specialty_id, evaluation_type_id)
);

-- ------------------------------------------------------------
-- vaccine_batches
-- Vaccine inventory lots.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vaccine_batches (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  vaccine_id         uuid NOT NULL REFERENCES public.vaccines(id) ON DELETE CASCADE,
  lot_number         text NOT NULL,
  manufacturer       text NULL,
  manufacturing_date date NULL,
  expiration_date    date NOT NULL,
  quantity_received  integer NOT NULL,
  quantity_remaining integer NOT NULL,
  received_at        timestamptz NOT NULL DEFAULT now(),
  received_by        text NULL,
  min_temp_celsius   numeric NULL,
  max_temp_celsius   numeric NULL,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- SECTION 6: SEQUENCE TABLES (composite PK, no id column)
-- ============================================================

-- ------------------------------------------------------------
-- appointment_code_sequences
-- Tracks last used code number per tenant per year.
-- Used exclusively via get_next_appointment_code() SECURITY DEFINER.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.appointment_code_sequences (
  tenant_id    uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  year         integer NOT NULL,
  last_number  integer NOT NULL DEFAULT 0,
  PRIMARY KEY (tenant_id, year)
);

-- ------------------------------------------------------------
-- medical_record_sequences
-- Single counter per tenant for patient record numbers.
-- Used exclusively via get_next_record_number() SECURITY DEFINER.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.medical_record_sequences (
  tenant_id    uuid PRIMARY KEY REFERENCES public.tenants(id) ON DELETE CASCADE,
  last_number  integer NOT NULL DEFAULT 0
);

-- ============================================================
-- SECTION 7: CLINICAL TABLES (depend on patients/professionals/etc.)
-- ============================================================

-- ------------------------------------------------------------
-- appointments
-- The core scheduling entity.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.appointments (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id               uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  patient_id              uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  professional_id         uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  specialty_id            uuid NOT NULL REFERENCES public.specialties(id) ON DELETE CASCADE,
  room_id                 uuid NULL REFERENCES public.rooms(id) ON DELETE SET NULL,
  code                    text NOT NULL,
  scheduled_at            timestamptz NOT NULL,
  duration_min            integer NOT NULL DEFAULT 30,
  status                  public.appointment_status NOT NULL DEFAULT 'SCHEDULED',
  appointment_type        public.appointment_type NOT NULL DEFAULT 'IN_PERSON',
  notes                   text NULL,
  fee                     numeric NULL,
  confirmed_at            timestamptz NULL,
  attended_at             timestamptz NULL,
  cancelled_at            timestamptz NULL,
  cancelled_by            uuid NULL,
  cancellation_reason     text NULL,
  absence_reason          text NULL,
  absence_justified       boolean NULL,
  original_appointment_id uuid NULL REFERENCES public.appointments(id) ON DELETE SET NULL,
  recurrence_group_id     uuid NULL,
  created_by              uuid NULL,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, code)
);

-- ------------------------------------------------------------
-- evaluations
-- Clinical evaluation forms filled per appointment.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.evaluations (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  patient_id          uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  professional_id     uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  evaluation_type_id  uuid NOT NULL REFERENCES public.evaluation_types(id) ON DELETE RESTRICT,
  appointment_id      uuid NULL REFERENCES public.appointments(id) ON DELETE SET NULL,
  form_data           jsonb NOT NULL DEFAULT '{}',
  result              jsonb NULL,
  notes               text NULL,
  is_draft            boolean NOT NULL DEFAULT true,
  is_locked           boolean NOT NULL DEFAULT false,
  finalized_at        timestamptz NULL,
  finalized_by        uuid NULL,
  pdf_url             text NULL,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- clinical_events
-- Append-only clinical timeline (LGPD-protected immutable records).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clinical_events (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  patient_id     uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  appointment_id uuid NULL REFERENCES public.appointments(id) ON DELETE SET NULL,
  event_type     public.clinical_event_type NOT NULL,
  performed_by   uuid NOT NULL,
  performed_at   timestamptz NOT NULL DEFAULT now(),
  content        text NULL,
  metadata       jsonb NULL,
  is_immutable   boolean NOT NULL DEFAULT false,
  ip_address     text NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- documents
-- Files/documents attached to a patient record.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.documents (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  patient_id     uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  name           text NOT NULL,
  file_url       text NOT NULL,
  file_type      text NULL,
  file_size      integer NULL,
  category       public.document_category NOT NULL DEFAULT 'OTHER',
  template_type  text NULL,
  is_generated   boolean NOT NULL DEFAULT false,
  created_by     uuid NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- treatment_contracts
-- Treatment plan agreements signed by patients.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.treatment_contracts (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id             uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  patient_id            uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  professional_id       uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  previous_contract_id  uuid NULL REFERENCES public.treatment_contracts(id) ON DELETE SET NULL,
  version               integer NOT NULL DEFAULT 1,
  description           text NULL,
  goals                 text NULL,
  start_date            date NULL,
  end_date              date NULL,
  session_frequency     text NULL,
  estimated_duration    text NULL,
  fee_per_session       numeric NULL,
  payment_terms         text NULL,
  cancellation_policy   text NULL,
  content_html          text NULL,
  signature_data        text NULL,
  signed_at             timestamptz NULL,
  signed_by_name        text NULL,
  acceptance_checkbox   boolean NULL,
  pdf_url               text NULL,
  is_locked             boolean NOT NULL DEFAULT false,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- SECTION 8: FINANCIAL TABLES
-- ============================================================

-- ------------------------------------------------------------
-- transactions
-- Income/expense ledger entries per tenant.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  type             public.transaction_type NOT NULL,
  amount           numeric NOT NULL,
  description      text NULL,
  reference_date   date NOT NULL,
  is_paid          boolean NOT NULL DEFAULT false,
  paid_at          timestamptz NULL,
  payment_method   text NULL,
  receipt_url      text NULL,
  financial_status public.financial_status NOT NULL DEFAULT 'REALIZED',
  patient_id       uuid NULL REFERENCES public.patients(id) ON DELETE SET NULL,
  professional_id  uuid NULL REFERENCES public.professionals(id) ON DELETE SET NULL,
  appointment_id   uuid NULL REFERENCES public.appointments(id) ON DELETE SET NULL,
  category_id      uuid NULL REFERENCES public.expense_categories(id) ON DELETE SET NULL,
  convention_id    uuid NULL REFERENCES public.conventions(id) ON DELETE SET NULL,
  created_by       uuid NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- SECTION 9: VACCINE CHILD TABLES
-- ============================================================

-- ------------------------------------------------------------
-- vaccine_applications
-- Record of a vaccine dose given to a patient.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vaccine_applications (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  vaccine_id      uuid NOT NULL REFERENCES public.vaccines(id) ON DELETE RESTRICT,
  batch_id        uuid NOT NULL REFERENCES public.vaccine_batches(id) ON DELETE RESTRICT,
  patient_id      uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  professional_id uuid NOT NULL REFERENCES public.professionals(id) ON DELETE RESTRICT,
  dose_label      text NOT NULL,
  applied_at      timestamptz NOT NULL DEFAULT now(),
  injection_site  text NULL,
  observations    text NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- vaccine_temp_logs
-- Temperature monitoring logs for cold-chain compliance.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vaccine_temp_logs (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  recorded_date       date NOT NULL,
  temperature_celsius numeric NOT NULL,
  recorded_by         text NOT NULL,
  is_out_of_range     boolean NOT NULL DEFAULT false,
  notes               text NULL,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- SECTION 10: AUDIT LOG
-- ============================================================

-- ------------------------------------------------------------
-- audit_logs
-- Append-only audit trail for sensitive table mutations.
-- Populated exclusively by the audit_trigger_func() SECURITY DEFINER.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NULL REFERENCES public.tenants(id) ON DELETE SET NULL,
  user_id      uuid NULL,
  action       text NOT NULL,
  entity_type  text NOT NULL,
  entity_id    text NULL,
  old_data     jsonb NULL,
  new_data     jsonb NULL,
  ip_address   text NULL,
  user_agent   text NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- SECTION 11: SAAS ADMIN TABLE
-- ============================================================

-- ------------------------------------------------------------
-- saas_admins
-- Users with backoffice SaaS admin privileges.
-- Created here so the saas_admins migration can INSERT safely.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saas_admins (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active  boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.saas_admins ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SECTION 12: HELPER FUNCTIONS
-- ============================================================

-- ------------------------------------------------------------
-- get_user_tenant_id
-- Returns the first active tenant_id for the given user.
-- Used in every RLS policy.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_user_tenant_id(p_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT tenant_id
  FROM public.user_roles
  WHERE user_id = p_user_id
    AND is_active = true
  LIMIT 1;
$$;

-- ------------------------------------------------------------
-- has_tenant_role
-- Returns true if the user holds any of the given roles in the
-- specified tenant.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_tenant_role(
  p_user_id  uuid,
  p_tenant_id uuid,
  p_roles     org_role[]
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id   = p_user_id
      AND tenant_id = p_tenant_id
      AND role      = ANY(p_roles)
      AND is_active = true
  );
$$;

-- ------------------------------------------------------------
-- get_next_appointment_code
-- Atomically generates the next appointment code for a tenant/year.
-- Format: AGD-YYYY-NNNNN
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_next_appointment_code(p_tenant_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_year integer := EXTRACT(YEAR FROM now())::integer;
  v_next integer;
BEGIN
  INSERT INTO public.appointment_code_sequences (tenant_id, year, last_number)
  VALUES (p_tenant_id, v_year, 1)
  ON CONFLICT (tenant_id, year)
  DO UPDATE SET last_number = appointment_code_sequences.last_number + 1
  RETURNING last_number INTO v_next;

  RETURN 'AGD-' || v_year::text || '-' || LPAD(v_next::text, 5, '0');
END;
$$;

-- ------------------------------------------------------------
-- get_next_record_number
-- Atomically generates the next patient record number.
-- Format: PAC-NNNNN
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_next_record_number(p_tenant_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_next integer;
BEGIN
  INSERT INTO public.medical_record_sequences (tenant_id, last_number)
  VALUES (p_tenant_id, 1)
  ON CONFLICT (tenant_id)
  DO UPDATE SET last_number = medical_record_sequences.last_number + 1
  RETURNING last_number INTO v_next;

  RETURN 'PAC-' || LPAD(v_next::text, 5, '0');
END;
$$;

-- ------------------------------------------------------------
-- handle_new_user
-- Trigger function: fires after a new auth.users row is created.
--
-- Behavior:
--   1. Always creates a public.profiles row.
--   2. If the signup metadata contains org_name, creates a new
--      tenant (with TRIAL subscription) and assigns the user
--      as ORG_ADMIN, handling slug collisions automatically.
--
-- NOTE: Subsequent migrations replace this function with
--       CREATE OR REPLACE to add/refine logic; this is the
--       canonical initial version.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_tenant_id  uuid;
  v_org_name   text;
  v_base_slug  text;
  v_slug       text;
  v_cnpj       text;
  v_phone      text;
  v_counter    integer := 0;
BEGIN
  -- 1. Create profile
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );

  -- 2. Optionally create tenant + assign ORG_ADMIN role
  v_org_name := NEW.raw_user_meta_data->>'org_name';
  IF v_org_name IS NOT NULL AND v_org_name != '' THEN
    v_base_slug := NEW.raw_user_meta_data->>'org_slug';
    v_slug      := v_base_slug;
    v_cnpj      := NULLIF(NEW.raw_user_meta_data->>'org_cnpj', '');
    v_phone     := NULLIF(NEW.raw_user_meta_data->>'org_phone', '');

    -- Handle duplicate slugs by appending an incrementing counter
    LOOP
      BEGIN
        INSERT INTO public.tenants (
          name, slug, cnpj, email, phone,
          subscription_status, trial_started_at, trial_duration_days,
          subscription_ends_at
        )
        VALUES (
          v_org_name, v_slug, v_cnpj, NEW.email, v_phone,
          'TRIAL', now(), 10,
          now() + interval '10 days'
        )
        RETURNING id INTO v_tenant_id;
        EXIT; -- success
      EXCEPTION WHEN unique_violation THEN
        v_counter := v_counter + 1;
        v_slug    := v_base_slug || '-' || v_counter;
        IF v_counter > 100 THEN
          RAISE EXCEPTION 'Could not generate unique slug for tenant';
        END IF;
      END;
    END LOOP;

    INSERT INTO public.user_roles (user_id, tenant_id, role, accepted_at)
    VALUES (NEW.id, v_tenant_id, 'ORG_ADMIN', now());
  END IF;

  RETURN NEW;
END;
$function$;

-- ============================================================
-- SECTION 13: TRIGGER — on_auth_user_created
-- ============================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SECTION 14: MINIMAL RLS — tenants INSERT
-- Required by the first patch migration
-- (20260309051353) which DROPs and re-creates this policy.
-- All other RLS is handled in 20260311100001_rls_complete.sql.
-- ============================================================

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Permissive INSERT so the handle_new_user trigger (which runs
-- as SECURITY DEFINER) and authenticated signups can create tenants.
DROP POLICY IF EXISTS "Users can create tenants during signup" ON public.tenants;
CREATE POLICY "Users can create tenants during signup"
  ON public.tenants
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
