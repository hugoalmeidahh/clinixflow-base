# AVA-001: Construtor de Instrumentos de Avaliação

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 1

**User Story:**  
Como administrador clínico, quero criar e configurar instrumentos de avaliação personalizados (com seções, perguntas e pesos), para que os profissionais possam aplicá-los aos pacientes de forma padronizada.

**Critérios de Aceite:**
- [ ] CRUD de Instrumentos: nome, descrição, especialidade(s) alvo, versão, status (ATIVO/INATIVO)
- [ ] Cada instrumento tem N Seções (ex: "Desenvolvimento Motor", "Linguagem")
- [ ] Cada seção tem N Perguntas com: texto da pergunta, tipo de resposta (escala Likert, múltipla escolha, sim/não, texto livre, numérico)
- [ ] Para respostas objetivas: cada opção tem peso numérico configurável
- [ ] Configuração de faixas de score por seção: definir intervalos (ex: 0-30 = "Abaixo do esperado", 31-60 = "Em desenvolvimento", 61-100 = "Adequado") com texto de consideração para cada faixa
- [ ] Faixas de score global (soma de todas as seções) com texto de consideração geral
- [ ] Preview do instrumento antes de publicar
- [ ] Versioning: ao editar instrumento publicado, criar nova versão; avaliações anteriores mantêm referência à versão usada

**Refinamento Técnico:**
- **DB:**
  - `AssessmentTemplate` (id, tenant_id, name, specialty, version, status, created_by)
  - `AssessmentSection` (id, template_id, title, order, weight_multiplier)
  - `AssessmentQuestion` (id, section_id, text, type: SCALE|MULTIPLE|BOOLEAN|TEXT|NUMERIC, order, is_required)
  - `AssessmentOption` (id, question_id, label, value/weight)
  - `AssessmentScoreRange` (id, template_id OR section_id, min_score, max_score, label, consideration_text)
- **Frontend:** Builder drag-and-drop para reordenar seções e perguntas; preview side-by-side em tempo real

---
