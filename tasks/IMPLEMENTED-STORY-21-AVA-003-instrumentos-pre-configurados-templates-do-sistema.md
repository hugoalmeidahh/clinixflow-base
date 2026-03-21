# AVA-003: Instrumentos Pré-Configurados (Templates do Sistema)

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 2

**User Story:**  
Como clínica recém-cadastrada, quero ter acesso a instrumentos de avaliação clássicos já configurados no sistema, para começar a aplicar avaliações sem precisar construir tudo do zero.

**Critérios de Aceite:**
- [ ] Biblioteca de templates globais (não editáveis, mantidos pelo SaaS): Anamnese Geral, PORTAGE, Avaliação de TO, Avaliação Psicológica (triagem), Avaliação Fonoaudiológica, Avaliação de Psicomotricidade, Anamnese Nutricional
- [ ] Tenant pode "clonar" um template global para seu acervo e então personalizar
- [ ] Templates globais ficam atualizados pelo SaaS Admin sem afetar avaliações já realizadas (versionamento)
- [ ] Indicação visual de "Template Oficial ClinixFlow" vs "Criado pela sua clínica"

**Refinamento Técnico:**
- **DB:** Campo `is_system_template` (boolean) e `owner_tenant_id` nullable em `AssessmentTemplate`; templates globais têm `owner_tenant_id = null`
- **Seed:** Script de seed com os instrumentos pré-configurados incluindo seções, perguntas, opções e faixas de score baseados nos padrões clínicos brasileiros
- **Clone:** Server Action `cloneTemplateForTenant(template_id, tenant_id)` que cria cópia completa do template e todas as entidades filhas

---
