-- ============================================================================
-- Script SQL para marcar pagamento como realizado e ajustar plano para anual
-- ============================================================================
-- 
-- INSTRUÇÕES DE USO:
-- 
-- OPÇÃO 1: Por subscription_id (RECOMENDADO - mais preciso)
--   1. Substitua 'SUBSCRIPTION_ID_AQUI' pelo ID da subscription (uuid)
--   2. Execute todo o script
--
-- OPÇÃO 2: Por email do usuário
--   1. Substitua 'SEU_EMAIL_AQUI' pelo email do usuário
--   2. Descomente a seção "OPÇÃO 2" e comente a "OPÇÃO 1"
--   3. Execute todo o script
--
-- IMPORTANTE: Este script cria uma transação. Se algo der errado, 
-- execute ROLLBACK; antes de COMMIT;
-- ============================================================================

BEGIN;

-- ============================================================================
-- CONFIGURAÇÃO: Escolha UMA das opções abaixo
-- ============================================================================

-- OPÇÃO 1: Por subscription_id (mais preciso)
DO $$
DECLARE
  v_subscription_id UUID := 'SUBSCRIPTION_ID_AQUI'::uuid; -- SUBSTITUIR AQUI
  v_user_id TEXT;
  v_subscription RECORD;
  v_payment_request_id UUID;
  v_plan_name TEXT;
  v_period_start TIMESTAMP;
  v_period_end TIMESTAMP;
BEGIN
  -- Buscar subscription
  SELECT * INTO v_subscription
  FROM subscriptions
  WHERE id = v_subscription_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Subscription não encontrada com ID: %', v_subscription_id;
  END IF;
  
  v_user_id := v_subscription.user_id;
  v_period_start := NOW();
  v_period_end := NOW() + INTERVAL '365 days';
  
  -- Buscar nome do plano
  SELECT name INTO v_plan_name
  FROM plans
  WHERE id = v_subscription.plan_id;
  
  -- Buscar payment_request pendente (se existir)
  SELECT id INTO v_payment_request_id
  FROM payment_requests
  WHERE subscription_id = v_subscription_id
    AND status = 'pending'
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- 1. Atualizar payment_request (se existir)
  IF v_payment_request_id IS NOT NULL THEN
    UPDATE payment_requests
    SET 
      status = 'paid',
      paid_at = v_period_start,
      updated_at = v_period_start
    WHERE id = v_payment_request_id;
  END IF;
  
  -- 2. Criar registro de pagamento no histórico
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
  ) VALUES (
    v_subscription_id,
    v_payment_request_id,
    v_subscription.amount,
    COALESCE(v_subscription.payment_method, 'pix'),
    'succeeded',
    v_period_start,
    v_period_end,
    v_period_start,
    v_period_start,
    v_period_start
  );
  
  -- 3. Atualizar subscription para plano anual e marcar como pago
  UPDATE subscriptions
  SET 
    plan_type = 'anual',
    status = 'active',
    payment_status = 'paid',
    current_period_start = v_period_start,
    current_period_end = v_period_end,
    updated_at = v_period_start
  WHERE id = v_subscription_id;
  
  -- 4. Atualizar user
  UPDATE users
  SET 
    plan = v_plan_name,
    plan_expires_at = v_period_end,
    updated_at = v_period_start
  WHERE id = v_user_id;
  
  RAISE NOTICE '✅ Pagamento aprovado e plano ajustado para anual';
  RAISE NOTICE 'Subscription ID: %', v_subscription_id;
  RAISE NOTICE 'User ID: %', v_user_id;
  RAISE NOTICE 'Plano: %', v_plan_name;
  RAISE NOTICE 'Período: % até %', v_period_start, v_period_end;
END $$;

