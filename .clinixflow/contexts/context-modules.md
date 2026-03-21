# claude.md

# ClinixFlow v2 — Backlog: Novos Módulos
> Formato: Jira Ticket | User Story + Critérios de Aceite + Refinamento Técnico  
> Stack: Next.js 15 · Supabase (Postgres + Storage) · Prisma ORM · NextAuth.js v5  
> Gerado em: Março/2026 | Pleno Inovação

---

## ÍNDICE DE EPICS

| Epic | Módulo | Tickets |
|------|--------|---------|
| EPIC-FIN | Financeiro | FIN-001 a FIN-008 |
| EPIC-AVA | Avaliações | AVA-001 a AVA-007 |
| EPIC-REL | Relatórios | REL-001 a REL-006 |
| EPIC-VAC | Vacinas | VAC-001 a VAC-011 |

---

# EPIC-FIN — MÓDULO FINANCEIRO

> Módulo de gestão financeira básica integrado à base da clínica. Todas as movimentações devem estar vinculadas a atendimentos, pacientes ou centros de custo. NFSe emitida via API parceira.

---

## FIN-001 — Plano de Contas e Centro de Custo

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 1

**User Story:**  
Como administrador da clínica, quero configurar o plano de contas (categorias de receita e despesa) e os centros de custo, para que todas as movimentações financeiras sejam classificadas corretamente desde o lançamento.

**Critérios de Aceite:**
- [ ] CRUD completo de Categorias financeiras com tipo (RECEITA / DESPESA)
- [ ] Suporte a subcategorias (ex: Receita > Consultas > Particular / Convênio)
- [ ] CRUD completo de Centros de Custo com código alfanumérico único por tenant
- [ ] Toda movimentação financeira deve obrigatoriamente ter categoria e, opcionalmente, centro de custo
- [ ] Inativação de categoria não deve apagar histórico — apenas impede novos lançamentos
- [ ] Listagem filtrada por tipo, status (ativo/inativo) e busca textual

**Refinamento Técnico:**
- **DB:** Tabelas `FinancialCategory` (id, tenant_id, name, type: INCOME|EXPENSE, parent_id nullable, is_active) e `CostCenter` (id, tenant_id, code, name, is_active)
- **Backend:** Server Actions para CRUD; validar unicidade de `code` do centro de custo por tenant; soft-delete via `is_active`
- **Frontend:** Tela em Settings → Financeiro; árvore de categorias com expand/collapse; formulário inline de criação rápida

---

## FIN-002 — Lançamentos Financeiros (Entrada e Saída)

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 1

**User Story:**  
Como financeiro da clínica, quero registrar entradas e saídas manualmente ou vinculadas a atendimentos, para manter o fluxo de caixa atualizado em tempo real.

**Critérios de Aceite:**
- [ ] Formulário de lançamento com: tipo (RECEITA/DESPESA), valor, data de competência, data de pagamento, categoria, centro de custo, descrição, status (PENDENTE / PAGO / CANCELADO)
- [ ] Lançamento pode ser vinculado a: paciente, atendimento/agendamento, ou avulso
- [ ] Ao marcar agendamento como "Compareceu + Pago" na base clínica, um lançamento de receita deve ser criado automaticamente com os dados do atendimento
- [ ] Edição permitida apenas em lançamentos com status PENDENTE; PAGO é imutável
- [ ] Cancelamento gera registro de auditoria com motivo obrigatório
- [ ] Upload de comprovante (PDF/imagem) vinculado ao lançamento, armazenado no Supabase Storage

**Refinamento Técnico:**
- **DB:** Tabela `FinancialEntry` (id, tenant_id, type, amount, competence_date, payment_date, status, category_id, cost_center_id, patient_id nullable, appointment_id nullable, description, receipt_url, created_by, created_at)
- **Backend:** Hook/evento no módulo de agendamento — ao atualizar status para ATTENDED_PAID, chamar `createFinancialEntryFromAppointment()`; Server Action separada para lançamento manual
- **Auditoria:** Tabela `FinancialEntryAudit` para cancellamentos e alterações críticas
- **Storage:** Bucket `financial-receipts/{tenant_id}/{entry_id}/` no Supabase

---

## FIN-003 — Livro Caixa

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 2

**User Story:**  
Como gestor financeiro, quero visualizar o livro caixa com saldo inicial, todas as movimentações do período e saldo final, para acompanhar a posição de caixa diária e mensal.

