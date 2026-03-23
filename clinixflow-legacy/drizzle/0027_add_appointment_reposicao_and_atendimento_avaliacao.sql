-- Execute este SQL diretamente no seu banco de dados PostgreSQL
-- ou use: psql $DATABASE_URL -f drizzle/0027_add_appointment_reposicao_and_atendimento_avaliacao.sql

-- Migration: Adicionar campos reposicao e atendimento_avaliacao na tabela appointments

-- Adicionar campo reposicao (se é um agendamento de reposição)
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "reposicao" boolean DEFAULT false NOT NULL;

-- Adicionar campo atendimento_avaliacao (se é atendimento/avaliação)
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "atendimento_avaliacao" boolean DEFAULT false NOT NULL;
