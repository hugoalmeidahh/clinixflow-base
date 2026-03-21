# VAC-003: Motor de Regras: Sugestão Automática de Próximas Doses

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 2

**User Story:**  
Como profissional de saúde, quero que o sistema sugira automaticamente as próximas doses do calendário vacinal após cada aplicação, para facilitar o agendamento e não deixar o paciente perder prazos.

**Critérios de Aceite:**
- [ ] Configuração do calendário vacinal por vacina: dose, intervalo mínimo (dias), intervalo recomendado (dias), idade recomendada (opcional)
- [ ] Após registrar aplicação, sistema calcula data sugerida para próxima dose e cria uma sugestão com status SUGERIDO
- [ ] Sugestão aparece na carteirinha do paciente destacada visualmente (card amarelo/âmbar)
- [ ] Ao agendar a próxima dose, sugestão muda para status AGENDADO
- [ ] Ao aplicar, muda para APLICADO
- [ ] Sugestão vencida (data sugerida passou sem aplicação) aparece como ATRASADO em vermelho

**Refinamento Técnico:**
- **DB:**
  - `VaccineScheduleRule` (id, vaccine_id, dose_number, min_interval_days, recommended_interval_days, recommended_age_days nullable)
  - `VaccineSuggestion` (id, patient_id, vaccine_id, dose_number, suggested_date, status: SUGGESTED|SCHEDULED|APPLIED|OVERDUE, application_id nullable, appointment_id nullable)
- **Rule Engine:** Função `calculateNextDoseSuggestion(vaccine_id, dose_number, application_date, patient_birthdate)` consultando `VaccineScheduleRule`
- **CRON:** Job diário atualizando sugestões com `suggested_date < today` e `status = SUGGESTED` para `OVERDUE`

---
