-- ============================================================
-- Migration: Complete RLS policies for all tenant-scoped tables
-- Ensures multi-tenant data isolation at the database level.
--
-- Strategy:
-- - DROP POLICY IF EXISTS + CREATE POLICY for idempotency
-- - ENABLE ROW LEVEL SECURITY is idempotent by nature
-- - FORCE ROW LEVEL SECURITY so table owners also respect policies
-- ============================================================

-- ============================================================
-- SECTION A: Direct tenant-scoped tables (19 tables)
-- Pattern: tenant_id = get_user_tenant_id(auth.uid())
-- ============================================================

-- Helper to avoid repetition in comments:
-- SELECT/INSERT/UPDATE → all authenticated users in the tenant
-- DELETE → restricted to ORG_ADMIN/MANAGER

-- -------------------------------------------------------
-- 1. patients
-- -------------------------------------------------------
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: patients SELECT" ON public.patients;
CREATE POLICY "Tenant isolation: patients SELECT"
  ON public.patients FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: patients INSERT" ON public.patients;
CREATE POLICY "Tenant isolation: patients INSERT"
  ON public.patients FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: patients UPDATE" ON public.patients;
CREATE POLICY "Tenant isolation: patients UPDATE"
  ON public.patients FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: patients DELETE" ON public.patients;
CREATE POLICY "Tenant isolation: patients DELETE"
  ON public.patients FOR DELETE TO authenticated
  USING (
    tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN'::org_role, 'MANAGER'::org_role])
  );

-- -------------------------------------------------------
-- 2. professionals
-- -------------------------------------------------------
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: professionals SELECT" ON public.professionals;
CREATE POLICY "Tenant isolation: professionals SELECT"
  ON public.professionals FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: professionals INSERT" ON public.professionals;
CREATE POLICY "Tenant isolation: professionals INSERT"
  ON public.professionals FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: professionals UPDATE" ON public.professionals;
CREATE POLICY "Tenant isolation: professionals UPDATE"
  ON public.professionals FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: professionals DELETE" ON public.professionals;
CREATE POLICY "Tenant isolation: professionals DELETE"
  ON public.professionals FOR DELETE TO authenticated
  USING (
    tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN'::org_role, 'MANAGER'::org_role])
  );

-- -------------------------------------------------------
-- 3. appointments
-- -------------------------------------------------------
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: appointments SELECT" ON public.appointments;
CREATE POLICY "Tenant isolation: appointments SELECT"
  ON public.appointments FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: appointments INSERT" ON public.appointments;
CREATE POLICY "Tenant isolation: appointments INSERT"
  ON public.appointments FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: appointments UPDATE" ON public.appointments;
CREATE POLICY "Tenant isolation: appointments UPDATE"
  ON public.appointments FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: appointments DELETE" ON public.appointments;
CREATE POLICY "Tenant isolation: appointments DELETE"
  ON public.appointments FOR DELETE TO authenticated
  USING (
    tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN'::org_role, 'MANAGER'::org_role])
  );

-- -------------------------------------------------------
-- 4. evaluations
-- -------------------------------------------------------
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: evaluations SELECT" ON public.evaluations;
CREATE POLICY "Tenant isolation: evaluations SELECT"
  ON public.evaluations FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: evaluations INSERT" ON public.evaluations;
CREATE POLICY "Tenant isolation: evaluations INSERT"
  ON public.evaluations FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: evaluations UPDATE" ON public.evaluations;
CREATE POLICY "Tenant isolation: evaluations UPDATE"
  ON public.evaluations FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: evaluations DELETE" ON public.evaluations;
CREATE POLICY "Tenant isolation: evaluations DELETE"
  ON public.evaluations FOR DELETE TO authenticated
  USING (
    tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN'::org_role, 'MANAGER'::org_role])
  );

-- -------------------------------------------------------
-- 5. evaluation_types
-- -------------------------------------------------------
ALTER TABLE public.evaluation_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_types FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: evaluation_types SELECT" ON public.evaluation_types;
CREATE POLICY "Tenant isolation: evaluation_types SELECT"
  ON public.evaluation_types FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: evaluation_types INSERT" ON public.evaluation_types;
