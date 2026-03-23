
-- Índices compostos para as tabelas mais consultadas

-- Appointments: query principal sempre filtra por tenant + data
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_scheduled 
ON public.appointments(tenant_id, scheduled_at);

CREATE INDEX IF NOT EXISTS idx_appointments_tenant_status 
ON public.appointments(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_appointments_tenant_professional_scheduled 
ON public.appointments(tenant_id, professional_id, scheduled_at);

CREATE INDEX IF NOT EXISTS idx_appointments_tenant_patient 
ON public.appointments(tenant_id, patient_id);

-- Patients: busca por tenant + nome, tenant + ativo
CREATE INDEX IF NOT EXISTS idx_patients_tenant_active 
ON public.patients(tenant_id, is_active);

CREATE INDEX IF NOT EXISTS idx_patients_tenant_name 
ON public.patients(tenant_id, full_name);

-- Professionals
CREATE INDEX IF NOT EXISTS idx_professionals_tenant_active 
ON public.professionals(tenant_id, is_active);

-- Transactions: relatórios financeiros por tenant + data
CREATE INDEX IF NOT EXISTS idx_transactions_tenant_date 
ON public.transactions(tenant_id, reference_date);

CREATE INDEX IF NOT EXISTS idx_transactions_tenant_type_date 
ON public.transactions(tenant_id, type, reference_date);

CREATE INDEX IF NOT EXISTS idx_transactions_tenant_appointment 
ON public.transactions(tenant_id, appointment_id);

-- Clinical events: timeline do paciente
CREATE INDEX IF NOT EXISTS idx_clinical_events_tenant_patient 
ON public.clinical_events(tenant_id, patient_id, performed_at);

-- Evaluations
CREATE INDEX IF NOT EXISTS idx_evaluations_tenant_patient 
ON public.evaluations(tenant_id, patient_id);

-- Professional availability: usado no book_appointment
CREATE INDEX IF NOT EXISTS idx_availability_professional_day 
ON public.professional_availability(professional_id, day_of_week, is_active);

-- Specialties
CREATE INDEX IF NOT EXISTS idx_specialties_tenant_active 
ON public.specialties(tenant_id, is_active);

-- Documents
CREATE INDEX IF NOT EXISTS idx_documents_tenant_patient 
ON public.documents(tenant_id, patient_id);

-- Insurance guides
CREATE INDEX IF NOT EXISTS idx_insurance_guides_tenant_patient 
ON public.insurance_guides(tenant_id, patient_id, status);
