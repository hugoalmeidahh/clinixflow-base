-- ── Report History (REL-006) ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS report_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  report_type TEXT NOT NULL,
  filters_json JSONB,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  file_url TEXT,
  file_type TEXT CHECK (file_type IN ('PDF', 'XLSX', 'CSV')),
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE report_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_report_history" ON report_history
  FOR ALL USING (tenant_id = get_user_tenant_id(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_report_history_tenant ON report_history(tenant_id, user_id, generated_at DESC);
