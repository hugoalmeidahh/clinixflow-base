# Aprovação Manual de Pagamento

Este documento explica como aprovar manualmente um pagamento no banco de dados.

## Processo Automático vs Manual

O sistema possui uma action `confirmPayment` que faz todo o processo automaticamente. Mas se você precisar fazer manualmente no banco de dados, siga os passos abaixo.

## Campos que Precisam ser Alterados

### 1. Tabela: `payment_requests`

Atualizar o registro do `payment_request` que está pendente:

```sql
UPDATE payment_requests
SET 
  status = 'paid',
  paid_at = NOW(),
  updated_at = NOW()
WHERE id = '<payment_request_id>';
```

**Campos:**
- `status`: `'paid'` (de `'pending'`)
- `paid_at`: `NOW()` (timestamp atual)
- `updated_at`: `NOW()` (timestamp atual)

### 2. Tabela: `subscriptions`

Atualizar a subscription relacionada:

```sql
UPDATE subscriptions
SET 
  status = 'active',
  payment_status = 'paid',
  current_period_start = '<data_inicio>',
  current_period_end = '<data_fim>',
  updated_at = NOW()
WHERE id = '<subscription_id>';
```

**Campos:**
- `status`: `'active'` (de `'pending_payment'`)
- `payment_status`: `'paid'` (de `'pending'`)
- `current_period_start`: Data de início do período (geralmente `NOW()`)
- `current_period_end`: Data de fim do período (calculada baseada no `plan_type`):
  - **Mensal**: `NOW() + 30 dias`
  - **Semestral**: `NOW() + 180 dias`
  - **Anual**: `NOW() + 365 dias`
- `updated_at`: `NOW()`

**Exemplo de cálculo de `current_period_end`:**
```sql
-- Para mensal (30 dias)
current_period_end = NOW() + INTERVAL '30 days'

-- Para semestral (180 dias)
current_period_end = NOW() + INTERVAL '180 days'

-- Para anual (365 dias)
current_period_end = NOW() + INTERVAL '365 days'
```

### 3. Tabela: `payments`

Criar um novo registro de pagamento (histórico):

```sql
INSERT INTO payments (
  subscription_id,
  payment_request_id,
  amount,
  payment_method,
  status,
  period_start,
  period_end,
  paid_at,
  notes,
  created_at,
  updated_at
)
VALUES (
  '<subscription_id>',
  '<payment_request_id>',
  <amount>, -- em centavos (ex: 8990 para R$ 89,90)
  '<payment_method>', -- 'pix', 'boleto', 'card'
  'succeeded',
  '<data_inicio>',
  '<data_fim>',
  NOW(),
  '<observacoes_opcionais>',
  NOW(),
  NOW()
);
```

**Campos:**
- `subscription_id`: ID da subscription
- `payment_request_id`: ID do payment_request
- `amount`: Valor em **centavos** (ex: 8990 = R$ 89,90)
- `payment_method`: `'pix'`, `'boleto'` ou `'card'`
- `status`: `'succeeded'`
- `period_start`: Mesma data de `current_period_start` da subscription
- `period_end`: Mesma data de `current_period_end` da subscription
- `paid_at`: `NOW()`
- `notes`: Observações opcionais (pode ser `NULL`)

### 4. Tabela: `users`

Atualizar o usuário com o plano e data de expiração:

```sql
UPDATE users
SET 
  plan = '<nome_plano>', -- 'essential', 'professional', 'super'
  plan_expires_at = '<data_fim>', -- mesma data de current_period_end
  updated_at = NOW()
WHERE id = '<user_id>';
```

**Campos:**
- `plan`: Nome do plano (`'essential'`, `'professional'`, `'super'`)
- `plan_expires_at`: Mesma data de `current_period_end` da subscription
- `updated_at`: `NOW()`

## Exemplo Completo

Vamos supor que você tem:
- `payment_request_id`: `'abc123'`
- `subscription_id`: `'sub456'`
- `user_id`: `'user789'`
- `plan_type`: `'mensal'`
- `amount`: `8990` (R$ 89,90)
- `payment_method`: `'pix'`
- `plan_name`: `'essential'`

### Passo 1: Atualizar payment_request
```sql
UPDATE payment_requests
SET 
  status = 'paid',
  paid_at = NOW(),
  updated_at = NOW()
WHERE id = 'abc123';
```

### Passo 2: Atualizar subscription
```sql
UPDATE subscriptions
SET 
  status = 'active',
  payment_status = 'paid',
  current_period_start = NOW(),
  current_period_end = NOW() + INTERVAL '30 days',
  updated_at = NOW()
WHERE id = 'sub456';
```

### Passo 3: Criar registro de pagamento
```sql
INSERT INTO payments (
  subscription_id,
  payment_request_id,
  amount,
  payment_method,
  status,
  period_start,
  period_end,
  paid_at,
  notes,
  created_at,
  updated_at
)
VALUES (
  'sub456',
  'abc123',
  8990,
  'pix',
  'succeeded',
  NOW(),
  NOW() + INTERVAL '30 days',
  NOW(),
  'Pagamento aprovado manualmente',
  NOW(),
  NOW()
);
```

### Passo 4: Atualizar user
```sql
UPDATE users
SET 
  plan = 'essential',
  plan_expires_at = NOW() + INTERVAL '30 days',
  updated_at = NOW()
WHERE id = 'user789';
```

## Valores Importantes

### Status Values

**payment_requests.status:**
- `'pending'` → `'paid'`

**subscriptions.status:**
- `'pending_payment'` → `'active'`

**subscriptions.payment_status:**
- `'pending'` → `'paid'`

**payments.status:**
- Sempre `'succeeded'` para pagamentos aprovados

### Payment Methods
- `'pix'`
- `'boleto'`
- `'card'`

### Plan Types e Duração
- `'mensal'`: 30 dias
- `'semestral'`: 180 dias
- `'anual'`: 365 dias

### Amount (Valor)
- **Sempre em centavos**
- Exemplos:
  - R$ 89,90 = `8990`
  - R$ 129,90 = `12990`
  - R$ 189,90 = `18990`

## Importante: Usar Transação

⚠️ **Recomendação**: Execute todas as queries dentro de uma transação para garantir consistência:

```sql
BEGIN;

-- Todas as queries aqui

COMMIT;
```

Ou, se algo der errado:

```sql
ROLLBACK;
```

## Alternativa: Usar a Action

Ao invés de fazer manualmente, você pode usar a action `confirmPayment` que faz tudo automaticamente:

```typescript
import { confirmPayment } from '@/src/actions/confirm-payment';

await confirmPayment({
  paymentRequestId: 'abc123',
  notes: 'Pagamento aprovado manualmente'
});
```

Isso garante que todas as atualizações sejam feitas corretamente e em transação.

