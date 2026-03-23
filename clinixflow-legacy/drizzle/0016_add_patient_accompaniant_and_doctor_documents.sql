-- Migration: Adicionar campos de acompanhante para pacientes e documentos para profissionais

-- 1. Adicionar campos de acompanhante na tabela patients
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "accompaniant_name" text;
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "accompaniant_relationship" text;

-- 2. Adicionar campos de documentos na tabela doctors
ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "cpf" text;
ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "cnpj" text;
ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "rg" text;
