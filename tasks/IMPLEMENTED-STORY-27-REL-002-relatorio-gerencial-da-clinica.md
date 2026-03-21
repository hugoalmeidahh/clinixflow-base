# REL-002: Relatório Gerencial da Clínica

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 3

**User Story:**  
Como gestor, quero relatórios gerenciais com indicadores operacionais da clínica (volume de atendimentos, taxa de ocupação, absenteísmo, profissionais mais ativos), para embasar decisões estratégicas.

**Critérios de Aceite:**
- [ ] KPIs: total de atendimentos, taxa de ocupação da agenda (%), taxa de absenteísmo (%), novos pacientes no período, atendimentos por profissional, atendimentos por especialidade
- [ ] Filtros: período, profissional, especialidade, convênio
- [ ] Gráfico de barras: atendimentos por mês (últimos 12 meses)
- [ ] Gráfico de rosca: atendimentos por especialidade
- [ ] Tabela: ranking de profissionais por volume de atendimento
- [ ] Exportação XLSX com todos os dados brutos + aba de resumo

**Refinamento Técnico:**
- **Backend:** Queries analíticas pesadas — considerar `materialized view` no Postgres atualizada via CRON diário para não impactar performance operacional
- **Índices:** Criar índice composto `(tenant_id, scheduled_at, status)` em `Appointment`
- **Cache:** `unstable_cache` com revalidação de 1 hora para relatórios do mês anterior

---