CREATE POLICY "Tenant isolation: evaluation_types INSERT"
  ON public.evaluation_types FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: evaluation_types UPDATE" ON public.evaluation_types;
CREATE POLICY "Tenant isolation: evaluation_types UPDATE"
  ON public.evaluation_types FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: evaluation_types DELETE" ON public.evaluation_types;
CREATE POLICY "Tenant isolation: evaluation_types DELETE"
  ON public.evaluation_types FOR DELETE TO authenticated
  USING (
    tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN'::org_role, 'MANAGER'::org_role])
  );

-- -------------------------------------------------------
-- 6. clinical_events
-- -------------------------------------------------------
ALTER TABLE public.clinical_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_events FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: clinical_events SELECT" ON public.clinical_events;
CREATE POLICY "Tenant isolation: clinical_events SELECT"
  ON public.clinical_events FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: clinical_events INSERT" ON public.clinical_events;
CREATE POLICY "Tenant isolation: clinical_events INSERT"
  ON public.clinical_events FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: clinical_events UPDATE" ON public.clinical_events;
CREATE POLICY "Tenant isolation: clinical_events UPDATE"
  ON public.clinical_events FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

-- No DELETE for clinical_events (immutable records)

-- -------------------------------------------------------
-- 7. transactions
-- -------------------------------------------------------
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: transactions SELECT" ON public.transactions;
CREATE POLICY "Tenant isolation: transactions SELECT"
  ON public.transactions FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: transactions INSERT" ON public.transactions;
CREATE POLICY "Tenant isolation: transactions INSERT"
  ON public.transactions FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: transactions UPDATE" ON public.transactions;
CREATE POLICY "Tenant isolation: transactions UPDATE"
  ON public.transactions FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: transactions DELETE" ON public.transactions;
CREATE POLICY "Tenant isolation: transactions DELETE"
  ON public.transactions FOR DELETE TO authenticated
  USING (
    tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN'::org_role, 'MANAGER'::org_role])
  );

-- -------------------------------------------------------
-- 8. documents
-- -------------------------------------------------------
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: documents SELECT" ON public.documents;
CREATE POLICY "Tenant isolation: documents SELECT"
  ON public.documents FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: documents INSERT" ON public.documents;
CREATE POLICY "Tenant isolation: documents INSERT"
  ON public.documents FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: documents UPDATE" ON public.documents;
CREATE POLICY "Tenant isolation: documents UPDATE"
  ON public.documents FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: documents DELETE" ON public.documents;
CREATE POLICY "Tenant isolation: documents DELETE"
  ON public.documents FOR DELETE TO authenticated
  USING (
    tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN'::org_role, 'MANAGER'::org_role])
  );

-- -------------------------------------------------------
-- 9. document_templates
-- -------------------------------------------------------
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: document_templates SELECT" ON public.document_templates;
CREATE POLICY "Tenant isolation: document_templates SELECT"
  ON public.document_templates FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: document_templates INSERT" ON public.document_templates;
CREATE POLICY "Tenant isolation: document_templates INSERT"
  ON public.document_templates FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: document_templates UPDATE" ON public.document_templates;
CREATE POLICY "Tenant isolation: document_templates UPDATE"
  ON public.document_templates FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: document_templates DELETE" ON public.document_templates;
CREATE POLICY "Tenant isolation: document_templates DELETE"
  ON public.document_templates FOR DELETE TO authenticated
  USING (
    tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN'::org_role, 'MANAGER'::org_role])
  );

-- -------------------------------------------------------
-- 10. conventions
-- -------------------------------------------------------
ALTER TABLE public.conventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conventions FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: conventions SELECT" ON public.conventions;
CREATE POLICY "Tenant isolation: conventions SELECT"
  ON public.conventions FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: conventions INSERT" ON public.conventions;
CREATE POLICY "Tenant isolation: conventions INSERT"
  ON public.conventions FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: conventions UPDATE" ON public.conventions;
CREATE POLICY "Tenant isolation: conventions UPDATE"
  ON public.conventions FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: conventions DELETE" ON public.conventions;
CREATE POLICY "Tenant isolation: conventions DELETE"
  ON public.conventions FOR DELETE TO authenticated
  USING (
    tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN'::org_role, 'MANAGER'::org_role])
  );

