# BIL-009: Cancelamento e Reembolso (Direito de Arrependimento)

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 3  
**Dependências:** BIL-003, BIL-004

**User Story:**  
Como owner, quero poder cancelar minha assinatura a qualquer momento, e caso esteja dentro de 15 dias do primeiro pagamento, receber o reembolso total automático, para ter segurança na contratação do serviço.

**Critérios de Aceite:**

**Cancelamento padrão (após 15 dias):**
- [ ] Solicitação de cancelamento disponível no portal de billing
- [ ] Modal de confirmação com: data em que o acesso será encerrado (fim do ciclo atual), aviso de que dados ficam retidos por 90 dias
- [ ] Acesso mantido até `current_period_end`
- [ ] Status → `CANCELLATION_REQUESTED`; ao chegar em `current_period_end` → `CANCELLED`
- [ ] Email confirmando cancelamento com data de encerramento
- [ ] Assinatura cancelada no Asaas via `DELETE /subscriptions/{id}`

**Cancelamento com direito de arrependimento (até 15 dias do 1º pagamento):**
- [ ] Sistema detecta automaticamente se `hoje <= subscription.created_at + 15 dias`
- [ ] Modal exibe: "Você está dentro do período de arrependimento. Você receberá o reembolso total de R$ XX,XX"
- [ ] Ao confirmar: cancelar assinatura no Asaas + solicitar estorno via `POST /payments/{id}/refund`
- [ ] Status → `CANCELLED` imediatamente (sem esperar fim do ciclo)
- [ ] Email com confirmação do reembolso e prazo de crédito (conforme bandeira do cartão)
- [ ] `RefundRequest` criado com status PENDING → atualizado para PROCESSED via webhook `PAYMENT_REFUNDED`

**Refinamento Técnico:**
- **DB:**
  ```
  RefundRequest (id, subscription_id, invoice_id, amount,
                 reason: WITHDRAWAL_RIGHT|MANUAL_ADMIN|OTHER,
                 requested_at, processed_at,
                 status: PENDING|APPROVED|PROCESSED|REJECTED,
                 asaas_refund_id, notes)
  ```
- **Detecção do período:** `isWithinWithdrawalPeriod(subscription) = (now - subscription.created_at) <= 15 days`
- **Asaas refund:** `POST /payments/{asaas_payment_id}/refund` com `value` = total pago; Asaas retorna status do estorno; webhook `PAYMENT_REFUNDED` confirma processamento
- **Edge case — módulos contratados no período:** se cliente contratou add-on pro-rata e cancela por arrependimento, reembolsar também o pro-rata cobrado; listar todos os `PaymentAttempt` com `status = SUCCESS` da conta

---
