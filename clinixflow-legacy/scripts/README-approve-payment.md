# Scripts SQL para Aprovar Pagamento e Ajustar Plano para Anual

Este diretório contém scripts SQL para marcar pagamentos como realizados e ajustar planos de assinatura para licença anual diretamente no banco de dados.

## Arquivos Disponíveis

### 1. `approve-payment-annual.sql` (Recomendado)
Script completo com tratamento de erros e mensagens informativas. Usa blocos `DO $$` do PostgreSQL.

**Características:**
- Validação de dados
- Mensagens de erro claras
- Suporte para buscar por `subscription_id` ou `email`
- Transação completa com commit/rollback

**Como usar:**
1. Abra o arquivo `approve-payment-annual.sql`
2. Escolha a **OPÇÃO 1** (por subscription_id) ou **OPÇÃO 2** (por email)
3. Substitua `'SUBSCRIPTION_ID_AQUI'` ou `'SEU_EMAIL_AQUI'` pelo valor correto
4. Execute o script completo no seu cliente SQL (psql, DBeaver, pgAdmin, etc.)

### 2. `approve-payment-annual-simple.sql` (Versão Simplificada)
Script mais direto e simples, sem blocos DO. Mais fácil de ler e modificar.

**Características:**
- Mais simples e direto
- Funciona com qualquer cliente SQL
- Requer substituir o subscription_id em múltiplos lugares

**Como usar:**
1. Abra o arquivo `approve-payment-annual-simple.sql`
2. Substitua **TODAS** as ocorrências de `'SUBSCRIPTION_ID_AQUI'` pelo UUID da subscription
3. Execute o script completo

## O que os scripts fazem?

Ambos os scripts realizam as seguintes operações em uma transação:

1. ✅ **Atualiza payment_request pendente** → Marca como `paid` e define `paid_at`
2. ✅ **Cria registro no histórico de pagamentos** → Insere na tabela `payments`
3. ✅ **Atualiza subscription** → Ajusta para `plan_type = 'anual'`, `status = 'active'`, `payment_status = 'paid'`
4. ✅ **Define período de validade** → `current_period_start = NOW()` e `current_period_end = NOW() + 365 dias`
5. ✅ **Atualiza tabela users** → Atualiza `plan` e `plan_expires_at`

## Exemplos de Uso

### Exemplo 1: Usando subscription_id

```sql
-- No arquivo approve-payment-annual.sql, OPÇÃO 1:
-- Substitua:
v_subscription_id UUID := 'SUBSCRIPTION_ID_AQUI'::uuid;

-- Por:
v_subscription_id UUID := '123e4567-e89b-12d3-a456-426614174000'::uuid;
```

### Exemplo 2: Usando email do usuário

```sql
-- No arquivo approve-payment-annual.sql, OPÇÃO 2:
-- Substitua:
v_user_email TEXT := 'SEU_EMAIL_AQUI';

-- Por:
v_user_email TEXT := 'usuario@exemplo.com';
```

### Exemplo 3: Versão simplificada

```sql
-- No arquivo approve-payment-annual-simple.sql:
-- Substitua todas as ocorrências de:
'SUBSCRIPTION_ID_AQUI'::uuid

-- Por:
'123e4567-e89b-12d3-a456-426614174000'::uuid
```

## Como encontrar o subscription_id?

### Opção 1: Via SQL
```sql
SELECT 
  s.id as subscription_id,
  u.email,
  s.license_key,
  s.plan_type,
  s.status,
  s.payment_status
FROM subscriptions s
INNER JOIN users u ON s.user_id = u.id
WHERE u.email = 'usuario@exemplo.com'
ORDER BY s.created_at DESC;
```

### Opção 2: Via código da aplicação
- Acesse a página de assinaturas no painel admin
- O ID da subscription geralmente está visível na URL ou nos logs

## Segurança e Validação

### Antes de executar:

1. ✅ **Faça backup do banco de dados**
2. ✅ **Verifique se a subscription existe**
3. ✅ **Confirme que o pagamento realmente foi realizado**
4. ✅ **Teste em ambiente de desenvolvimento primeiro**

### Validação após execução:

Execute esta query para verificar se tudo foi atualizado corretamente:

```sql
SELECT 
  u.email,
  u.plan,
  u.plan_expires_at,
  s.id as subscription_id,
  s.license_key,
  s.plan_type,
  s.status,
  s.payment_status,
  s.current_period_start,
  s.current_period_end,
  s.amount,
  (SELECT COUNT(*) FROM payments WHERE subscription_id = s.id) as total_payments
FROM subscriptions s
INNER JOIN users u ON s.user_id = u.id
WHERE s.id = 'SEU_SUBSCRIPTION_ID_AQUI'::uuid;
```

**Verifique:**
- ✅ `plan_type` = `'anual'`
- ✅ `status` = `'active'`
- ✅ `payment_status` = `'paid'`
- ✅ `current_period_end` = data atual + 365 dias
- ✅ `total_payments` > 0

## Tratamento de Erros

Se algo der errado durante a execução:

1. **Execute ROLLBACK:**
   ```sql
   ROLLBACK;
   ```

2. **Verifique os logs de erro** do PostgreSQL

3. **Valide os dados:**
   - Subscription existe?
   - User existe?
   - Plan existe?

4. **Tente novamente** após corrigir o problema

## Notas Importantes

⚠️ **IMPORTANTE:**
- Todos os scripts usam **transações** - se algo der errado, execute `ROLLBACK` antes de `COMMIT`
- O período é sempre calculado a partir de **NOW()**, não a partir do período anterior
- O script **não cria** novos payment_requests (apenas atualiza os existentes)
- Para planos mensais, a aplicação cria automaticamente um novo payment_request no próximo período

## Suporte

Se encontrar problemas:
1. Verifique se todas as tabelas existem (subscriptions, payment_requests, payments, users, plans)
2. Confirme que o formato do UUID está correto
3. Verifique os logs do PostgreSQL para mensagens de erro detalhadas


