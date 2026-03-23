-- ============================================================
-- Fase 3: Módulo Clínico (prescrições, guias de convênio, TISS)
-- Fase 4: Financeiro (status workflow, resolução de honorários)
-- ============================================================

-- ==========================================
-- FASE 3.1: Tabela de prescrições
-- ==========================================
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  professional_id uuid NOT NULL REFERENCES professionals(id),
  appointment_id uuid REFERENCES appointments(id),
  content text NOT NULL,
  notes text,
  is_signed boolean NOT NULL DEFAULT false,
  signed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "prescriptions_select" ON prescriptions;
CREATE POLICY "prescriptions_select" ON prescriptions FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "prescriptions_insert" ON prescriptions;
CREATE POLICY "prescriptions_insert" ON prescriptions FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "prescriptions_update" ON prescriptions;
CREATE POLICY "prescriptions_update" ON prescriptions FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "prescriptions_delete" ON prescriptions;
CREATE POLICY "prescriptions_delete" ON prescriptions FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN','MANAGER']::org_role[]));

-- Imutabilidade: prescrição assinada não pode ser editada
CREATE OR REPLACE FUNCTION enforce_prescription_immutability()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.is_signed = true THEN
    RAISE EXCEPTION 'Prescrição assinada não pode ser alterada';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prescription_immutability ON prescriptions;
CREATE TRIGGER trg_prescription_immutability
  BEFORE UPDATE ON prescriptions
  FOR EACH ROW EXECUTE FUNCTION enforce_prescription_immutability();

DROP TRIGGER IF EXISTS trg_prescription_no_delete_signed ON prescriptions;
CREATE TRIGGER trg_prescription_no_delete_signed
  BEFORE DELETE ON prescriptions
  FOR EACH ROW EXECUTE FUNCTION enforce_prescription_immutability();

-- ==========================================
-- FASE 3.2: Tabela de guias de convênio
-- ==========================================
CREATE TABLE IF NOT EXISTS insurance_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  convention_id uuid NOT NULL REFERENCES conventions(id),
  guide_number text NOT NULL,
  authorization_code text,
  sessions_authorized integer NOT NULL DEFAULT 10,
  sessions_used integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXHAUSTED', 'EXPIRED', 'CANCELLED')),
  valid_from date NOT NULL,
  valid_until date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE insurance_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_guides FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "insurance_guides_select" ON insurance_guides;
CREATE POLICY "insurance_guides_select" ON insurance_guides FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "insurance_guides_insert" ON insurance_guides;
CREATE POLICY "insurance_guides_insert" ON insurance_guides FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "insurance_guides_update" ON insurance_guides;
CREATE POLICY "insurance_guides_update" ON insurance_guides FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "insurance_guides_delete" ON insurance_guides;
CREATE POLICY "insurance_guides_delete" ON insurance_guides FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN','MANAGER']::org_role[]));

-- Trigger: decrementar sessões ao marcar ATTENDED
CREATE OR REPLACE FUNCTION decrement_guide_session()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_guide record;
BEGIN
  -- Só age quando status muda para ATTENDED
  IF NEW.status = 'ATTENDED' AND (OLD.status IS NULL OR OLD.status != 'ATTENDED') THEN
    -- Busca guia ativa para o paciente + convênio (se appointment tem convention)
    -- Busca via patient_id e convention do paciente
    FOR v_guide IN
      SELECT ig.* FROM insurance_guides ig
      JOIN patients p ON p.id = NEW.patient_id
      WHERE ig.patient_id = NEW.patient_id
        AND ig.tenant_id = NEW.tenant_id
        AND ig.status = 'ACTIVE'
        AND (ig.valid_until IS NULL OR ig.valid_until >= CURRENT_DATE)
        AND ig.sessions_used < ig.sessions_authorized
      ORDER BY ig.created_at ASC
      LIMIT 1
    LOOP
      UPDATE insurance_guides
      SET sessions_used = sessions_used + 1,
          status = CASE
            WHEN sessions_used + 1 >= sessions_authorized THEN 'EXHAUSTED'
            ELSE 'ACTIVE'
          END,
          updated_at = now()
      WHERE id = v_guide.id;
      EXIT;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_decrement_guide_session ON appointments;
CREATE TRIGGER trg_decrement_guide_session
  AFTER UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION decrement_guide_session();

-- ==========================================
-- FASE 3.3: Campos TISS
-- ==========================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conventions' AND column_name = 'ans_code') THEN
    ALTER TABLE conventions ADD COLUMN ans_code text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'specialties' AND column_name = 'tuss_code') THEN
    ALTER TABLE specialties ADD COLUMN tuss_code text;
  END IF;
END;
$$;

-- ==========================================
-- FASE 4.1: Financial status workflow
-- ==========================================

-- Enum para status financeiro
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'financial_status') THEN
    CREATE TYPE financial_status AS ENUM ('PROJECTED', 'REALIZED', 'RECEIVED');
  END IF;
