-- STORY-09: Patient Portal
-- RLS policies for patient self-service access + appointment booking requests table

-- ============================================================
-- Helper: get patient id from auth user
-- ============================================================
create or replace function get_patient_id_for_user(p_user_id uuid)
returns uuid
language sql
security definer
set search_path = public
as $$
  select id from patients where user_id = p_user_id limit 1;
$$;

-- ============================================================
-- RLS: Patients can view their own appointments
-- ============================================================
drop policy if exists "Patient can view own appointments" on public.appointments;
create policy "Patient can view own appointments"
  on public.appointments
  for select
  using (
    patient_id = get_patient_id_for_user(auth.uid())
  );

-- ============================================================
-- RLS: Patients can confirm their own appointments (update confirmed_at + status)
-- ============================================================
drop policy if exists "Patient can confirm own appointment" on public.appointments;
create policy "Patient can confirm own appointment"
  on public.appointments
  for update
  using (
    patient_id = get_patient_id_for_user(auth.uid())
    and status = 'SCHEDULED'
  )
  with check (
    patient_id = get_patient_id_for_user(auth.uid())
  );

-- ============================================================
-- RLS: Patients can view their own documents
-- ============================================================
drop policy if exists "Patient can view own documents" on public.documents;
create policy "Patient can view own documents"
  on public.documents
  for select
  using (
    patient_id = get_patient_id_for_user(auth.uid())
  );

-- ============================================================
-- Table: appointment_booking_requests
-- ============================================================
create table if not exists public.appointment_booking_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  preferred_date_1 timestamptz not null,
  preferred_date_2 timestamptz,
  preferred_date_3 timestamptz,
  notes text,
  status text not null default 'PENDING' check (status in ('PENDING', 'APPROVED', 'REJECTED')),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.appointment_booking_requests enable row level security;

-- Trigger for updated_at
create or replace trigger set_booking_requests_updated_at
  before update on public.appointment_booking_requests
  for each row execute function public.set_updated_at();

-- RLS: Tenant staff can view all booking requests
create policy "Staff can manage booking requests"
  on public.appointment_booking_requests
  for all
  using (tenant_id = get_user_tenant_id(auth.uid()));

-- RLS: Patient can insert and view own booking requests
create policy "Patient can create booking request"
  on public.appointment_booking_requests
  for insert
  with check (
    patient_id = get_patient_id_for_user(auth.uid())
    and tenant_id = get_user_tenant_id(auth.uid())
  );

create policy "Patient can view own booking requests"
  on public.appointment_booking_requests
  for select
  using (
    patient_id = get_patient_id_for_user(auth.uid())
  );
