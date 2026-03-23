-- Execute este SQL diretamente no seu banco de dados PostgreSQL
-- ou use: psql $DATABASE_URL -f drizzle/0026_add_doctor_birth_and_opening_dates.sql

-- Migration: Adicionar campos birthDate e openingDate na tabela doctors

-- Adicionar campo birth_date (data de nascimento para pessoa física)
ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "birth_date" date;

-- Adicionar campo opening_date (data de abertura empresa para pessoa jurídica)
ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "opening_date" date;
