# BIL-006: Webhooks Asaas — Processamento de Eventos

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 1  
**Dependências:** BIL-003

**User Story:**  
Como sistema, quero processar de forma confiável todos os eventos do Asaas via webhook, para manter o estado das assinaturas e faturas sincronizado em tempo real sem depender de polling.

**Critérios de Aceite:**
- [ ] Endpoint `POST /api/webhooks/asaas` recebe e processa todos os eventos
- [ ] Verificação de autenticidade: validar header `asaas-access-token` em toda requisição
- [ ] Processamento idempotente: mesmo evento recebido duas vezes não gera efeito duplicado
- [ ] Eventos tratados:
  - `PAYMENT_CONFIRMED` → marcar Invoice como PAID, ativar/desbloquear tenant se estava SUSPENDED
  - `PAYMENT_RECEIVED` → mesmo que CONFIRMED para PIX
  - `PAYMENT_OVERDUE` → marcar Invoice como OVERDUE, iniciar régua de inadimplência
  - `PAYMENT_DELETED` → cancelar Invoice, registrar log
  - `SUBSCRIPTION_INACTIVATED` → marcar Subscription como CANCELLED
- [ ] Log de todos os webhooks recebidos com payload completo (para debug e auditoria)
- [ ] Resposta sempre `200 OK` imediata; processamento assíncrono em background

**Refinamento Técnico:**
- **DB:**
  ```
  WebhookLog (id, event_type, asaas_event_id, payload_json,
              processed_at, status: SUCCESS|FAILED|DUPLICATE,
              error_message nullable)
  ```
- **Idempotência:** Antes de processar, verificar `WebhookLog` por `asaas_event_id`; se já existe com `SUCCESS`, retornar 200 sem reprocessar
- **Processamento assíncrono:** Responder 200 imediatamente, enfileirar processamento via pg-boss ou similar; timeout do Asaas é curto (5s) — não bloquear na resposta
- **Retry Asaas:** O Asaas reenvia webhooks em caso de falha; a idempotência garante segurança
- **Segurança:** Variável `ASAAS_WEBHOOK_TOKEN` no env server; nunca exposta ao client

---
