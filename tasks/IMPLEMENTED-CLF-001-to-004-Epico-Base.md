> **[IMPLEMENTED]** - Esta task já foi implementada/substituída.

# TICKET-001 ao TICKET-004: Épico Base e Agendamentos

## TICKET-001: Setup Inicial Multi-Tenant e RLS (Supabase)
**User Story**: Como arquiteto de software da clínica, quero que a estrutura base de banco de dados e políticas de segurança (RLS) sejam criadas no Supabase, para garantir que os dados das diferentes clínicas nunca se misturem e o desenvolvimento de novas features no Lovable seja seguro.
**Critérios de Aceite:**
- Criação das tabelas base `tenants`, `users` e `roles` vinculadas ao Auth.
- Implementação estrita do Row Level Security (RLS) baseada no `tenant_id` atrelado ao usuário logado na sessão JWT (`auth.jwt()`).
- O Client Frontend (Lovable React) deve ser capaz de instanciar o `supabase.js` e comprovar a leitura blindada da sua clínica atual e apenas dela.
**Refinamento Técnico:** Escrever arquivos `.sql` locais para o Supabase CLI criando Schemas. As policies PostgreSQL devem ser de `SELECT`, `INSERT`, `UPDATE` e `DELETE` baseadas cruamente em `(auth.jwt() ->> 'tenant_id')::uuid = tenant_id`. Todo Componente de lista do App Lovable herdará essas rules invisiveis do Provider.

## TICKET-002: Autenticação, Onboarding de Clínicas e Stripe Trial
**User Story**: Como dono de uma nova clínica, quero me cadastrar na plataforma rapidamente, ganhar alguns dias de teste (trial), e ter minha "área/instância" criada automaticamente sem espera, para começar a operar imediatamente.
**Critérios de Aceite:**
- Tela de Sign-Up no FrontEnd capturando Dados Pessoais, CNPJ e Nome da Clínica.
- Criação atômica do Tenant assim que o Supabase Auth dispara o evento de Inserção.
- Inicialização de plano Trial (Ex: 10 dias) com flags `is_active` e `plan=trial`.
- Usuário adquire role de `ORG_ADMIN`.
**Refinamento Técnico:** Uso de Supabase Auth `signUp()` passando `options.data` (metadados custom). Criação de **PostgreSQL Function/Trigger** vinculada à tabela nativa `auth.users` -> `AFTER INSERT`. Ela processa os metadados do form, insere row em `tenants`, assinala o criador a esse tenant. Edge Function para acionar Customer no Stripe.

## TICKET-003: Gestão de Profissionais e Json de Horários Livres
**User Story**: Como gerente, quero cadastrar enfermeiros, recepcionistas e médicos com seus avatares e estipular quais dias da semana e horários cada um trabalha, para que a agenda consiga encontrar faixas livres de atendimento.
**Critérios de Aceite:**
- Layout Mestre-Detalhe (Master-Detail) com CRUD de Profissionais do tenant.
- Upload real e funcional da Foto/Avatar.
- Tabela/Matriz desenhada de Domingo a Segunda preenchendo as janelas liberadas (Availability).
**Refinamento Técnico:** 
- A Matriz UI deve ser salva no banco PostgreSQL preferêncialmente em coluna `JSONB`, ex: `availability_rules: { "mon": ["08:00-12:00"], interval_minutes: 30 }`.
- O Upload usará o `Supabase Storage` no padrão Multipart Request FormData usando buckets com restrição de Owner/Tenant via RLS para Download.

## TICKET-004: Agenda Integrada e Bloqueio de Overbooking (Double Booking)
**User Story**: Como recepcionista, quero ter uma visão clara dos agendamentos em uma agenda integrada, para maximizar a organização da clínica e prevnir que marque 2 pacientes pro mesmo médico da sala 2 no mesmo horário.
**Critérios de Aceite:**
- Visualização em formato de calendário (diário e semanal) dos agendamentos efetuados.
- Deve ser possível bloquear horários específicos para pausas e faltas isoladas.
- Deve prevenir terminantemente a sobreposição (choque) de horários entre diferentes pacientes na mesma sala/enfermeiro.
**Refinamento Técnico:** 
- **Concorrência Otimizada:** Construir a prevenção de conflitos **não no front**, mas via *Supabase RPC (Remote Procedure Call)* ou um `Constraint/Trigger` de banco (PostgreSQL Range Types ou Function plpgsql). A function processa e devolve exception caso cruze o Timestamp Start/End na mesma Sala/Profissional. Front-end pega a exception e lança a notificação Toast. Renderização web feita com calendários como `react-big-calendar` ou primitivas customizadas do ShadCNUI.