-- -------------------------------------------------------
-- 11. specialties
-- -------------------------------------------------------
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: specialties SELECT" ON public.specialties;
CREATE POLICY "Tenant isolation: specialties SELECT"
  ON public.specialties FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: specialties INSERT" ON public.specialties;
CREATE POLICY "Tenant isolation: specialties INSERT"
  ON public.specialties FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: specialties UPDATE" ON public.specialties;
CREATE POLICY "Tenant isolation: specialties UPDATE"
  ON public.specialties FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: specialties DELETE" ON public.specialties;
CREATE POLICY "Tenant isolation: specialties DELETE"
  ON public.specialties FOR DELETE TO authenticated
  USING (
    tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN'::org_role, 'MANAGER'::org_role])
  );

-- -------------------------------------------------------
-- 12. rooms
-- -------------------------------------------------------
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: rooms SELECT" ON public.rooms;
CREATE POLICY "Tenant isolation: rooms SELECT"
  ON public.rooms FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: rooms INSERT" ON public.rooms;
CREATE POLICY "Tenant isolation: rooms INSERT"
  ON public.rooms FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: rooms UPDATE" ON public.rooms;
CREATE POLICY "Tenant isolation: rooms UPDATE"
  ON public.rooms FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: rooms DELETE" ON public.rooms;
CREATE POLICY "Tenant isolation: rooms DELETE"
  ON public.rooms FOR DELETE TO authenticated
  USING (
    tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN'::org_role, 'MANAGER'::org_role])
  );

-- -------------------------------------------------------
-- 13. expense_categories
-- -------------------------------------------------------
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_categories FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: expense_categories SELECT" ON public.expense_categories;
CREATE POLICY "Tenant isolation: expense_categories SELECT"
  ON public.expense_categories FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: expense_categories INSERT" ON public.expense_categories;
CREATE POLICY "Tenant isolation: expense_categories INSERT"
  ON public.expense_categories FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: expense_categories UPDATE" ON public.expense_categories;
CREATE POLICY "Tenant isolation: expense_categories UPDATE"
  ON public.expense_categories FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: expense_categories DELETE" ON public.expense_categories;
CREATE POLICY "Tenant isolation: expense_categories DELETE"
  ON public.expense_categories FOR DELETE TO authenticated
  USING (
    tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN'::org_role, 'MANAGER'::org_role])
  );

-- -------------------------------------------------------
-- 14. treatment_contracts
-- -------------------------------------------------------
ALTER TABLE public.treatment_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_contracts FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: treatment_contracts SELECT" ON public.treatment_contracts;
CREATE POLICY "Tenant isolation: treatment_contracts SELECT"
  ON public.treatment_contracts FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: treatment_contracts INSERT" ON public.treatment_contracts;
CREATE POLICY "Tenant isolation: treatment_contracts INSERT"
  ON public.treatment_contracts FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: treatment_contracts UPDATE" ON public.treatment_contracts;
CREATE POLICY "Tenant isolation: treatment_contracts UPDATE"
  ON public.treatment_contracts FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: treatment_contracts DELETE" ON public.treatment_contracts;
CREATE POLICY "Tenant isolation: treatment_contracts DELETE"
  ON public.treatment_contracts FOR DELETE TO authenticated
  USING (
    tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN'::org_role, 'MANAGER'::org_role])
  );

-- -------------------------------------------------------
-- 15. vaccines
-- -------------------------------------------------------
ALTER TABLE public.vaccines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccines FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: vaccines SELECT" ON public.vaccines;
CREATE POLICY "Tenant isolation: vaccines SELECT"
  ON public.vaccines FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: vaccines INSERT" ON public.vaccines;
CREATE POLICY "Tenant isolation: vaccines INSERT"
  ON public.vaccines FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: vaccines UPDATE" ON public.vaccines;
CREATE POLICY "Tenant isolation: vaccines UPDATE"
  ON public.vaccines FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: vaccines DELETE" ON public.vaccines;
CREATE POLICY "Tenant isolation: vaccines DELETE"
  ON public.vaccines FOR DELETE TO authenticated
  USING (
    tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN'::org_role, 'MANAGER'::org_role])
  );

