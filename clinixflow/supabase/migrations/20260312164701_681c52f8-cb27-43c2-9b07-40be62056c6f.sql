CREATE TABLE public.saas_admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  UNIQUE(user_id)
);

ALTER TABLE public.saas_admins ENABLE ROW LEVEL SECURITY;

INSERT INTO public.saas_admins (user_id)
VALUES ('0a341897-1174-4f5f-8556-51d1b82cb3dd');