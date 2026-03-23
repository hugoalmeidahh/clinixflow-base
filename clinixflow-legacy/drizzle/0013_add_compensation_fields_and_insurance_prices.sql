-- Migration: Adicionar campos de compensação e tabela de preços de convênios

-- 1. Criar enum compensation_type
DO $$ BEGIN
 CREATE TYPE "compensation_type" AS ENUM('percentage', 'fixed', 'percentage_plus_fixed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- 2. Adicionar campos de compensação na tabela doctors
ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "compensation_type" "compensation_type" NOT NULL DEFAULT 'percentage';
ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "compensation_percentage" integer;
ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "compensation_fixed_amount_in_cents" integer;

-- 3. Migrar dados: se houver appointment_price_in_cents, converter para compensation_fixed
-- Verificar se a coluna existe antes de tentar migrar
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'doctors' 
    AND column_name = 'appointment_price_in_cents'
  ) THEN
    UPDATE "doctors" 
    SET 
      "compensation_type" = 'fixed',
      "compensation_fixed_amount_in_cents" = "appointment_price_in_cents"
    WHERE "compensation_fixed_amount_in_cents" IS NULL 
      AND "appointment_price_in_cents" IS NOT NULL 
      AND "appointment_price_in_cents" > 0;
  END IF;
END $$;

-- 4. Remover coluna appointment_price_in_cents (comentado por segurança - descomente após verificar)
-- ALTER TABLE "doctors" DROP COLUMN IF EXISTS "appointment_price_in_cents";

-- 5. Adicionar campo doctor_compensation_in_cents na tabela appointments
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "doctor_compensation_in_cents" integer;

-- 6. Criar tabela insurance_prices
CREATE TABLE IF NOT EXISTS "insurance_prices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"insurance" "insurance" NOT NULL,
	"treatment" "treatment" NOT NULL,
	"duration_in_minutes" integer NOT NULL,
	"price_in_cents" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);

-- 7. Adicionar foreign key para clinic_id
DO $$ BEGIN
 ALTER TABLE "insurance_prices" ADD CONSTRAINT "insurance_prices_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- 8. Criar índice para melhorar performance de queries
CREATE INDEX IF NOT EXISTS "insurance_prices_clinic_insurance_treatment_idx" ON "insurance_prices" ("clinic_id", "insurance", "treatment", "duration_in_minutes");


