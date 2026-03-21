# BIL-004: Cobrança Recorrente e Ciclo de Faturamento

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 1  
**Dependências:** BIL-003

**User Story:**  
Como sistema, quero processar o ciclo de faturamento mensal automaticamente, gerando faturas com os itens corretos (plano base + add-ons ativos + descontos de cupom), para que a cobrança seja precisa e rastreável.

**Critérios de Aceite:**
- [ ] No dia do vencimento, o Asaas tenta a cobrança automaticamente (configurado na assinatura)
- [ ] Ao receber webhook de sucesso: criar `Invoice` com status PAID, registrar `InvoiceItem` para cada componente (plano + cada add-on ativo), atualizar `current_period_start/end`
- [ ] Se cupom `ALL_MONTHS` ativo: aplicar desconto em cada fatura recorrente até cancelamento do cupom
- [ ] Se cupom `FIRST_MONTH`: aplicar apenas na 1ª fatura; nas seguintes cobrar valor cheio
- [ ] Cada `Invoice` deve ter itens discriminados: "Plano [Nome] — [Mês/Ano]", "Módulo [Nome] — [Mês/Ano]", "Desconto cupom [CÓDIGO]"
- [ ] Fatura disponível para download em PDF pelo owner no portal

**Refinamento Técnico:**
- **DB:**
  ```
  Invoice (id, subscription_id, tenant_id, due_date, paid_at,
           status: PENDING|PAID|FAILED|OVERDUE|REFUNDED,
           subtotal, discount_amount, total,
           asaas_payment_id, created_at)
  
  InvoiceItem (id, invoice_id, description, quantity, unit_price, total,
               type: PLAN|ADDON|DISCOUNT|SURCHARGE)
  
  PaymentAttempt (id, invoice_id, attempted_at, method: CARD|PIX,
                  status: SUCCESS|FAILED, failure_reason,
                  asaas_charge_id, pix_surcharge_applied)
  ```
- **Geração da fatura:** Triggered pelo webhook `PAYMENT_CREATED` do Asaas; Server Action `generateInvoiceRecord()` monta os itens consultando `Subscription`, `SubscriptionAddon[]` ativos e `CouponRedemption` ativa
- **PDF:** Template de fatura gerado com `@react-pdf/renderer`; armazenado em Supabase Storage `invoices/{tenant_id}/{invoice_id}.pdf`; link salvo em `Invoice.pdf_url`

---
