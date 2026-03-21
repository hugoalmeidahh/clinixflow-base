# VAC-008: Emissão de NFSe para Aplicações de Vacinas

**Tipo:** Story | **Prioridade:** Média | **Sprint:** 4

**User Story:**  
Como faturista, quero emitir notas fiscais para as aplicações de vacinas particulares, selecionando múltiplas aplicações de uma vez, para agilizar o faturamento.

**Critérios de Aceite:**
- [ ] Integrado ao módulo financeiro (FIN-007) — usa a mesma infraestrutura de NFSe
- [ ] Na tela de aplicações, filtrar por: período, paciente, status de NF (sem nota / com nota)
- [ ] Seleção múltipla de aplicações → "Gerar NF" → preview → emitir
- [ ] Código de serviço LC116 configurável por tenant para aplicações de vacinas
- [ ] Após emissão, lançamento de receita criado automaticamente no módulo financeiro (FIN-002)

**Refinamento Técnico:**
- Reutilizar `emitNFSe()` de FIN-007 com adapter para popular campos a partir de `VaccineApplication` em vez de `Appointment`
- **DB:** Campo `invoice_id` nullable em `VaccineApplication` para rastreamento da nota gerada

---
