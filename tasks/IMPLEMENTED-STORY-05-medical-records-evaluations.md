> **[IMPLEMENTED]** - Esta story já foi implementada na Fase 1/Core.

# STORY-05: Prontuário Eletrônico e Avaliações

## Descrição
Como Profissional de Saúde, preciso de um ambiente seguro para registrar a evolução clínica dos meus pacientes, preencher avaliações estruturadas e anexar exames, cumprindo requisitos LGPD e do conselho profissional.

## Acceptance Criteria
- [ ] Timeline cronológica de todos os eventos clínicos (Evoluções, Faltas, Avaliações, Documentos).
- [ ] Formulário de Evolução Clínica com editor rich text.
- [ ] Avaliações customizáveis por especialidade (Anamnese, TGMD-2, etc.) com cálculo automático de escores.
- [ ] Botão de "Finalizar", que bloqueia permanentemente a edição da evolução ou avaliação (Imutabilidade).
- [ ] Upload de documentos em categorias (Exames, Laudos) salvos em Bucket RLS.
- [ ] Emissão de Receituário/Prescrição e Atestado de Comparecimento (pdf template).

## Sub-tasks
1. **Layout do Prontuário**: Implementar a UI em abas (Info, Agenda, Timeline Clínica, Documentos).
2. **Timeline de Eventos**: Unificar queries de diferentes tabelas para montar o histórico ordenado por data e ícone de tipo.
3. **Editor de Evolução e Imutabilidade**: Criar UI com Tiptap/Quill e Trigger Postgres (`BEFORE UPDATE`) bloqueando edições se o status for `FINALIZED`.
4. **Módulo de Anexos**: Interface de drag-and-drop enviando para Supabase Storage.
5. **Avaliações Dinâmicas**: Desenvolver renderizador de formulários (JSON-driven) e calculador de escores.

## Refinamento Técnico
- A imutabilidade da avaliação finalizada deve ser garantida no Banco através de Triggers, não apenas travando a UI no frontend. 
- Usar Storage do Supabase com buckets fechados, onde usuários só leem anexos de pacientes do próprio `tenant_id`.
