# AVA-006: Controle de Acesso por Especialidade

**Tipo:** Story | **Prioridade:** Média | **Sprint:** 2

**User Story:**  
Como administrador, quero que cada instrumento de avaliação seja visível e aplicável apenas pelos profissionais da especialidade correta, para evitar que um fisioterapeuta aplique uma avaliação nutricional, por exemplo.

**Critérios de Aceite:**
- [ ] Instrumento tem campo "Especialidades permitidas" (multi-select)
- [ ] Ao iniciar avaliação, o sistema filtra instrumentos disponíveis pela especialidade do profissional logado
- [ ] Admin pode marcar instrumento como "Universal" (visível a todos os profissionais)
- [ ] Log de tentativa de acesso a instrumento não autorizado

**Refinamento Técnico:**
- **DB:** Tabela `AssessmentTemplateSpecialty` (template_id, specialty_id) para relação N:N; flag `is_universal` em `AssessmentTemplate`
- **Backend:** Filtro automático nas queries de listagem de templates baseado no `professional.specialty_id`; middleware que bloqueia `startAssessment()` se especialidade não autorizada

---