-- -------------------------------------------------------
-- 16. vaccine_batches
-- -------------------------------------------------------
ALTER TABLE public.vaccine_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccine_batches FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: vaccine_batches SELECT" ON public.vaccine_batches;
CREATE POLICY "Tenant isolation: vaccine_batches SELECT"
  ON public.vaccine_batches FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: vaccine_batches INSERT" ON public.vaccine_batches;
CREATE POLICY "Tenant isolation: vaccine_batches INSERT"
  ON public.vaccine_batches FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: vaccine_batches UPDATE" ON public.vaccine_batches;
CREATE POLICY "Tenant isolation: vaccine_batches UPDATE"
  ON public.vaccine_batches FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: vaccine_batches DELETE" ON public.vaccine_batches;
CREATE POLICY "Tenant isolation: vaccine_batches DELETE"
  ON public.vaccine_batches FOR DELETE TO authenticated
  USING (
    tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN'::org_role, 'MANAGER'::org_role])
  );

-- -------------------------------------------------------
-- 17. vaccine_applications
-- -------------------------------------------------------
ALTER TABLE public.vaccine_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccine_applications FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: vaccine_applications SELECT" ON public.vaccine_applications;
CREATE POLICY "Tenant isolation: vaccine_applications SELECT"
  ON public.vaccine_applications FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: vaccine_applications INSERT" ON public.vaccine_applications;
CREATE POLICY "Tenant isolation: vaccine_applications INSERT"
  ON public.vaccine_applications FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: vaccine_applications UPDATE" ON public.vaccine_applications;
CREATE POLICY "Tenant isolation: vaccine_applications UPDATE"
  ON public.vaccine_applications FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: vaccine_applications DELETE" ON public.vaccine_applications;
CREATE POLICY "Tenant isolation: vaccine_applications DELETE"
  ON public.vaccine_applications FOR DELETE TO authenticated
  USING (
    tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN'::org_role, 'MANAGER'::org_role])
  );

-- -------------------------------------------------------
-- 18. vaccine_temp_logs
-- -------------------------------------------------------
ALTER TABLE public.vaccine_temp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccine_temp_logs FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: vaccine_temp_logs SELECT" ON public.vaccine_temp_logs;
CREATE POLICY "Tenant isolation: vaccine_temp_logs SELECT"
  ON public.vaccine_temp_logs FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: vaccine_temp_logs INSERT" ON public.vaccine_temp_logs;
CREATE POLICY "Tenant isolation: vaccine_temp_logs INSERT"
  ON public.vaccine_temp_logs FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: vaccine_temp_logs UPDATE" ON public.vaccine_temp_logs;
CREATE POLICY "Tenant isolation: vaccine_temp_logs UPDATE"
  ON public.vaccine_temp_logs FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Tenant isolation: vaccine_temp_logs DELETE" ON public.vaccine_temp_logs;
CREATE POLICY "Tenant isolation: vaccine_temp_logs DELETE"
  ON public.vaccine_temp_logs FOR DELETE TO authenticated
  USING (
    tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN'::org_role, 'MANAGER'::org_role])
  );

-- ============================================================
-- SECTION B: FK-indirect tables (4 tables)
-- These tables reference a parent with tenant_id via FK.
-- RLS checks the parent's tenant ownership.
-- ============================================================

-- -------------------------------------------------------
-- 19. professional_availability
-- -------------------------------------------------------
ALTER TABLE public.professional_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_availability FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: professional_availability SELECT" ON public.professional_availability;
CREATE POLICY "Tenant isolation: professional_availability SELECT"
  ON public.professional_availability FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_id
        AND p.tenant_id = get_user_tenant_id(auth.uid())
    )
  );

DROP POLICY IF EXISTS "Tenant isolation: professional_availability INSERT" ON public.professional_availability;
CREATE POLICY "Tenant isolation: professional_availability INSERT"
  ON public.professional_availability FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_id
        AND p.tenant_id = get_user_tenant_id(auth.uid())
    )
  );

DROP POLICY IF EXISTS "Tenant isolation: professional_availability UPDATE" ON public.professional_availability;
CREATE POLICY "Tenant isolation: professional_availability UPDATE"
  ON public.professional_availability FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_id
        AND p.tenant_id = get_user_tenant_id(auth.uid())
    )
  );

