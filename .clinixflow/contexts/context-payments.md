# claude.md

# ClinixFlow v2 — EPIC-BIL: Billing, Assinaturas e Cobrança Recorrente
> Formato: Jira Ticket | User Story + Critérios de Aceite + Refinamento Técnico  
> Gateway: Asaas | Stack: Next.js 15 · Supabase · Prisma  
> Gerado em: Março/2026 | Pleno Inovação

---

## CONTEXTO DO EPIC

Módulo de billing responsável por toda a jornada de cobrança do ClinixFlow como SaaS:
- Signup com escolha de plano e cadastro de cartão
- Cobrança recorrente mensal via Asaas
- Contratação de módulos add-on com pro-rata
- Cupons de desconto (percentual e valor fixo, 1º mês ou todos os meses)
- Limites por plano: pacientes ativos e membros da equipe
- Régua de inadimplência com bloqueio automático em D+3
- Desbloqueio automático via webhook ao confirmar pagamento
- Direito de arrependimento: cancelamento com reembolso total em até 15 dias
- Backoffice para gestão de planos, módulos e tenants

---

## DECISÕES DE NEGÓCIO REGISTRADAS

| Decisão | Valor |
|---|---|
| Gateway | Asaas |
| Cobrança inicial | Imediata no signup (sem trial) |
| Direito de arrependimento | 15 dias com reembolso total (acima do CDC que exige 7) |
| Módulo no meio do mês | Pro-rata dos dias restantes + mês cheio na próxima fatura |
| Prazo para regularizar inadimplência | D+0 até D+2 (3 tentativas) |
| Bloqueio | D+3 sem pagamento |
| Desbloqueio | Automático via webhook Asaas |
| PIX em inadimplência | Valor original + 10% de acréscimo |
| Cancelamento definitivo | D+30 sem pagamento |
| Retenção de dados pós-cancelamento | 90 dias (LGPD) |
| Limites por plano | Pacientes ativos + Membros da equipe |
| Cupons | Percentual ou valor fixo, aplicável ao 1º mês ou todos os meses |
| Dados do cartão | Nunca armazenados no sistema — apenas no Asaas |

---

## ÍNDICE DE TICKETS

| Ticket | Título | Prioridade |
|---|---|---|
| BIL-001 | Modelo de Planos e Módulos (Backoffice) | Alta |
| BIL-002 | Gestão de Cupons de Desconto (Backoffice) | Média |
| BIL-003 | Signup com Escolha de Plano e Cadastro de Cartão | Alta |
| BIL-004 | Cobrança Recorrente e Ciclo de Faturamento | Alta |
| BIL-005 | Contratação de Módulo Add-on com Pro-rata | Alta |
| BIL-006 | Webhooks Asaas — Processamento de Eventos | Alta |
| BIL-007 | Régua de Inadimplência e Bloqueio Automático | Alta |
| BIL-008 | Portal de Billing do Owner (Minha Assinatura) | Alta |
| BIL-009 | Cancelamento e Reembolso (Direito de Arrependimento) | Alta |
| BIL-010 | Enforcement de Limites do Plano | Alta |
| BIL-011 | Histórico de Faturas e Itens de Cobrança | Média |
| BIL-012 | Painel de Tenants e Assinaturas (Backoffice Admin) | Alta |

---

## BIL-001 — Modelo de Planos e Módulos (Backoffice)

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 1  
**Dependências:** Nenhuma — base de tudo

**User Story:**  
Como SaaS Admin, quero criar e gerenciar planos de assinatura e módulos add-on pelo backoffice, definindo preços, limites e quais módulos estão incluídos em cada plano, para poder lançar novos planos e ajustar a oferta comercial sem precisar de deploy.

**Critérios de Aceite:**
- [ ] CRUD de Planos: nome, descrição, preço mensal, status (PÚBLICO/PRIVADO/ARQUIVADO)
- [ ] Cada plano tem: lista de módulos incluídos, limite de pacientes ativos, limite de membros da equipe
- [ ] Plano PRIVADO: existe no sistema mas não aparece na tela de signup (usado para planos customizados negociados diretamente)
- [ ] Plano ARQUIVADO: não aceita novos signups mas respeita assinantes existentes
- [ ] CRUD de Módulos: key única (ex: `financial`, `vaccines`), nome, descrição, preço mensal como add-on, disponível como add-on (sim/não)
- [ ] Associação N:N entre Plano e Módulos incluídos
- [ ] Preview de como o plano aparecerá na tela de signup
- [ ] Histórico de alterações de preço (não retroativo — apenas para novas assinaturas)

