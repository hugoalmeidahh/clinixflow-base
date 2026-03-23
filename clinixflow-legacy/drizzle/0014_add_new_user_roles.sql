-- Migration: Adicionar novos perfis de usuário (clinic_gestor e clinic_recepcionist)

-- Adicionar clinic_gestor ao enum user_role
DO $$ BEGIN
  ALTER TYPE "user_role" ADD VALUE 'clinic_gestor';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Adicionar clinic_recepcionist ao enum user_role
DO $$ BEGIN
  ALTER TYPE "user_role" ADD VALUE 'clinic_recepcionist';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
