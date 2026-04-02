-- STORY-11: FIN-001 - Plano de Contas e Centro de Custo

-- ============================================================
-- Table: financial_categories (Plano de Contas)
-- ============================================================
create table if not exists public.financial_categories (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  type text not null check (type in ('INCOME', 'EXPENSE')),
  parent_id uuid references public.financial_categories(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.financial_categories enable row level security;

create or replace trigger set_financial_categories_updated_at
  before update on public.financial_categories
  for each row execute function public.update_updated_at_column();

create policy "Tenant isolation for financial_categories"
  on public.financial_categories
  for all
  using (tenant_id = get_user_tenant_id(auth.uid()));

-- Index for fast lookups
create index if not exists idx_financial_categories_tenant_type
  on public.financial_categories(tenant_id, type, is_active);

-- ============================================================
-- Table: cost_centers (Centros de Custo)
-- ============================================================
create table if not exists public.cost_centers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, code)
);

alter table public.cost_centers enable row level security;

create or replace trigger set_cost_centers_updated_at
  before update on public.cost_centers
  for each row execute function public.update_updated_at_column();

create policy "Tenant isolation for cost_centers"
  on public.cost_centers
  for all
  using (tenant_id = get_user_tenant_id(auth.uid()));

-- ============================================================
-- Add category_id and cost_center_id to transactions
-- ============================================================
alter table public.transactions
  add column if not exists category_id uuid references public.financial_categories(id) on delete set null,
  add column if not exists cost_center_id uuid references public.cost_centers(id) on delete set null;
