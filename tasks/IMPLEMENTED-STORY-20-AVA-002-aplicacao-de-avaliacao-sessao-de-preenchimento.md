# AVA-002: Aplicação de Avaliação (Sessão de Preenchimento)

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 2

**User Story:**  
Como profissional de saúde, quero aplicar um instrumento de avaliação a um paciente, respondendo as perguntas de forma guiada, para gerar um resultado calculado automaticamente ao final.

**Critérios de Aceite:**
- [ ] Iniciar avaliação vinculando: paciente + instrumento + profissional + data de aplicação
- [ ] Interface de preenchimento passo a passo (seção por seção) com barra de progresso
- [ ] Salvar rascunho automaticamente a cada resposta (auto-save) — avaliação fica em status RASCUNHO
- [ ] Ao concluir todas as perguntas obrigatórias: botão "Calcular e Finalizar"
- [ ] Sistema calcula score de cada seção e score global automaticamente
- [ ] Exibe resultado calculado com a faixa correspondente e o texto de consideração para cada seção e consideração geral
- [ ] Profissional pode adicionar observações livres antes de finalizar
- [ ] Ao clicar "Finalizar e Assinar": avaliação torna-se IMUTÁVEL; registro de `finalized_by`, `finalized_at`
- [ ] Avaliações em RASCUNHO podem ser editadas; FINALIZADAS não

**Refinamento Técnico:**
- **DB:**
  - `Assessment` (id, tenant_id, patient_id, template_id, template_version, professional_id, status: DRAFT|FINALIZED, applied_at, finalized_by, finalized_at, notes)
  - `AssessmentAnswer` (id, assessment_id, question_id, option_id nullable, text_value nullable, numeric_value nullable)
  - `AssessmentResult` (id, assessment_id, section_id nullable [null = global], raw_score, normalized_score, range_label, consideration_text)
- **Cálculo:** Server Action `calculateAssessmentResult(assessment_id)` — itera respostas, soma pesos, aplica multiplicadores de seção, determina faixa; salva em `AssessmentResult`
- **Imutabilidade:** Middleware de validação em todas as mutations que verifica `status !== FINALIZED` antes de permitir alteração

---
