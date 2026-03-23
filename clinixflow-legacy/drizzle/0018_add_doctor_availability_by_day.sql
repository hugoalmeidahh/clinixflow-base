-- Migration: Adicionar disponibilidade por dia da semana para profissionais

-- 1. Criar tabela de disponibilidade por dia da semana
CREATE TABLE IF NOT EXISTS "doctor_availability" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "doctor_id" uuid NOT NULL REFERENCES "doctors"("id") ON DELETE CASCADE,
    "day_of_week" integer NOT NULL CHECK ("day_of_week" >= 1 AND "day_of_week" <= 7), -- 1=Segunda, 7=Domingo
    "is_available" boolean DEFAULT false NOT NULL,
    "start_time" time,
    "end_time" time,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now(),
    UNIQUE("doctor_id", "day_of_week")
);

-- 2. Adicionar índice para melhor performance
CREATE INDEX IF NOT EXISTS "doctor_availability_doctor_id_idx" ON "doctor_availability"("doctor_id");
CREATE INDEX IF NOT EXISTS "doctor_availability_day_of_week_idx" ON "doctor_availability"("day_of_week");

-- 3. Migrar dados existentes de availableFromWeekDay/availableToWeekDay para a nova estrutura
-- Criar registros para cada dia no intervalo configurado (ignorar duplicatas)
INSERT INTO "doctor_availability" ("doctor_id", "day_of_week", "is_available", "start_time", "end_time")
SELECT DISTINCT ON ("doctor_id", "day_of_week")
    "id" as "doctor_id",
    day_num as "day_of_week",
    true as "is_available",
    "available_from_time" as "start_time",
    "available_to_time" as "end_time"
FROM "doctors"
CROSS JOIN LATERAL generate_series(
    "available_from_week_day",
    "available_to_week_day"
) AS day_num
WHERE "available_from_week_day" IS NOT NULL 
  AND "available_to_week_day" IS NOT NULL
  AND "available_from_time" IS NOT NULL
  AND "available_to_time" IS NOT NULL
ON CONFLICT ("doctor_id", "day_of_week") DO NOTHING;

-- NOTA: Os campos antigos (available_from_week_day, available_to_week_day, available_from_time, available_to_time)
-- serão mantidos temporariamente para compatibilidade, mas serão removidos em uma migration futura