DROP POLICY IF EXISTS "Tenant isolation: professional_availability DELETE" ON public.professional_availability;
CREATE POLICY "Tenant isolation: professional_availability DELETE"
  ON public.professional_availability FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_id
        AND p.tenant_id = get_user_tenant_id(auth.uid())
    )
  );

-- -------------------------------------------------------
-- 20. professional_blocks
-- -------------------------------------------------------
ALTER TABLE public.professional_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_blocks FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: professional_blocks SELECT" ON public.professional_blocks;
CREATE POLICY "Tenant isolation: professional_blocks SELECT"
  ON public.professional_blocks FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_id
        AND p.tenant_id = get_user_tenant_id(auth.uid())
    )
  );

DROP POLICY IF EXISTS "Tenant isolation: professional_blocks INSERT" ON public.professional_blocks;
CREATE POLICY "Tenant isolation: professional_blocks INSERT"
  ON public.professional_blocks FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_id
        AND p.tenant_id = get_user_tenant_id(auth.uid())
    )
  );

DROP POLICY IF EXISTS "Tenant isolation: professional_blocks UPDATE" ON public.professional_blocks;
CREATE POLICY "Tenant isolation: professional_blocks UPDATE"
  ON public.professional_blocks FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_id
        AND p.tenant_id = get_user_tenant_id(auth.uid())
    )
  );

DROP POLICY IF EXISTS "Tenant isolation: professional_blocks DELETE" ON public.professional_blocks;
CREATE POLICY "Tenant isolation: professional_blocks DELETE"
  ON public.professional_blocks FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_id
        AND p.tenant_id = get_user_tenant_id(auth.uid())
    )
  );

-- -------------------------------------------------------
-- 21. professional_specialties
-- -------------------------------------------------------
ALTER TABLE public.professional_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_specialties FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: professional_specialties SELECT" ON public.professional_specialties;
CREATE POLICY "Tenant isolation: professional_specialties SELECT"
  ON public.professional_specialties FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_id
        AND p.tenant_id = get_user_tenant_id(auth.uid())
    )
  );

DROP POLICY IF EXISTS "Tenant isolation: professional_specialties INSERT" ON public.professional_specialties;
CREATE POLICY "Tenant isolation: professional_specialties INSERT"
  ON public.professional_specialties FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_id
        AND p.tenant_id = get_user_tenant_id(auth.uid())
    )
  );

DROP POLICY IF EXISTS "Tenant isolation: professional_specialties UPDATE" ON public.professional_specialties;
CREATE POLICY "Tenant isolation: professional_specialties UPDATE"
  ON public.professional_specialties FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_id
        AND p.tenant_id = get_user_tenant_id(auth.uid())
    )
  );

DROP POLICY IF EXISTS "Tenant isolation: professional_specialties DELETE" ON public.professional_specialties;
CREATE POLICY "Tenant isolation: professional_specialties DELETE"
  ON public.professional_specialties FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.id = professional_id
        AND p.tenant_id = get_user_tenant_id(auth.uid())
    )
  );

-- -------------------------------------------------------
-- 22. specialty_evaluation_types
-- -------------------------------------------------------
ALTER TABLE public.specialty_evaluation_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialty_evaluation_types FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation: specialty_evaluation_types SELECT" ON public.specialty_evaluation_types;
CREATE POLICY "Tenant isolation: specialty_evaluation_types SELECT"
  ON public.specialty_evaluation_types FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.specialties s
      WHERE s.id = specialty_id
        AND s.tenant_id = get_user_tenant_id(auth.uid())
    )
  );

DROP POLICY IF EXISTS "Tenant isolation: specialty_evaluation_types INSERT" ON public.specialty_evaluation_types;
CREATE POLICY "Tenant isolation: specialty_evaluation_types INSERT"
  ON public.specialty_evaluation_types FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.specialties s
      WHERE s.id = specialty_id
        AND s.tenant_id = get_user_tenant_id(auth.uid())
    )
  );

DROP POLICY IF EXISTS "Tenant isolation: specialty_evaluation_types UPDATE" ON public.specialty_evaluation_types;
CREATE POLICY "Tenant isolation: specialty_evaluation_types UPDATE"
  ON public.specialty_evaluation_types FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.specialties s
      WHERE s.id = specialty_id
        AND s.tenant_id = get_user_tenant_id(auth.uid())
    )
  );