**Critérios de Aceite:**
- [ ] Visão de livro caixa filtrável por: período (data início/fim), centro de custo, categoria, tipo
- [ ] Exibir: saldo anterior ao período, cada lançamento em ordem cronológica, saldo acumulado após cada lançamento, saldo final do período
- [ ] Totalizadores: Total de Entradas, Total de Saídas, Saldo do Período
- [ ] Exportação em PDF e XLSX
- [ ] Filtro rápido: "Hoje", "Esta semana", "Este mês", "Mês anterior", "Período customizado"

**Refinamento Técnico:**
- **Backend:** Query analítica com `SUM` cumulativo (window function `SUM() OVER (ORDER BY payment_date)`); filtros passados via Server Action; resultados paginados com cursor
- **Performance:** Índices em `(tenant_id, payment_date, status)` na tabela `FinancialEntry`
- **Export PDF:** Biblioteca `@react-pdf/renderer` ou `puppeteer` gerando PDF server-side; enviar via download
- **Export XLSX:** Biblioteca `xlsx` (SheetJS) montando planilha com totalizadores no rodapé

---

## FIN-004 — Contas a Pagar e a Receber

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 2

**User Story:**  
Como financeiro, quero visualizar separadamente as contas a pagar e a receber com seus respectivos vencimentos e status, para priorizar cobranças e pagamentos.

**Critérios de Aceite:**
- [ ] Painel "A Receber": lista de lançamentos de receita com status PENDENTE, ordenados por data de vencimento
- [ ] Painel "A Pagar": lista de lançamentos de despesa com status PENDENTE, ordenados por data de vencimento
- [ ] Alertas visuais: vencido (vermelho), vence hoje (âmbar), vence em até 7 dias (amarelo)
- [ ] Ação de "Baixar" lançamento (marcar como PAGO) diretamente na listagem com confirmação de data/valor recebido
- [ ] Filtros: por categoria, centro de custo, período, paciente
- [ ] Totalizador: Valor total a receber / a pagar no período filtrado

**Refinamento Técnico:**
- **DB:** Nenhuma tabela nova — usar `FinancialEntry` com filtro de status PENDENTE e tipo
- **Backend:** Server Actions `getPendingReceivables()` e `getPendingPayables()` com filtros dinâmicos
- **Frontend:** Dois tabs ou páginas separadas; badge de contagem no menu lateral; botão "Baixar" abre modal com data e valor real recebido (pode diferir do valor original)

---

## FIN-005 — Parcelamento e Recorrência

**Tipo:** Story | **Prioridade:** Média | **Sprint:** 3

**User Story:**  
Como financeiro, quero lançar uma despesa ou receita parcelada ou recorrente, para que o sistema gere automaticamente as parcelas futuras sem necessidade de lançamento manual repetido.

**Critérios de Aceite:**
- [ ] Ao criar lançamento, opção de: Parcelado (N parcelas) ou Recorrente (semanal/mensal/anual)
- [ ] Sistema gera todas as parcelas automaticamente com datas calculadas
- [ ] Cada parcela é um `FinancialEntry` independente; ao baixar uma parcela, as demais não são afetadas
- [ ] Parcelas vinculadas por `installment_group_id` para rastreabilidade
- [ ] Cancelar o grupo cancela todas as parcelas PENDENTES (as PAGAS permanecem)

**Refinamento Técnico:**
- **DB:** Campo `installment_group_id` (UUID) e `installment_number` / `installment_total` em `FinancialEntry`
- **Backend:** `createInstallmentGroup()` que gera N entradas em transação atômica; `cancelInstallmentGroup()` com soft-cancel apenas nas PENDENTES
- **Frontend:** Formulário com toggle "Parcelado / Recorrente" que expande campos adicionais; preview das parcelas antes de confirmar

---

## FIN-006 — Dashboard Financeiro

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 2

**User Story:**  
Como gestor, quero um dashboard financeiro com os principais indicadores do mês, para ter uma visão rápida da saúde financeira da clínica sem precisar navegar em relatórios.

**Critérios de Aceite:**
- [ ] Cards: Receitas do mês, Despesas do mês, Saldo do mês, A Receber, A Pagar
- [ ] Gráfico de barras: Receitas vs Despesas (últimos 6 meses)
- [ ] Gráfico de rosca: Distribuição de receitas por categoria (top 5)
- [ ] Lista dos 5 lançamentos pendentes mais próximos do vencimento
- [ ] Filtro por centro de custo afeta todos os cards e gráficos
- [ ] Período padrão: mês atual; seletor de mês disponível

**Refinamento Técnico:**
- **Backend:** Queries agregadas com `GROUP BY month`, `GROUP BY category`; cache de 5 minutos via `unstable_cache` do Next.js para não sobrecarregar o banco
- **Frontend:** Recharts para gráficos; cards com skeleton loading; atualização ao trocar filtro sem reload de página

