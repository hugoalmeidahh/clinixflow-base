-- Migration: Criar tabela de convênios e migrar dados do enum
-- Esta migration substitui o enum insurance por uma tabela gerenciável

-- 1. Criar tabela de convênios
CREATE TABLE IF NOT EXISTS "insurances" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name" text NOT NULL UNIQUE,
    "display_name" text NOT NULL,
    "description" text,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now()
);

-- 2. Popular tabela com os convênios existentes do enum
INSERT INTO "insurances" ("name", "display_name", "is_active") VALUES
    ('unimed', 'Unimed', true),
    ('amil', 'Amil', true),
    ('sulamerica', 'SulAmérica', true),
    ('bradesco_saude', 'Bradesco Saúde', true),
    ('porto_seguro', 'Porto Seguro', true),
    ('allianz', 'Allianz', true),
    ('hapvida', 'Hapvida', true),
    ('cassems', 'Cassems', true),
    ('santa_casa_saude', 'Santa Casa Saúde', true),
    ('particular', 'Particular', true),
    ('outros', 'Outros', true)
ON CONFLICT ("name") DO NOTHING;

-- 3. Adicionar campos SUS e insurance_plan na tabela patients
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "sus_card" text;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "sus_region" text;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "insurance_plan" text;

-- 4. Adicionar coluna insurance_id na tabela patients (temporariamente nullable)
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "insurance_id" uuid;

-- 5. Migrar dados do enum para a nova coluna insurance_id
UPDATE "patients" p
SET "insurance_id" = i.id
FROM "insurances" i
WHERE p.insurance::text = i.name;

-- 6. Adicionar foreign key constraint (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'patients_insurance_id_insurances_id_fk'
    ) THEN
        ALTER TABLE "patients" 
        ADD CONSTRAINT "patients_insurance_id_insurances_id_fk" 
        FOREIGN KEY ("insurance_id") REFERENCES "insurances"("id") ON DELETE SET NULL;
    END IF;
END $$;

-- 7. Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS "patients_insurance_id_idx" ON "patients"("insurance_id");
CREATE INDEX IF NOT EXISTS "insurances_name_idx" ON "insurances"("name");
CREATE INDEX IF NOT EXISTS "insurances_is_active_idx" ON "insurances"("is_active");
