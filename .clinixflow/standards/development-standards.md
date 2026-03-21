# ClinixFlow - Padrões de Desenvolvimento V2 (Lovable / Supabase)

Este documento define os padrões arquiteturais e de codificação para o novo frontend e backend as a service (BaaS) do ClinixFlow, utilizando a plataforma Lovable em conjunto com Supabase. O objetivo é garantir segurança, isolamento multi-tenant e rápida iteração de interface.

## Stack e Arquitetura Base
- **Frontend**: React (Vite) via Lovable
- **Linguagem**: TypeScript
- **Estilização e Componentes**: Tailwind CSS, shadcn/ui, Radix UI
- **Backend/Database/Auth**: Supabase (PostgreSQL, GoTrue, Edge Functions, Storage)
- **Integrações Complementares**: Stripe (Assinaturas), Resend (E-mail), Evolution API (WhatsApp) - via Supabase Edge Functions ou Webhooks.

## Comandos Principais
- Lovable gere a maior parte da UI, mas localmente pode-se usar:
  - `npm run dev` — rodar o Vite em desenvolvimento local
  - `npm run build` — compilar o bundle de produção
  - `npm run lint` — executar análise de código

## Estrutura de Diretórios 

```
src/
├── components/    # Componentes React reutilizáveis (UI base, forms, layouts)
├── contexts/      # React Contexts (Auth, Tenant, Theme)
├── hooks/         # Custom hooks (e.g., useSupabase, useTenant)
├── integrations/  # Integração com Supabase (clientes e geradores Lovable)
├── lib/           # Utilitários, formatação, validações (Zod)
├── pages/         # Páginas da aplicação mapeando rotas (React Router)
└── index.css      # Diretivas Tailwind e variáveis globais
supabase/
├── migrations/    # Scripts SQL para setup do banco de dados e RLS
├── functions/     # Supabase Edge Functions (Deno) para lógica backend
└── seed.sql       # Dados iniciais para ambiente de dev
```

## Convenções de Nomenclatura

- **Tabelas/Colunas no Supabase:** `snake_case` (ex: `tenant_id`, `medical_records`).
- **Variáveis, funções e hooks (TS/React):** `camelCase` (ex: `usePatients`, `fetchAppointments`).
- **Componentes React e Types/Interfaces:** `PascalCase` (ex: `PatientCard`, `AppointmentDetails`).
- **Arquivos TSX:** `PascalCase.tsx` para Componentes e Páginas.
- **DTOs / Validações:** Zod schemas usando `camelCase` com sufixo Schema (ex: `patientSchema`).

## Regras Críticas de Desenvolvimento

### Isolamento Multi-Tenant via RLS (Obrigatório)
O sistema é um SaaS multi-tenant onde os dados não podem jamais se misturar.
- **Todas as tabelas** relacionadas ao cliente final DEVEM ter a coluna `tenant_id`.
- O isolamento é feito na camada do Banco de Dados usando **Row Level Security (RLS)** do Supabase.
- Políticas RLS (Policies) devem garantir que:
  ```sql
  create policy "Isolate tenant data" on public.patients
  for all using (tenant_id = (select auth.jwt()->>'tenant_id')::uuid);
  ```
- No Frontend, injete o JWT customizado no Supabase Client ou garanta que o Token do usuário contém a claim do tenant logado.

### Lógica de Negócio e Backend
Sempre que possível, resolva as lógicas no próprio PostgreSQL via **Supabase RPC (Remote Procedure Calls)** ou **Database Functions/Triggers**, para evitar ida e volta de dados no Frontend:
- **Exemplo**: Prevenção de overbooking em Agendamentos deve ser validada por uma Função via uma **Supabase Edge Function** que orquestra a lógica de disponibilidade, e não confiando apenas na validação do browser.
- **Webhooks/Processos Assíncronos**: Use o Supabase Webhooks Edge Functions para notificar criação de faturas no Stripe.

### Tratamento de Erros e Boas Práticas (Frontend)
- Utilize `sonner` / `react-toastify` (integrado na template) para notificações ao usuário em caso de sucessos ou erros nas Mutations do Supabase.
- Evite chamadas soltas. Use **React Query (@tanstack/react-query)** (padrão em muitos apps gerados pelo Lovable) para fetch, cache e mutations em cima do cliente `supabase`.
- Sempre forneça feedback visual (Loading skeletons/spinners) ao consultar dados usando a engine do Lovable.

### Manipulação de Valores Monetários
- Salvar valores de transações no Supabase como inteiros (`integer`), representando **centavos** (ex: R$ 100,50 → `10050`).
- Usar funções locais de máscara em React (via Intl.NumberFormat ou bibliotecas utilitárias) para formatar a saída.

### Permissões e Roles
- As roles (ex: `ORG_ADMIN`, `RECEPTIONIST`, `HEALTH_PROFESSIONAL`) devem ser salvas nos metadados do usuário no Supabase Auth (`user_metadata`) e cruzadas com as Permissões via RLS para gerir o CRUD na plataforma.

### Integrações e Padrões de Dados (v2)
- **Status Financeiros**: Utilizar os estados `PROJECTED` (previsto/agendado), `REALIZED` (atendido) e `RECEIVED` (recebido/pago) na mesma tabela `transactions` para evitar duplicação de dados e facilitar o Livro Caixa e fechamentos por convênio.
- **Preparação TISS (Saúde)**: Tabelas devem conter os campos base para futura exportação XML: `ans_code` (no convênio), `tuss_code` (na especialidade), `cid10_code` e `insurance_guide_id` (no agendamento).
- **Lembretes e Notificações**: Configurações de credenciais de plataformas de terceiros (como Resend API Key para E-mails e Evolution API para WhatsApp) podem ser parametrizadas como Environment Variables globais ou no nível de configurações do Tenant (`tenant_settings`).
