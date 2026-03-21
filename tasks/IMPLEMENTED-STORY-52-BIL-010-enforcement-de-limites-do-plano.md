# BIL-010: Enforcement de Limites do Plano

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
