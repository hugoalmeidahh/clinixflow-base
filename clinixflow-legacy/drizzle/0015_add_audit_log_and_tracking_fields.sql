-- Migration: Adicionar tabela de audit_log e campos created_by/updated_by

-- 1. Criar enum audit_action
DO $$ BEGIN
 CREATE TYPE "audit_action" AS ENUM('create', 'update', 'delete', 'view', 'login', 'logout', 'export', 'import');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- 2. Criar tabela audit_log
CREATE TABLE IF NOT EXISTS "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"action" "audit_action" NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"old_values" text,
	"new_values" text,
	"description" text,
	"ip_address" text,
	"user_agent" text,
	"clinic_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- 3. Adicionar foreign keys para audit_log
DO $$ BEGIN
 ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- 4. Criar índices para melhorar performance de queries
CREATE INDEX IF NOT EXISTS "audit_log_user_id_idx" ON "audit_log" ("user_id");
CREATE INDEX IF NOT EXISTS "audit_log_entity_type_entity_id_idx" ON "audit_log" ("entity_type", "entity_id");
CREATE INDEX IF NOT EXISTS "audit_log_clinic_id_idx" ON "audit_log" ("clinic_id");
CREATE INDEX IF NOT EXISTS "audit_log_created_at_idx" ON "audit_log" ("created_at");
CREATE INDEX IF NOT EXISTS "audit_log_action_idx" ON "audit_log" ("action");

-- 5. Adicionar campos created_by e updated_by nas tabelas principais

-- Clinics
ALTER TABLE "clinics" ADD COLUMN IF NOT EXISTS "created_by" text;
ALTER TABLE "clinics" ADD COLUMN IF NOT EXISTS "updated_by" text;

DO $$ BEGIN
 ALTER TABLE "clinics" ADD CONSTRAINT "clinics_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "clinics" ADD CONSTRAINT "clinics_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Doctors
ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "created_by" text;
ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "updated_by" text;

DO $$ BEGIN
 ALTER TABLE "doctors" ADD CONSTRAINT "doctors_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "doctors" ADD CONSTRAINT "doctors_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Patients
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "created_by" text;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "updated_by" text;

DO $$ BEGIN
 ALTER TABLE "patients" ADD CONSTRAINT "patients_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "patients" ADD CONSTRAINT "patients_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Appointments
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "created_by" text;
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "updated_by" text;

DO $$ BEGIN
 ALTER TABLE "appointments" ADD CONSTRAINT "appointments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "appointments" ADD CONSTRAINT "appointments_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Patient Records
ALTER TABLE "patient_records" ADD COLUMN IF NOT EXISTS "created_by" text;
ALTER TABLE "patient_records" ADD COLUMN IF NOT EXISTS "updated_by" text;

DO $$ BEGIN
 ALTER TABLE "patient_records" ADD CONSTRAINT "patient_records_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "patient_records" ADD CONSTRAINT "patient_records_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Prescriptions
ALTER TABLE "prescriptions" ADD COLUMN IF NOT EXISTS "created_by" text;
ALTER TABLE "prescriptions" ADD COLUMN IF NOT EXISTS "updated_by" text;

DO $$ BEGIN
 ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Insurance Prices
ALTER TABLE "insurance_prices" ADD COLUMN IF NOT EXISTS "created_by" text;
ALTER TABLE "insurance_prices" ADD COLUMN IF NOT EXISTS "updated_by" text;

DO $$ BEGIN
 ALTER TABLE "insurance_prices" ADD CONSTRAINT "insurance_prices_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "insurance_prices" ADD CONSTRAINT "insurance_prices_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Subscriptions
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "created_by" text;
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "updated_by" text;

DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Payment Requests
ALTER TABLE "payment_requests" ADD COLUMN IF NOT EXISTS "created_by" text;
ALTER TABLE "payment_requests" ADD COLUMN IF NOT EXISTS "updated_by" text;

DO $$ BEGIN
 ALTER TABLE "payment_requests" ADD CONSTRAINT "payment_requests_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "payment_requests" ADD CONSTRAINT "payment_requests_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Payments
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "created_by" text;
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "updated_by" text;

DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