**Refinamento Técnico:**
- **DB:**
  ```
  Plan (id, name, description, price_monthly, status: PUBLIC|PRIVATE|ARCHIVED,
        max_patients, max_team_members, created_at, updated_at)
  
  Module (id, key UNIQUE, name, description, price_monthly,
          is_available_as_addon, is_active)
  
  PlanModule (plan_id, module_id) — relação N:N
  
  PlanPriceHistory (id, plan_id, old_price, new_price, changed_at, changed_by)
  ```
- **Backend:** Server Actions CRUD em `/admin`; trigger automático em `Plan.price_monthly` que insere em `PlanPriceHistory`; seed com 1 plano inicial e os 4 módulos do ClinixFlow
- **Frontend:** Tabela de planos com badge de status; modal de edição com checklist de módulos; seção de limites com inputs numéricos (0 = ilimitado)
- **Validação:** Não permitir arquivar plano com assinantes ACTIVE; exibir contagem de assinantes ativos ao tentar arquivar

---

## BIL-002 — Gestão de Cupons de Desconto (Backoffice)

**Tipo:** Story | **Prioridade:** Média | **Sprint:** 2  
**Dependências:** BIL-001

**User Story:**  
Como SaaS Admin, quero criar cupons de desconto com diferentes tipos e regras de aplicação, para usar em campanhas comerciais, parcerias e negociações diretas.

**Critérios de Aceite:**
- [ ] CRUD de Cupons: código único (ex: `CLINIX20`), tipo (PERCENTUAL ou VALOR_FIXO), valor do desconto
- [ ] Escopo do desconto: `FIRST_MONTH` (só no 1º mês) ou `ALL_MONTHS` (todos os meses enquanto ativo)
- [ ] Configurações adicionais: data de expiração (opcional), limite de usos total (opcional), uso por cliente: 1 uso máximo por CPF/CNPJ
- [ ] Status: ATIVO / PAUSADO / EXPIRADO (calculado automaticamente pela data)
- [ ] Relatório de uso: quantas vezes usado, total de desconto concedido, lista de tenants que usaram
- [ ] Validação em tempo real no campo de cupom do signup: retorna nome do cupom e valor do desconto antes de confirmar
- [ ] Cupom aplicado ao plano apenas — não se aplica a módulos add-on contratados separadamente

**Refinamento Técnico:**
- **DB:**
  ```
  Coupon (id, code UNIQUE, type: PERCENTAGE|FIXED, value,
          scope: FIRST_MONTH|ALL_MONTHS, expires_at nullable,
          max_uses nullable, current_uses, status: ACTIVE|PAUSED,
          created_by, created_at)
  
  CouponRedemption (id, coupon_id, subscription_id, tenant_id,
                    redeemed_at, discount_applied)
  ```
- **Backend:** `validateCoupon(code, plan_id)` — verifica existência, status, expiração, limite de usos e se tenant já usou; retorna `{ valid, discount_value, scope, description }`
- **Aplicação:** Se `scope = FIRST_MONTH`, desconto aplicado apenas na primeira `Invoice`; se `ALL_MONTHS`, aplicado via campo `discount` em todas as faturas enquanto `CouponRedemption` ativa
- **Asaas:** Cupom não é repassado ao Asaas — o desconto é calculado no sistema e o valor já descontado é enviado na criação da cobrança

---

## BIL-003 — Signup com Escolha de Plano e Cadastro de Cartão

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

## BIL-004 — Cobrança Recorrente e Ciclo de Faturamento

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

## BIL-005 — Contratação de Módulo Add-on com Pro-rata

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

## BIL-006 — Webhooks Asaas — Processamento de Eventos

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

## BIL-007 — Régua de Inadimplência e Bloqueio Automático

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

## BIL-008 — Portal de Billing do Owner (Minha Assinatura)

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 2  
**Dependências:** BIL-004, BIL-005

**User Story:**  
Como owner da clínica, quero gerenciar minha assinatura em uma área dedicada, podendo visualizar meu plano atual, módulos contratados, próxima cobrança e atualizar meu cartão quando necessário.

**Critérios de Aceite:**
- [ ] Rota `/settings/billing` acessível apenas ao owner
- [ ] **Resumo da assinatura:** plano atual, módulos ativos (incluídos e contratados), status, próxima data de cobrança, próximo valor a cobrar (discriminado)
- [ ] **Uso atual vs limites:** barra de progresso para "Pacientes ativos: X / Y" e "Membros da equipe: X / Y"
- [ ] **Atualizar cartão:** modal com formulário tokenizado Asaas; ao salvar, atualiza cartão na assinatura do Asaas via `PUT /subscriptions/{id}/creditCard`
- [ ] **Módulos disponíveis:** cards dos add-ons não contratados com preço e botão "Contratar"
- [ ] **Cancelar módulo:** botão em cada add-on ativo com modal de confirmação informando até quando o módulo ficará ativo
- [ ] **Histórico de faturas:** últimas 12 faturas com status e link para download do PDF (ver BIL-011)
- [ ] **Solicitar cancelamento da conta:** botão "Cancelar assinatura" com fluxo de confirmação (ver BIL-009)

