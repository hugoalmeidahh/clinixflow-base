-- Criar tabela de histórico de pagamentos de owners
-- Esta tabela armazena todos os pagamentos registrados manualmente pelo master

CREATE TABLE IF NOT EXISTS "owner_payments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "subscription_id" uuid REFERENCES "subscriptions"("id") ON DELETE set null,
  "amount" integer NOT NULL, -- em centavos
  "payment_period" text NOT NULL, -- 'diario', 'mensal', 'trimestral', 'semestral', 'anual'
  "period_start" timestamp NOT NULL,
  "period_end" timestamp NOT NULL,
  "payment_date" timestamp NOT NULL, -- Data em que o pagamento foi informado
  "status" text NOT NULL DEFAULT 'paid', -- 'paid', 'overdue', 'cancelled'
  "notes" text,
  "created_by" text REFERENCES "users"("id") ON DELETE set null, -- ID do master que registrou
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Criar índice para buscar pagamentos por usuário
CREATE INDEX IF NOT EXISTS "owner_payments_user_id_idx" ON "owner_payments"("user_id");

-- Criar índice para buscar pagamentos por período
CREATE INDEX IF NOT EXISTS "owner_payments_period_end_idx" ON "owner_payments"("period_end");

-- Criar tabela de inconsistências de pagamento
-- Armazena owners que estão com pagamento vencido e precisam validação

CREATE TABLE IF NOT EXISTS "payment_inconsistencies" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "subscription_id" uuid REFERENCES "subscriptions"("id") ON DELETE set null,
  "expired_at" timestamp NOT NULL, -- Data em que o plano expirou
  "status" text NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'overdue', 'resolved'
  "resolved_at" timestamp,
  "resolved_by" text REFERENCES "users"("id") ON DELETE set null, -- ID do master que resolveu
  "resolution_notes" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "payment_inconsistencies_user_id_unique" UNIQUE("user_id") -- Uma inconsistência por owner
);

-- Criar índice para buscar inconsistências pendentes
CREATE INDEX IF NOT EXISTS "payment_inconsistencies_status_idx" ON "payment_inconsistencies"("status");
