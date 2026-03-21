# REL-004: Relatório de Devolutiva de Pacientes

**Tipo:** Story | **Prioridade:** Média | **Sprint:** 4

**User Story:**  
Como coordenador clínico, quero um relatório consolidado de todas as devolutivas enviadas aos pacientes no período, para acompanhar o cumprimento dos protocolos de comunicação.

**Critérios de Aceite:**
- [ ] Lista de devolutivas enviadas com: paciente, profissional, instrumento avaliado, data envio, canal (email/WhatsApp), status de entrega
- [ ] Filtros: período, profissional, instrumento, canal
- [ ] Indicador de pacientes que receberam devolutiva vs que não receberam (no período com avaliações finalizadas)
- [ ] Exportação XLSX

**Refinamento Técnico:**
- **Backend:** JOIN entre `Assessment` (FINALIZED no período) e `AssessmentFeedback`; identificar avaliações sem feedback como "Devolutiva Pendente"
- **Frontend:** Tabela com badge de status: "Enviado ✓", "Pendente ⚠️"

---
