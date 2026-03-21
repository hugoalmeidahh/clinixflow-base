# FIN-003: Livro Caixa

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 2

**User Story:**  
Como gestor financeiro, quero visualizar o livro caixa com saldo inicial, todas as movimentações do período e saldo final, para acompanhar a posição de caixa diária e mensal.

**Critérios de Aceite:**
- [ ] Visão de livro caixa filtrável por: período (data início/fim), centro de custo, categoria, tipo
- [ ] Exibir: saldo anterior ao período, cada lançamento em ordem cronológica, saldo acumulado após cada lançamento, saldo final do período
- [ ] Totalizadores: Total de Entradas, Total de Saídas, Saldo do Período
- [ ] Exportação em PDF e XLSX
- [ ] Filtro rápido: "Hoje", "Esta semana", "Este mês", "Mês anterior", "Período customizado"

**Refinamento Técnico:**
- **Backend:** Query analítica com `SUM` cumulativo (window function `SUM() OVER (ORDER BY payment_date)`); filtros passados via Server Action; resultados paginados com cursor
- **Performance:** Índices em `(tenant_id, payment_date, status)` na tabela `FinancialEntry`
- **Export PDF:** Biblioteca `@react-pdf/renderer` ou `puppeteer` gerando PDF server-side; enviar via download
- **Export XLSX:** Biblioteca `xlsx` (SheetJS) montando planilha com totalizadores no rodapé

---
