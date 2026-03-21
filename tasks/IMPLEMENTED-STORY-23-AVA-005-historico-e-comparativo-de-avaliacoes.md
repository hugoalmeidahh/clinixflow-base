# AVA-005: Histórico e Comparativo de Avaliações

**Tipo:** Story | **Prioridade:** Média | **Sprint:** 3

**User Story:**  
Como profissional, quero visualizar o histórico de avaliações de um paciente com o mesmo instrumento e comparar resultados ao longo do tempo, para acompanhar a evolução do tratamento.

**Critérios de Aceite:**
- [ ] Na ficha do paciente: aba "Avaliações" com listagem de todas as avaliações finalizadas
- [ ] Filtro por instrumento para ver apenas um tipo de avaliação
- [ ] Gráfico de linha mostrando evolução do score global ao longo das datas de aplicação
- [ ] Comparativo lado a lado de duas avaliações selecionadas (scorecards por seção)
- [ ] Badge indicando melhora (↑), piora (↓) ou estabilidade (→) em relação à avaliação anterior

**Refinamento Técnico:**
- **Backend:** Query `getAssessmentHistory(patient_id, template_id)` retornando lista de `AssessmentResult` agrupados por data; query de diff calculando variação percentual entre avaliações consecutivas
- **Frontend:** Recharts `LineChart` para evolução temporal; tabela comparativa com código de cores; seleção de duas avaliações via checkbox

---
