> **[IMPLEMENTED]** - Esta story já foi implementada na Fase 1/Core.

# STORY-08: Relatórios, Dashboards e Inconsistências

## Descrição
Como Administrador, quero analisar os Key Performance Indicators da minha clínica em tempo real e de forma precisa, identificando rapidamente gargalos e ausência de informações vitais (inconsistências).

## Acceptance Criteria
- [ ] Dashboard Principal exibindo % Taxa de Presença, Consultas Mês, Inadimplência e Pacientes Ativos.
- [ ] Painel de Inconsistências (Consultas passadas sem status; presenças sem evolução clínica; carteirinhas vencidas).
- [ ] Relatórios Operacionais (Agendamentos por status, Frequência por paciente, Produtividade do profissional).
- [ ] Relatórios Financeiros (Receita por Convênio vs Receita Particular, DRE simplificada).
- [ ] Possibilidade de exportar dados para CSV e visões como Gráficos usando Charts (Chart.js ou Recharts).

## Sub-tasks
1. **Views no Supabase**: Criar `PostgreSQL Materialized Views` para as agregações do Dashboard (evitar processar map/reduce pesados no Node).
2. **Widgets Visuais**: Desenvolver Cards e Gráficos responsivos na UI de Dashboard.
3. **Painel de Inconsistências**: View consolidada cruzando dados (`appointments` sem presença, agendas sem preço).
4. **Exportação Modular**: Função genérica para baixar o CSV das views filtradas.

## Refinamento Técnico
- Performance das Dashboards deve ser instantânea. Se necessário, agendar refresh de views no pg_cron ou fazer Materialized Views com cache no React Query.
