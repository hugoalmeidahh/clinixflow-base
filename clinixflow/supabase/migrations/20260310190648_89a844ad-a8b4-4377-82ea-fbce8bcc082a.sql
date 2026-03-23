
-- Function to check appointment conflicts for a professional or patient
CREATE OR REPLACE FUNCTION public.check_appointment_conflicts(
  p_tenant_id uuid,
  p_professional_id uuid,
  p_patient_id uuid,
  p_scheduled_at timestamptz,
  p_duration_min integer,
  p_exclude_id uuid DEFAULT NULL
)
RETURNS TABLE(
  conflict_type text,
  conflicting_appointment_id uuid,
  conflicting_patient_name text,
  conflicting_professional_name text,
  conflicting_start timestamptz,
  conflicting_end timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH new_range AS (
    SELECT 
      p_scheduled_at AS start_at,
      p_scheduled_at + (p_duration_min || ' minutes')::interval AS end_at
  )
  SELECT 
    CASE 
      WHEN a.professional_id = p_professional_id THEN 'PROFESSIONAL'
      ELSE 'PATIENT'
    END AS conflict_type,
    a.id AS conflicting_appointment_id,
    pat.full_name AS conflicting_patient_name,
    prof.full_name AS conflicting_professional_name,
    a.scheduled_at AS conflicting_start,
    a.scheduled_at + (a.duration_min || ' minutes')::interval AS conflicting_end
  FROM appointments a
  CROSS JOIN new_range nr
  JOIN patients pat ON pat.id = a.patient_id
  JOIN professionals prof ON prof.id = a.professional_id
  WHERE a.tenant_id = p_tenant_id
    AND a.status NOT IN ('CANCELLED', 'RESCHEDULED')
    AND (a.professional_id = p_professional_id OR a.patient_id = p_patient_id)
    AND a.scheduled_at < nr.end_at
    AND (a.scheduled_at + (a.duration_min || ' minutes')::interval) > nr.start_at
    AND (p_exclude_id IS NULL OR a.id != p_exclude_id)
  ORDER BY a.scheduled_at
  LIMIT 5;
$$;
