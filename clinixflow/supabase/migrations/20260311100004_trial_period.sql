-- ============================================================
-- Migration: Trial period for new tenants
-- Adds trial tracking columns and updates the signup trigger.
-- ============================================================

-- Add trial columns to tenants
ALTER TABLE public.tenants
  ADD COLUMN IF NOT EXISTS trial_started_at timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS trial_duration_days integer DEFAULT 10;

-- Update handle_new_user to initialize trial period on tenant creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_tenant_id uuid;
  v_org_name text;
  v_slug text;
  v_cnpj text;
  v_phone text;
  v_base_slug text;
  v_counter integer := 0;
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );

  -- Check if signup includes org data (new org registration)
  v_org_name := NEW.raw_user_meta_data->>'org_name';
  IF v_org_name IS NOT NULL AND v_org_name != '' THEN
    v_base_slug := NEW.raw_user_meta_data->>'org_slug';
    v_slug := v_base_slug;
    v_cnpj := NULLIF(NEW.raw_user_meta_data->>'org_cnpj', '');
    v_phone := NULLIF(NEW.raw_user_meta_data->>'org_phone', '');

    -- Handle duplicate slugs by appending a counter
    LOOP
      BEGIN
        INSERT INTO public.tenants (
          name, slug, cnpj, email, phone,
          subscription_status, trial_started_at, trial_duration_days,
          subscription_ends_at
        )
        VALUES (
          v_org_name, v_slug, v_cnpj, NEW.email, v_phone,
          'TRIAL', now(), 10,
          now() + interval '10 days'
        )
        RETURNING id INTO v_tenant_id;
        EXIT; -- success
      EXCEPTION WHEN unique_violation THEN
        v_counter := v_counter + 1;
        v_slug := v_base_slug || '-' || v_counter;
        IF v_counter > 100 THEN
          RAISE EXCEPTION 'Could not generate unique slug for tenant';
        END IF;
      END;
    END LOOP;

    INSERT INTO public.user_roles (user_id, tenant_id, role, accepted_at)
    VALUES (NEW.id, v_tenant_id, 'ORG_ADMIN', now());
  END IF;

  RETURN NEW;
END;
$function$;
