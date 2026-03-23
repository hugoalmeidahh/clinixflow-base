-- ── BIL Epic: Billing System ────────────────────────────────────────────────
-- BIL-001: Plans & Modules
-- BIL-002: Coupons
-- BIL-003 to BIL-012: Full billing infrastructure

-- ── Extend plans table (BIL-001) ─────────────────────────────────────────────
ALTER TABLE plans
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'PUBLIC' CHECK (status IN ('PUBLIC', 'PRIVATE', 'ARCHIVED')),
  ADD COLUMN IF NOT EXISTS max_team_members INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0;

-- ── Modules (BIL-001) ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly INTEGER NOT NULL DEFAULT 0, -- centavos
  is_available_as_addon BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Plan-Module junction (BIL-001) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plan_modules (
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  PRIMARY KEY (plan_id, module_id)
);

-- ── Plan Price History (BIL-001) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plan_price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  old_price INTEGER NOT NULL,
  new_price INTEGER NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  changed_by UUID REFERENCES auth.users(id)
);

-- Trigger to record price history on plan price change
CREATE OR REPLACE FUNCTION record_plan_price_change()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.price_monthly IS DISTINCT FROM NEW.price_monthly THEN
    INSERT INTO plan_price_history (plan_id, old_price, new_price, changed_by)
    VALUES (NEW.id, COALESCE(OLD.price_monthly, 0), NEW.price_monthly, auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_plan_price_history ON plans;
CREATE TRIGGER trg_plan_price_history
  AFTER UPDATE ON plans
  FOR EACH ROW EXECUTE FUNCTION record_plan_price_change();

-- ── Coupons (BIL-002) ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('PERCENTAGE', 'FIXED')),
  value NUMERIC NOT NULL,
  scope TEXT NOT NULL DEFAULT 'FIRST_MONTH' CHECK (scope IN ('FIRST_MONTH', 'ALL_MONTHS')),
  expires_at TIMESTAMPTZ,
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  discount_applied NUMERIC NOT NULL DEFAULT 0
);

-- ── Subscription addons (BIL-005) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscription_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES modules(id),
  contracted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  price_at_contraction INTEGER NOT NULL,
  prorata_amount INTEGER,
  prorata_invoice_id UUID,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CANCELLATION_REQUESTED', 'CANCELLED')),
  cancellation_requested_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  UNIQUE (subscription_id, module_id)
);

-- ── Invoice items (BIL-004) ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscription_invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES subscription_invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL,
  total INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('PLAN', 'ADDON', 'DISCOUNT', 'SURCHARGE')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Payment attempts (BIL-004) ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES subscription_invoices(id) ON DELETE CASCADE,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  method TEXT CHECK (method IN ('CARD', 'PIX', 'BOLETO')),
  status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'PENDING')),
  failure_reason TEXT,
  gateway_charge_id TEXT,
  pix_surcharge_applied BOOLEAN NOT NULL DEFAULT FALSE,
  amount_centavos INTEGER
);

-- ── Webhook logs (BIL-006) ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  gateway_event_id TEXT,
  payload_json JSONB,
  processed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'DUPLICATE')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_webhook_logs_event_id ON webhook_logs(gateway_event_id) WHERE gateway_event_id IS NOT NULL;

-- ── Dunning actions (BIL-007) ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dunning_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES subscription_invoices(id),
  action_type TEXT NOT NULL CHECK (action_type IN (
    'NOTIFICATION_D0', 'RETRY_D1', 'RETRY_D2', 'NOTIFICATION_FINAL',
    'SUSPENSION', 'PIX_GENERATED', 'UNBLOCK', 'CANCELLATION'
  )),
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  success BOOLEAN NOT NULL DEFAULT TRUE,
  notes TEXT
);

-- ── Refund requests (BIL-009) ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS refund_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES subscription_invoices(id),
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('WITHDRAWAL_RIGHT', 'MANUAL_ADMIN', 'OTHER')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'PROCESSED', 'REJECTED')),
  gateway_refund_id TEXT,
  notes TEXT
);

