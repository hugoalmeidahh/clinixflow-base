# VAC-006: Lembretes Automáticos de Doses Vencendo

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 3

**User Story:**  
Como clínica, quero que o sistema envie automaticamente lembretes aos pacientes com doses sugeridas nos próximos dias via WhatsApp, para aumentar a adesão ao calendário vacinal sem esforço manual.

**Critérios de Aceite:**
- [ ] Job diário identifica pacientes com `VaccineSuggestion` com `suggested_date` em 7 dias ou 1 dia
- [ ] Envia WhatsApp via Evolution API com mensagem template aprovado
- [ ] Configuração por tenant: ativar/desativar lembretes, dias de antecedência (padrão: 7 e 1 dia)
- [ ] Registro de cada envio com timestamp, canal e status de entrega
- [ ] Paciente pode responder ao WhatsApp para agendar (integração futura — apenas log por ora)

**Refinamento Técnico:**
- **DB:** Tabela `VaccineReminderLog` (id, patient_id, suggestion_id, sent_at, channel, status: SENT|FAILED, message_template)
- **Job:** CRON diário às 8h; fila assíncrona (pg-boss ou similar) para processar envios em background; retry 3x com backoff exponencial em caso de falha da Evolution API
- **Rate Limiting:** Máximo 1 lembrete por paciente por vacina por canal a cada 3 dias (evitar spam)

---