---

## FIN-007 — Emissão de Nota Fiscal de Serviço (NFSe)

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 3

**User Story:**  
Como faturista, quero emitir notas fiscais de serviço diretamente da plataforma a partir dos atendimentos realizados, e enviá-las automaticamente por e-mail ao paciente ou responsável financeiro.

**Critérios de Aceite:**
- [ ] Configuração da integração NFSe por tenant: API Key do provedor (Focus NFe ou eNotas), dados fiscais da clínica (CNPJ, IM, regime tributário, código de serviço LC116)
- [ ] Seleção múltipla de lançamentos/atendimentos para agrupar em uma NFSe
- [ ] Preview da nota antes de emitir com todos os dados do tomador e prestador
- [ ] Emissão com retorno do número da nota, PDF e XML
- [ ] Envio automático do PDF por e-mail via Resend ao e-mail do responsável financeiro do paciente
- [ ] Status da nota: PENDENTE_AUTORIZACAO / AUTORIZADA / CANCELADA / ERRO
- [ ] Cancelamento de nota dentro do prazo legal com motivo obrigatório
- [ ] Histórico de notas emitidas com filtros por período e paciente

**Refinamento Técnico:**
- **DB:** Tabela `Invoice` (id, tenant_id, nfse_number, status, pdf_url, xml_url, patient_id, amount, service_code, issued_at, cancelled_at, cancel_reason, external_id do provedor)
- **Integração:** HTTP client para Focus NFe / eNotas; Webhook receiver para atualização assíncrona de status de autorização da prefeitura
- **Backend:** `emitNFSe()` como Server Action; webhook handler em `/api/webhooks/nfse`; retry automático com backoff exponencial para erros de comunicação
- **Email:** Template Resend com PDF anexo; fallback para link de download se PDF > 10MB

---

## FIN-008 — Fechamento por Convênio

**Tipo:** Story | **Prioridade:** Média | **Sprint:** 4

**User Story:**  
Como faturista, quero gerar o fechamento mensal de atendimentos por convênio, para organizar a cobrança à operadora com os procedimentos e guias do período.

**Critérios de Aceite:**
- [ ] Seleção de convênio + período (mês/ano) para geração do fechamento
- [ ] Lista de atendimentos com: paciente, data, procedimento, código TUSS, número da guia, valor
- [ ] Totalizador por procedimento e total geral
- [ ] Exportação em XLSX e PDF
- [ ] Marcar fechamento como "Enviado à Operadora" com data de envio
- [ ] Marcar como "Recebido" com data e valor efetivamente pago (pode diferir do cobrado)

**Refinamento Técnico:**
- **DB:** Tabela `InsuranceBatch` (id, tenant_id, insurance_id, period_month, period_year, status: OPEN/SENT/RECEIVED, sent_at, received_at, billed_amount, received_amount); tabela de junção `InsuranceBatchItem` ligando a `FinancialEntry` ou `Appointment`
- **Backend:** Query que cruza `Appointment` com `InsuranceGuide` e filtra por período e convênio
- **Integração futura:** estrutura preparada para exportação TISS XML (campos `tuss_code` e `ans_code` já presentes no schema base)

---

# EPIC-AVA — MÓDULO DE AVALIAÇÕES

> Módulo de criação e aplicação de instrumentos de avaliação clínica (anamnese, PORTAGE, TO, psicologia, fono, psicomotricidade, nutricionista). Resultados calculados com pesos, gerando considerações automáticas e relatório com gráficos comparativos. Resultados são IMUTÁVEIS após finalização.

---

## AVA-001 — Construtor de Instrumentos de Avaliação

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

## AVA-002 — Aplicação de Avaliação (Sessão de Preenchimento)

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

## AVA-003 — Instrumentos Pré-Configurados (Templates do Sistema)

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

## AVA-004 — Relatório Individual de Avaliação

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

## AVA-005 — Histórico e Comparativo de Avaliações

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

## AVA-006 — Controle de Acesso por Especialidade

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

## AVA-007 — Devolutiva ao Paciente/Responsável

**Tipo:** Story | **Prioridade:** Média | **Sprint:** 4

**User Story:**  
Como profissional, quero enviar a devolutiva da avaliação ao paciente ou responsável com uma versão simplificada do relatório e uma mensagem personalizada, para comunicar os resultados de forma acessível.

