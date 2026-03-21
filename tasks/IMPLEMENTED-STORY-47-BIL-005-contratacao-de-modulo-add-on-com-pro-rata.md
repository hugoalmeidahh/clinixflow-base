# BIL-005: Contratação de Módulo Add-on com Pro-rata

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 2  
**Dependências:** BIL-003, BIL-004

**User Story:**  
Como owner da clínica, quero contratar módulos adicionais a qualquer momento, sendo cobrado proporcionalmente pelos dias restantes do mês atual e depois junto com minha mensalidade, para expandir funcionalidades sem precisar esperar o próximo ciclo.

**Critérios de Aceite:**
- [ ] Tela "Módulos disponíveis" listando add-ons com: nome, descrição, features, preço mensal
- [ ] Módulos já incluídos no plano exibidos como "Incluído no seu plano" (não contratáveis)
- [ ] Módulos já contratados exibidos com status ATIVO e opção de cancelar
- [ ] Ao clicar "Contratar": exibir modal com cálculo transparente do pro-rata
  - "Você será cobrado agora: R$ XX,XX (X dias restantes)"
  - "A partir do próximo ciclo: + R$ XX,XX/mês na sua mensalidade"
- [ ] Confirmação → cobrança imediata do pro-rata via Asaas (cobrança avulsa, não recorrente)
- [ ] Em caso de sucesso: módulo liberado imediatamente, `SubscriptionAddon` criado, próxima fatura recorrente já inclui o add-on
- [ ] Cancelamento de add-on: efeito no fim do ciclo atual; módulo permanece ativo até lá; sem reembolso proporcional

**Refinamento Técnico:**
- **DB:**
  ```
  SubscriptionAddon (id, subscription_id, module_id,
                     contracted_at, price_at_contraction,
                     prorata_amount, prorata_invoice_id,
                     status: ACTIVE|CANCELLATION_REQUESTED|CANCELLED,
                     cancellation_requested_at, cancelled_at)
  ```
- **Cálculo pro-rata:**
  ```
  dias_restantes = current_period_end - hoje (em dias)
  dias_no_ciclo = current_period_end - current_period_start (em dias)
  prorata = (module.price_monthly / dias_no_ciclo) * dias_restantes
  ```
- **Cobrança avulsa Asaas:** `POST /payments` com valor pro-rata, `dueDate = hoje`, vinculado ao `asaas_customer_id` do tenant
- **Ativação:** Webhook `PAYMENT_CONFIRMED` da cobrança avulsa → `activateAddon(subscription_addon_id)` → liberar módulo no middleware de permissões
- **Cancelamento:** `requestAddonCancellation()` seta `cancellation_requested_at`; CRON diário cancela efetivamente ao chegar em `current_period_end`

---
