> **[IMPLEMENTED]** - Esta story já foi implementada na Fase 1/Core.

# STORY-02: Configurações da Clínica e Cadastros Base

## Descrição
Como Administrador, quero poder gerenciar os dados da minha clínica, horários de funcionamento, cadastros de convênios/tabelas de preços, e permissões da equipe.

## Acceptance Criteria
- [ ] Interface de Perfil da Clínica (edição de CNPJ com validação, logo, endereço, contatos).
- [ ] Gestão de Convênios de Saúde e Especialidades.
- [ ] Gestão de Equipe (convite via email para outras roles: RECEPCIONISTA, PROFISSIONAL, GERENTE).
- [ ] Configuração de Mensageria (WhatsApp/Evolution API e E-mail/Resend).
- [ ] Dashboard de assinatura com acesso ao portal do cliente (Stripe).

## Sub-tasks
1. **Perfil da Clínica**: Tela de edição e upload de Logo para o Supabase Storage.
2. **Tabelas de Referência**: CRUD de Convênios, Especialidades e Tipos de Consulta.
3. **Gestão de Usuários e Convites**: Tela de listagem de equipe. Função para enviar invite via Supabase Auth enviando param de role.
4. **Integrações**: Formulários de chaves de API (Evolution/Resend) salvos no `tenant_settings`.

## Refinamento Técnico
- **Validações**: Zod schema para CNPJ e estruturação JSON.
- **Triggers**: Evitar duplicação de Convênios com a mesma descrição e ans_code no mesmo tenant.
- **Stripe**: Criar rota local simulando webhook do Stripe configurando o Trial em dev (STRIPE_ENABLED=false).