-- ── Tenant limit overrides (BIL-010) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tenant_limit_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  limit_type TEXT NOT NULL CHECK (limit_type IN ('PATIENTS', 'TEAM_MEMBERS')),
  override_value INTEGER NOT NULL,
  reason TEXT,
  applied_by UUID REFERENCES auth.users(id),
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Admin actions (BIL-012) ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES auth.users(id),
  tenant_id UUID REFERENCES tenants(id),
  action_type TEXT NOT NULL,
  payload_json JSONB,
  reason TEXT,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Tenant credits (BIL-012) ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tenant_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT,
  applied_by UUID REFERENCES auth.users(id),
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  used_in_invoice_id UUID REFERENCES subscription_invoices(id)
);

-- ── Extend subscriptions (BIL-003, BIL-007, BIL-009) ─────────────────────────
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES coupons(id),
  ADD COLUMN IF NOT EXISTS cancellation_requested_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancel_reason TEXT,
  ADD COLUMN IF NOT EXISTS dunning_day INTEGER NOT NULL DEFAULT 0;

-- ── Extend subscription_invoices (BIL-004, BIL-011) ──────────────────────────
ALTER TABLE subscription_invoices
  ADD COLUMN IF NOT EXISTS subtotal INTEGER,
  ADD COLUMN IF NOT EXISTS discount_amount INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pdf_url TEXT,
  ADD COLUMN IF NOT EXISTS asaas_payment_id TEXT;

-- ── Seed modules (BIL-001) ────────────────────────────────────────────────────
INSERT INTO modules (key, name, description, price_monthly, is_available_as_addon, is_active) VALUES
  ('base',        'Base',              'Prontuário, agenda e gestão de pacientes',  0,    FALSE, TRUE),
  ('financial',   'Financeiro',        'Faturamento, DRE, contas a pagar/receber', 9900, TRUE,  TRUE),
  ('evaluations', 'Avaliações',        'Instrumentos de avaliação e devolutivas',  7900, TRUE,  TRUE),
  ('reports',     'Relatórios',        'Relatórios gerenciais e exportação',        4900, TRUE,  TRUE),
  ('vaccines',    'Vacinas',           'Gestão vacinal, RNDS e carteirinha digital', 4900, TRUE, TRUE)
ON CONFLICT (key) DO NOTHING;

-- ── RLS ────────────────────────────────────────────────────────────────────────
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dunning_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE refund_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_limit_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_credits ENABLE ROW LEVEL SECURITY;

-- Modules: public read
CREATE POLICY "modules_public_read" ON modules FOR SELECT USING (TRUE);

-- Plan modules: public read
CREATE POLICY "plan_modules_public_read" ON plan_modules FOR SELECT USING (TRUE);

-- Tenant-scoped tables
CREATE POLICY "tenant_coupon_redemptions" ON coupon_redemptions
  FOR ALL USING (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "tenant_subscription_addons" ON subscription_addons
  FOR ALL USING (subscription_id IN (SELECT id FROM subscriptions WHERE tenant_id = get_user_tenant_id(auth.uid())));

CREATE POLICY "tenant_invoice_items" ON subscription_invoice_items
  FOR ALL USING (invoice_id IN (SELECT id FROM subscription_invoices WHERE tenant_id = get_user_tenant_id(auth.uid())));

CREATE POLICY "tenant_payment_attempts" ON payment_attempts
  FOR ALL USING (invoice_id IN (SELECT id FROM subscription_invoices WHERE tenant_id = get_user_tenant_id(auth.uid())));

CREATE POLICY "tenant_dunning_actions" ON dunning_actions
  FOR ALL USING (subscription_id IN (SELECT id FROM subscriptions WHERE tenant_id = get_user_tenant_id(auth.uid())));

CREATE POLICY "tenant_refund_requests" ON refund_requests
  FOR ALL USING (subscription_id IN (SELECT id FROM subscriptions WHERE tenant_id = get_user_tenant_id(auth.uid())));

CREATE POLICY "tenant_limit_overrides_read" ON tenant_limit_overrides
  FOR SELECT USING (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "tenant_credits_read" ON tenant_credits
  FOR SELECT USING (tenant_id = get_user_tenant_id(auth.uid()));

-- ── Indexes ────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_subscription_addons_sub ON subscription_addons(subscription_id, status);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON subscription_invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_invoice ON payment_attempts(invoice_id);
CREATE INDEX IF NOT EXISTS idx_dunning_actions_sub ON dunning_actions(subscription_id, action_type);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_coupon ON coupon_redemptions(coupon_id);
CREATE INDEX IF NOT EXISTS idx_tenant_credits_tenant ON tenant_credits(tenant_id);