-- OPÇÃO 2: Por email do usuário (descomente e comente a OPÇÃO 1 acima)
-- DO $$
-- DECLARE
--   v_user_email TEXT := 'SEU_EMAIL_AQUI'; -- SUBSTITUIR AQUI
--   v_user_id TEXT;
--   v_subscription RECORD;
--   v_payment_request_id UUID;
--   v_plan_name TEXT;
--   v_period_start TIMESTAMP;
--   v_period_end TIMESTAMP;
-- BEGIN
--   -- Buscar user_id
--   SELECT id INTO v_user_id
--   FROM users
--   WHERE email = v_user_email;
--   
--   IF NOT FOUND THEN
--     RAISE EXCEPTION 'Usuário não encontrado com email: %', v_user_email;
--   END IF;
--   
--   -- Buscar subscription mais recente do usuário
--   SELECT * INTO v_subscription
--   FROM subscriptions
--   WHERE user_id = v_user_id
--   ORDER BY created_at DESC
--   LIMIT 1;
--   
--   IF NOT FOUND THEN
--     RAISE EXCEPTION 'Nenhuma subscription encontrada para o usuário: %', v_user_email;
--   END IF;
--   
--   v_period_start := NOW();
--   v_period_end := NOW() + INTERVAL '365 days';
--   
--   -- Buscar nome do plano
--   SELECT name INTO v_plan_name
--   FROM plans
--   WHERE id = v_subscription.plan_id;
--   
--   -- Buscar payment_request pendente (se existir)
--   SELECT id INTO v_payment_request_id
--   FROM payment_requests
--   WHERE subscription_id = v_subscription.id
--     AND status = 'pending'
--   ORDER BY created_at DESC
--   LIMIT 1;
--   
--   -- 1. Atualizar payment_request (se existir)
--   IF v_payment_request_id IS NOT NULL THEN
--     UPDATE payment_requests
--     SET 
--       status = 'paid',
--       paid_at = v_period_start,
--       updated_at = v_period_start
--     WHERE id = v_payment_request_id;
--   END IF;
--   
--   -- 2. Criar registro de pagamento no histórico
--   INSERT INTO payments (
--     subscription_id,
--     payment_request_id,
--     amount,
--     payment_method,
--     status,
--     period_start,
--     period_end,
--     paid_at,
--     created_at,
--     updated_at
--   ) VALUES (
--     v_subscription.id,
--     v_payment_request_id,
--     v_subscription.amount,
--     COALESCE(v_subscription.payment_method, 'pix'),
--     'succeeded',
--     v_period_start,
--     v_period_end,
--     v_period_start,
--     v_period_start,
--     v_period_start
--   );
--   
--   -- 3. Atualizar subscription para plano anual e marcar como pago
--   UPDATE subscriptions
--   SET 
--     plan_type = 'anual',
--     status = 'active',
--     payment_status = 'paid',
--     current_period_start = v_period_start,
--     current_period_end = v_period_end,
--     updated_at = v_period_start
--   WHERE id = v_subscription.id;
--   
--   -- 4. Atualizar user
--   UPDATE users
--   SET 
--     plan = v_plan_name,
--     plan_expires_at = v_period_end,
--     updated_at = v_period_start
--   WHERE id = v_user_id;
--   
--   RAISE NOTICE '✅ Pagamento aprovado e plano ajustado para anual';
--   RAISE NOTICE 'User Email: %', v_user_email;
--   RAISE NOTICE 'Subscription ID: %', v_subscription.id;
--   RAISE NOTICE 'Plano: %', v_plan_name;
--   RAISE NOTICE 'Período: % até %', v_period_start, v_period_end;
-- END $$;

-- ============================================================================
-- VERIFICAÇÃO (opcional - descomente para verificar os resultados)
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
--   s.amount,
--   (SELECT COUNT(*) FROM payments WHERE subscription_id = s.id) as total_payments
-- FROM subscriptions s
-- INNER JOIN users u ON s.user_id = u.id
-- WHERE s.id = 'SUBSCRIPTION_ID_AQUI'::uuid; -- SUBSTITUIR com o mesmo ID usado acima
-- ============================================================================

COMMIT;

-- ============================================================================
-- IMPORTANTE: Se algo der errado, execute ROLLBACK antes do COMMIT
-- ============================================================================
-- ROLLBACK;

