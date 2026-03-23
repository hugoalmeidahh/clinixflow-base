-- STORY-15: FIN-005 - Parcelamento e Recorrência

alter table public.transactions
  add column if not exists installment_group_id uuid,
  add column if not exists installment_number integer,
  add column if not exists installment_total integer;

-- Index for grouping installments
create index if not exists idx_transactions_installment_group
  on public.transactions(installment_group_id)
  where installment_group_id is not null;
