-- ── VAC-008: Add invoice_id to vaccine_applications ─────────────────────────

ALTER TABLE vaccine_applications
  ADD COLUMN IF NOT EXISTS invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_vaccine_applications_invoice ON vaccine_applications(tenant_id, invoice_id);
