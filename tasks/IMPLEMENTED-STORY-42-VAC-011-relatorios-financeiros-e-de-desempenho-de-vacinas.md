# VAC-011: Relatórios Financeiros e de Desempenho de Vacinas

**Tipo:** Story | **Prioridade:** Média | **Sprint:** 4

**User Story:**  
Como gestor, quero relatórios de faturamento e volume de vacinação com filtros por vacina e fabricante, para comparar com períodos anteriores e tomar decisões de estoque e campanha.

**Critérios de Aceite:**
- [ ] Relatório de faturamento: total de receitas de vacinas no período, breakdown por vacina/fabricante
- [ ] Relatório de volume: quantidade de doses aplicadas por vacina, por profissional, por período
- [ ] Comparativo com período anterior: variação percentual por vacina
- [ ] Gráfico de barras: top 10 vacinas por volume no período
- [ ] Gráfico de linha: evolução mensal do total de doses aplicadas
- [ ] Exportação XLSX e PDF
- [ ] Integrado ao módulo de relatórios (REL) — aparece no hub de relatórios

**Refinamento Técnico:**
- **Backend:** Queries analíticas em `VaccineApplication` com JOINs em `Vaccine` e `FinancialEntry`; índices em `(tenant_id, applied_at, vaccine_id)`
- **Frontend:** Recharts para visualizações; mesma infraestrutura de export de REL-002/003

---

# RESUMO DO BACKLOG

## Contagem de Tickets

| Epic | Total | Alta | Média | Baixa |
|------|-------|------|-------|-------|
| EPIC-FIN — Financeiro | 8 | 5 | 3 | 0 |
| EPIC-AVA — Avaliações | 7 | 4 | 3 | 0 |
| EPIC-REL — Relatórios | 6 | 3 | 3 | 0 |
| EPIC-VAC — Vacinas | 11 | 6 | 4 | 1 |
| **TOTAL** | **32** | **18** | **13** | **1** |

## Dependências Críticas

```
FIN-001 → FIN-002 → FIN-003, FIN-004, FIN-005
FIN-002 → FIN-006 (dashboard)
FIN-002 + FIN-007 → FIN-008 (fechamento convênio)
AVA-001 → AVA-002 → AVA-004 → AVA-005
AVA-002 → AVA-007 (devolutiva)
AVA-003 (independente — pode ser feita em paralelo com AVA-001)
REL-001 depende de: Módulo base + AVA-002
REL-003 depende de: FIN-002
REL-004 depende de: AVA-007
REL-005 depende de: AVA-005
VAC-001 → VAC-002 → VAC-003, VAC-004
VAC-002 + VAC-005 → VAC-006
VAC-007 depende de: VAC-002
VAC-008 depende de: FIN-007 + VAC-002
```

## Sugestão de Ordem de Sprints

| Sprint | Foco | Tickets |
|--------|------|---------|
| 1 | Financeiro base + Avaliações builder | FIN-001, FIN-002, AVA-001, VAC-001 |
| 2 | Financeiro painel + Avaliações aplicação + Vacinas core | FIN-003, FIN-004, FIN-006, AVA-002, AVA-003, AVA-006, VAC-002, VAC-003, VAC-004, VAC-005 |
| 3 | Relatórios + Avaliações relatório | FIN-005, REL-001, REL-002, REL-003, AVA-004, AVA-005, VAC-006 |
| 4 | NFSe + RNDS + Campanhas + Devolutiva | FIN-007, FIN-008, AVA-007, REL-004, REL-005, REL-006, VAC-007, VAC-008, VAC-009, VAC-011 |
| 5 | App Mobile (fase futura) | VAC-010 |