**Critérios de Aceite:**
- [ ] Botão "Enviar Devolutiva" na tela de avaliação finalizada
- [ ] Editor de mensagem personalizada com variáveis automáticas: {nome_paciente}, {data_avaliacao}, {consideracao_geral}
- [ ] Preview da devolutiva antes de enviar
- [ ] Envio por: Email (Resend) e/ou WhatsApp (Evolution API)
- [ ] Devolutiva inclui versão PDF simplificada (sem scores brutos, apenas faixas e considerações em linguagem acessível)
- [ ] Registro de envio com timestamp e canal usado
- [ ] Paciente logado no portal vê suas devolutivas recebidas

**Refinamento Técnico:**
- **DB:** Tabela `AssessmentFeedback` (id, assessment_id, sent_at, channel: EMAIL|WHATSAPP, recipient_email/phone, message, simplified_pdf_url)
- **PDF simplificado:** Template separado do relatório completo — sem scores numéricos, apenas linguagem clínica acessível ao leigo; gerado on-demand
- **WhatsApp:** Integração Evolution API com template de mensagem pré-aprovado; PDF enviado como documento

---

# EPIC-REL — MÓDULO DE RELATÓRIOS

> Relatórios gerenciais, clínicos e financeiros interligados aos demais módulos. Foco em exportação PDF/XLSX e visualizações com gráficos.

---

## REL-001 — Relatório de Acompanhamento do Paciente

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

## REL-002 — Relatório Gerencial da Clínica

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 3

**User Story:**  
Como gestor, quero relatórios gerenciais com indicadores operacionais da clínica (volume de atendimentos, taxa de ocupação, absenteísmo, profissionais mais ativos), para embasar decisões estratégicas.

**Critérios de Aceite:**
- [ ] KPIs: total de atendimentos, taxa de ocupação da agenda (%), taxa de absenteísmo (%), novos pacientes no período, atendimentos por profissional, atendimentos por especialidade
- [ ] Filtros: período, profissional, especialidade, convênio
- [ ] Gráfico de barras: atendimentos por mês (últimos 12 meses)
- [ ] Gráfico de rosca: atendimentos por especialidade
- [ ] Tabela: ranking de profissionais por volume de atendimento
- [ ] Exportação XLSX com todos os dados brutos + aba de resumo

**Refinamento Técnico:**
- **Backend:** Queries analíticas pesadas — considerar `materialized view` no Postgres atualizada via CRON diário para não impactar performance operacional
- **Índices:** Criar índice composto `(tenant_id, scheduled_at, status)` em `Appointment`
- **Cache:** `unstable_cache` com revalidação de 1 hora para relatórios do mês anterior

---

## REL-003 — Relatório Financeiro Gerencial

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 3

**User Story:**  
Como gestor financeiro, quero relatórios financeiros comparativos por período, categoria e centro de custo, para análise de DRE simplificado e tendências.

**Critérios de Aceite:**
- [ ] DRE simplificado: Receitas brutas, Deduções, Receita líquida, Despesas por categoria, Resultado do período
- [ ] Comparativo mês atual vs mês anterior e vs mesmo mês do ano anterior
- [ ] Breakdown por categoria de receita e despesa (top 10 cada)
- [ ] Filtro por centro de custo, período, categoria
- [ ] Gráfico de barras empilhadas: Receitas vs Despesas por mês
- [ ] Exportação PDF (DRE formatado) e XLSX (dados brutos)

**Refinamento Técnico:**
- **DB:** Queries com `GROUP BY category_id, EXTRACT(month FROM payment_date)` e subqueries para comparativos
- **Frontend:** Tabela de DRE com linhas hierárquicas (categoria pai > subcategorias); valores negativos em vermelho, positivos em verde

---

## REL-004 — Relatório de Devolutiva de Pacientes

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

## REL-005 — Relatório Interligado a Avaliações (Evolução por Instrumento)

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

## REL-006 — Central de Relatórios (Hub)

**Tipo:** Story | **Prioridade:** Média | **Sprint:** 4

**User Story:**  
Como usuário, quero acessar todos os relatórios disponíveis em uma central organizada, com histórico dos últimos relatórios gerados, para não precisar configurar os mesmos filtros repetidamente.

**Critérios de Aceite:**
- [ ] Página `/relatorios` com cards de cada tipo de relatório disponível
- [ ] Cada card mostra: nome, descrição, ícone, última vez gerado (por este usuário)
- [ ] Histórico dos últimos 10 relatórios gerados com link para download do arquivo
- [ ] Relatórios "favoritos" fixados no topo
- [ ] Controle de acesso: relatórios financeiros visíveis apenas para roles ADMIN e FINANCEIRO

