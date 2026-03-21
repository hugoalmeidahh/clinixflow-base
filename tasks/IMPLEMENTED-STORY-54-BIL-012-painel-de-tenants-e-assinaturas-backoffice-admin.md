# BIL-012: Painel de Tenants e Assinaturas (Backoffice Admin)

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 2  
**Dependências:** BIL-001, BIL-003

**User Story:**  
Como SaaS Admin, quero uma visão completa de todos os tenants com status de assinatura, uso e histórico de pagamentos, e poder realizar ações manuais de suporte (bloquear, desbloquear, alterar plano, conceder override de limites), para gerenciar a base de clientes com eficiência.

**Critérios de Aceite:**
- [ ] Tabela de tenants com: nome da clínica, owner email, plano atual, status da assinatura (badge), próximo vencimento, pacientes ativos / limite, membros / limite, data de cadastro
- [ ] Filtros: status (ACTIVE / PAST_DUE / SUSPENDED / CANCELLED), plano, data de cadastro (range)
- [ ] Busca por nome da clínica ou email do owner
- [ ] Ação "Ver detalhes" abre página do tenant com: histórico de faturas, módulos ativos, log de ações de billing, uso atual
- [ ] Ações manuais disponíveis ao admin:
  - Alterar plano (efeito imediato, sem cobrança adicional — admin decide)
  - Suspender manualmente (com motivo obrigatório)
  - Reativar manualmente (override da régua de inadimplência)
  - Conceder override de limite (pacientes ou membros) com justificativa
  - Aplicar desconto manual (gera crédito na próxima fatura)
  - Processar reembolso manual
- [ ] Todas as ações manuais registradas em log com `admin_user_id`, `timestamp` e `reason`
- [ ] Dashboard de métricas SaaS: MRR (Monthly Recurring Revenue), total de tenants ativos, novos tenants no mês, churn do mês, tenants inadimplentes

**Refinamento Técnico:**
- **DB:**
  ```
  AdminAction (id, admin_user_id, tenant_id, action_type, payload_json,
               reason, executed_at)
  
  TenantCredit (id, tenant_id, amount, reason, applied_by,
                applied_at, used_in_invoice_id nullable)
  ```
- **MRR:** `SUM(plan.price_monthly + SUM(addon.price_at_contraction))` para todas as subscriptions `ACTIVE`
- **Churn:** Subscriptions que mudaram para `CANCELLED` no período / total de subscriptions ativas no início do período × 100
- **Frontend:** Tabela com react-table para sorting/filtering client-side após fetch inicial; ações via modais com confirmação explícita para operações destrutivas
- **Segurança:** Rota `/admin/*` protegida por role `SAAS_ADMIN`; never expose ao tenant

---

## RESUMO DO EPIC-BIL

### Contagem

| Categoria | Tickets | Prioridade Alta | Prioridade Média |
|---|---|---|---|
| Backoffice (planos, cupons, painel) | 3 | 2 | 1 |
| Jornada de signup e billing | 3 | 3 | 0 |
| Operação recorrente e add-ons | 3 | 3 | 0 |
| Portal owner e histórico | 2 | 1 | 1 |
| Inadimplência e cancelamento | 2 | 2 | 0 |
| **Total EPIC-BIL** | **13** | **11** | **2** |

### Dependências críticas

```
BIL-001 (Planos) ──────────────────────────── BASE DE TUDO
    ↓
BIL-002 (Cupons) ───────────────────────────→ BIL-003
BIL-003 (Signup) ───────────────────────────→ BIL-004, BIL-006, BIL-010
BIL-004 (Recorrência) ──────────────────────→ BIL-005, BIL-008, BIL-011
BIL-006 (Webhooks) ─────────────────────────→ BIL-007
BIL-007 (Inadimplência) ────────────────────→ BIL-008
BIL-003 + BIL-004 ──────────────────────────→ BIL-009 (Cancelamento)
BIL-001 + BIL-003 ──────────────────────────→ BIL-010 (Limites)
BIL-001 + BIL-003 ──────────────────────────→ BIL-012 (Backoffice Admin)
```

### Sugestão de ordem por sprint

| Sprint | Tickets | Motivo |
|---|---|---|
| Sprint 1 | BIL-001, BIL-003, BIL-006 | Base: planos + signup + webhooks (sem esses nada funciona) |
| Sprint 2 | BIL-002, BIL-004, BIL-005, BIL-007, BIL-010, BIL-012 | Operação completa + enforcement + backoffice |
| Sprint 3 | BIL-008, BIL-009, BIL-011 | Portal owner + cancelamento + histórico |

### Dados que ficam no Asaas (NUNCA no seu DB)

| Dado | Onde fica |
|---|---|
| Número do cartão | Asaas |
| CVV | Asaas |
| Data de validade do cartão | Asaas |
| Token do cartão | Asaas |
| Dados bancários | Asaas |

### Dados que ficam no seu DB (referências apenas)

| Dado | Campo |
|---|---|
| ID do cliente no Asaas | `Account.asaas_customer_id` |
| ID da assinatura no Asaas | `Subscription.asaas_subscription_id` |
| ID do pagamento no Asaas | `Invoice.asaas_payment_id` |
| ID da cobrança avulsa | `PaymentAttempt.asaas_charge_id` |
