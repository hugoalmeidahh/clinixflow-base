# FIN-002: Lançamentos Financeiros (Entrada e Saída)

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 1

**User Story:**  
Como financeiro da clínica, quero registrar entradas e saídas manualmente ou vinculadas a atendimentos, para manter o fluxo de caixa atualizado em tempo real.

**Critérios de Aceite:**
- [ ] Formulário de lançamento com: tipo (RECEITA/DESPESA), valor, data de competência, data de pagamento, categoria, centro de custo, descrição, status (PENDENTE / PAGO / CANCELADO)
- [ ] Lançamento pode ser vinculado a: paciente, atendimento/agendamento, ou avulso
- [ ] Ao marcar agendamento como "Compareceu + Pago" na base clínica, um lançamento de receita deve ser criado automaticamente com os dados do atendimento
- [ ] Edição permitida apenas em lançamentos com status PENDENTE; PAGO é imutável
- [ ] Cancelamento gera registro de auditoria com motivo obrigatório
- [ ] Upload de comprovante (PDF/imagem) vinculado ao lançamento, armazenado no Supabase Storage

**Refinamento Técnico:**
- **DB:** Tabela `FinancialEntry` (id, tenant_id, type, amount, competence_date, payment_date, status, category_id, cost_center_id, patient_id nullable, appointment_id nullable, description, receipt_url, created_by, created_at)
- **Backend:** Hook/evento no módulo de agendamento — ao atualizar status para ATTENDED_PAID, chamar `createFinancialEntryFromAppointment()`; Server Action separada para lançamento manual
- **Auditoria:** Tabela `FinancialEntryAudit` para cancellamentos e alterações críticas
- **Storage:** Bucket `financial-receipts/{tenant_id}/{entry_id}/` no Supabase

---
