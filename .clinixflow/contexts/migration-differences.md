# ClinixFlow - Diferenças e Funcionalidades a Migrar (Legado → Lovable/Supabase)

Este documento elenca as "Gaps" (lacunas) técnicas e funcionais identificadas na versão legada (`clinixflow-app`) e formaliza como essas funcionalidades serão arquitetadas na nova versão usando **Lovable, React, Vite e Supabase** baseadas no `context.md`.

## 1. Gestão de Clínicas e Multi-Tenant
**O que havia no legado:** Organização criada apenas no ato do registro, validações soltas, e webhook engessado no plano Essential.
**Arquitetura Lovable/Supabase:**
- **Auth e Criação:** Supabase Auth gere o cadastro. O fluxo de Sign-Up aciona um **Trigger no Banco Postgres** (`after insert` no `auth.users`) que gera automaticamente a row principal na tabela `tenants` (Organização) e define a Role inicial do criador como `ORG_ADMIN` nos metadados do JWT do Supabase (`auth.jwt()`). Incluir lógica de Trial de 7 a 10 dias.
- **Segurança (RLS):** Ao invés de middlewares complexos no backend, O Supabase RLS restringe tudo baseando-se no `tenant_id` cravado no Token.
- **Assinaturas (Stripe):** Implementar Stripe Checkout linkado a Supabase Webhooks (Edge Functions) atualizando os privilégios da conta e expiração do trial na tabela `tenants`. Corrigir o webhook legado para ler o `plan` correto ao invés de fixar como `essential`. Usar flag `STRIPE_ENABLED=false` localmente.

## 2. Configurações de Agendamento e Profissionais
**O que havia no legado:** CRUD gigante 100% manual, banco desconectado das exceções, deleções arriscadas e ausência de uploads.
**Arquitetura Lovable/Supabase:**
- **Upload Centralizado:** Supabase Storage vai guardar avatares numa pipeline direta Client -> Storage usando RLS (Bucket seguro: usuários logados do tenant podem ler).
- **Dados Restritivos:** Os Profissionais são criados via convite (Supabase Auth invite URL). 
- **Array JSON de Disponibilidade:** No Supabase, usar a coluna JSONB para armazenar a matriz de horários disponíveis. Ex: `availability: [{ "monday": [{ "start": "08:00", "end":"12:00" }] }]`.
- **Soft Delete e Visibilidade:** O Frontend só consulta queries não inativadas, e o BD restringe cascata/deleção forçada caso existam consultas via FK e Constraints normais do SQL.

## 3. Workflow de Agendamento (Core)
**O que havia no legado:** Agenda existente mas que ignorava feriados e permitia choque de horários sem restrição de concorrência massiva.
**Arquitetura Lovable/Supabase:**
- **Supabase RPC (Prevenção de Conflitos):** Não faremos a checagem de sobreposição de horas apenas no Front React, isso gera race conditions. Devemos criar uma *PostgreSQL Function* no Supabase chamada `book_appointment(...)` que garante ACID, barrando via erro (Raise Exception) o Double Booking ou feriados da agenda, ativada nativamente no Front Lovable via `supabase.rpc()`.
- Lembretes assíncronos farão ponte via Webhooks Supabase / pg_net ou Edge Functions ativando Resend (Emails) e Evolution API (WhatsApp).

## 4. Prontuários e Imutabilidade LGPD
**O que havia no legado:** Mascaramento restritivo em app tier, sem lock efetivo no banco de notas clínicas para fins de auditoria médica legal.
**Arquitetura Lovable/Supabase:**
- **Row Immutability:** No banco, utilizar um **Trigger Supabase** (e.g. `BEFORE UPDATE`) na tabela `clinical_events`. Se o status anterior era `FINALIZED`, abortar a transação. Somente a Justiça e Sysadmin queburam isso; isso cobre conformidade jurídica/LGPD.
- Frontend (Lovable): O botão de "Finalizar Evolução" travará toda a UI (readOnly).
- Attachments via Supabase Storage: Buckets fechados via RLS para exames dos pacientes do Tenant.

## 5. Módulo de Guias (Convênios) e Prescrições
**O que havia no legado:** Interface irreal no legado; não manipulavam saldo de consultas.
**Arquitetura Lovable/Supabase:**
- Interface de Prescrição via Editor Ricaç (Quill/TIptap em React), o HTML será guardado na Row Supabase. 
- Componente Front reativo para conversões em PDF nativas no Cliente do Navegador via `react-pdf` ou chamadas serverless (Edge function puppeteer-core / Browserless) se alta fidelidade for mandatória.
- Relacionamento Guia -> Agendamento: O RPC de marcação final ("Atualizar Status para ATTENDED") ativará diminuição do `sessions_remaining` via trigger do POSTGRES, impedindo lógicas tortas no Front.

## 6. Módulo Financeiro Raiz
**O que havia no legado:** Dashboard 100% Mockado. Sem transações base e rateios em back.
**Arquitetura Lovable/Supabase:**
- Controle estrito transacional no PostgreSQL na tabela `transactions`. Uma transação é criada via Supabase Triggers vinculada ao Agendamento com status `PROJECTED` (previsto).
- Quando a recepcionista der "Confirmado/Atendido", o gatilho muda a transação para `REALIZED`. O pagamento efetivo altera para `RECEIVED`. Isso unifica A Receber e Caixa na mesma tabela.
- Relatórios de Cashbook puxados via Supabase Views ou queries diretas construídas no React Query, agrupando categorias na on-the-fly (`reduce/map` em JS ou Agregation SQL View).

## 7. Relatórios, Dashboard e Auditoria
**O que havia no legado:** Dashboards lentas caso montassem query ad-hoc em grandes tabelas. Log incompleto. 
**Arquitetura Lovable/Supabase:**
- Para não pesar o App Router do Lovable carregando dados pesados, usaremos **PostgreSQL Materialized Views** ou **Views simples** no Supabase, que expõem endpoints agregados da performance clínica direto por rota REST, e o ChartJs/Recharts desenha isso sem suor no Client.
- **Audit Logging via Database Triggers:** A melhor forma em Supabase é criar generic Audit Triggers on Insert/Update/Delete que povoam a tabela `audit_logs` sem amarrar processamento extra no frontend (Client não precisa sequer saber que a auditoria rolou).
