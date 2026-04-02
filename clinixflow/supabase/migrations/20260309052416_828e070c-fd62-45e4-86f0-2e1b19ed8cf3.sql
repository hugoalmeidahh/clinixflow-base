-- Create tenant for existing user (seed data — skipped if already exists)
INSERT INTO public.tenants (name, slug, cnpj, email, phone)
VALUES ('Plenoser Terapias', 'plenoser-terapias', '11111111111111', 'hugoalmeidahh+1@gmail.com', '12981565612')
ON CONFLICT (slug) DO NOTHING;

-- Create user role linking user to tenant (only if user exists in auth.users)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users WHERE id = '8bf77eeb-68a3-411f-8d11-98e241b7a926'::uuid) THEN
    INSERT INTO public.user_roles (user_id, tenant_id, role, accepted_at)
    SELECT
      '8bf77eeb-68a3-411f-8d11-98e241b7a926'::uuid,
      t.id,
      'ORG_ADMIN',
      now()
    FROM public.tenants t
    WHERE t.slug = 'plenoser-terapias'
    ON CONFLICT DO NOTHING;
  END IF;
END $$;