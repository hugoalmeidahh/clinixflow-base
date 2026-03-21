# FIN-008: Fechamento por Convênio

**Tipo:** Story | **Prioridade:** Média | **Sprint:** 4

**User Story:**  
Como faturista, quero gerar o fechamento mensal de atendimentos por convênio, para organizar a cobrança à operadora com os procedimentos e guias do período.

**Critérios de Aceite:**
- [ ] Seleção de convênio + período (mês/ano) para geração do fechamento
- [ ] Lista de atendimentos com: paciente, data, procedimento, código TUSS, número da guia, valor
- [ ] Totalizador por procedimento e total geral
- [ ] Exportação em XLSX e PDF
- [ ] Marcar fechamento como "Enviado à Operadora" com data de envio
- [ ] Marcar como "Recebido" com data e valor efetivamente pago (pode diferir do cobrado)

**Refinamento Técnico:**
- **DB:** Tabela `InsuranceBatch` (id, tenant_id, insurance_id, period_month, period_year, status: OPEN/SENT/RECEIVED, sent_at, received_at, billed_amount, received_amount); tabela de junção `InsuranceBatchItem` ligando a `FinancialEntry` ou `Appointment`
- **Backend:** Query que cruza `Appointment` com `InsuranceGuide` e filtra por período e convênio
- **Integração futura:** estrutura preparada para exportação TISS XML (campos `tuss_code` e `ans_code` já presentes no schema base)

---

# EPIC-AVA — MÓDULO DE AVALIAÇÕES

> Módulo de criação e aplicação de instrumentos de avaliação clínica (anamnese, PORTAGE, TO, psicologia, fono, psicomotricidade, nutricionista). Resultados calculados com pesos, gerando considerações automáticas e relatório com gráficos comparativos. Resultados são IMUTÁVEIS após finalização.

---
