# BIL-002: Gestão de Cupons de Desconto (Backoffice)

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
