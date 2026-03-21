# FIN-006: Dashboard Financeiro

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 2

**User Story:**  
Como gestor, quero um dashboard financeiro com os principais indicadores do mês, para ter uma visão rápida da saúde financeira da clínica sem precisar navegar em relatórios.

**Critérios de Aceite:**
- [ ] Cards: Receitas do mês, Despesas do mês, Saldo do mês, A Receber, A Pagar
- [ ] Gráfico de barras: Receitas vs Despesas (últimos 6 meses)
- [ ] Gráfico de rosca: Distribuição de receitas por categoria (top 5)
- [ ] Lista dos 5 lançamentos pendentes mais próximos do vencimento
- [ ] Filtro por centro de custo afeta todos os cards e gráficos
- [ ] Período padrão: mês atual; seletor de mês disponível

**Refinamento Técnico:**
- **Backend:** Queries agregadas com `GROUP BY month`, `GROUP BY category`; cache de 5 minutos via `unstable_cache` do Next.js para não sobrecarregar o banco
- **Frontend:** Recharts para gráficos; cards com skeleton loading; atualização ao trocar filtro sem reload de página

---
