-- Migration: Add rescheduled fields to appointments table
-- Date: 2026-01-25

-- Add isRescheduled field
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "is_rescheduled" boolean DEFAULT false NOT NULL;

-- Add rescheduledFromId field (foreign key to appointments table)
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "rescheduled_from_id" uuid;

-- Add foreign key constraint
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'appointments_rescheduled_from_id_appointments_id_fk'
  ) THEN
    ALTER TABLE "appointments" 
    ADD CONSTRAINT "appointments_rescheduled_from_id_appointments_id_fk" 
    FOREIGN KEY ("rescheduled_from_id") 
    REFERENCES "appointments"("id") 
    ON DELETE SET NULL;
  END IF;
END $$;
