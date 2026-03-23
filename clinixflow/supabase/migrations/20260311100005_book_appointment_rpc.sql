-- ============================================================
-- Fase 2: Tabela de feriados + RPC book_appointment atômico
-- ============================================================

-- ========== 1. Tabela tenant_holidays ==========
CREATE TABLE IF NOT EXISTS tenant_holidays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  date date NOT NULL,
  name text NOT NULL,
  is_recurring boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, date)
);

ALTER TABLE tenant_holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_holidays FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tenant_holidays_select" ON tenant_holidays;
CREATE POLICY "tenant_holidays_select" ON tenant_holidays FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "tenant_holidays_insert" ON tenant_holidays;
CREATE POLICY "tenant_holidays_insert" ON tenant_holidays FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "tenant_holidays_update" ON tenant_holidays;
CREATE POLICY "tenant_holidays_update" ON tenant_holidays FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()))
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

DROP POLICY IF EXISTS "tenant_holidays_delete" ON tenant_holidays;
CREATE POLICY "tenant_holidays_delete" ON tenant_holidays FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid())
    AND has_tenant_role(auth.uid(), tenant_id, ARRAY['ORG_ADMIN','MANAGER']::org_role[]));

-- ========== 2. get_next_appointment_code() ==========
CREATE OR REPLACE FUNCTION get_next_appointment_code(p_tenant_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_year integer := EXTRACT(YEAR FROM now())::integer;
  v_next integer;
BEGIN
  INSERT INTO appointment_code_sequences (tenant_id, year, last_number)
  VALUES (p_tenant_id, v_year, 1)
  ON CONFLICT (tenant_id, year)
  DO UPDATE SET last_number = appointment_code_sequences.last_number + 1
  RETURNING last_number INTO v_next;

  RETURN 'AGD-' || v_year::text || '-' || LPAD(v_next::text, 5, '0');
END;
$$;

-- ========== 3. book_appointment() RPC atômico ==========
CREATE OR REPLACE FUNCTION book_appointment(
  p_tenant_id uuid,
  p_patient_id uuid,
  p_professional_id uuid,
  p_specialty_id uuid,
  p_scheduled_at timestamptz,
  p_duration_min integer DEFAULT 30,
  p_notes text DEFAULT NULL,
  p_recurrence_group_id uuid DEFAULT NULL,
  p_skip_conflict_check boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_day_of_week integer;
  v_time_str text;
  v_start_min integer;
  v_end_min integer;
  v_date date;
  v_slot record;
  v_within_slot boolean := false;
  v_block record;
  v_holiday record;
  v_conflict record;
  v_code text;
  v_appointment_id uuid;
BEGIN
  -- Basic validation
  IF p_tenant_id IS NULL OR p_patient_id IS NULL OR p_professional_id IS NULL
     OR p_specialty_id IS NULL OR p_scheduled_at IS NULL THEN
    RETURN jsonb_build_object('error', 'Campos obrigatórios não preenchidos');
  END IF;

  v_date := (p_scheduled_at AT TIME ZONE 'America/Sao_Paulo')::date;
  v_day_of_week := EXTRACT(DOW FROM p_scheduled_at AT TIME ZONE 'America/Sao_Paulo')::integer;
  v_time_str := TO_CHAR(p_scheduled_at AT TIME ZONE 'America/Sao_Paulo', 'HH24:MI');
  v_start_min := EXTRACT(HOUR FROM p_scheduled_at AT TIME ZONE 'America/Sao_Paulo')::integer * 60
               + EXTRACT(MINUTE FROM p_scheduled_at AT TIME ZONE 'America/Sao_Paulo')::integer;
  v_end_min := v_start_min + p_duration_min;

  -- 1. Check tenant holiday
  SELECT * INTO v_holiday FROM tenant_holidays
  WHERE tenant_id = p_tenant_id
    AND (date = v_date OR (is_recurring AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM v_date)
                                        AND EXTRACT(DAY FROM date) = EXTRACT(DAY FROM v_date)))
  LIMIT 1;

  IF FOUND THEN
    RETURN jsonb_build_object('error', 'Data é feriado: ' || v_holiday.name);
  END IF;

  -- 2. Check professional block
  SELECT * INTO v_block FROM professional_blocks
  WHERE professional_id = p_professional_id
    AND v_date BETWEEN start_date::date AND end_date::date
  LIMIT 1;

  IF FOUND THEN
    RETURN jsonb_build_object('error', 'Profissional bloqueado nesta data' ||
      COALESCE(': ' || v_block.reason, ''));
  END IF;

  -- 3. Check professional availability
  FOR v_slot IN
    SELECT * FROM professional_availability
    WHERE professional_id = p_professional_id
      AND day_of_week = v_day_of_week
      AND is_active = true
  LOOP
    DECLARE
      v_slot_start integer;
      v_slot_end integer;
      v_sh integer;
      v_sm integer;
      v_eh integer;
      v_em integer;
    BEGIN
      v_sh := SPLIT_PART(v_slot.start_time, ':', 1)::integer;
      v_sm := SPLIT_PART(v_slot.start_time, ':', 2)::integer;
      v_eh := SPLIT_PART(v_slot.end_time, ':', 1)::integer;
      v_em := SPLIT_PART(v_slot.end_time, ':', 2)::integer;
      v_slot_start := v_sh * 60 + v_sm;
      v_slot_end := v_eh * 60 + v_em;

      IF v_start_min >= v_slot_start AND v_end_min <= v_slot_end THEN
        v_within_slot := true;
        EXIT;
      END IF;
    END;
  END LOOP;

  -- Only warn if professional has availability configured but time is outside
  IF EXISTS (SELECT 1 FROM professional_availability WHERE professional_id = p_professional_id AND is_active = true)
     AND NOT v_within_slot THEN
    RETURN jsonb_build_object('error', 'Horário fora da disponibilidade do profissional');
  END IF;

  -- 4. Check conflicts (unless skipped)
  IF NOT p_skip_conflict_check THEN
    SELECT * INTO v_conflict FROM (
      SELECT
        a.id,
        a.scheduled_at,
        (a.scheduled_at + (a.duration_min || ' minutes')::interval) AS end_at,
        CASE
          WHEN a.professional_id = p_professional_id THEN 'PROFESSIONAL'
          WHEN a.patient_id = p_patient_id THEN 'PATIENT'
        END AS conflict_type
      FROM appointments a
      WHERE a.tenant_id = p_tenant_id
        AND a.status NOT IN ('CANCELLED', 'RESCHEDULED')
        AND (a.professional_id = p_professional_id OR a.patient_id = p_patient_id)
        AND a.scheduled_at < (p_scheduled_at + (p_duration_min || ' minutes')::interval)
        AND (a.scheduled_at + (a.duration_min || ' minutes')::interval) > p_scheduled_at
    ) conflicts
    LIMIT 1;

    IF FOUND THEN
      RETURN jsonb_build_object(
        'error', 'Conflito de horário (' || v_conflict.conflict_type || ')',
        'conflict_type', v_conflict.conflict_type,
        'conflicting_appointment_id', v_conflict.id
      );
    END IF;
  END IF;

  -- 5. Generate appointment code
  v_code := get_next_appointment_code(p_tenant_id);

  -- 6. Insert appointment
  INSERT INTO appointments (
    tenant_id, patient_id, professional_id, specialty_id,
    scheduled_at, duration_min, code, notes, recurrence_group_id,
    created_by
  ) VALUES (
    p_tenant_id, p_patient_id, p_professional_id, p_specialty_id,
    p_scheduled_at, p_duration_min, v_code, p_notes, p_recurrence_group_id,
    auth.uid()
  )
  RETURNING id INTO v_appointment_id;

  RETURN jsonb_build_object(
    'success', true,
    'appointment_id', v_appointment_id,
    'code', v_code
  );
END;
$$;
