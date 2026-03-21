> **[IMPLEMENTED]** - Esta story já foi implementada na Fase 1/Core.

# STORY-04: Motor de Agendamentos e Calendário

## Descrição
Como Recepcionista, preciso agendar consultas de pacientes com os profissionais em modo de calendário ou lista, prevenindo choques de horário.

## Acceptance Criteria
- [ ] Calendário Interativo: visualização diária, semanal e modo kanban por profissional.
- [ ] Marcação de Consulta: escolha de paciente, profissional, data/hora baseada na disponibilidade do profissional.
- [ ] Agendamento Recorrente (ex: toda segunda e quarta até Dezembro).
- [ ] Prevenção de Conflitos: O agendamento é barrado no servidor se o horário colidir (overbooking) ou cair em exceção/férias.
- [ ] Mudanças de Status (fluxo: Scheduled -> Confirmed -> Attended, ou Cancellations/Absence).

## Sub-tasks
1. **Módulo Calendário UI**: Implementar as visualizações (Daily, Weekly, List).
2. **RPC de Prevenção de Conflitos**: Desenvolver função Postgres `book_appointment(...)` para checagem "ACID" da disponibilidade real.
3. **Motor de Recorrência**: UI para setup de frequência e backend script para gerar a lista de dates.
4. **Painel de Inconsistências**: Visualizar consultas passadas sem ação de presença/falta.

## Refinamento Técnico
- A checagem de sobreposição de horas **NÃO DEVE** ser feita apenas no Front React; criar `Subapase RPC` p/ checagem.
- Agendamentos recorrentes salvam um registro mestre e N filhos; as checagens batem slot por slot pulando feriados se definidos na master_config do tenant.
