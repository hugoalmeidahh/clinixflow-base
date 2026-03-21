# AVA-004: Relatório Individual de Avaliação

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 3

**User Story:**  
Como profissional, quero gerar e imprimir/exportar o relatório individual de uma avaliação finalizada, com os resultados por seção, gráficos comparativos e as considerações clínicas geradas automaticamente.

**Critérios de Aceite:**
- [ ] Relatório inclui: dados do paciente, dados do profissional, data de aplicação, instrumento usado (nome + versão)
- [ ] Por seção: score obtido, score máximo possível, percentual, faixa atingida, texto de consideração
- [ ] Score global com faixa e consideração geral
- [ ] Gráfico de radar/teia (spider chart) com os scores normalizados por seção
- [ ] Observações do profissional
- [ ] Exportação em PDF com logo e dados da clínica no cabeçalho
- [ ] Relatório disponível no prontuário do paciente após finalização

**Refinamento Técnico:**
- **Frontend:** Componente React do relatório usando Recharts `RadarChart` para spider chart; versão "print" com CSS `@media print`
- **PDF:** Geração server-side com Puppeteer ou `@react-pdf/renderer`; armazenar PDF gerado no Supabase Storage e salvar URL em `Assessment.report_url`
- **Prontuário:** Link para relatório aparece na timeline do paciente com tag "Avaliação: [Nome do Instrumento]"

---
