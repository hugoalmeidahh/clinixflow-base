# FIN-001: Plano de Contas e Centro de Custo

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 1

**User Story:**  
Como administrador da clínica, quero configurar o plano de contas (categorias de receita e despesa) e os centros de custo, para que todas as movimentações financeiras sejam classificadas corretamente desde o lançamento.

**Critérios de Aceite:**
- [ ] CRUD completo de Categorias financeiras com tipo (RECEITA / DESPESA)
- [ ] Suporte a subcategorias (ex: Receita > Consultas > Particular / Convênio)
- [ ] CRUD completo de Centros de Custo com código alfanumérico único por tenant
- [ ] Toda movimentação financeira deve obrigatoriamente ter categoria e, opcionalmente, centro de custo
- [ ] Inativação de categoria não deve apagar histórico — apenas impede novos lançamentos
- [ ] Listagem filtrada por tipo, status (ativo/inativo) e busca textual

**Refinamento Técnico:**
- **DB:** Tabelas `FinancialCategory` (id, tenant_id, name, type: INCOME|EXPENSE, parent_id nullable, is_active) e `CostCenter` (id, tenant_id, code, name, is_active)
- **Backend:** Server Actions para CRUD; validar unicidade de `code` do centro de custo por tenant; soft-delete via `is_active`
- **Frontend:** Tela em Settings → Financeiro; árvore de categorias com expand/collapse; formulário inline de criação rápida

---
