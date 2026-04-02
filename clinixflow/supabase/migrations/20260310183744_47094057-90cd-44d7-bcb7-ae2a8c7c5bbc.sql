
-- Ensure updated_at helper function exists (used by all updated_at triggers)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Role permissions table for tenant-level RBAC overrides
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  role text NOT NULL,
  permissions jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, role)
);

-- Enable RLS
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Only ORG_ADMIN and MANAGER can view permissions
DROP POLICY IF EXISTS "Staff can view role permissions" ON public.role_permissions;
CREATE POLICY "Staff can view role permissions"
  ON public.role_permissions
  FOR SELECT
  TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

-- Only ORG_ADMIN and MANAGER can manage permissions
DROP POLICY IF EXISTS "Admins can manage role permissions" ON public.role_permissions;
CREATE POLICY "Admins can manage role permissions"
  ON public.role_permissions
  FOR ALL
  TO authenticated
  USING (has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN'::org_role, 'MANAGER'::org_role]));

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_role_permissions_updated_at ON public.role_permissions;
CREATE TRIGGER update_role_permissions_updated_at
  BEFORE UPDATE ON public.role_permissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
