-- Migration: Add i18n fields, authorization guides, financial transactions, inactivation reasons
-- Date: 2026-02-08
-- Description: Adds slug fields to specialties/insurances, preferred language to users,
--   guide number to appointments, patient inactivation fields, and creates new tables
--   for authorization guides, guide sessions, financial transactions, monthly closings,
--   inactivation reasons, and appointment statuses.

-- =====================
-- 1. ALTER EXISTING TABLES
-- =====================

-- Add preferred language to users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "preferred_language" varchar(10) DEFAULT 'pt-BR';

-- Add slug to specialties
ALTER TABLE "specialties" ADD COLUMN IF NOT EXISTS "slug" varchar(255) UNIQUE;

-- Add clinic_id to specialties (NULL = system specialty, UUID = clinic custom)
ALTER TABLE "specialties" ADD COLUMN IF NOT EXISTS "clinic_id" uuid;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'specialties_clinic_id_clinics_id_fk'
  ) THEN
    ALTER TABLE "specialties"
    ADD CONSTRAINT "specialties_clinic_id_clinics_id_fk"
    FOREIGN KEY ("clinic_id")
    REFERENCES "clinics"("id")
    ON DELETE CASCADE;
  END IF;
END $$;

-- Add slug to insurances
ALTER TABLE "insurances" ADD COLUMN IF NOT EXISTS "slug" varchar(255) UNIQUE;

-- Add guide_number to appointments
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "guide_number" varchar(100);

-- Add patient inactivation fields
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "inactivation_reason_id" uuid;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "inactivation_notes" text;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "inactivated_at" timestamp;

-- =====================
-- 2. CREATE NEW ENUMS
-- =====================

DO $$ BEGIN
  CREATE TYPE "guide_status" AS ENUM ('active', 'completed', 'expired', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "guide_session_status" AS ENUM ('pending', 'scheduled', 'completed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "transaction_type" AS ENUM ('income', 'expense');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =====================
-- 3. CREATE NEW TABLES
-- =====================

-- Inactivation reasons table
CREATE TABLE IF NOT EXISTS "inactivation_reasons" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "slug" varchar(255) NOT NULL UNIQUE,
  "clinic_id" uuid REFERENCES "clinics"("id") ON DELETE CASCADE,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now()
);

-- Add FK from patients to inactivation_reasons
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'patients_inactivation_reason_id_inactivation_reasons_id_fk'
  ) THEN
    ALTER TABLE "patients"
    ADD CONSTRAINT "patients_inactivation_reason_id_inactivation_reasons_id_fk"
    FOREIGN KEY ("inactivation_reason_id")
    REFERENCES "inactivation_reasons"("id")
    ON DELETE SET NULL;
  END IF;
END $$;

-- Appointment statuses table
CREATE TABLE IF NOT EXISTS "appointment_statuses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "slug" varchar(255) NOT NULL UNIQUE,
  "color" varchar(20),
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now()
);

-- Authorization guides table
CREATE TABLE IF NOT EXISTS "authorization_guides" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "clinic_id" uuid NOT NULL REFERENCES "clinics"("id") ON DELETE CASCADE,
  "patient_id" uuid NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
  "insurance_provider_id" uuid REFERENCES "insurances"("id") ON DELETE SET NULL,
  "guide_number" varchar(100) NOT NULL UNIQUE,
  "total_sessions" integer NOT NULL,
  "completed_sessions" integer DEFAULT 0 NOT NULL,
  "session_value_in_cents" integer NOT NULL,
  "issue_date" date NOT NULL,
  "expiry_date" date,
  "status" "guide_status" DEFAULT 'active' NOT NULL,
  "created_by" text REFERENCES "users"("id") ON DELETE SET NULL,
  "updated_by" text REFERENCES "users"("id") ON DELETE SET NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now()
);

-- Guide sessions table
CREATE TABLE IF NOT EXISTS "guide_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "guide_id" uuid NOT NULL REFERENCES "authorization_guides"("id") ON DELETE CASCADE,
  "appointment_id" uuid REFERENCES "appointments"("id") ON DELETE SET NULL,
  "session_number" integer NOT NULL,
  "status" "guide_session_status" DEFAULT 'pending' NOT NULL,
  "scheduled_date" date,
  "scheduled_time" time,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now(),
  CONSTRAINT "guide_sessions_guide_id_session_number_unique" UNIQUE ("guide_id", "session_number")
);

