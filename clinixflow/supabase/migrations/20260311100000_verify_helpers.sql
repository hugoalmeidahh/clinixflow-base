-- ============================================================
-- Migration: Verify/recreate helper functions for RLS
-- These functions are used by all RLS policies across the system.
-- Using CREATE OR REPLACE to be idempotent.
-- ============================================================

-- get_user_tenant_id: Returns the active tenant_id for a given user
CREATE OR REPLACE FUNCTION public.get_user_tenant_id(p_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT tenant_id
  FROM public.user_roles
  WHERE user_id = p_user_id
    AND is_active = true
  LIMIT 1;
$$;

-- has_tenant_role: Checks if a user has one of the specified roles in a tenant
CREATE OR REPLACE FUNCTION public.has_tenant_role(
  p_user_id uuid,
  p_tenant_id uuid,
  p_roles org_role[]
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = p_user_id
      AND tenant_id = p_tenant_id
      AND role = ANY(p_roles)
      AND is_active = true
  );
$$;