**Refinamento Técnico:**
- **DB:** Tabela `ReportHistory` (id, tenant_id, user_id, report_type, filters_json, generated_at, file_url, file_type: PDF|XLSX)
- **Storage:** Bucket `reports/{tenant_id}/` com TTL de 30 dias para arquivos gerados
- **RBAC:** Middleware verificando `user.role` antes de renderizar cards de relatórios restritos

---

# EPIC-VAC — MÓDULO DE VACINAS

> Baseado na especificação NetVacinas. Controle de estoque por lote/validade, carteirinha digital do paciente, motor de regras de calendário vacinal, integração RNDS/SIPNI, NFSe e lembretes WhatsApp.

---

## VAC-001 — Cadastro de Vacinas e Estoque por Lote

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 1

**User Story:**  
Como farmacêutico/enfermeiro, quero cadastrar vacinas com controle de estoque por lote e validade, para garantir rastreabilidade e evitar uso de doses vencidas.

**Critérios de Aceite:**
- [ ] CRUD de Vacinas: nome comercial, nome genérico, fabricante, dose padrão (ml), via de administração, código no SIPNI
- [ ] Entrada de estoque por Lote: número do lote, validade, quantidade, vacina referenciada, data de entrada, nota fiscal de entrada
- [ ] Saldo atual calculado automaticamente: entradas - saídas (aplicações)
- [ ] Configuração de estoque mínimo por vacina
- [ ] Alertas visuais: lote com validade em ≤ 30 dias (amarelo), ≤ 7 dias (vermelho), saldo abaixo do mínimo (âmbar)
- [ ] Listagem de lotes com filtro: "A vencer", "Vencidos", "Abaixo do mínimo", "Ativos"

**Refinamento Técnico:**
- **DB:**
  - `Vaccine` (id, tenant_id, commercial_name, generic_name, manufacturer, dose_ml, administration_route, sipni_code, minimum_stock)
  - `VaccineBatch` (id, vaccine_id, tenant_id, lot_number, expiry_date, initial_quantity, current_quantity)
  - `VaccineStockMovement` (id, batch_id, type: ENTRY|APPLICATION|DISPOSAL|ADJUSTMENT, quantity, reference_id nullable, notes, created_at, created_by)
- **CRON:** Job diário às 7h verificando validades e saldos mínimos; inserir notificações no sistema e enviar e-mail para responsável configurado
- **Consistência:** Decrementar `current_quantity` do lote FIFO (primeiro a vencer, primeiro a usar) ao registrar aplicação

---

## VAC-002 — Registro de Aplicação de Vacina

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 1

**User Story:**  
Como enfermeiro, quero registrar a aplicação de uma vacina a um paciente, vinculando ao lote correto e atualizando o estoque automaticamente, para manter o histórico vacinal preciso.

**Critérios de Aceite:**
- [ ] Formulário de aplicação: paciente, vacina, dose (1ª, 2ª, 3ª, reforço), lote (selecionado com validade visível), profissional aplicador, data/hora, local de aplicação (braço D/E, coxa D/E), observações
- [ ] Ao salvar: decrementar `current_quantity` do lote selecionado
- [ ] Bloquear seleção de lote vencido ou com saldo = 0
- [ ] Aviso se paciente já recebeu esta dose anteriormente
- [ ] Geração automática de sugestão de próxima dose (ver VAC-003)
- [ ] Aplicação registrada aparece imediatamente na carteirinha do paciente

**Refinamento Técnico:**
- **DB:** Tabela `VaccineApplication` (id, tenant_id, patient_id, vaccine_id, batch_id, dose_number, dose_label, applied_by, applied_at, application_site, notes, synced_to_rnds: boolean)
- **Transação atômica:** `registerApplication()` cria `VaccineApplication` + `VaccineStockMovement` (tipo APPLICATION) + `VaccineSuggestion` em uma única transação Prisma
- **Validação:** Server Action verifica `batch.expiry_date > today` e `batch.current_quantity > 0` antes de registrar

---

## VAC-003 — Motor de Regras: Sugestão Automática de Próximas Doses

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 2

**User Story:**  
Como profissional de saúde, quero que o sistema sugira automaticamente as próximas doses do calendário vacinal após cada aplicação, para facilitar o agendamento e não deixar o paciente perder prazos.

