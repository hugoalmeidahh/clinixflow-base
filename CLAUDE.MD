# ClinixFlow Assistant Guidelines

## Desenvolvimento e Arquitetura
Antes de iniciar o desenvolvimento ou sugerir qualquer refatoração, **SEMPRE LEIA** os seguintes arquivos para entender as regras de negócio, a arquitetura e os padrões adotados para o projeto:
- `.clinixflow/contexts/context.md`: Contexto geral, regras de negócio globais as a service, informações base de papéis, entidades principais do banco de dados.
- `.clinixflow/standards/development-standards.md`: Padrões do Supabase, React, componentes (shadcn/ui), Row Level Security (RLS) e regras de nomenclatura.
- `.clinixflow/contexts/migration-differences.md`: Mapeamento e gap analysis de como as features do antigo app (`clinixflow-app`) devem ser moldadas no novo (`clinixflow` ou `clinixback`).

Estes documentos são a fonte da verdade para decisões técnicas no projeto V2 (Lovable / Supabase).

## Estrutura Multi-Tenant
O projeto é dividido em:
- **`clinixflow`** (ou projeto gerenciado pelo Lovable): Aplicação voltada para clínicas, profissionais de saúde e ambiente clínico/financeiro de uma Tenant específica. É isolada via RLS pelo `tenant_id`.
- **`clinixback`**: Projeto Backoffice voltado para a administração do SaaS (gestão global de tenants, planos, faturamento Stripe central). Este não possui RLS de tenant block, acessado exclusivamente via rules de admin.
- Sempre verifique em qual diretório você está atuando antes de sugerir comandos ou criar componentes.
