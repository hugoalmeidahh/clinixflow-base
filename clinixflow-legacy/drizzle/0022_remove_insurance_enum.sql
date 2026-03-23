-- Migration: Remover enum insurance após migração completa
-- ATENÇÃO: Execute esta migration APENAS após confirmar que todos os dados foram migrados
-- e que a aplicação está funcionando corretamente com a nova estrutura

-- 1. Remover a coluna antiga do enum (manter por enquanto para rollback se necessário)
-- ALTER TABLE "patients" DROP COLUMN IF EXISTS "insurance";

-- 2. Remover o enum (comentar por enquanto para segurança)
-- DROP TYPE IF EXISTS "insurance";

-- NOTA: Descomente as linhas acima apenas quando tiver certeza de que:
-- - Todos os dados foram migrados corretamente
-- - A aplicação está funcionando com insurance_id
-- - Não há necessidade de rollback
