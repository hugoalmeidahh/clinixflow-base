#!/bin/bash

# Script para restaurar backup do banco de dados PostgreSQL
# Uso: ./scripts/restore-database.sh <arquivo_backup> [opções]
#
# Opções:
#   --clean          Limpa objetos antes de restaurar (DROP/CREATE)
#   --if-exists      Usa IF EXISTS ao limpar (mais seguro)
#   -h, --help       Mostra esta ajuda

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse argumentos
CLEAN=false
IF_EXISTS=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --clean)
      CLEAN=true
      shift
      ;;
    --if-exists)
      IF_EXISTS=true
      shift
      ;;
    -h|--help)
      echo "Uso: ./scripts/restore-database.sh <arquivo_backup> [opções]"
      echo ""
      echo "Opções:"
      echo "  --clean          Limpa objetos antes de restaurar (DROP/CREATE)"
      echo "  --if-exists      Usa IF EXISTS ao limpar (mais seguro)"
      echo "  -h, --help       Mostra esta ajuda"
      echo ""
      echo "Exemplos:"
      echo "  ./scripts/restore-database.sh backups/backup_neondb_20250123_120000.dump"
      echo "  ./scripts/restore-database.sh backups/backup_neondb_20250123_120000.sql --clean"
      exit 0
      ;;
    -*)
      echo -e "${RED}❌ Opção desconhecida: $1${NC}"
      exit 1
      ;;
    *)
      BACKUP_FILE="$1"
      shift
      ;;
  esac
done

# Verificar se arquivo foi fornecido
if [ -z "$BACKUP_FILE" ]; then
  echo -e "${RED}❌ Arquivo de backup não especificado${NC}"
  echo "Uso: ./scripts/restore-database.sh <arquivo_backup>"
  exit 1
fi

# Verificar se arquivo existe
if [ ! -f "$BACKUP_FILE" ]; then
  echo -e "${RED}❌ Arquivo não encontrado: $BACKUP_FILE${NC}"
  exit 1
fi

# Verificar se DATABASE_URL está definida
if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}❌ DATABASE_URL não está definida${NC}"
  echo "Defina a variável de ambiente ou use: DATABASE_URL=... ./scripts/restore-database.sh"
  exit 1
fi

# Verificar se pg_restore ou psql está instalado
if [[ "$BACKUP_FILE" == *.dump ]] || [[ "$BACKUP_FILE" == *.tar ]]; then
  if ! command -v pg_restore &> /dev/null; then
    echo -e "${RED}❌ pg_restore não está instalado${NC}"
    exit 1
  fi
  RESTORE_CMD="pg_restore"
else
  if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ psql não está instalado${NC}"
    exit 1
  fi
  RESTORE_CMD="psql"
fi

# Confirmar restauração
echo -e "${YELLOW}⚠️  ATENÇÃO: Esta operação irá sobrescrever dados no banco!${NC}"
echo "📁 Arquivo: $BACKUP_FILE"
echo "🗄️  Banco: $(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')"
echo ""
read -p "Tem certeza que deseja continuar? (digite 'sim' para confirmar): " CONFIRM

if [ "$CONFIRM" != "sim" ]; then
  echo -e "${YELLOW}❌ Restauração cancelada${NC}"
  exit 0
fi

echo ""
echo -e "${YELLOW}🔄 Iniciando restauração...${NC}"

# Preparar opções de restore
RESTORE_OPTIONS=""

if [ "$CLEAN" = true ]; then
  RESTORE_OPTIONS="$RESTORE_OPTIONS --clean"
fi

if [ "$IF_EXISTS" = true ]; then
  RESTORE_OPTIONS="$RESTORE_OPTIONS --if-exists"
fi

# Executar restauração
if [[ "$BACKUP_FILE" == *.dump ]]; then
  # Formato custom
  if pg_restore -d "$DATABASE_URL" $RESTORE_OPTIONS "$BACKUP_FILE"; then
    echo ""
    echo -e "${GREEN}✅ Backup restaurado com sucesso!${NC}"
  else
    echo ""
    echo -e "${RED}❌ Erro ao restaurar backup${NC}"
    exit 1
  fi
elif [[ "$BACKUP_FILE" == *.tar ]]; then
  # Formato tar
  if pg_restore -d "$DATABASE_URL" $RESTORE_OPTIONS "$BACKUP_FILE"; then
    echo ""
    echo -e "${GREEN}✅ Backup restaurado com sucesso!${NC}"
  else
    echo ""
    echo -e "${RED}❌ Erro ao restaurar backup${NC}"
    exit 1
  fi
else
  # Formato SQL (plain)
  if [ "$CLEAN" = true ]; then
    echo -e "${YELLOW}⚠️  Opção --clean não é suportada para backups SQL${NC}"
  fi
  if psql "$DATABASE_URL" -f "$BACKUP_FILE"; then
    echo ""
    echo -e "${GREEN}✅ Backup restaurado com sucesso!${NC}"
  else
    echo ""
    echo -e "${RED}❌ Erro ao restaurar backup${NC}"
    exit 1
  fi
fi
