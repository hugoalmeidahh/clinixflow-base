# BIL-001: Modelo de Planos e Módulos (Backoffice)

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
