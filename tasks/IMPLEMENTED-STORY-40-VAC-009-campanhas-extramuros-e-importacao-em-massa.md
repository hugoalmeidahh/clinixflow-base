# VAC-009: Campanhas Extramuros e Importação em Massa

**Tipo:** Story | **Prioridade:** Média | **Sprint:** 4

**User Story:**  
Como coordenador de campanhas, quero importar planilhas de aplicações realizadas em campanhas externas (empresas, escolas), para registrar em massa sem digitação manual.

**Critérios de Aceite:**
- [ ] Download do modelo de planilha (CSV/XLSX) com colunas obrigatórias
- [ ] Upload de planilha preenchida
- [ ] Validação prévia: exibir preview das linhas, destacar erros (paciente não encontrado, vacina inválida, lote vencido)
- [ ] Confirmação antes de importar: "X linhas válidas serão importadas, Y linhas com erro serão ignoradas"
- [ ] Processamento assíncrono para planilhas grandes (> 100 linhas)
- [ ] Relatório de resultado: linhas importadas com sucesso, linhas com erro e motivo

**Refinamento Técnico:**
- **Backend:** Parser CSV/XLSX com `xlsx` (SheetJS); validação linha a linha contra regras de negócio; `BulkInsert` via Prisma `createMany()` em chunks de 100
- **Job assíncrono:** Para arquivos > 100 linhas, processar em background com pg-boss; notificar usuário por e-mail ao concluir
- **DB:** Tabela `ImportJob` (id, tenant_id, status, total_rows, success_rows, error_rows, result_json, created_by, created_at)

---
