
-- Fix tenants INSERT policy: change from RESTRICTIVE to PERMISSIVE
DROP POLICY IF EXISTS "Users can create tenants during signup" ON public.tenants;
CREATE POLICY "Users can create tenants during signup"
  ON public.tenants
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Fix user_roles: add PERMISSIVE INSERT policy for self-assignment during signup
DROP POLICY IF EXISTS "Users can insert their own role during signup" ON public.user_roles;
CREATE POLICY "Users can insert their own role during signup"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
