# BIL-008: Portal de Billing do Owner (Minha Assinatura)

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
