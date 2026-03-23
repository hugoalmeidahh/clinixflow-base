# 📦 Scripts de Backup e Restauração do Banco de Dados

Este documento descreve como fazer backup e restaurar o banco de dados PostgreSQL do ClinixFlow.

## 📋 Pré-requisitos

### Instalar PostgreSQL Client Tools

**macOS:**
```bash
brew install postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql-client
```

**Windows:**
Baixe e instale o PostgreSQL do site oficial: https://www.postgresql.org/download/windows/

### Variável de Ambiente

Certifique-se de que a variável `DATABASE_URL` está definida no arquivo `.env`:

```bash
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

## 🚀 Fazer Backup

### Opção 1: Script Shell (Recomendado)

```bash
# Backup simples (formato custom comprimido)
./scripts/backup-database.sh

# Backup em diretório específico
./scripts/backup-database.sh --output ./my-backups

# Backup em formato SQL (texto legível)
./scripts/backup-database.sh --format plain

# Backup em formato tar
./scripts/backup-database.sh --format tar

# Ver todas as opções
./scripts/backup-database.sh --help
```

### Opção 2: Script TypeScript

```bash
# Backup simples
npx tsx scripts/backup-database.ts

# Backup com opções
npx tsx scripts/backup-database.ts --output ./my-backups --format plain

# Backup com verbose
npx tsx scripts/backup-database.ts --verbose
```

### Opção 3: Comando Direto (pg_dump)

```bash
# Formato custom (binário comprimido - recomendado)
pg_dump "$DATABASE_URL" -Fc -f backups/backup_$(date +%Y%m%d_%H%M%S).dump

# Formato SQL (texto legível)
pg_dump "$DATABASE_URL" -Fp -f backups/backup_$(date +%Y%m%d_%H%M%S).sql

# Formato tar
pg_dump "$DATABASE_URL" -Ft -f backups/backup_$(date +%Y%m%d_%H%M%S).tar
```

### Opção 4: Via npm Script

```bash
# Backup simples
npm run db:backup

# Backup com formato específico
npm run db:backup -- --format plain
```

## 🔄 Restaurar Backup

### Opção 1: Script Shell

```bash
# Restaurar backup
./scripts/restore-database.sh backups/backup_neondb_20250123_120000.dump

# Restaurar com limpeza (DROP/CREATE)
./scripts/restore-database.sh backups/backup.dump --clean

# Restaurar com IF EXISTS (mais seguro)
./scripts/restore-database.sh backups/backup.dump --clean --if-exists
```

### Opção 2: Script TypeScript

```bash
# Restaurar backup
npx tsx scripts/restore-database.ts backups/backup.dump

# Restaurar com opções
npx tsx scripts/restore-database.ts backups/backup.dump --clean --if-exists
```

### Opção 3: Comando Direto

```bash
# Formato custom/tar
pg_restore -d "$DATABASE_URL" backups/backup.dump

# Formato custom com limpeza
pg_restore -d "$DATABASE_URL" --clean --if-exists backups/backup.dump

# Formato SQL
psql "$DATABASE_URL" -f backups/backup.sql
```

## 📊 Formatos de Backup

### Custom (`.dump`) - **Recomendado**
- ✅ Formato binário comprimido
- ✅ Mais rápido para backup/restore
- ✅ Menor tamanho de arquivo
- ✅ Suporta restauração seletiva
- ❌ Não é legível como texto

### Plain (`.sql`) - **Para leitura**
- ✅ Formato SQL texto legível
- ✅ Pode ser editado manualmente
- ✅ Compatível com qualquer cliente SQL
- ❌ Arquivos maiores
- ❌ Mais lento para backup/restore

### Tar (`.tar`)
- ✅ Formato intermediário
- ✅ Pode ser extraído como arquivo tar
- ⚠️ Menos comum, use custom ou plain

## 📁 Estrutura de Diretórios

Os backups são salvos por padrão em `./backups/`:

```
backups/
├── backup_neondb_20250123_120000.dump
├── backup_neondb_20250123_130000.sql
└── backup_neondb_20250123_140000.tar
```

## 🔐 Segurança

### ⚠️ Importante

1. **Nunca commite backups** no repositório Git
2. **Mantenha backups seguros** - eles contêm dados sensíveis
3. **Use backups locais** para desenvolvimento
4. **Use backups remotos** (S3, Google Cloud Storage, etc.) para produção
5. **Criptografe backups** se contiverem dados sensíveis

### Adicionar ao .gitignore

Certifique-se de que a pasta de backups está no `.gitignore`:

```gitignore
# Backups
backups/
*.dump
*.sql.backup
```

## 🤖 Automação

### Backup Automático Diário (cron)

**macOS/Linux:**

```bash
# Editar crontab
crontab -e

# Adicionar linha para backup diário às 2h da manhã
0 2 * * * cd /path/to/clinixflow-app && ./scripts/backup-database.sh --output /path/to/backups
```

### Backup Automático com Retenção

Crie um script que mantém apenas os últimos N backups:

```bash
#!/bin/bash
# scripts/backup-with-retention.sh

BACKUP_DIR="./backups"
RETENTION_DAYS=7

# Criar backup
./scripts/backup-database.sh --output "$BACKUP_DIR"

# Remover backups antigos (mais de 7 dias)
find "$BACKUP_DIR" -name "backup_*.dump" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "backup_*.sql" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "backup_*.tar" -mtime +$RETENTION_DAYS -delete

echo "✅ Backup criado e backups antigos removidos"
```

## 📝 Exemplos de Uso

### Backup antes de migration

```bash
# 1. Fazer backup
./scripts/backup-database.sh --output ./backups/pre-migration

# 2. Executar migration
npm run db:migrate:sql

# 3. Se algo der errado, restaurar
./scripts/restore-database.sh ./backups/pre-migration/backup_*.dump
```

### Backup antes de deploy

```bash
# Criar backup com timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
./scripts/backup-database.sh --output "./backups/pre-deploy-$TIMESTAMP"
```

### Backup de produção

```bash
# Usar formato custom para menor tamanho
./scripts/backup-database.sh --format custom --output ./backups/production

# Ou fazer backup direto para S3 (exemplo)
pg_dump "$DATABASE_URL" -Fc | aws s3 cp - s3://my-bucket/backups/backup_$(date +%Y%m%d_%H%M%S).dump
```

## 🐛 Troubleshooting

### Erro: "pg_dump não está instalado"

Instale o PostgreSQL client tools (veja Pré-requisitos acima).

### Erro: "DATABASE_URL não está definida"

Certifique-se de que o arquivo `.env` existe e contém a variável `DATABASE_URL`.

### Erro: "permission denied" ao restaurar

Alguns objetos podem ter permissões restritas. Use `--clean --if-exists`:

```bash
./scripts/restore-database.sh backup.dump --clean --if-exists
```

### Backup muito grande

Use o formato `custom` com compressão (padrão):

```bash
./scripts/backup-database.sh --format custom
```

Ou faça backup apenas de tabelas específicas:

```bash
pg_dump "$DATABASE_URL" -t table_name -Fc -f backup_table.dump
```

## 📚 Referências

- [PostgreSQL Backup Documentation](https://www.postgresql.org/docs/current/backup.html)
- [pg_dump Documentation](https://www.postgresql.org/docs/current/app-pgdump.html)
- [pg_restore Documentation](https://www.postgresql.org/docs/current/app-pgrestore.html)
