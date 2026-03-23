-- ============================================
-- SCRIPTS SQL PARA ATUALIZAR ACESSO DE USUÁRIOS
-- ============================================

-- ============================================
-- 1. ATIVAR USUÁRIO POR EMAIL
-- ============================================
-- Ativa um usuário por 30 dias com plano 'alpha'
-- Substitua 'user@example.com' pelo email do usuário
-- Substitua '30' pelos dias desejados
-- Substitua 'alpha' pelo plano desejado (alpha, beta_partner, etc)

UPDATE users
SET 
  plan = 'alpha',
  plan_expires_at = NOW() + INTERVAL '30 days',
  activated_by_code = 'MANUAL_SQL_' || NOW()::text,
  updated_at = NOW()
WHERE email = 'user@example.com';

-- ============================================
-- 2. ESTENDER PLANO DE USUÁRIO
-- ============================================
-- Adiciona 30 dias à data de expiração atual
-- Substitua 'user@example.com' pelo email do usuário
-- Substitua '30' pelos dias a adicionar

UPDATE users
SET 
  plan_expires_at = plan_expires_at + INTERVAL '30 days',
  updated_at = NOW()
WHERE email = 'user@example.com'
  AND plan IS NOT NULL
  AND plan_expires_at IS NOT NULL;

-- ============================================
-- 3. RENOVAR PLANO (A PARTIR DE HOJE)
-- ============================================
-- Renova o plano a partir de hoje por 30 dias
-- Substitua 'user@example.com' pelo email do usuário
-- Substitua '30' pelos dias desejados

UPDATE users
SET 
  plan_expires_at = NOW() + INTERVAL '30 days',
  updated_at = NOW()
WHERE email = 'user@example.com'
  AND plan IS NOT NULL;

-- ============================================
-- 4. ATIVAR MÚLTIPLOS USUÁRIOS
-- ============================================
-- Ativa vários usuários de uma vez
-- Adicione mais linhas no WHERE conforme necessário

UPDATE users
SET 
  plan = 'alpha',
  plan_expires_at = NOW() + INTERVAL '30 days',
  activated_by_code = 'MANUAL_SQL_BATCH_' || NOW()::text,
  updated_at = NOW()
WHERE email IN (
  'user1@example.com',
  'user2@example.com',
  'user3@example.com'
);

-- ============================================
-- 5. ATIVAR TODOS OS OWNERS SEM PLANO
-- ============================================
-- Ativa todos os clinic_owners que não têm plano

UPDATE users
SET 
  plan = 'alpha',
  plan_expires_at = NOW() + INTERVAL '30 days',
  activated_by_code = 'MANUAL_SQL_ALL_OWNERS_' || NOW()::text,
  updated_at = NOW()
WHERE role = 'clinic_owner'
  AND (plan IS NULL OR plan_expires_at IS NULL OR plan_expires_at < NOW());

-- ============================================
-- 6. VERIFICAR STATUS DE USUÁRIOS
-- ============================================
-- Lista todos os owners e seus status de acesso

SELECT 
  u.id,
  u.name,
  u.email,
  u.role,
  u.plan,
  u.plan_expires_at,
  u.activated_by_code,
  CASE 
    WHEN u.plan IS NULL THEN 'SEM PLANO'
    WHEN u.plan_expires_at IS NULL THEN 'PLANO SEM DATA'
    WHEN u.plan_expires_at < NOW() THEN 'EXPIRADO'
    WHEN u.plan_expires_at <= NOW() + INTERVAL '7 days' THEN 'EXPIRANDO EM BREVE'
    ELSE 'ATIVO'
  END as status,
  CASE 
    WHEN u.plan_expires_at IS NOT NULL 
    THEN EXTRACT(DAY FROM (u.plan_expires_at - NOW()))
    ELSE NULL
  END as dias_restantes,
  u.created_at,
  u.updated_at
FROM users u
WHERE u.role = 'clinic_owner'
ORDER BY u.created_at DESC;

-- ============================================
-- 7. ATUALIZAR STATUS DE SUBSCRIPTION
-- ============================================
-- Ativa uma subscription pendente e atualiza o usuário
-- Substitua 'subscription_id_aqui' pelo ID da subscription

UPDATE subscriptions
SET 
  status = 'active',
  payment_status = 'paid',
  current_period_start = NOW(),
  current_period_end = NOW() + INTERVAL '30 days',
  updated_at = NOW()
WHERE id = 'subscription_id_aqui'::uuid;

-- Atualizar também o usuário vinculado
UPDATE users
SET 
  plan = (SELECT plan_type FROM subscriptions WHERE id = 'subscription_id_aqui'::uuid),
  plan_expires_at = (SELECT current_period_end FROM subscriptions WHERE id = 'subscription_id_aqui'::uuid),
  updated_at = NOW()
WHERE id = (SELECT user_id FROM subscriptions WHERE id = 'subscription_id_aqui'::uuid);

-- ============================================
-- 8. LIMPAR PLANOS EXPIRADOS
-- ============================================
-- Remove planos expirados de todos os usuários

UPDATE users
SET 
  plan = NULL,
  plan_expires_at = NULL,
  activated_by_code = NULL,
  updated_at = NOW()
WHERE plan IS NOT NULL
  AND plan_expires_at IS NOT NULL
  AND plan_expires_at < NOW();

-- ============================================
-- 9. CRIAR USUÁRIO MASTER
-- ============================================
-- Cria um usuário master (role será adicionado ao enum)
-- IMPORTANTE: Execute apenas uma vez e guarde as credenciais!

-- Primeiro, adicione 'master' ao enum (se ainda não existir):
-- ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'master';

-- Depois, atualize o usuário para ser master:
-- UPDATE users
-- SET role = 'master'
-- WHERE email = 'master@clinixflow.com.br';

-- ============================================
-- 10. EXEMPLO COMPLETO: ATIVAR E RENOVAR
-- ============================================
-- Exemplo prático: Ativar usuário por 1 ano

UPDATE users
SET 
  plan = 'alpha',
  plan_expires_at = NOW() + INTERVAL '365 days',
  activated_by_code = 'MANUAL_ANUAL_' || NOW()::text,
  updated_at = NOW()
WHERE email = 'user@example.com';

-- Verificar se foi atualizado
SELECT 
  email,
  plan,
  plan_expires_at,
  EXTRACT(DAY FROM (plan_expires_at - NOW())) as dias_restantes
FROM users
WHERE email = 'user@example.com';
