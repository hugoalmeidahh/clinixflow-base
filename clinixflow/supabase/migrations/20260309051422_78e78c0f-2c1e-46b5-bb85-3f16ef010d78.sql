
-- Extend handle_new_user to also create tenant and role from signup metadata
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
    v_slug := NEW.raw_user_meta_data->>'org_slug';
    v_cnpj := NULLIF(NEW.raw_user_meta_data->>'org_cnpj', '');
    v_phone := NULLIF(NEW.raw_user_meta_data->>'org_phone', '');

    INSERT INTO public.tenants (name, slug, cnpj, email, phone)
    VALUES (v_org_name, v_slug, v_cnpj, NEW.email, v_phone)
    RETURNING id INTO v_tenant_id;

    INSERT INTO public.user_roles (user_id, tenant_id, role, accepted_at)
    VALUES (NEW.id, v_tenant_id, 'ORG_ADMIN', now());
  END IF;

  RETURN NEW;
END;
$function$;
