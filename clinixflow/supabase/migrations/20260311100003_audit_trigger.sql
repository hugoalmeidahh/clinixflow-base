-- ============================================================
-- Migration: Generic audit logging trigger
-- Automatically populates audit_logs on INSERT/UPDATE/DELETE
-- for high-value tables, using SECURITY DEFINER to bypass RLS.
-- ============================================================

CREATE OR REPLACE FUNCTION public.audit_trigger_func()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_old_data jsonb;
  v_new_data jsonb;
  v_action text;
  v_tenant_id uuid;
  v_entity_id text;
BEGIN
  -- Determine action
  v_action := TG_OP;

  -- Extract entity_id and tenant_id based on operation
  IF TG_OP = 'DELETE' THEN
    v_old_data := to_jsonb(OLD);
    v_entity_id := OLD.id::text;
    v_tenant_id := OLD.tenant_id;
  ELSE
    v_new_data := to_jsonb(NEW);
    v_entity_id := NEW.id::text;
    v_tenant_id := NEW.tenant_id;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    v_old_data := to_jsonb(OLD);
  END IF;

  -- Insert audit log entry
  INSERT INTO public.audit_logs (
    tenant_id,
    user_id,
    action,
    entity_type,
    entity_id,
    old_data,
    new_data
  ) VALUES (
    v_tenant_id,
    auth.uid(),
    v_action,
    TG_TABLE_NAME,
    v_entity_id,
    v_old_data,
    v_new_data
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

-- -------------------------------------------------------
-- Attach audit triggers to high-value tables
-- -------------------------------------------------------

-- appointments
DROP TRIGGER IF EXISTS trg_audit_appointments ON public.appointments;
CREATE TRIGGER trg_audit_appointments
  AFTER INSERT OR UPDATE OR DELETE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_func();

-- transactions
DROP TRIGGER IF EXISTS trg_audit_transactions ON public.transactions;
CREATE TRIGGER trg_audit_transactions
  AFTER INSERT OR UPDATE OR DELETE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_func();

-- clinical_events
DROP TRIGGER IF EXISTS trg_audit_clinical_events ON public.clinical_events;
CREATE TRIGGER trg_audit_clinical_events
  AFTER INSERT OR UPDATE ON public.clinical_events
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_func();

-- evaluations
DROP TRIGGER IF EXISTS trg_audit_evaluations ON public.evaluations;
CREATE TRIGGER trg_audit_evaluations
  AFTER INSERT OR UPDATE ON public.evaluations
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_func();

-- patients
DROP TRIGGER IF EXISTS trg_audit_patients ON public.patients;
CREATE TRIGGER trg_audit_patients
  AFTER INSERT OR UPDATE OR DELETE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_func();
