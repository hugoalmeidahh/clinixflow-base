-- Fix tenants INSERT policy: only allow via trigger (SECURITY DEFINER)
DROP POLICY IF EXISTS "Users can create tenants during signup" ON public.tenants;

-- The handle_new_user trigger runs as SECURITY DEFINER, so it bypasses RLS
-- No need for permissive INSERT policy for regular users