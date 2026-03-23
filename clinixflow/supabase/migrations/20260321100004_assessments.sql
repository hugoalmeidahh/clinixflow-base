-- ── Assessment Templates (Instrument Builder) ─────────────────────────────

CREATE TABLE assessment_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  specialty_id UUID REFERENCES specialties(id) ON DELETE SET NULL,
  version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ACTIVE', 'INACTIVE')),
  is_system_template BOOLEAN NOT NULL DEFAULT FALSE,
  is_universal BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE assessment_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES assessment_templates(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  weight_multiplier NUMERIC NOT NULL DEFAULT 1.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES assessment_sections(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'SCALE' CHECK (type IN ('SCALE','MULTIPLE','BOOLEAN','TEXT','NUMERIC')),
  order_index INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE assessment_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  weight NUMERIC NOT NULL DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE assessment_score_ranges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES assessment_templates(id) ON DELETE CASCADE,
  section_id UUID REFERENCES assessment_sections(id) ON DELETE CASCADE, -- NULL = global
  min_score NUMERIC NOT NULL,
  max_score NUMERIC NOT NULL,
  label TEXT NOT NULL,
  consideration_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- N:N specialty access control (AVA-006)
CREATE TABLE assessment_template_specialties (
  template_id UUID NOT NULL REFERENCES assessment_templates(id) ON DELETE CASCADE,
  specialty_id UUID NOT NULL REFERENCES specialties(id) ON DELETE CASCADE,
  PRIMARY KEY (template_id, specialty_id)
);

-- ── Assessment Sessions (AVA-002) ──────────────────────────────────────────

CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES assessment_templates(id),
  template_version INTEGER NOT NULL DEFAULT 1,
  professional_id UUID NOT NULL REFERENCES professionals(id),
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'FINALIZED')),
  applied_at DATE NOT NULL DEFAULT CURRENT_DATE,
  finalized_by UUID REFERENCES auth.users(id),
  finalized_at TIMESTAMPTZ,
  notes TEXT,
  report_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE assessment_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES assessment_questions(id),
  option_id UUID REFERENCES assessment_options(id),
  text_value TEXT,
  numeric_value NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (assessment_id, question_id)
);

CREATE TABLE assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  section_id UUID REFERENCES assessment_sections(id), -- NULL = global
  raw_score NUMERIC NOT NULL DEFAULT 0,
  normalized_score NUMERIC NOT NULL DEFAULT 0,
  range_label TEXT,
  consideration_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Assessment Feedback (AVA-007) ──────────────────────────────────────────

CREATE TABLE assessment_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  channel TEXT NOT NULL CHECK (channel IN ('EMAIL', 'WHATSAPP')),
  recipient TEXT NOT NULL,
  message TEXT,
  simplified_pdf_url TEXT,
  sent_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── RLS ───────────────────────────────────────────────────────────────────

ALTER TABLE assessment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_score_ranges ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_template_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_feedback ENABLE ROW LEVEL SECURITY;

-- Templates: tenant can see own + system templates
CREATE POLICY "tenant_select_templates" ON assessment_templates
  FOR SELECT USING (tenant_id = get_user_tenant_id(auth.uid()) OR is_system_template = TRUE);
CREATE POLICY "tenant_insert_templates" ON assessment_templates
  FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));
CREATE POLICY "tenant_update_templates" ON assessment_templates
  FOR UPDATE USING (tenant_id = get_user_tenant_id(auth.uid()) AND is_system_template = FALSE);
CREATE POLICY "tenant_delete_templates" ON assessment_templates
  FOR DELETE USING (tenant_id = get_user_tenant_id(auth.uid()) AND is_system_template = FALSE);

-- Sections/questions/options/ranges: via template access
CREATE POLICY "tenant_select_sections" ON assessment_sections
  FOR ALL USING (template_id IN (SELECT id FROM assessment_templates WHERE tenant_id = get_user_tenant_id(auth.uid()) OR is_system_template = TRUE));
CREATE POLICY "tenant_select_questions" ON assessment_questions
  FOR ALL USING (section_id IN (SELECT id FROM assessment_sections WHERE template_id IN (SELECT id FROM assessment_templates WHERE tenant_id = get_user_tenant_id(auth.uid()) OR is_system_template = TRUE)));
CREATE POLICY "tenant_select_options" ON assessment_options
  FOR ALL USING (question_id IN (SELECT id FROM assessment_questions WHERE section_id IN (SELECT id FROM assessment_sections WHERE template_id IN (SELECT id FROM assessment_templates WHERE tenant_id = get_user_tenant_id(auth.uid()) OR is_system_template = TRUE))));
CREATE POLICY "tenant_select_score_ranges" ON assessment_score_ranges
  FOR ALL USING (template_id IN (SELECT id FROM assessment_templates WHERE tenant_id = get_user_tenant_id(auth.uid()) OR is_system_template = TRUE));
CREATE POLICY "tenant_select_template_specialties" ON assessment_template_specialties
  FOR ALL USING (template_id IN (SELECT id FROM assessment_templates WHERE tenant_id = get_user_tenant_id(auth.uid()) OR is_system_template = TRUE));

-- Assessments
CREATE POLICY "tenant_assessments" ON assessments
  FOR ALL USING (tenant_id = get_user_tenant_id(auth.uid()));
CREATE POLICY "tenant_assessment_answers" ON assessment_answers
  FOR ALL USING (assessment_id IN (SELECT id FROM assessments WHERE tenant_id = get_user_tenant_id(auth.uid())));
CREATE POLICY "tenant_assessment_results" ON assessment_results
  FOR ALL USING (assessment_id IN (SELECT id FROM assessments WHERE tenant_id = get_user_tenant_id(auth.uid())));
CREATE POLICY "tenant_assessment_feedback" ON assessment_feedback
  FOR ALL USING (assessment_id IN (SELECT id FROM assessments WHERE tenant_id = get_user_tenant_id(auth.uid())));

-- ── Indexes ───────────────────────────────────────────────────────────────

CREATE INDEX idx_assessment_templates_tenant ON assessment_templates(tenant_id);
CREATE INDEX idx_assessment_sections_template ON assessment_sections(template_id, order_index);
CREATE INDEX idx_assessment_questions_section ON assessment_questions(section_id, order_index);
CREATE INDEX idx_assessment_options_question ON assessment_options(question_id, order_index);
CREATE INDEX idx_assessments_tenant ON assessments(tenant_id, patient_id);
CREATE INDEX idx_assessment_answers_session ON assessment_answers(assessment_id, question_id);
CREATE INDEX idx_assessment_results_session ON assessment_results(assessment_id);
