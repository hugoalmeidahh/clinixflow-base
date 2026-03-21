# REL-003: Relatório Financeiro Gerencial

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 3

**User Story:**  
Como gestor financeiro, quero relatórios financeiros comparativos por período, categoria e centro de custo, para análise de DRE simplificado e tendências.

**Critérios de Aceite:**
- [ ] DRE simplificado: Receitas brutas, Deduções, Receita líquida, Despesas por categoria, Resultado do período
- [ ] Comparativo mês atual vs mês anterior e vs mesmo mês do ano anterior
- [ ] Breakdown por categoria de receita e despesa (top 10 cada)
- [ ] Filtro por centro de custo, período, categoria
- [ ] Gráfico de barras empilhadas: Receitas vs Despesas por mês
- [ ] Exportação PDF (DRE formatado) e XLSX (dados brutos)

**Refinamento Técnico:**
- **DB:** Queries com `GROUP BY category_id, EXTRACT(month FROM payment_date)` e subqueries para comparativos
- **Frontend:** Tabela de DRE com linhas hierárquicas (categoria pai > subcategorias); valores negativos em vermelho, positivos em verde

---
