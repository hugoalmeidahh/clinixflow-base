# REL-001: Relatório de Acompanhamento do Paciente

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 3

**User Story:**  
Como profissional, quero gerar um relatório completo do paciente com histórico de atendimentos, avaliações aplicadas e evolução, para ter uma visão longitudinal do tratamento.

**Critérios de Aceite:**
- [ ] Seleção de paciente + período
- [ ] Seções do relatório: dados do paciente, resumo do tratamento, histórico de atendimentos (data, profissional, tipo, status), avaliações realizadas com resultados e evolução
- [ ] Gráfico de evolução de avaliações (se houver múltiplas do mesmo instrumento)
- [ ] Frequência de comparecimento: % presença no período
- [ ] Exportação em PDF com cabeçalho da clínica

**Refinamento Técnico:**
- **Backend:** Query federada cruzando `Appointment`, `Assessment`, `AssessmentResult` para o patient_id no período; calcular taxa de frequência como `(comparecimentos / agendamentos) * 100`
- **Frontend:** Componente de relatório imprimível com `@media print`; Recharts para gráficos embutidos no PDF via Puppeteer

---
