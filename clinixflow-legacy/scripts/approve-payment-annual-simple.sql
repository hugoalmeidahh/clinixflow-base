-- ============================================================================
-- Versão Simplificada: Aprovar Pagamento e Ajustar para Plano Anual
-- ============================================================================
-- 
-- INSTRUÇÕES RÁPIDAS:
-- 1. Substitua TODAS as ocorrências de 'SUBSCRIPTION_ID_AQUI' pelo UUID da subscription
-- 2. Execute o script completo
-- 3. Se algo der errado, execute ROLLBACK; antes de COMMIT;
-- 
-- IMPORTANTE: Substitua 'SUBSCRIPTION_ID_AQUI' por exemplo: 
-- '123e4567-e89b-12d3-a456-426614174000'
-- ============================================================================

BEGIN;

-- VARIÁVEL: Substitua pelo UUID da subscription
-- Exemplo: '123e4567-e89b-12d3-a456-426614174000'
WITH subscription_data AS (
  SELECT 
    s.id as subscription_id,
    s.user_id,
    s.plan_id,
    s.amount,
    COALESCE(s.payment_method, 'pix') as payment_method,
    (SELECT id FROM payment_requests 
     WHERE subscription_id = s.id 
       AND status = 'pending'
     ORDER BY created_at DESC 
     LIMIT 1) as payment_request_id
  FROM subscriptions s
  WHERE s.id = 'SUBSCRIPTION_ID_AQUI'::uuid  -- SUBSTITUIR AQUI
)
-- 1. Atualizar payment_request pendente (se existir)
UPDATE payment_requests pr
SET 
  status = 'paid',
  paid_at = NOW(),
  updated_at = NOW()
FROM subscription_data sd
WHERE pr.id = sd.payment_request_id;

-- 2. Criar registro de pagamento no histórico
WITH subscription_data AS (
  SELECT 
    s.id as subscription_id,
    s.user_id,
    s.plan_id,
    s.amount,
    COALESCE(s.payment_method, 'pix') as payment_method,
    (SELECT id FROM payment_requests 
     WHERE subscription_id = s.id 
       AND status = 'paid'
     ORDER BY created_at DESC 
     LIMIT 1) as payment_request_id
  FROM subscriptions s
  WHERE s.id = 'SUBSCRIPTION_ID_AQUI'::uuid  -- SUBSTITUIR AQUI
)
INSERT INTO payments (
  subscription_id,
  payment_request_id,
  amount,
  payment_method,
  status,
  period_start,
  period_end,
  paid_at,
  created_at,
  updated_at
)
SELECT 
  subscription_id,
  payment_request_id,
  amount,
  payment_method,
  'succeeded',
  NOW(),
  NOW() + INTERVAL '365 days',
  NOW(),
  NOW(),
  NOW()
FROM subscription_data;

-- 3. Atualizar subscription para plano anual e marcar como pago
UPDATE subscriptions
SET 
  plan_type = 'anual',
  status = 'active',
  payment_status = 'paid',
  current_period_start = NOW(),
  current_period_end = NOW() + INTERVAL '365 days',
  updated_at = NOW()
WHERE id = 'SUBSCRIPTION_ID_AQUI'::uuid;  -- SUBSTITUIR AQUI

-- 4. Atualizar user com nome do plano e data de expiração
UPDATE users
SET 
  plan = p.name,
  plan_expires_at = NOW() + INTERVAL '365 days',
  updated_at = NOW()
FROM subscriptions s
INNER JOIN plans p ON s.plan_id = p.id
WHERE users.id = s.user_id
  AND s.id = 'SUBSCRIPTION_ID_AQUI'::uuid;  -- SUBSTITUIR AQUI

COMMIT;

-- ============================================================================
-- VERIFICAÇÃO: Descomente para verificar o resultado
-- ============================================================================
-- SELECT 
--   u.email,
--   u.plan,
--   u.plan_expires_at,
--   s.id as subscription_id,
--   s.license_key,
--   s.plan_type,
--   s.status,
--   s.payment_status,
--   s.current_period_start,
--   s.current_period_end,
--   s.amount
-- FROM subscriptions s
-- INNER JOIN users u ON s.user_id = u.id
-- WHERE s.id = 'SUBSCRIPTION_ID_AQUI'::uuid;  -- SUBSTITUIR AQUI