**Critérios de Aceite:**
- [ ] Configuração do calendário vacinal por vacina: dose, intervalo mínimo (dias), intervalo recomendado (dias), idade recomendada (opcional)
- [ ] Após registrar aplicação, sistema calcula data sugerida para próxima dose e cria uma sugestão com status SUGERIDO
- [ ] Sugestão aparece na carteirinha do paciente destacada visualmente (card amarelo/âmbar)
- [ ] Ao agendar a próxima dose, sugestão muda para status AGENDADO
- [ ] Ao aplicar, muda para APLICADO
- [ ] Sugestão vencida (data sugerida passou sem aplicação) aparece como ATRASADO em vermelho

**Refinamento Técnico:**
- **DB:**
  - `VaccineScheduleRule` (id, vaccine_id, dose_number, min_interval_days, recommended_interval_days, recommended_age_days nullable)
  - `VaccineSuggestion` (id, patient_id, vaccine_id, dose_number, suggested_date, status: SUGGESTED|SCHEDULED|APPLIED|OVERDUE, application_id nullable, appointment_id nullable)
- **Rule Engine:** Função `calculateNextDoseSuggestion(vaccine_id, dose_number, application_date, patient_birthdate)` consultando `VaccineScheduleRule`
- **CRON:** Job diário atualizando sugestões com `suggested_date < today` e `status = SUGGESTED` para `OVERDUE`

---

## VAC-004 — Carteirinha Digital do Paciente

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 2

**User Story:**  
Como paciente, quero acessar minha carteirinha de vacinação digital no portal do paciente, para visualizar todas as vacinas recebidas, próximas doses sugeridas e compartilhar com outras clínicas.

**Critérios de Aceite:**
- [ ] Portal do paciente exibe aba "Carteirinha de Vacinação" (visível sem necessidade de acesso admin)
- [ ] Lista cronológica de vacinas aplicadas: nome, dose, data, lote, profissional aplicador
- [ ] Seção "Próximas doses sugeridas" com vacinas pendentes e datas recomendadas
- [ ] Seção "Doses em atraso" destacada em vermelho
- [ ] QR Code único por paciente que abre a carteirinha em versão pública (sem login) para apresentar em outras clínicas
- [ ] Download da carteirinha em PDF formatado
- [ ] Carteirinha sincronizada com dados do RNDS (quando disponível)

**Refinamento Técnico:**
- **Portal:** Rota `/portal/vacinacao` protegida por sessão do paciente (role PATIENT)
- **QR Code:** Gerar URL assinada com token JWT de curta validade (24h) linkando para `/public/carteirinha/{token}`; rota pública renderiza carteirinha sem autenticação
- **PDF:** Template de carteirinha em formato A5, gerado sob demanda via Puppeteer; cachear por 1h no Supabase Storage

---

## VAC-005 — Agendamento de Vacinas

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 2

**User Story:**  
Como recepcionista, quero agendar a aplicação de vacinas aos pacientes integrando com a agenda principal da clínica, para organizar o fluxo de vacinação.

**Critérios de Aceite:**
- [ ] Agendamento de vacina usa o mesmo sistema de agenda da base (tipo de atendimento = VACINA)
- [ ] Ao agendar, selecionar: vacina(s), dose, profissional aplicador
- [ ] Se há sugestão ativa para o paciente + vacina, vincular automaticamente ao agendamento
- [ ] Lembretes automáticos 48h e 24h antes do agendamento via WhatsApp/Email (Evolution API + Resend)
- [ ] Na tela de aplicação, agenda mostra pacientes agendados para vacinas com botão de acesso rápido ao formulário de aplicação

**Refinamento Técnico:**
- **DB:** Campo `appointment_type` enum em `Appointment` recebe novo valor `VACCINE`; tabela `AppointmentVaccine` (appointment_id, vaccine_id, dose_number, suggestion_id nullable) para múltiplas vacinas por agendamento
- **Lembretes:** Job rodando a cada hora verificando agendamentos em 24h/48h e disparando mensagens via Evolution API (WhatsApp) e Resend (email)

---

## VAC-006 — Lembretes Automáticos de Doses Vencendo

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 3

**User Story:**  
Como clínica, quero que o sistema envie automaticamente lembretes aos pacientes com doses sugeridas nos próximos dias via WhatsApp, para aumentar a adesão ao calendário vacinal sem esforço manual.

**Critérios de Aceite:**
- [ ] Job diário identifica pacientes com `VaccineSuggestion` com `suggested_date` em 7 dias ou 1 dia
- [ ] Envia WhatsApp via Evolution API com mensagem template aprovado
- [ ] Configuração por tenant: ativar/desativar lembretes, dias de antecedência (padrão: 7 e 1 dia)
- [ ] Registro de cada envio com timestamp, canal e status de entrega
- [ ] Paciente pode responder ao WhatsApp para agendar (integração futura — apenas log por ora)

