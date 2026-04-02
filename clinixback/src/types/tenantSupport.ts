export interface TenantTeamMember {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: 'ORG_ADMIN' | 'MANAGER' | 'HEALTH_PROFESSIONAL' | 'RECEPTIONIST' | 'FINANCIAL' | 'PATIENT';
  is_active: boolean;
  accepted_at: string | null;
  created_at: string;
}

export interface TenantPatient {
  id: string;
  record_number: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  cpf: string | null;
  date_of_birth: string | null;
  gender: string | null;
  care_type: string;
  is_active: boolean;
  created_at: string;
}

export interface TenantPatientsResponse {
  data: TenantPatient[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TenantAppointment {
  id: string;
  code: string;
  scheduled_at: string;
  duration_min: number;
  status: string;
  appointment_type: string;
  notes: string | null;
  fee: number | null;
  patient_name: string;
  professional_name: string;
  specialty_name: string;
  created_at: string;
}

export interface TenantClinicalEvent {
  id: string;
  event_type: string;
  performed_at: string;
  content: string | null;
  metadata: Record<string, any> | null;
  is_immutable: boolean;
  created_at: string;
}

export interface TenantEvaluation {
  id: string;
  evaluation_type_name: string;
  professional_name: string;
  is_draft: boolean;
  is_locked: boolean;
  notes: string | null;
  finalized_at: string | null;
  created_at: string;
}

export interface TenantClinicalData {
  events: TenantClinicalEvent[];
  evaluations: TenantEvaluation[];
}
