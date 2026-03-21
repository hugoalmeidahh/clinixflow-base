# BIL-007: Régua de Inadimplência e Bloqueio Automático

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 2  
**Dependências:** BIL-006

**User Story:**  
Como sistema, quero aplicar automaticamente a régua de inadimplência quando um pagamento falha, notificando o owner e bloqueando o acesso após o prazo, para garantir a sustentabilidade financeira do SaaS sem intervenção manual.

**Critérios de Aceite:**

**Régua completa:**
- [ ] **D+0 (falha):** Status → `PAST_DUE`; notificação imediata email + WhatsApp ao owner com 3 opções: tentar novamente, trocar cartão, pagar PIX
- [ ] **D+1:** 2ª tentativa automática no cartão cadastrado via Asaas
- [ ] **D+2:** 3ª tentativa automática + email "último aviso — acesso será suspenso amanhã"
- [ ] **D+3:** Status → `SUSPENDED`; bloqueio de todos os usuários staff; pacientes mantêm acesso read-only; tela de bloqueio exibida ao tentar acessar; email de bloqueio com opções de regularização
- [ ] **PIX como alternativa:** Gerar cobrança PIX com valor original + 10%; QR code e código copia-e-cola disponíveis na tela de bloqueio; validade do PIX: 24h (renovável)
- [ ] **D+30:** Status → `CANCELLED`; email informando cancelamento definitivo e retenção de dados por 90 dias
- [ ] **A qualquer momento D+0 a D+30:** Pagamento confirmado via webhook → desbloqueio automático imediato; email de confirmação ao owner

**Acesso de pacientes durante suspensão:**
- [ ] Carteirinha de vacinação: ✅ leitura
- [ ] Histórico de atendimentos: ✅ leitura
- [ ] Avaliações e devolutivas recebidas: ✅ leitura
- [ ] Agendamento de novos atendimentos: ❌ bloqueado
- [ ] Upload de documentos: ❌ bloqueado

**Refinamento Técnico:**
- **Middleware de acesso:** `checkSubscriptionStatus(tenant_id)` executado em cada requisição autenticada; retorna `{ allowed, reason, is_patient }`; pacientes (`role = PATIENT`) têm lógica separada de permissões durante suspensão
- **CRON jobs:**
  - A cada hora: verificar subscriptions `PAST_DUE` e disparar tentativas/notificações conforme dias decorridos desde `Invoice.due_date`
  - Diário às 2h: verificar subscriptions `SUSPENDED` com `due_date + 30 dias` ultrapassado → cancelar definitivamente
- **DB:**
  ```
  DunningAction (id, subscription_id, invoice_id, action_type:
    NOTIFICATION_D0|RETRY_D1|RETRY_D2|NOTIFICATION_FINAL|
    SUSPENSION|PIX_GENERATED|UNBLOCK|CANCELLATION,
    executed_at, success, notes)
  ```
- **PIX com acréscimo:** `POST /payments` no Asaas com `value = original * 1.10`; registrar `PaymentAttempt` com `pix_surcharge_applied = true` e `InvoiceItem` de tipo `SURCHARGE`
- **Tela de bloqueio:** Rota `/blocked` exibida pelo middleware quando `subscription.status = SUSPENDED`; mostra: motivo, valor em aberto, 3 opções (tentar cartão, trocar cartão, PIX), botão "Atualizar cartão" abre modal de tokenização Asaas

---
