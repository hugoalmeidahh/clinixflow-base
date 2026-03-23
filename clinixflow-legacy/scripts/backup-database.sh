#!/bin/bash

# Script para fazer backup do banco de dados PostgreSQL
# Uso: ./scripts/backup-database.sh [opções]
#
# Opções:
#   -o, --output DIR    Diretório onde salvar o backup (padrão: ./backups)
#   -f, --format FORMAT Formato do backup: custom, plain, tar (padrão: custom)
#   -h, --help          Mostra esta ajuda

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Valores padrão
OUTPUT_DIR="./backups"
FORMAT="custom"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Parse argumentos
while [[ $# -gt 0 ]]; do
  case $1 in
    -o|--output)
      OUTPUT_DIR="$2"
      shift 2
      ;;
    -f|--format)
      FORMAT="$2"
      shift 2
      ;;
    -h|--help)
      echo "Uso: ./scripts/backup-database.sh [opções]"
      echo ""
      echo "Opções:"
      echo "  -o, --output DIR    Diretório onde salvar o backup (padrão: ./backups)"
      echo "  -f, --format FORMAT Formato do backup: custom, plain, tar (padrão: custom)"
      echo "  -h, --help          Mostra esta ajuda"
      exit 0
      ;;
    *)
      echo -e "${RED}❌ Opção desconhecida: $1${NC}"
      exit 1
      ;;
  esac
done

# Verificar se DATABASE_URL está definida
if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}❌ DATABASE_URL não está definida${NC}"
  echo "Defina a variável de ambiente ou use: DATABASE_URL=... ./scripts/backup-database.sh"
  exit 1
fi

# Verificar se pg_dump está instalado
if ! command -v pg_dump &> /dev/null; then
  echo -e "${RED}❌ pg_dump não está instalado${NC}"
  echo "Instale o PostgreSQL client tools:"
  echo "  macOS: brew install postgresql"
  echo "  Ubuntu/Debian: sudo apt-get install postgresql-client"
  echo "  Windows: Instale PostgreSQL do site oficial"
  exit 1
fi

# Criar diretório de backup se não existir
mkdir -p "$OUTPUT_DIR"

# Extrair nome do banco da URL
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')
BACKUP_FILE="$OUTPUT_DIR/backup_${DB_NAME}_${TIMESTAMP}"

# Definir extensão baseada no formato
case $FORMAT in
  custom)
    BACKUP_FILE="${BACKUP_FILE}.dump"
    DUMP_OPTIONS="-Fc"
    ;;
  plain)
    BACKUP_FILE="${BACKUP_FILE}.sql"
    DUMP_OPTIONS="-Fp"
    ;;
  tar)
    BACKUP_FILE="${BACKUP_FILE}.tar"
    DUMP_OPTIONS="-Ft"
    ;;
  *)
    echo -e "${RED}❌ Formato inválido: $FORMAT${NC}"
    echo "Formatos válidos: custom, plain, tar"
    exit 1
    ;;
esac

echo -e "${YELLOW}🔄 Iniciando backup do banco de dados...${NC}"
echo "📁 Diretório: $OUTPUT_DIR"
echo "📄 Arquivo: $(basename $BACKUP_FILE)"
echo "🔧 Formato: $FORMAT"
echo ""

# Executar backup
if pg_dump "$DATABASE_URL" $DUMP_OPTIONS -f "$BACKUP_FILE"; then
  # Obter tamanho do arquivo
  FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  
  echo ""
  echo -e "${GREEN}✅ Backup criado com sucesso!${NC}"
  echo "📦 Arquivo: $BACKUP_FILE"
  echo "📊 Tamanho: $FILE_SIZE"
  echo ""
  echo "💡 Para restaurar, use:"
  echo "   ./scripts/restore-database.sh $BACKUP_FILE"
else
  echo ""
  echo -e "${RED}❌ Erro ao criar backup${NC}"
  exit 1
fi
