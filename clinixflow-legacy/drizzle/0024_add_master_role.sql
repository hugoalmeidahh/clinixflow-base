-- Adicionar role 'master' ao enum user_role
-- Execute este script para adicionar o role master ao sistema

-- PostgreSQL não permite adicionar valores ao enum diretamente em uma transação
-- Se o valor já existir, o comando será ignorado
DO $$ 
BEGIN
  -- Tentar adicionar 'master' ao enum
  -- Se já existir, será ignorado
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'master' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
  ) THEN
    ALTER TYPE user_role ADD VALUE 'master';
  END IF;
END $$;

-- Para tornar um usuário master, execute:
-- UPDATE users SET role = 'master' WHERE email = 'seu-email@example.com';
