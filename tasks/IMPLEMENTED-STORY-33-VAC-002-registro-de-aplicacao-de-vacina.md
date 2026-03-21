# VAC-002: Registro de Aplicação de Vacina

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 1

**User Story:**  
Como enfermeiro, quero registrar a aplicação de uma vacina a um paciente, vinculando ao lote correto e atualizando o estoque automaticamente, para manter o histórico vacinal preciso.

**Critérios de Aceite:**
- [ ] Formulário de aplicação: paciente, vacina, dose (1ª, 2ª, 3ª, reforço), lote (selecionado com validade visível), profissional aplicador, data/hora, local de aplicação (braço D/E, coxa D/E), observações
- [ ] Ao salvar: decrementar `current_quantity` do lote selecionado
- [ ] Bloquear seleção de lote vencido ou com saldo = 0
- [ ] Aviso se paciente já recebeu esta dose anteriormente
- [ ] Geração automática de sugestão de próxima dose (ver VAC-003)
- [ ] Aplicação registrada aparece imediatamente na carteirinha do paciente

**Refinamento Técnico:**
- **DB:** Tabela `VaccineApplication` (id, tenant_id, patient_id, vaccine_id, batch_id, dose_number, dose_label, applied_by, applied_at, application_site, notes, synced_to_rnds: boolean)
- **Transação atômica:** `registerApplication()` cria `VaccineApplication` + `VaccineStockMovement` (tipo APPLICATION) + `VaccineSuggestion` em uma única transação Prisma
- **Validação:** Server Action verifica `batch.expiry_date > today` e `batch.current_quantity > 0` antes de registrar

---
