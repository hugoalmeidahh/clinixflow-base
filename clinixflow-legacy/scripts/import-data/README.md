# Scripts de Importação de Dados

Este diretório contém scripts SQL para importar dados históricos do CSV para o banco de dados.

## 📋 Arquivos Gerados

1. **01_import_doctors.sql** - Importa profissionais únicos (8 profissionais)
2. **02_import_patients.sql** - Importa pacientes únicos (128 pacientes)
3. **03_import_appointments.sql** - Importa agendamentos (875 agendamentos)
4. **04_import_patient_records.sql** - Importa evoluções (apenas para pacientes que compareceram)

## ⚠️ IMPORTANTE: Antes de Executar

**Você DEVE substituir os seguintes valores em TODOS os scripts:**

1. `CLINIC_ID_AQUI` → Substituir pelo UUID real da clínica
2. `USER_ID_AQUI` → Substituir pelo ID do usuário que está importando

### Como encontrar os IDs:

```sql
-- Encontrar o ID da clínica
SELECT id, name FROM clinics WHERE name = 'Nome da Clínica';

-- Encontrar o ID do usuário
SELECT id, name, email FROM users WHERE email = 'seu-email@exemplo.com';
```

## 📝 Ordem de Execução

**Execute os scripts nesta ordem exata:**

```bash
# 1. Primeiro, importar profissionais
psql $DATABASE_URL -f 01_import_doctors.sql

# 2. Depois, importar pacientes
psql $DATABASE_URL -f 02_import_patients.sql

# 3. Em seguida, importar agendamentos
psql $DATABASE_URL -f 03_import_appointments.sql

# 4. Por último, importar evoluções
psql $DATABASE_URL -f 04_import_patient_records.sql
```

## 📊 Estatísticas da Importação

- **Profissionais únicos:** 8
- **Pacientes únicos:** 128
- **Agendamentos:** 875
- **Evoluções:** Apenas para pacientes que compareceram (attended = true)

## 🔍 Validações e Ajustes Necessários

### Profissionais
- ✅ Nomes normalizados
- ⚠️ Telefones padrão: `(12) 00000-0000` - **Atualizar depois**
- ⚠️ CRFa padrão: `000000` - **Atualizar depois**
- ✅ Especialidade: "Terapia Ocupacional" (assumida para todos)

### Pacientes
- ✅ Nomes normalizados
- ⚠️ Sexo: Assumido como "male" - **Revisar e ajustar se necessário**
- ⚠️ Endereços padrão: "Endereço não informado" - **Atualizar depois**
- ⚠️ CPF/RG padrão: `00000000000` / `000000000` - **Atualizar depois**
- ✅ Convênios mapeados (Santa Casa, Particular, etc.)

### Agendamentos
- ✅ Datas e horários convertidos corretamente
- ✅ Duração em minutos calculada
- ✅ Valores convertidos para centavos
- ✅ Presença mapeada (SIM → attended=true, JUSTIFICADO → attended=false com justificativa)

### Evoluções
- ✅ Apenas para pacientes que compareceram
- ✅ Primeira consulta identificada automaticamente
- ✅ Conteúdo de avaliação e evolução preservado

## 🛠️ Comandos Úteis

### Verificar importação de profissionais:
```sql
SELECT COUNT(*) FROM doctors WHERE clinic_id = 'SEU_CLINIC_ID';
```

### Verificar importação de pacientes:
```sql
SELECT COUNT(*) FROM patients WHERE clinic_id = 'SEU_CLINIC_ID';
```

### Verificar importação de agendamentos:
```sql
SELECT COUNT(*) FROM appointments WHERE clinic_id = 'SEU_CLINIC_ID';
```

### Verificar importação de evoluções:
```sql
SELECT COUNT(*) FROM patient_records WHERE clinic_id = 'SEU_CLINIC_ID';
```

## ⚡ Dicas

1. **Backup:** Faça backup do banco antes de executar os scripts
2. **Teste:** Execute primeiro em um banco de teste
3. **Validação:** Após importar, valide os dados manualmente
4. **Ajustes:** Alguns campos têm valores padrão que precisam ser atualizados depois

## 🐛 Problemas Comuns

### Erro: "column does not exist"
- Verifique se todas as migrations foram executadas
- Execute: `npm run db:migrate:sql`

### Erro: "foreign key constraint"
- Verifique se executou os scripts na ordem correta
- Verifique se os IDs de clínica e usuário estão corretos

### Dados duplicados
- Os scripts usam `ON CONFLICT DO NOTHING` para evitar duplicatas
- Se precisar reimportar, delete os dados antigos primeiro
