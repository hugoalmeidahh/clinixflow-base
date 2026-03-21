# VAC-001: Cadastro de Vacinas e Estoque por Lote

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 1

**User Story:**  
Como farmacêutico/enfermeiro, quero cadastrar vacinas com controle de estoque por lote e validade, para garantir rastreabilidade e evitar uso de doses vencidas.

**Critérios de Aceite:**
- [ ] CRUD de Vacinas: nome comercial, nome genérico, fabricante, dose padrão (ml), via de administração, código no SIPNI
- [ ] Entrada de estoque por Lote: número do lote, validade, quantidade, vacina referenciada, data de entrada, nota fiscal de entrada
- [ ] Saldo atual calculado automaticamente: entradas - saídas (aplicações)
- [ ] Configuração de estoque mínimo por vacina
- [ ] Alertas visuais: lote com validade em ≤ 30 dias (amarelo), ≤ 7 dias (vermelho), saldo abaixo do mínimo (âmbar)
- [ ] Listagem de lotes com filtro: "A vencer", "Vencidos", "Abaixo do mínimo", "Ativos"

**Refinamento Técnico:**
- **DB:**
  - `Vaccine` (id, tenant_id, commercial_name, generic_name, manufacturer, dose_ml, administration_route, sipni_code, minimum_stock)
  - `VaccineBatch` (id, vaccine_id, tenant_id, lot_number, expiry_date, initial_quantity, current_quantity)
  - `VaccineStockMovement` (id, batch_id, type: ENTRY|APPLICATION|DISPOSAL|ADJUSTMENT, quantity, reference_id nullable, notes, created_at, created_by)
- **CRON:** Job diário às 7h verificando validades e saldos mínimos; inserir notificações no sistema e enviar e-mail para responsável configurado
- **Consistência:** Decrementar `current_quantity` do lote FIFO (primeiro a vencer, primeiro a usar) ao registrar aplicação

---