-- Financial transactions table
CREATE TABLE IF NOT EXISTS "financial_transactions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "clinic_id" uuid NOT NULL REFERENCES "clinics"("id") ON DELETE CASCADE,
  "type" "transaction_type" NOT NULL,
  "category" varchar(100) NOT NULL,
  "amount" integer NOT NULL,
  "description" text,
  "transaction_date" date NOT NULL,
  "appointment_id" uuid REFERENCES "appointments"("id") ON DELETE SET NULL,
  "created_by" text REFERENCES "users"("id") ON DELETE SET NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now()
);

-- Monthly closings table
CREATE TABLE IF NOT EXISTS "monthly_closings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "clinic_id" uuid NOT NULL REFERENCES "clinics"("id") ON DELETE CASCADE,
  "month" integer NOT NULL,
  "year" integer NOT NULL,
  "total_income" integer NOT NULL,
  "total_expenses" integer NOT NULL,
  "net_profit" integer NOT NULL,
  "is_closed" boolean DEFAULT false NOT NULL,
  "closed_at" timestamp,
  "closed_by" text REFERENCES "users"("id") ON DELETE SET NULL,
  "notes" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now()
);

-- =====================
-- 4. CREATE INDEXES
-- =====================

CREATE INDEX IF NOT EXISTS "authorization_guides_clinic_id_idx" ON "authorization_guides"("clinic_id");
CREATE INDEX IF NOT EXISTS "authorization_guides_patient_id_idx" ON "authorization_guides"("patient_id");
CREATE INDEX IF NOT EXISTS "authorization_guides_status_idx" ON "authorization_guides"("status");
CREATE INDEX IF NOT EXISTS "guide_sessions_guide_id_idx" ON "guide_sessions"("guide_id");
CREATE INDEX IF NOT EXISTS "financial_transactions_clinic_id_idx" ON "financial_transactions"("clinic_id");
CREATE INDEX IF NOT EXISTS "financial_transactions_date_idx" ON "financial_transactions"("transaction_date");
CREATE INDEX IF NOT EXISTS "monthly_closings_clinic_id_idx" ON "monthly_closings"("clinic_id");
CREATE INDEX IF NOT EXISTS "monthly_closings_period_idx" ON "monthly_closings"("year", "month");

-- =====================
-- 5. SEED DEFAULT DATA
-- =====================

-- Default inactivation reasons (system-level, clinic_id = NULL)
INSERT INTO "inactivation_reasons" ("name", "slug", "clinic_id", "is_active") VALUES
  ('Mudança de cidade', 'mudanca_de_cidade', NULL, true),
  ('Insatisfação com o atendimento', 'insatisfacao_com_o_atendimento', NULL, true),
  ('Plano de saúde não aceito', 'plano_de_saude_nao_aceito', NULL, true),
  ('Falecimento', 'falecimento', NULL, true),
  ('Outros', 'outros', NULL, true)
ON CONFLICT ("slug") DO NOTHING;

-- Default appointment statuses
INSERT INTO "appointment_statuses" ("name", "slug", "color", "is_active") VALUES
  ('Agendado', 'agendado', '#3B82F6', true),
  ('Confirmado', 'confirmado', '#10B981', true),
  ('Compareceu', 'compareceu', '#22C55E', true),
  ('Faltou', 'faltou', '#EF4444', true),
  ('Cancelado', 'cancelado', '#6B7280', true),
  ('Reagendado', 'reagendado', '#F59E0B', true)
ON CONFLICT ("slug") DO NOTHING;

-- Generate slugs for existing specialties that don't have one
UPDATE "specialties"
SET "slug" = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      TRANSLATE(
        LOWER(TRIM("name")),
        'àáâãäéèêëíìîïóòôõöúùûüñç',
        'aaaaaeeeeiiiioooooouuuunc'
      ),
      '[^a-z0-9]+', '_', 'g'
    ),
    '^_+|_+$', '', 'g'
  )
)
WHERE "slug" IS NULL;

-- Generate slugs for existing insurances that don't have one
UPDATE "insurances"
SET "slug" = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      TRANSLATE(
        LOWER(TRIM("name")),
        'àáâãäéèêëíìîïóòôõöúùûüñç',
        'aaaaaeeeeiiiioooooouuuunc'
      ),
      '[^a-z0-9]+', '_', 'g'
    ),
    '^_+|_+$', '', 'g'
  )
)
WHERE "slug" IS NULL;
