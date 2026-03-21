# BIL-003: Signup com Escolha de Plano e Cadastro de Cartão

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 1  
**Dependências:** BIL-001, BIL-002

**User Story:**  
Como novo usuário, quero me cadastrar no ClinixFlow escolhendo meu plano e informando meu cartão de forma segura, para ter acesso imediato após a confirmação do pagamento.

**Critérios de Aceite:**
- [ ] Fluxo em 3 etapas com stepper visual: (1) Dados da conta, (2) Escolha do plano, (3) Pagamento
- [ ] **Etapa 1 — Dados da conta:** nome completo, email, senha, telefone, nome da clínica, CNPJ/CPF, endereço da clínica
- [ ] **Etapa 2 — Escolha do plano:** cards dos planos PÚBLICOS com features, limites e preço; campo de cupom com validação em tempo real; resumo do valor a cobrar hoje
- [ ] **Etapa 3 — Pagamento:** formulário de cartão com campos: número, nome, validade, CVV; checkbox "Li e aceito os Termos de Uso e a Política de Privacidade"; aviso sobre direito de arrependimento de 15 dias
- [ ] Dados do cartão enviados diretamente ao Asaas via tokenização (nunca passam pelo servidor do ClinixFlow)
- [ ] Ao confirmar: criar customer no Asaas → criar assinatura no Asaas → cobrar 1ª mensalidade → em caso de sucesso, criar tenant + liberar acesso
- [ ] Em caso de falha no cartão: exibir mensagem do Asaas traduzida + opção de corrigir dados sem perder os dados da conta
- [ ] Email de boas-vindas com: confirmação de pagamento, valor cobrado, data da próxima cobrança, instrução sobre cancelamento em 15 dias

**Refinamento Técnico:**
- **DB:**
  ```
  Account (id, owner_user_id, asaas_customer_id, status: PENDING|ACTIVE|SUSPENDED|CANCELLED)
  
  Subscription (id, tenant_id, plan_id, coupon_id nullable,
                status: ACTIVE|PAST_DUE|SUSPENDED|CANCELLED,
                current_period_start, current_period_end,
                asaas_subscription_id, asaas_customer_id,
                cancellation_requested_at nullable,
                cancelled_at nullable, cancel_reason nullable)
  ```
- **Fluxo Asaas:**
  1. `POST /customers` → obtém `asaas_customer_id`
  2. `POST /creditCard/tokenize` (client-side via Asaas.js) → obtém token
  3. `POST /subscriptions` com token, valor calculado (já com desconto do cupom se `FIRST_MONTH`), cycle: MONTHLY
  4. Webhook `PAYMENT_CONFIRMED` → ativa tenant
- **Transação:** Criar `Account` + `Tenant` + `User(owner)` + `Subscription` em transação Prisma; rollback se qualquer etapa falhar; registro de `asaas_customer_id` antes de criar assinatura
- **Segurança:** Campos do cartão nunca no body das requisições Next.js; usar Asaas.js SDK client-side para tokenização direta
- **Frontend:** Máscara nos campos de cartão (react-input-mask); indicador de segurança ("Seus dados são protegidos pelo Asaas"); spinner durante processamento do pagamento

---
