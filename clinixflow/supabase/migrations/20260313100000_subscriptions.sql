-- ============================================================
-- Sistema de Assinaturas Gateway-Agnostic
-- Tabelas: subscriptions, subscription_invoices
-- Enums: billing_cycle, invoice_status, payment_gateway, payment_method_type
-- Trigger: sync_tenant_from_subscription
-- ============================================================

-- 1. Enums
DO $$ BEGIN
  CREATE TYPE billing_cycle AS ENUM ('MONTHLY', 'YEARLY');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE invoice_status AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_gateway AS ENUM ('STRIPE', 'ASAAS', 'MANUAL');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method_type AS ENUM ('CREDIT_CARD', 'PIX', 'BOLETO');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Tabela subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.plans(id),

  status text NOT NULL DEFAULT 'TRIAL',
  billing_cycle billing_cycle NOT NULL DEFAULT 'MONTHLY',

  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  cancelled_at timestamptz,

  gateway payment_gateway,
  gateway_subscription_id text,
  gateway_customer_id text,

  price_centavos integer NOT NULL DEFAULT 0,
  failed_payment_count integer NOT NULL DEFAULT 0,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT subscriptions_tenant_unique UNIQUE (tenant_id)
);

-- 3. Tabela subscription_invoices
CREATE TABLE IF NOT EXISTS public.subscription_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,

  amount_centavos integer NOT NULL,
  status invoice_status NOT NULL DEFAULT 'PENDING',
  billing_cycle billing_cycle NOT NULL,

  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,

  payment_method payment_method_type,
  payment_gateway payment_gateway,
  gateway_invoice_id text,
  gateway_payment_url text,

  paid_at timestamptz,
  due_date date,

  registered_by uuid REFERENCES auth.users(id),
  notes text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Colunas extras em tenants
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS gateway_customer_id text;
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS gateway payment_gateway;

-- 5. Índices
CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant ON public.subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_gateway_customer ON public.subscriptions(gateway_customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_subscription ON public.subscription_invoices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_invoices_tenant ON public.subscription_invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.subscription_invoices(status);

-- 6. Trigger de sincronização subscriptions → tenants
CREATE OR REPLACE FUNCTION sync_tenant_from_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.tenants
  SET
    subscription_status = NEW.status,
    subscription_ends_at = NEW.current_period_end,
    plan_id = NEW.plan_id,
    gateway_customer_id = NEW.gateway_customer_id,
    gateway = NEW.gateway,
    updated_at = now()
  WHERE id = NEW.tenant_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_tenant_from_subscription ON public.subscriptions;
CREATE TRIGGER trg_sync_tenant_from_subscription
  AFTER INSERT OR UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION sync_tenant_from_subscription();

-- 7. Trigger updated_at
CREATE OR REPLACE FUNCTION update_subscription_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_updated_at();

DROP TRIGGER IF EXISTS trg_invoices_updated_at ON public.subscription_invoices;
CREATE TRIGGER trg_invoices_updated_at
  BEFORE UPDATE ON public.subscription_invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_updated_at();

-- 8. RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant can read own subscription" ON public.subscriptions;
CREATE POLICY "Tenant can read own subscription"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

-- Nenhuma policy de INSERT/UPDATE/DELETE — somente service_role (Edge Functions)

ALTER TABLE public.subscription_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_invoices FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant can read own invoices" ON public.subscription_invoices;
CREATE POLICY "Tenant can read own invoices"
  ON public.subscription_invoices FOR SELECT
  TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

-- 9. Data migration: criar subscriptions para tenants existentes
INSERT INTO public.subscriptions (tenant_id, plan_id, status, billing_cycle, current_period_start, current_period_end, price_centavos)
SELECT
  t.id,
  t.plan_id,
  COALESCE(t.subscription_status, 'TRIAL'),
  'MONTHLY',
  COALESCE(t.trial_started_at, t.created_at),
  COALESCE(t.subscription_ends_at, t.created_at + interval '10 days'),
  COALESCE(p.price_monthly, 0)
FROM public.tenants t
LEFT JOIN public.plans p ON p.id = t.plan_id
WHERE t.plan_id IS NOT NULL
ON CONFLICT (tenant_id) DO NOTHING;
