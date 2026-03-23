-- Migration: Adicionar suporte a múltiplas especialidades por profissional e reestruturar documentos

-- 1. Criar enum para tipo de pessoa
DO $$ BEGIN
    CREATE TYPE "person_type" AS ENUM('physical', 'legal');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Criar tabela de especialidades dos profissionais
CREATE TABLE IF NOT EXISTS "doctor_specialties" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "doctor_id" uuid NOT NULL REFERENCES "doctors"("id") ON DELETE CASCADE,
    "specialty" text NOT NULL,
    "class_number_type" text NOT NULL,
    "class_number_register" text NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now()
);

-- 3. Adicionar índice para melhor performance
CREATE INDEX IF NOT EXISTS "doctor_specialties_doctor_id_idx" ON "doctor_specialties"("doctor_id");

-- 4. Migrar dados existentes de specialty para doctor_specialties
-- (assumindo que class_number_type e class_number_register já existem)
INSERT INTO "doctor_specialties" ("doctor_id", "specialty", "class_number_type", "class_number_register")
SELECT 
    "id" as "doctor_id",
    "specialty",
    COALESCE("class_number_type", 'CRM') as "class_number_type",
    COALESCE("class_number_register", '') as "class_number_register"
FROM "doctors"
WHERE "specialty" IS NOT NULL AND "specialty" != '';

-- 5. Adicionar novos campos na tabela doctors
ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "person_type" "person_type" DEFAULT 'physical';
ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "document" text;
ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "access_type" text DEFAULT 'code'; -- 'code' ou 'email'

-- 6. Migrar dados de CPF/CNPJ para document
-- Se tiver CPF, é pessoa física; se tiver CNPJ, é pessoa jurídica
UPDATE "doctors" 
SET 
    "document" = COALESCE("cpf", "cnpj"),
    "person_type" = CASE 
        WHEN "cpf" IS NOT NULL THEN 'physical'::person_type
        WHEN "cnpj" IS NOT NULL THEN 'legal'::person_type
        ELSE 'physical'::person_type
    END
WHERE "document" IS NULL;

-- 7. Adicionar campo doctor_specialty_id na tabela appointments
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "doctor_specialty_id" uuid REFERENCES "doctor_specialties"("id") ON DELETE SET NULL;

-- 8. Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS "appointments_doctor_specialty_id_idx" ON "appointments"("doctor_specialty_id");

-- NOTA: Não vamos remover os campos antigos ainda para manter compatibilidade
-- Os campos specialty, class_number_type, class_number_register, cpf, cnpj serão removidos em uma migration futura
-- após confirmar que tudo está funcionando corretamente
