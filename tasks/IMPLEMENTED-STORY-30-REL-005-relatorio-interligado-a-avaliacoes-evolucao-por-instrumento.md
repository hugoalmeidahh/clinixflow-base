# REL-005: Relatório Interligado a Avaliações (Evolução por Instrumento)

**Tipo:** Story | **Prioridade:** Média | **Sprint:** 4

**User Story:**  
Como coordenador clínico, quero um relatório agregado mostrando a evolução de todos os pacientes avaliados com um mesmo instrumento, para identificar padrões e eficácia do tratamento.

**Critérios de Aceite:**
- [ ] Seleção de instrumento + período
- [ ] Tabela: paciente, data 1ª avaliação, data última avaliação, score inicial, score final, variação (%)
- [ ] Gráfico de dispersão: score inicial vs score final (ponto por paciente)
- [ ] Distribuição de pacientes por faixa de score na última avaliação
- [ ] Filtros: profissional aplicador, especialidade

**Refinamento Técnico:**
- **Backend:** Query com `FIRST_VALUE` e `LAST_VALUE` (window functions) para pegar primeira e última avaliação por paciente+instrumento; calcular delta percentual
- **Frontend:** Recharts `ScatterChart` para gráfico de dispersão; tabela exportável

---
