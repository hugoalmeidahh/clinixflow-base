-- Tornar o campo attended nullable para distinguir entre:
-- null = não verificado ainda
-- true = paciente compareceu
-- false = paciente faltou

ALTER TABLE "appointments" ALTER COLUMN "attended" DROP NOT NULL;
ALTER TABLE "appointments" ALTER COLUMN "attended" DROP DEFAULT;

-- Atualizar registros existentes: manter os que já têm valor definido
-- (não há como saber quais foram explicitamente marcados, então mantemos como estão)