**Refinamento Técnico:**
- **DB:** Tabela `VaccineReminderLog` (id, patient_id, suggestion_id, sent_at, channel, status: SENT|FAILED, message_template)
- **Job:** CRON diário às 8h; fila assíncrona (pg-boss ou similar) para processar envios em background; retry 3x com backoff exponencial em caso de falha da Evolution API
- **Rate Limiting:** Máximo 1 lembrete por paciente por vacina por canal a cada 3 dias (evitar spam)

---

## VAC-007 — Sincronização com RNDS / SIPNI

**Tipo:** Story | **Prioridade:** Alta | **Sprint:** 4

**User Story:**  
Como responsável técnico da clínica, quero que as doses aplicadas sejam transmitidas automaticamente ao RNDS após o registro, para cumprir as obrigações legais sem digitação dupla.

**Critérios de Aceite:**
- [ ] Configuração RNDS por tenant: certificado digital (upload), CNES da clínica, credenciais de acesso
- [ ] Ao registrar aplicação: criar entrada na fila de sincronização com status PENDING
- [ ] Worker processa fila e envia para RNDS; atualiza `synced_to_rnds = true` e armazena ID da transmissão
- [ ] Em caso de falha: retry automático até 5x; após 5 falhas, status FAILED com alerta na interface
- [ ] Painel de monitoramento RNDS: transmissões do dia (pendentes, enviadas, com erro)
- [ ] Reprocessamento manual de transmissões com erro

**Refinamento Técnico:**
- **DB:** Tabela `RNDSQueue` (id, application_id, status: PENDING|SENT|FAILED, attempts, last_attempt_at, rnds_response_id, error_message)
- **Certificado:** Upload do .pfx/.p12 criptografado com AES-256; chave de decriptação no env server; nunca exposto ao frontend
- **Worker:** Pg-boss job rodando a cada 5 minutos; Dead Letter Queue para itens com 5+ falhas
- **Integração:** HTTP client com mutual TLS usando o certificado digital da clínica; mapear resposta FHIR R4 do RNDS

---

## VAC-008 — Emissão de NFSe para Aplicações de Vacinas

**Tipo:** Story | **Prioridade:** Média | **Sprint:** 4

**User Story:**  
Como faturista, quero emitir notas fiscais para as aplicações de vacinas particulares, selecionando múltiplas aplicações de uma vez, para agilizar o faturamento.

**Critérios de Aceite:**
- [ ] Integrado ao módulo financeiro (FIN-007) — usa a mesma infraestrutura de NFSe
- [ ] Na tela de aplicações, filtrar por: período, paciente, status de NF (sem nota / com nota)
- [ ] Seleção múltipla de aplicações → "Gerar NF" → preview → emitir
- [ ] Código de serviço LC116 configurável por tenant para aplicações de vacinas
- [ ] Após emissão, lançamento de receita criado automaticamente no módulo financeiro (FIN-002)

**Refinamento Técnico:**
- Reutilizar `emitNFSe()` de FIN-007 com adapter para popular campos a partir de `VaccineApplication` em vez de `Appointment`
- **DB:** Campo `invoice_id` nullable em `VaccineApplication` para rastreamento da nota gerada

---

## VAC-009 — Campanhas Extramuros e Importação em Massa

**Tipo:** Story | **Prioridade:** Média | **Sprint:** 4

**User Story:**  
Como coordenador de campanhas, quero importar planilhas de aplicações realizadas em campanhas externas (empresas, escolas), para registrar em massa sem digitação manual.

**Critérios de Aceite:**
- [ ] Download do modelo de planilha (CSV/XLSX) com colunas obrigatórias
- [ ] Upload de planilha preenchida
- [ ] Validação prévia: exibir preview das linhas, destacar erros (paciente não encontrado, vacina inválida, lote vencido)
- [ ] Confirmação antes de importar: "X linhas válidas serão importadas, Y linhas com erro serão ignoradas"
- [ ] Processamento assíncrono para planilhas grandes (> 100 linhas)
- [ ] Relatório de resultado: linhas importadas com sucesso, linhas com erro e motivo

**Refinamento Técnico:**
- **Backend:** Parser CSV/XLSX com `xlsx` (SheetJS); validação linha a linha contra regras de negócio; `BulkInsert` via Prisma `createMany()` em chunks de 100
- **Job assíncrono:** Para arquivos > 100 linhas, processar em background com pg-boss; notificar usuário por e-mail ao concluir
- **DB:** Tabela `ImportJob` (id, tenant_id, status, total_rows, success_rows, error_rows, result_json, created_by, created_at)

