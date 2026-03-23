#!/bin/bash

# Script para executar migrations SQL diretamente no banco
# Uso: ./scripts/run-migrations-sql.sh

if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL não está definida"
  echo "Defina a variável de ambiente ou use: DATABASE_URL=... ./scripts/run-migrations-sql.sh"
  exit 1
fi

echo "🚀 Executando migrations SQL..."

# Executar migrations em ordem
echo "📄 Executando migration: 0011_add_subscriptions_tables.sql"
psql "$DATABASE_URL" -f drizzle/0011_add_subscriptions_tables.sql

if [ $? -eq 0 ]; then
  echo "✅ Migration 0011 executada com sucesso!"
else
  echo "❌ Erro ao executar migration 0011"
  exit 1
fi

echo "📄 Executando migration: 0012_add_subscription_id_to_activation_codes.sql"
psql "$DATABASE_URL" -f drizzle/0012_add_subscription_id_to_activation_codes.sql

if [ $? -eq 0 ]; then
  echo "✅ Migration 0012 executada com sucesso!"
else
  echo "❌ Erro ao executar migration 0012"
  exit 1
fi

echo "🎉 Todas as migrations foram executadas!"

