> **[IMPLEMENTED]** - Esta story já foi implementada na Fase 1/Core.

# STORY-10: Painel Backoffice (SaaS Admin)

## Descrição
Como Administrador Master (SaaS Admin), preciso de um painel de backoffice para gerenciar as organizações (tenants) cadastradas no ClinixFlow, acompanhar assinaturas e ter uma visão global da saúde do negócio, separado do painel clínico.

## Acceptance Criteria
- [ ] Fluxo de autenticação restrito para usuários com role `SAAS_ADMIN`.
- [ ] Dashboard Master com métricas consolidadas (Total de Tenants Ativos, Novas Contas no Mês, Faturamento Global MRR).
- [ ] Gestão de Organizações/Tenants (listar, visualizar detalhes, suspender conta).
- [ ] Gestão e visualização de Assinaturas e Planos (integrado ao Stripe ou controle interno).
- [ ] Funcionalidade de registro de pagamento manual e aprovação de transações pendentes (caso aplique para pagamentos via PIX/Boleto manual).
- [ ] Layout e components aproveitando o novo design system (Vite + React + Tailwind + shadcn/ui).

## Sub-tasks
1. **Configuração Base do Projeto**: Inicializar repositório `clinixback` com a stack base (Vite + TS + Tailwind + shadcn).
2. **Setup Supabase Client & Auth**: Configurar login exclusivo para SaaS Admin, bloqueando acessos de roles clínicas.
3. **Dashboard Master e KPIs**: Construir queries administrativas globais (sem RLS por tenant ou com Service Role Key para leitura global de estatísticas).
4. **CRUD de Organizações e Planos**: Telas para visualizar tenants, editar metadados e suspender faturamento/acesso.
5. **Integração Financeira do SaaS**: Tela para listar pagamentos dos tenants e subscriptions do Stripe.

## Refinamento Técnico
- **Segurança**: O Backoffice não deve compartilhar as sessões do admin com as contas dos tenants. Como o RLS bloqueia o acesso cruzado, as estatísticas globais precisarão ser consultadas via Supabase Edge Functions usando a `service_role` key (para contornar o RLS), de forma restrita e apenas acionada por quem for validado como `SAAS_ADMIN`.
- A arquitetura visual pode compartilhar de um `ui-library` ou simplesmente ter os mesmos tokens do `clinixflow` (cores `deep teal`, `Tailwind` config semelhante).