END;
$$;

-- Adicionar coluna financial_status na transactions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'financial_status') THEN
    ALTER TABLE transactions ADD COLUMN financial_status financial_status NOT NULL DEFAULT 'REALIZED';
  END IF;
END;
$$;

-- ==========================================
-- FASE 4.2: Trigger criar PROJECTED ao agendar
-- ==========================================
CREATE OR REPLACE FUNCTION create_projected_transaction()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_fee numeric;
BEGIN
  -- Só cria transação se o appointment tem fee definido
  IF NEW.fee IS NOT NULL AND NEW.fee > 0 THEN
    INSERT INTO transactions (
      tenant_id, type, amount, description,
      reference_date, patient_id, professional_id, appointment_id,
      financial_status, is_paid, created_by
    ) VALUES (
      NEW.tenant_id, 'INCOME', NEW.fee,
      'Agendamento ' || NEW.code,
      (NEW.scheduled_at AT TIME ZONE 'America/Sao_Paulo')::date,
      NEW.patient_id, NEW.professional_id, NEW.id,
      'PROJECTED', false, auth.uid()
    )
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_projected_transaction ON appointments;
CREATE TRIGGER trg_projected_transaction
  AFTER INSERT ON appointments
  FOR EACH ROW EXECUTE FUNCTION create_projected_transaction();

-- ==========================================
-- FASE 4.3: Trigger PROJECTED → REALIZED ao ATTENDED
-- ==========================================
CREATE OR REPLACE FUNCTION transition_transaction_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- ATTENDED → mover para REALIZED
  IF NEW.status = 'ATTENDED' AND (OLD.status IS NULL OR OLD.status != 'ATTENDED') THEN
    UPDATE transactions
    SET financial_status = 'REALIZED', updated_at = now()
    WHERE appointment_id = NEW.id
      AND financial_status = 'PROJECTED';
  END IF;

  -- CANCELLED ou ABSENCE → remover PROJECTED (não realizados)
  IF NEW.status IN ('CANCELLED', 'ABSENCE') AND OLD.status NOT IN ('CANCELLED', 'ABSENCE') THEN
    DELETE FROM transactions
    WHERE appointment_id = NEW.id
      AND financial_status = 'PROJECTED'
      AND is_paid = false;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_transition_financial ON appointments;
CREATE TRIGGER trg_transition_financial
  AFTER UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION transition_transaction_status();

-- ==========================================
-- FASE 4.4: RPC resolução de honorários
-- ==========================================
CREATE OR REPLACE FUNCTION resolve_appointment_fee(
  p_appointment_id uuid
)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_apt record;
  v_custom_fee numeric;
  v_convention_fee numeric;
  v_default_fee numeric;
  v_resolved_fee numeric;
BEGIN
  SELECT a.*, p.convention_id
  INTO v_apt
  FROM appointments a
  JOIN patients p ON p.id = a.patient_id
  WHERE a.id = p_appointment_id;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Prioridade 1: Fee customizado do profissional para a especialidade
  SELECT ps.custom_fee INTO v_custom_fee
  FROM professional_specialties ps
  WHERE ps.professional_id = v_apt.professional_id
    AND ps.specialty_id = v_apt.specialty_id
    AND ps.custom_fee IS NOT NULL;

  IF v_custom_fee IS NOT NULL THEN
    v_resolved_fee := v_custom_fee;
  ELSE
    -- Prioridade 2: Tabela do convênio
    IF v_apt.convention_id IS NOT NULL THEN
      SELECT (c.default_fee_table->>v_apt.specialty_id::text)::numeric INTO v_convention_fee
      FROM conventions c
      WHERE c.id = v_apt.convention_id
        AND c.default_fee_table IS NOT NULL;
    END IF;

    IF v_convention_fee IS NOT NULL THEN
      v_resolved_fee := v_convention_fee;
    ELSE
      -- Prioridade 3: Fee padrão da especialidade
      SELECT s.default_fee INTO v_default_fee
      FROM specialties s
      WHERE s.id = v_apt.specialty_id;

      v_resolved_fee := v_default_fee;
    END IF;
  END IF;

  -- Atualiza o appointment com o fee resolvido
  IF v_resolved_fee IS NOT NULL THEN
    UPDATE appointments SET fee = v_resolved_fee WHERE id = p_appointment_id;
  END IF;

  RETURN v_resolved_fee;
END;
$$;

-- Adicionar audit triggers nas novas tabelas
DROP TRIGGER IF EXISTS trg_audit_prescriptions ON prescriptions;
CREATE TRIGGER trg_audit_prescriptions
  AFTER INSERT OR UPDATE OR DELETE ON prescriptions
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

DROP TRIGGER IF EXISTS trg_audit_insurance_guides ON insurance_guides;
CREATE TRIGGER trg_audit_insurance_guides
  AFTER INSERT OR UPDATE OR DELETE ON insurance_guides
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
