> **[IMPLEMENTED]** - Esta story já foi implementada na Fase 1/Core.

# STORY-01: Autenticação e Multi-Tenancy

## Descrição
Como um dono de clínica, quero poder me cadastrar no sistema, criar minha organização e convidar minha equipe, para que possamos usar o sistema de forma isolada e segura. 

## Acceptance Criteria
- [ ] O usuário deve conseguir se cadastrar (Sign-Up) informando email, senha, dados pessoais e nome da clínica.
- [ ] A URL da clínica (slug) deve ser validada em tempo real para ser única.
- [ ] Ao terminar o cadastro, o sistema deve criar a tenant (Organização) e vincular o usuário como `ORG_ADMIN`.
- [ ] Deve existir um Trial Automático de 7 a 10 dias configurado no banco.
- [ ] O login deve identificar o tenant pelo subdomínio ou slug.
- [ ] Recuperação de senha completa com envio de e-mail (Resend).

## Sub-tasks
1. **Configuração Supabase Auth**: Habilitar email/password; configurar templates de email (Resend).
2. **Trigger de Criação de Tenant**: Criar function Postgres `after insert` no `auth.users` para criar o registro na tabela `tenants`.
3. **Página de Sign-Up e Onboarding**: Desenvolver o fluxo React com steps (Dados da Clínica, Primeiro Profissional, Convênios, Módulos).
4. **Login e Recuperação de Senha**: Criar interfaces e integrar as mutations do Supabase Auth.

## Refinamento Técnico
- **Frontend**: Next.js App Router (ou Lovable React/Vite padrão), componentes form com shadcn/ui e Zod para validação.
- **Backend/Supabase**: Usar Row Level Security (RLS) baseada no `tenant_id` cravado no `auth.jwt()`. NENHUMA query de dados de clínica deve funcionar sem o RLS.
