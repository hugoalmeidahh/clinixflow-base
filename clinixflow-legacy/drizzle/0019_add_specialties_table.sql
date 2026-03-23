-- Migration: Criar tabela de especialidades e atualizar doctor_specialties

-- 1. Criar tabela de especialidades
CREATE TABLE IF NOT EXISTS "specialties" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name" text NOT NULL UNIQUE,
    "description" text,
    "council_code" text, -- Código do conselho (CRM, CRP, CREFITO, etc.)
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now()
);

-- 2. Adicionar índice para melhor performance
CREATE INDEX IF NOT EXISTS "specialties_name_idx" ON "specialties"("name");
CREATE INDEX IF NOT EXISTS "specialties_is_active_idx" ON "specialties"("is_active");

-- 2.1. Adicionar coluna council_code caso a tabela já exista (para migrations em produção)
ALTER TABLE "specialties" 
ADD COLUMN IF NOT EXISTS "council_code" text;

-- 3. Adicionar coluna specialty_id na tabela doctor_specialties
ALTER TABLE "doctor_specialties" 
ADD COLUMN IF NOT EXISTS "specialty_id" uuid REFERENCES "specialties"("id") ON DELETE RESTRICT;

-- 4. Criar índice para specialty_id
CREATE INDEX IF NOT EXISTS "doctor_specialties_specialty_id_idx" ON "doctor_specialties"("specialty_id");

-- 5. Migrar dados existentes: vincular especialidades existentes pelo nome
UPDATE "doctor_specialties" ds
SET "specialty_id" = s."id"
FROM "specialties" s
WHERE ds."specialty" = s."name"
  AND ds."specialty_id" IS NULL;

-- 3. Popular com especialidades existentes
INSERT INTO "specialties" ("name", "description", "council_code", "is_active") VALUES
    -- Especialidades ABA (Análise do Comportamento Aplicada) - ordem alfabética
    ('ABA - Fonoaudiologia', 'Especialidade em fonoaudiologia com Análise do Comportamento Aplicada', 'CREFONO', true),
    ('ABA - Fisioterapia', 'Especialidade em fisioterapia com Análise do Comportamento Aplicada', 'CREFITO', true),
    ('ABA - Nutrição', 'Especialidade em nutrição com Análise do Comportamento Aplicada', 'CRN', true),
    ('ABA - Psicologia', 'Especialidade em psicologia com Análise do Comportamento Aplicada', 'CRP', true),
    ('ABA - Terapia Ocupacional', 'Especialidade em terapia ocupacional com Análise do Comportamento Aplicada', 'CREFITO', true),
    -- Especialidades convencionais - ordem alfabética
    ('Fonoaudiologia', 'Especialidade em fonoaudiologia', 'CREFONO', true),
    ('Fisioterapia', 'Especialidade em fisioterapia', 'CREFITO', true),
    ('Fisioterapia Integrativa', 'Especialidade em fisioterapia com Análise do Comportamento Aplicada', 'CREFITO', true),
    ('Musicoterapia', 'Especialidade em musicoterapia', NULL, true),
    ('Neuropsicologia', 'Especialidade em neuropsicologia', NULL, true),
    ('Nutrição', 'Especialidade em nutrição', 'CRN', true),
    ('Psicologia', 'Especialidade em psicologia', 'CRP', true),
    ('Psicomotricidade', 'Especialidade em psicomotricidade', NULL, true),
    ('Psicopedagogia', 'Especialidade em psicopedagogia', NULL, true),
    ('Terapia Integrativa', 'Especialidade em terapia integrativa', NULL, true),
    ('Terapia Ocupacional', 'Especialidade em terapia ocupacional', 'CREFITO', true)
ON CONFLICT ("name") DO NOTHING;

-- 6. Atualizar conselhos das especialidades existentes (caso já existam)
UPDATE "specialties" SET "council_code" = 'CREFITO' WHERE "name" IN ('Fisioterapia', 'Fisioterapia Integrativa', 'Terapia Ocupacional', 'ABA - Fisioterapia', 'ABA - Terapia Ocupacional') AND "council_code" IS NULL;
UPDATE "specialties" SET "council_code" = 'CRP' WHERE "name" IN ('Psicologia', 'ABA - Psicologia') AND "council_code" IS NULL;
UPDATE "specialties" SET "council_code" = 'CRN' WHERE "name" IN ('Nutrição', 'ABA - Nutrição') AND "council_code" IS NULL;
UPDATE "specialties" SET "council_code" = 'CREFONO' WHERE "name" IN ('Fonoaudiologia', 'ABA - Fonoaudiologia') AND "council_code" IS NULL;
UPDATE "specialties" SET "council_code" = NULL WHERE "name" IN ('Psicomotricidade', 'Psicopedagogia', 'Neuropsicologia', 'Musicoterapia', 'Terapia Integrativa', 'Fisioterapia Integrativa') AND "council_code" IS NOT NULL AND "name" NOT IN ('Fisioterapia Integrativa');
