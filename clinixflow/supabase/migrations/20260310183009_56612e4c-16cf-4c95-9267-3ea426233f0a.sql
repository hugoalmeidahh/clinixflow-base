
-- Make registration_number nullable for non-health staff
ALTER TABLE public.professionals ALTER COLUMN registration_number DROP NOT NULL;

-- Add staff_role column to distinguish health professionals from admin staff
ALTER TABLE public.professionals ADD COLUMN IF NOT EXISTS staff_role text NOT NULL DEFAULT 'HEALTH_PROFESSIONAL';

-- Add comment for clarity
COMMENT ON COLUMN public.professionals.staff_role IS 'Role type: HEALTH_PROFESSIONAL, ORG_ADMIN, MANAGER, RECEPTIONIST, FINANCIAL';