**Refinamento Técnico:**
- **Backend:** `getSubscriptionDetails(tenant_id)` agrega dados de `Subscription`, `SubscriptionAddon[]`, `Invoice[]` e contagens reais de pacientes/membros
- **Atualização de cartão Asaas:** `PUT /subscriptions/{asaas_subscription_id}` com novo token de cartão; nunca armazenar dados do cartão; confirmar sucesso antes de exibir "Cartão atualizado"
- **Frontend:** Seções colapsáveis; skeleton loading por seção para não bloquear toda a página; toast de confirmação em cada ação

---

## BIL-009 — Cancelamento e Reembolso (Direito de Arrependimento)

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

## BIL-010 — Enforcement de Limites do Plano

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 2  
**Dependências:** BIL-001, BIL-003

**User Story:**  
Como sistema, quero impor os limites de pacientes ativos e membros da equipe definidos no plano, bloqueando operações que ultrapassem os limites e orientando o upgrade de plano, para garantir a sustentabilidade do modelo de negócio.

**Critérios de Aceite:**
- [ ] **Limite de pacientes ativos:** ao cadastrar novo paciente, verificar contagem atual vs `plan.max_patients` (0 = ilimitado); se no limite: exibir modal "Você atingiu o limite de X pacientes do seu plano. Faça upgrade para continuar."
- [ ] **Limite de membros da equipe:** ao convidar/criar novo usuário (qualquer role: profissional, recepção, admin, gestão), verificar contagem vs `plan.max_team_members`; mesmo comportamento de bloqueio
- [ ] **Alerta preventivo:** ao atingir 80% do limite, exibir banner amarelo no dashboard: "Você está usando 80% do limite de pacientes do seu plano"
- [ ] **Dashboard de uso:** no portal de billing, barras de progresso mostrando uso atual vs limite
- [ ] Limites com valor 0 no plano = ilimitado (sem enforcement)
- [ ] Admin do backoffice pode aumentar limites de um tenant específico manualmente (override)

**Refinamento Técnico:**
- **Contagem de pacientes ativos:** `Patient` com `status = ACTIVE` vinculado ao `tenant_id`; contagem via `COUNT()` com cache de 1 minuto
- **Contagem de membros:** `User` com `tenant_id` e `role IN (OWNER, ADMIN, PROFESSIONAL, RECEPTIONIST, MANAGER)` e `status = ACTIVE`
- **DB:**
  ```
  TenantLimitOverride (id, tenant_id, limit_type: PATIENTS|TEAM_MEMBERS,
                       override_value, reason, applied_by, applied_at)
  ```
- **Server Action `checkPlanLimit(tenant_id, limit_type)`:** consulta `Plan.max_*` → verifica `TenantLimitOverride` → compara com contagem atual → retorna `{ allowed, current, max, percentage }`
- **Middleware:** Executado antes de `createPatient()` e `inviteTeamMember()`; erro padronizado `PLAN_LIMIT_REACHED` retornado ao frontend

---

## BIL-011 — Histórico de Faturas e Itens de Cobrança

**Tipo:** Story | **Prioridade:** Média | **Sprint:** 3  
**Dependências:** BIL-004

**User Story:**  
Como owner, quero visualizar o histórico completo de faturas com todos os itens discriminados e fazer download do PDF de cada fatura, para fins de controle financeiro e prestação de contas.

**Critérios de Aceite:**
- [ ] Listagem de todas as faturas com: mês de referência, data de vencimento, data de pagamento, valor total, status (badge colorido)
- [ ] Clique na fatura expande detalhamento de itens: plano base, cada add-on, descontos de cupom, acréscimo PIX (se houver)
- [ ] Download de PDF de cada fatura com: logo da clínica, dados do prestador (ClinixFlow), dados do tomador (clínica), itens discriminados, valor total, forma de pagamento
- [ ] Fatura com status FAILED exibe botão "Regularizar pagamento" que leva para a tela de bloqueio/regularização
- [ ] Filtro por ano e status
- [ ] Exportação da listagem em XLSX (útil para contabilidade do cliente)

**Refinamento Técnico:**
- **PDF da fatura:** Gerado server-side com `@react-pdf/renderer`; armazenado em Supabase Storage com URL assinada de acesso (expiração de 1h para download); regenerado se não existir
- **Backend:** `getInvoiceHistory(tenant_id, filters)` com paginação por cursor; `getInvoiceItems(invoice_id)` retorna `InvoiceItem[]` com types discriminados
- **XLSX:** `xlsx` (SheetJS) gerando planilha com colunas: Mês, Vencimento, Pagamento, Plano, Add-ons, Desconto, Total, Status

---

## BIL-012 — Painel de Tenants e Assinaturas (Backoffice Admin)

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