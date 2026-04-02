-- STORY-17: FIN-007 - NFSe (Notas Fiscais de Serviço)
-- STORY-18: FIN-008 - Fechamento por Convênio

-- ============================================================
-- NFSe Configuration per tenant (in tenant_settings or separate table)
-- ============================================================
alter table public.tenants
  add column if not exists nfse_provider text check (nfse_provider in ('FOCUS_NFE', 'ENOTAS', null)),
  add column if not exists nfse_api_key text,
  add column if not exists nfse_inscricao_municipal text,
  add column if not exists nfse_regime_tributario text,
  add column if not exists nfse_codigo_servico text;

-- ============================================================
-- Table: invoices (Notas Fiscais)
-- ============================================================
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  patient_id uuid references public.patients(id) on delete set null,
  nfse_number text,
  status text not null default 'DRAFT' check (status in ('DRAFT', 'PENDING', 'AUTHORIZED', 'CANCELLED', 'ERROR')),
  amount numeric not null,
  service_code text,
  description text,
  pdf_url text,
  xml_url text,
  external_id text,
  issued_at timestamptz,
  cancelled_at timestamptz,
  cancel_reason text,
  error_message text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.invoices enable row level security;

create or replace trigger set_invoices_updated_at
  before update on public.invoices
  for each row execute function public.update_updated_at_column();

create policy "Tenant isolation for invoices"
  on public.invoices
  for all
  using (tenant_id = get_user_tenant_id(auth.uid()));

-- Junction: invoice items (transactions linked to invoice)
create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  transaction_id uuid references public.transactions(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null,
  description text,
  amount numeric not null,
  created_at timestamptz not null default now()
);

alter table public.invoice_items enable row level security;

create policy "Tenant isolation for invoice_items"
  on public.invoice_items
  for all
  using (
    invoice_id in (select id from public.invoices where tenant_id = get_user_tenant_id(auth.uid()))
  );

-- ============================================================
-- Table: insurance_batches (Fechamento por Convênio)
-- ============================================================
create table if not exists public.insurance_batches (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  convention_id uuid references public.conventions(id) on delete set null,
  period_month integer not null check (period_month between 1 and 12),
  period_year integer not null,
  status text not null default 'OPEN' check (status in ('OPEN', 'SENT', 'RECEIVED')),
  billed_amount numeric default 0,
  received_amount numeric,
  sent_at timestamptz,
  received_at timestamptz,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.insurance_batches enable row level security;

create or replace trigger set_insurance_batches_updated_at
  before update on public.insurance_batches
  for each row execute function public.update_updated_at_column();

create policy "Tenant isolation for insurance_batches"
  on public.insurance_batches
  for all
  using (tenant_id = get_user_tenant_id(auth.uid()));
