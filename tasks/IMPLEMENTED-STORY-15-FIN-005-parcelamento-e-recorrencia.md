# FIN-005: Parcelamento e Recorrência

**Tipo:** Story | **Prioridade:** Média | **Sprint:** 3

**User Story:**  
Como financeiro, quero lançar uma despesa ou receita parcelada ou recorrente, para que o sistema gere automaticamente as parcelas futuras sem necessidade de lançamento manual repetido.

**Critérios de Aceite:**
- [ ] Ao criar lançamento, opção de: Parcelado (N parcelas) ou Recorrente (semanal/mensal/anual)
- [ ] Sistema gera todas as parcelas automaticamente com datas calculadas
- [ ] Cada parcela é um `FinancialEntry` independente; ao baixar uma parcela, as demais não são afetadas
- [ ] Parcelas vinculadas por `installment_group_id` para rastreabilidade
- [ ] Cancelar o grupo cancela todas as parcelas PENDENTES (as PAGAS permanecem)

**Refinamento Técnico:**
- **DB:** Campo `installment_group_id` (UUID) e `installment_number` / `installment_total` em `FinancialEntry`
- **Backend:** `createInstallmentGroup()` que gera N entradas em transação atômica; `cancelInstallmentGroup()` com soft-cancel apenas nas PENDENTES
- **Frontend:** Formulário com toggle "Parcelado / Recorrente" que expande campos adicionais; preview das parcelas antes de confirmar

---
