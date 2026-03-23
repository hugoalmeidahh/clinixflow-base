-- ============================================================
-- Migration: Clinical immutability triggers
-- Enforces LGPD compliance: finalized clinical records cannot be modified.
-- ============================================================

-- -------------------------------------------------------
-- Trigger: Prevent updates to immutable clinical events
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_clinical_event_immutability()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.is_immutable = true THEN
    RAISE EXCEPTION 'Cannot modify immutable clinical event (id: %). Finalized clinical records are legally protected.', OLD.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_clinical_event_immutability ON public.clinical_events;
CREATE TRIGGER trg_enforce_clinical_event_immutability
  BEFORE UPDATE ON public.clinical_events
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_clinical_event_immutability();

-- Also prevent deletion of immutable clinical events
CREATE OR REPLACE FUNCTION public.prevent_clinical_event_deletion()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.is_immutable = true THEN
    RAISE EXCEPTION 'Cannot delete immutable clinical event (id: %). Finalized clinical records are legally protected.', OLD.id;
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_clinical_event_deletion ON public.clinical_events;
CREATE TRIGGER trg_prevent_clinical_event_deletion
  BEFORE DELETE ON public.clinical_events
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_clinical_event_deletion();

-- -------------------------------------------------------
-- Trigger: Prevent updates to locked evaluations
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_evaluation_immutability()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.is_locked = true THEN
    RAISE EXCEPTION 'Cannot modify finalized evaluation (id: %). Finalized evaluations are legally protected.', OLD.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_evaluation_immutability ON public.evaluations;
CREATE TRIGGER trg_enforce_evaluation_immutability
  BEFORE UPDATE ON public.evaluations
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_evaluation_immutability();

-- Also prevent deletion of locked evaluations
CREATE OR REPLACE FUNCTION public.prevent_evaluation_deletion()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.is_locked = true THEN
    RAISE EXCEPTION 'Cannot delete finalized evaluation (id: %). Finalized evaluations are legally protected.', OLD.id;
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_evaluation_deletion ON public.evaluations;
CREATE TRIGGER trg_prevent_evaluation_deletion
  BEFORE DELETE ON public.evaluations
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_evaluation_deletion();