---

## VAC-010 — Aplicativo de Vacinação Domiciliar (Mobile)

**Tipo:** Story | **Prioridade:** Baixa | **Sprint:** 5 (fase futura)

**User Story:**  
Como enfermeira, quero usar um app mobile para registrar aplicações domiciliares no ato do atendimento, sem precisar de acesso ao sistema web.

**Critérios de Aceite:**
- [ ] App lista agenda domiciliar do profissional logado para o dia
- [ ] Formulário de aplicação com as mesmas validações do sistema web
- [ ] Funcionamento offline com sync posterior (PWA ou React Native)
- [ ] Registro de geolocalização opcional
- [ ] Cobrança e pagamento via integração com gateway (Pagar.me)

**Refinamento Técnico:**
- **Tecnologia:** React Native (Expo) consumindo API REST do ClinixFlow
- **Offline:** AsyncStorage local + sync queue; ao reconectar, processar fila de aplicações pendentes
- **API:** Novos endpoints REST (além dos Server Actions) para consumo mobile: `POST /api/mobile/vaccine-applications`

---

## VAC-011 — Relatórios Financeiros e de Desempenho de Vacinas

**Tipo:** Story | **Prioridade:** Média | **Sprint:** 4

**User Story:**  
Como gestor, quero relatórios de faturamento e volume de vacinação com filtros por vacina e fabricante, para comparar com períodos anteriores e tomar decisões de estoque e campanha.

**Critérios de Aceite:**
- [ ] Relatório de faturamento: total de receitas de vacinas no período, breakdown por vacina/fabricante
- [ ] Relatório de volume: quantidade de doses aplicadas por vacina, por profissional, por período
- [ ] Comparativo com período anterior: variação percentual por vacina
- [ ] Gráfico de barras: top 10 vacinas por volume no período
- [ ] Gráfico de linha: evolução mensal do total de doses aplicadas
- [ ] Exportação XLSX e PDF
- [ ] Integrado ao módulo de relatórios (REL) — aparece no hub de relatórios

**Refinamento Técnico:**
- **Backend:** Queries analíticas em `VaccineApplication` com JOINs em `Vaccine` e `FinancialEntry`; índices em `(tenant_id, applied_at, vaccine_id)`
- **Frontend:** Recharts para visualizações; mesma infraestrutura de export de REL-002/003

---

# RESUMO DO BACKLOG

## Contagem de Tickets

| Epic | Total | Alta | Média | Baixa |
|------|-------|------|-------|-------|
| EPIC-FIN — Financeiro | 8 | 5 | 3 | 0 |
| EPIC-AVA — Avaliações | 7 | 4 | 3 | 0 |
| EPIC-REL — Relatórios | 6 | 3 | 3 | 0 |
| EPIC-VAC — Vacinas | 11 | 6 | 4 | 1 |
| **TOTAL** | **32** | **18** | **13** | **1** |

## Dependências Críticas

```
FIN-001 → FIN-002 → FIN-003, FIN-004, FIN-005
FIN-002 → FIN-006 (dashboard)
FIN-002 + FIN-007 → FIN-008 (fechamento convênio)
AVA-001 → AVA-002 → AVA-004 → AVA-005
AVA-002 → AVA-007 (devolutiva)
AVA-003 (independente — pode ser feita em paralelo com AVA-001)
REL-001 depende de: Módulo base + AVA-002
REL-003 depende de: FIN-002
REL-004 depende de: AVA-007
REL-005 depende de: AVA-005
VAC-001 → VAC-002 → VAC-003, VAC-004
VAC-002 + VAC-005 → VAC-006
VAC-007 depende de: VAC-002
VAC-008 depende de: FIN-007 + VAC-002
```

## Sugestão de Ordem de Sprints

| Sprint | Foco | Tickets |
|--------|------|---------|
| 1 | Financeiro base + Avaliações builder | FIN-001, FIN-002, AVA-001, VAC-001 |
| 2 | Financeiro painel + Avaliações aplicação + Vacinas core | FIN-003, FIN-004, FIN-006, AVA-002, AVA-003, AVA-006, VAC-002, VAC-003, VAC-004, VAC-005 |
| 3 | Relatórios + Avaliações relatório | FIN-005, REL-001, REL-002, REL-003, AVA-004, AVA-005, VAC-006 |
| 4 | NFSe + RNDS + Campanhas + Devolutiva | FIN-007, FIN-008, AVA-007, REL-004, REL-005, REL-006, VAC-007, VAC-008, VAC-009, VAC-011 |
| 5 | App Mobile (fase futura) | VAC-010 |