-- ── Extend existing vaccines table (VAC-001) ──────────────────────────────

ALTER TABLE vaccines
  ADD COLUMN IF NOT EXISTS generic_name TEXT,
  ADD COLUMN IF NOT EXISTS dose_ml NUMERIC,
  ADD COLUMN IF NOT EXISTS administration_route TEXT,
  ADD COLUMN IF NOT EXISTS sipni_code TEXT,
  ADD COLUMN IF NOT EXISTS minimum_stock INTEGER NOT NULL DEFAULT 5;

-- ── Extend vaccine_batches ─────────────────────────────────────────────────

ALTER TABLE vaccine_batches
  ADD COLUMN IF NOT EXISTS entry_invoice TEXT,
  ADD COLUMN IF NOT EXISTS entry_date DATE DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS initial_quantity INTEGER,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Backfill initial_quantity from quantity_received if null
UPDATE vaccine_batches SET initial_quantity = quantity_received WHERE initial_quantity IS NULL;

-- ── Extend vaccine_applications (VAC-002) ──────────────────────────────────

ALTER TABLE vaccine_applications
  ADD COLUMN IF NOT EXISTS application_site TEXT,
  ADD COLUMN IF NOT EXISTS dose_number INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS synced_to_rnds BOOLEAN NOT NULL DEFAULT FALSE;

-- ── Vaccine Schedule Rules (VAC-003) ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS vaccine_schedule_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vaccine_id UUID NOT NULL REFERENCES vaccines(id) ON DELETE CASCADE,
  dose_number INTEGER NOT NULL,
  min_interval_days INTEGER NOT NULL DEFAULT 0,
  recommended_interval_days INTEGER NOT NULL DEFAULT 0,
  recommended_age_days INTEGER,
  dose_label TEXT NOT NULL DEFAULT '1ª Dose',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Vaccine Suggestions (VAC-003) ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS vaccine_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  vaccine_id UUID NOT NULL REFERENCES vaccines(id) ON DELETE CASCADE,
  dose_number INTEGER NOT NULL DEFAULT 1,
  dose_label TEXT,
  suggested_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'SUGGESTED' CHECK (status IN ('SUGGESTED', 'SCHEDULED', 'APPLIED', 'OVERDUE')),
  application_id UUID REFERENCES vaccine_applications(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Vaccine Reminder Log (VAC-006) ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS vaccine_reminder_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  suggestion_id UUID REFERENCES vaccine_suggestions(id),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  channel TEXT NOT NULL CHECK (channel IN ('EMAIL', 'WHATSAPP')),
  status TEXT NOT NULL DEFAULT 'SENT' CHECK (status IN ('SENT', 'FAILED')),
  message_template TEXT
);

-- ── RNDS Queue (VAC-007) ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS rnds_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES vaccine_applications(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'FAILED')),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  rnds_response_id TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── RLS ───────────────────────────────────────────────────────────────────

ALTER TABLE vaccine_schedule_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccine_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccine_reminder_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE rnds_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_vaccine_schedule_rules" ON vaccine_schedule_rules
  FOR ALL USING (vaccine_id IN (SELECT id FROM vaccines WHERE tenant_id = get_user_tenant_id(auth.uid())));

CREATE POLICY "tenant_vaccine_suggestions" ON vaccine_suggestions
  FOR ALL USING (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "tenant_vaccine_reminder_log" ON vaccine_reminder_log
  FOR ALL USING (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "tenant_rnds_queue" ON rnds_queue
  FOR ALL USING (tenant_id = get_user_tenant_id(auth.uid()));

-- Patient portal: can see own suggestions
CREATE POLICY "patient_own_suggestions" ON vaccine_suggestions
  FOR SELECT USING (patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()));

-- ── Indexes ───────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_vaccine_suggestions_patient ON vaccine_suggestions(patient_id, status);
CREATE INDEX IF NOT EXISTS idx_vaccine_suggestions_tenant ON vaccine_suggestions(tenant_id, status, suggested_date);
CREATE INDEX IF NOT EXISTS idx_rnds_queue_status ON rnds_queue(tenant_id, status, created_at);