DROP POLICY IF EXISTS "Tenant isolation: specialty_evaluation_types DELETE" ON public.specialty_evaluation_types;
CREATE POLICY "Tenant isolation: specialty_evaluation_types DELETE"
  ON public.specialty_evaluation_types FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.specialties s
      WHERE s.id = specialty_id
        AND s.tenant_id = get_user_tenant_id(auth.uid())
    )
  );

-- ============================================================
-- SECTION C: Special tables
-- ============================================================

-- -------------------------------------------------------
-- 23. profiles (user-scoped, not tenant-scoped)
-- -------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- INSERT handled by handle_new_user() SECURITY DEFINER trigger
-- Admins can also view profiles of users in their tenant (for team management)
DROP POLICY IF EXISTS "Admins can view tenant profiles" ON public.profiles;
CREATE POLICY "Admins can view tenant profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = profiles.user_id
        AND ur.tenant_id = get_user_tenant_id(auth.uid())
        AND ur.is_active = true
    )
  );

-- -------------------------------------------------------
-- 24. tenants
-- -------------------------------------------------------
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tenant" ON public.tenants;
CREATE POLICY "Users can view own tenant"
  ON public.tenants FOR SELECT TO authenticated
  USING (id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "Admins can update own tenant" ON public.tenants;
CREATE POLICY "Admins can update own tenant"
  ON public.tenants FOR UPDATE TO authenticated
  USING (
    id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), id, ARRAY['ORG_ADMIN'::org_role])
  )
  WITH CHECK (
    id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), id, ARRAY['ORG_ADMIN'::org_role])
  );

-- Allow slug check for signup (unauthenticated users can check if slug exists)
DROP POLICY IF EXISTS "Anyone can check tenant slug" ON public.tenants;
CREATE POLICY "Anyone can check tenant slug"
  ON public.tenants FOR SELECT TO anon, authenticated
  USING (true);
-- Note: This is intentionally permissive for SELECT to allow slug validation.
-- Tenant data is not sensitive (name, slug). Sensitive data is in other tables.
-- If you want to restrict, remove this and use an RPC instead.

-- -------------------------------------------------------
-- 25. user_roles (extend existing policies)
-- -------------------------------------------------------
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles FORCE ROW LEVEL SECURITY;

-- Keep existing INSERT policy for self-assignment during signup
-- Add SELECT for viewing tenant team members
DROP POLICY IF EXISTS "Users can view roles in their tenant" ON public.user_roles;
CREATE POLICY "Users can view roles in their tenant"
  ON public.user_roles FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

-- Admins can manage roles
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE TO authenticated
  USING (
    tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN'::org_role, 'MANAGER'::org_role])
  );

DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (
    tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN'::org_role, 'MANAGER'::org_role])
  );

-- -------------------------------------------------------
-- 26. plans (global read-only reference data)
-- -------------------------------------------------------
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view plans" ON public.plans;
CREATE POLICY "Anyone can view plans"
  ON public.plans FOR SELECT TO authenticated, anon
  USING (true);

-- No INSERT/UPDATE/DELETE for regular users (managed by backoffice/admin)

-- -------------------------------------------------------
-- 27. audit_logs
-- -------------------------------------------------------
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs FORCE ROW LEVEL SECURITY;

-- Only ORG_ADMIN can view audit logs for their tenant
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (
    tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN'::org_role])
  );

-- INSERT is handled by SECURITY DEFINER audit trigger function
-- No UPDATE/DELETE for audit logs (immutable by design)

-- -------------------------------------------------------
-- 28-29. Sequence tables (used only by SECURITY DEFINER RPCs)
-- -------------------------------------------------------
ALTER TABLE public.appointment_code_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_code_sequences FORCE ROW LEVEL SECURITY;
-- No policies needed: accessed only via get_next_appointment_code() SECURITY DEFINER

ALTER TABLE public.medical_record_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_record_sequences FORCE ROW LEVEL SECURITY;
-- No policies needed: accessed only via get_next_record_number() SECURITY DEFINER
