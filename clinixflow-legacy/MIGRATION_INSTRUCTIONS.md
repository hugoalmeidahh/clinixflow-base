# 🚨 INSTRUÇÕES PARA EXECUTAR A MIGRATION

## Problema
O banco de dados está tentando buscar colunas que ainda não existem:
- `person_type`
- `document` 
- `access_type`
- Tabela `doctor_specialties`
- Campo `doctor_specialty_id` em `appointments`

## Solução

Execute a migration SQL manualmente ou usando o comando:

### Opção 1: Usando drizzle-kit push (Recomendado)
```bash
npm run db:migrate
```

### Opção 2: Executando o SQL diretamente
```bash
npm run db:migrate:sql
```

### Opção 3: Executar SQL manualmente
Conecte-se ao seu banco de dados PostgreSQL e execute o arquivo:
```
drizzle/0017_add_doctor_specialties_and_restructure_doctors.sql
```

## O que a migration faz:

1. ✅ Cria o enum `person_type` (physical, legal)
2. ✅ Cria a tabela `doctor_specialties` 
3. ✅ Adiciona campos `person_type`, `document`, `access_type` na tabela `doctors`
4. ✅ Migra dados existentes de CPF/CNPJ para `document`
5. ✅ Adiciona campo `doctor_specialty_id` na tabela `appointments`
6. ✅ Migra especialidades existentes para a nova tabela

## Após executar a migration:

O erro deve desaparecer e o sistema funcionará normalmente com:
- ✅ Seleção de perfil do usuário
- ✅ Especialidades múltiplas (apenas para perfil "Doutor")
- ✅ Documentos unificados (CPF/CNPJ em um único campo)
- ✅ Tipo de acesso (código ou email)
