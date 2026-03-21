# REL-006: Central de Relatórios (Hub)

**Tipo:** Story | **Prioridade:** Média | **Sprint:** 4

**User Story:**  
Como usuário, quero acessar todos os relatórios disponíveis em uma central organizada, com histórico dos últimos relatórios gerados, para não precisar configurar os mesmos filtros repetidamente.

**Critérios de Aceite:**
- [ ] Página `/relatorios` com cards de cada tipo de relatório disponível
- [ ] Cada card mostra: nome, descrição, ícone, última vez gerado (por este usuário)
- [ ] Histórico dos últimos 10 relatórios gerados com link para download do arquivo
- [ ] Relatórios "favoritos" fixados no topo
- [ ] Controle de acesso: relatórios financeiros visíveis apenas para roles ADMIN e FINANCEIRO

**Refinamento Técnico:**
- **DB:** Tabela `ReportHistory` (id, tenant_id, user_id, report_type, filters_json, generated_at, file_url, file_type: PDF|XLSX)
- **Storage:** Bucket `reports/{tenant_id}/` com TTL de 30 dias para arquivos gerados
- **RBAC:** Middleware verificando `user.role` antes de renderizar cards de relatórios restritos

---

# EPIC-VAC — MÓDULO DE VACINAS

> Baseado na especificação NetVacinas. Controle de estoque por lote/validade, carteirinha digital do paciente, motor de regras de calendário vacinal, integração RNDS/SIPNI, NFSe e lembretes WhatsApp.

---
