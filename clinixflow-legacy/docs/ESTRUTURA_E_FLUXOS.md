# 📋 Estrutura do Projeto ClinixFlow e Fluxos de Funcionalidades

## 🏗️ Arquitetura Geral

### Stack Tecnológica
- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Formulários**: React Hook Form + Zod
- **Autenticação**: BetterAuth
- **Banco de Dados**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validação**: Zod
- **Gráficos**: Recharts
- **PDF**: @react-pdf/renderer
- **Pagamentos**: Stripe

---

## 📁 Estrutura de Diretórios

```
clinixflow-app/
├── src/
│   ├── actions/              # Server Actions (lógica de negócio)
│   ├── app/                  # Rotas e páginas (App Router)
│   │   ├── (protected)/      # Rotas protegidas
│   │   ├── api/              # API Routes
│   │   ├── authentication/   # Autenticação
│   │   └── new-subscription/ # Nova assinatura
│   ├── components/           # Componentes específicos
│   ├── constants/            # Constantes
│   ├── data/                # Funções de busca de dados
│   ├── db/                  # Schema e configuração do banco
│   ├── helpers/             # Funções auxiliares
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Bibliotecas e utilitários
│   └── middleware.ts        # Middleware Next.js
├── components/              # Componentes compartilhados
├── drizzle/                # Migrations SQL
├── scripts/                # Scripts utilitários
└── public/                 # Arquivos estáticos
```

---

## 👥 Sistema de Roles e Permissões

### Roles Disponíveis

1. **master** - Administrador do sistema
   - Gerencia owners e pagamentos
   - Acesso total ao sistema
   - Não precisa de plano

2. **clinic_owner** - Proprietário da clínica
   - Acesso total à clínica
   - Pode cadastrar profissionais e pacientes
   - Gerencia agendamentos
   - Precisa de plano

3. **clinic_admin** - Administrador da clínica
   - Mesmas permissões do owner
   - Precisa de plano

4. **clinic_gestor** - Gestor da clínica
   - Pode cadastrar profissionais e pacientes
   - Gerencia agendamentos
   - Precisa de plano

5. **clinic_recepcionist** - Recepcionista
   - Pode cadastrar pacientes
   - Pode fazer agendamentos
   - Precisa de plano

6. **doctor** - Profissional da saúde
   - Acesso à própria agenda
   - Pode criar prontuários
   - Pode criar prescrições
   - Não precisa de plano

7. **patient** - Paciente
   - Visualiza próprios agendamentos
   - Não precisa de plano

### Matriz de Permissões

| Funcionalidade | Owner | Admin | Gestor | Recepcionista | Doctor | Patient |
|----------------|-------|-------|--------|--------------|--------|---------|
| Ver preço consulta | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Cadastrar profissionais | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Cadastrar pacientes | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Criar agendamentos | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ver prontuários | ❌ | ❌ | ❌ | ❌ | ✅* | ❌ |
| Criar prescrições | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |

*Doctor só vê seus próprios prontuários

---

## 🔄 Fluxos Principais

### 1. Fluxo de Autenticação e Cadastro

#### 1.1 Cadastro de Owner (Primeiro Usuário)
```
1. Usuário acessa /authentication
2. Preenche formulário de cadastro:
   - Nome
   - Email
   - Senha
3. Sistema cria conta com role "clinic_owner"
4. Redireciona para /clinic-form
5. Preenche dados da clínica:
   - Nome
   - CNPJ
   - Endereço
   - Telefone
   - Email
6. Sistema cria clínica e vincula ao usuário
7. Redireciona para /new-subscription
8. Escolhe plano ou ativa código
9. Após ativação, redireciona para /dashboard
```

#### 1.2 Login
```
1. Usuário acessa /authentication
2. Preenche email e senha
3. Sistema valida credenciais
4. Carrega dados da sessão:
   - Dados do usuário
   - Clínicas vinculadas
   - Plano ativo
5. Redireciona conforme role:
   - master → /master/dashboard
   - clinic_owner/admin/gestor/recepcionist → /dashboard
   - doctor → /professional/dashboard
   - patient → /patient/dashboard
```

---

### 2. Fluxo de Cadastro de Profissional

#### 2.1 Acesso
- **Quem pode**: clinic_owner, clinic_admin, clinic_gestor
- **Rota**: `/doctors`

#### 2.2 Processo de Cadastro
```
1. Clicar em "Adicionar Profissional"
2. Preencher formulário com tabs:

   TAB 1: Dados Pessoais
   - Nome completo
   - Tipo de pessoa (Física/Jurídica)
   - Documento (CPF/CNPJ)
   - RG / Inscrição Estadual
   - Data de nascimento / Abertura
   - Avatar (opcional)

   TAB 2: Endereço
   - CEP
   - Endereço completo
   - Número, complemento
   - Bairro, cidade, estado

   TAB 3: Contatos
   - Telefone
   - Email

   TAB 4: Profissional
   - Perfil do usuário (admin/gestor/recepcionist/doctor)
   - Especialidades (se doctor):
     * Nome da especialidade
     * Tipo do conselho (CRM, CRP, etc.)
     * Número do registro
   - Tipo de compensação:
     * Porcentagem
     * Valor fixo
     * Porcentagem + Fixo
   - Valores de compensação

   TAB 5: Disponibilidade
   - Para cada dia da semana:
     * Disponível? (sim/não)
     * Horário início
     * Horário fim

   TAB 6: Acesso
   - Criar conta? (sim/não)
   - Se sim:
     * Tipo de acesso (código/email)
     * Código de login (se código)
     * Senha

3. Sistema valida dados
4. Cria registro na tabela doctors
5. Se criar conta:
   - Cria usuário com role apropriado
   - Vincula doctor ao user (doctors_to_users)
6. Cria especialidades (doctor_specialties)
7. Cria disponibilidade (doctor_availability)
8. Redireciona para lista de profissionais
```

#### 2.3 Estrutura de Dados
- **Tabela principal**: `doctors`
- **Especialidades**: `doctor_specialties` (N:N com `specialties`)
- **Disponibilidade**: `doctor_availability` (7 registros, um por dia)
- **Vínculo com usuário**: `doctors_to_users`

---

### 3. Fluxo de Cadastro de Paciente

#### 3.1 Acesso
- **Quem pode**: clinic_owner, clinic_admin, clinic_gestor, clinic_recepcionist
- **Rota**: `/patients`

#### 3.2 Processo de Cadastro
```
1. Clicar em "Adicionar Paciente"
2. Preencher formulário com tabs:

   TAB 1: Dados Pessoais
   - Nome completo
   - Email (opcional)
   - Telefone
   - WhatsApp? (sim/não)
   - Sexo
   - Data de nascimento
   - CPF (obrigatório)
   - RG

   TAB 2: Responsáveis
   - Nome da mãe
   - Nome do pai
   - Nome do responsável
   - Contato do responsável
   - Mostrar responsável? (sim/não)
   - Acompanhante (se menor de 18):
     * Nome
     * Grau de parentesco

   TAB 3: Endereço
   - CEP
   - Endereço completo
   - Número, complemento
   - Bairro, cidade, estado

   TAB 4: Convênio
   - Convênio (seleção)
   - Número da carteirinha
   - Plano do convênio
   - Cartão SUS (opcional)
   - Região SUS (opcional)
   - CID (opcional)

   TAB 5: Acesso
   - Criar conta? (sim/não)
   - Se sim:
     * Tipo de acesso (código/email)
     * Código de login (se código)
     * Senha

3. Sistema valida dados
4. Validações especiais:
   - Se menor de 18: acompanhante obrigatório
   - CPF obrigatório
5. Cria registro na tabela patients
6. Gera número de prontuário único (patient_record_number)
7. Se criar conta:
   - Cria usuário com role "patient"
   - Vincula patient ao user (patients_to_users)
8. Redireciona para lista de pacientes
```

#### 3.3 Estrutura de Dados
- **Tabela principal**: `patients`
- **Vínculo com usuário**: `patients_to_users`
- **Tratamentos**: `patients_to_treatments` (N:N)

---

### 4. Fluxo de Agendamento

#### 4.1 Acesso
- **Quem pode criar**: clinic_owner, clinic_admin, clinic_gestor, clinic_recepcionist
- **Quem pode ver**: Todos os roles (com filtros)
- **Rota**: `/appointments`

#### 4.2 Processo de Criação
```
1. Clicar em "Novo Agendamento"
2. Preencher formulário:
   - Paciente (seleção)
   - Profissional (seleção)
   - Especialidade do profissional (se múltiplas)
   - Data e hora
   - Duração (padrão: 30min)
   - Convênio do paciente
   - Tratamento
   - Duração da consulta
3. Sistema calcula:
   - Preço da consulta (baseado em insurance_prices)
   - Compensação do profissional (baseado em compensationType)
4. Validações:
   - Profissional disponível no horário?
   - Horário dentro da disponibilidade do profissional?
   - Não conflita com outros agendamentos?
5. Cria registro na tabela appointments
6. Status inicial: confirmed = false
7. Redireciona para lista de agendamentos
```

#### 4.3 Visualizações
- **Tabela**: Lista todos os agendamentos com filtros
- **Calendário Semanal**: Visualização por semana
- **Filtros disponíveis**:
  - Data (de/até)
  - Profissional
  - Paciente
  - Status (confirmado/não confirmado)
  - Comparecimento (compareceu/faltou/pendente)

#### 4.4 Ações sobre Agendamento
- **Confirmar**: Marca como confirmado
- **Marcar Presença**: Define se compareceu ou faltou
- **Criar Prontuário**: Abre formulário de evolução
- **Criar Prescrição**: Abre editor de prescrição
- **Excluir**: Remove agendamento

---

### 5. Fluxo de Prontuário Eletrônico

#### 5.1 Acesso
- **Quem pode criar**: doctor
- **Quem pode ver conteúdo**: Apenas o doctor que criou
- **Quem pode ver metadados**: clinic_owner, clinic_admin, clinic_gestor
- **Rota**: `/patient-records` (admin) ou `/professional/patient-records` (doctor)

#### 5.2 Processo de Criação
```
1. A partir de um agendamento:
   - Clicar em "Criar Prontuário"
   - Ou acessar /professional/patient-records/[patientId]

2. Preencher formulário:
   - Primeira consulta? (sim/não)
   - Conteúdo da avaliação
   - Conteúdo da evolução

3. Sistema cria registro em patient_records:
   - Vincula ao paciente
   - Vincula ao profissional
   - Vincula ao agendamento (se houver)
   - Vincula à clínica
   - canEdit = false (não pode editar após salvar)

4. Após salvar:
   - Prontuário fica bloqueado para edição
   - Apenas gestão pode autorizar edição
```

#### 5.3 Regras de Segurança
- **Confidencialidade**: Apenas o profissional que criou pode ver o conteúdo
- **Imutabilidade**: Após salvar, não pode editar (exceto com autorização)
- **Auditoria**: Todas as ações são registradas (audit_log)

#### 5.4 Estrutura de Dados
- **Tabela**: `patient_records`
- **Campos principais**:
  - `firstConsultation`: boolean
  - `avaliationContent`: text
  - `content`: text
  - `canEdit`: boolean
  - `editAuthorizedBy`: userId (quem autorizou)
  - `editAuthorizedAt`: timestamp

---

### 6. Fluxo de Prescrições

#### 6.1 Acesso
- **Quem pode criar**: doctor
- **Rota**: `/prescriptions`

#### 6.2 Processo de Criação
```
1. Clicar em "Nova Prescrição"
2. Selecionar:
   - Paciente
   - Profissional (pré-selecionado se logado como doctor)
3. Editor de texto rico (TipTap):
   - Formatação de texto
   - Alinhamento
   - Sublinhado
4. Salvar prescrição
5. Opções:
   - Editar
   - Baixar PDF
   - Excluir
```

#### 6.3 Estrutura de Dados
- **Tabela**: `prescriptions`
- **Campos principais**:
  - `patientId`: uuid
  - `doctorId`: uuid
  - `clinicId`: uuid
  - `content`: text (HTML formatado)

---

### 7. Fluxo de Assinatura e Pagamento

#### 7.1 Tipos de Planos
- **Essential**: Plano básico
- **Professional**: Plano profissional
- **Super**: Plano completo
- **Custom**: Plano customizado

#### 7.2 Processo de Ativação

**Opção 1: Código de Ativação**
```
1. Acessar /subscription
2. Inserir código de ativação
3. Sistema valida código:
   - Código existe?
   - Código está ativo?
   - Código já foi usado?
4. Se válido:
   - Ativa plano conforme código
   - Define data de expiração
   - Vincula código ao usuário
5. Redireciona para /dashboard
```

**Opção 2: Pagamento via Stripe**
```
1. Acessar /new-subscription
2. Escolher plano
3. Escolher período (mensal/semestral/anual)
4. Preencher dados de pagamento
5. Redireciona para Stripe Checkout
6. Após pagamento:
   - Webhook recebe confirmação
   - Ativa assinatura
   - Cria registro em subscriptions
   - Cria registro em payments
7. Redireciona para /subscription/checkout/success
```

#### 7.3 Estrutura de Dados
- **Tabelas principais**:
  - `subscriptions`: Assinaturas ativas
  - `plans`: Planos disponíveis
  - `activation_codes`: Códigos de ativação
  - `payment_requests`: Solicitações de pagamento
  - `payments`: Histórico de pagamentos
  - `owner_payments`: Pagamentos manuais de owners

---

### 8. Fluxo Master (Gerenciamento de Owners)

#### 8.1 Acesso
- **Quem pode**: master
- **Rotas**: `/master/dashboard`, `/master/owners`, `/master/owners/[userId]`

#### 8.2 Funcionalidades
```
1. Dashboard Master:
   - Estatísticas gerais
   - Owners ativos/expirados
   - Inconsistências de pagamento

2. Listagem de Owners:
   - Lista todos os owners
   - Status (Ativo, Expirando, Expirado, Sem Plano)
   - Data de expiração
   - Dias restantes

3. Detalhes do Owner:
   - Informações do usuário
   - Status atual do plano
   - Histórico de pagamentos
   - Formulário de atualização:
     * Selecionar plano
     * Definir duração (dias)
     * Adicionar observações
     * Atualizar acesso

4. Inconsistências de Pagamento:
   - Lista owners com pagamentos pendentes
   - Permite registrar pagamento manual
   - Marca como resolvido
```

#### 8.3 Estrutura de Dados
- **Tabelas relacionadas**:
  - `users`: Usuários owners
  - `subscriptions`: Assinaturas
  - `owner_payments`: Pagamentos manuais
  - `payment_inconsistencies`: Inconsistências detectadas

---

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

#### Usuários e Autenticação
- `users`: Usuários do sistema
- `sessions`: Sessões ativas
- `accounts`: Contas vinculadas (OAuth)
- `verifications`: Códigos de verificação

#### Clínicas
- `clinics`: Dados das clínicas
- `users_to_clinics`: Vínculo usuário-clínica

#### Profissionais
- `doctors`: Dados dos profissionais
- `doctor_specialties`: Especialidades dos profissionais
- `doctor_availability`: Disponibilidade semanal
- `doctors_to_users`: Vínculo profissional-usuário

#### Pacientes
- `patients`: Dados dos pacientes
- `patients_to_users`: Vínculo paciente-usuário
- `patients_to_treatments`: Tratamentos do paciente

#### Agendamentos
- `appointments`: Agendamentos
- Campos: paciente, profissional, data, duração, preço, compensação

#### Prontuários
- `patient_records`: Prontuários eletrônicos
- Campos: avaliação, evolução, primeira consulta

#### Prescrições
- `prescriptions`: Prescrições médicas

#### Assinaturas e Pagamentos
- `plans`: Planos disponíveis
- `subscriptions`: Assinaturas ativas
- `activation_codes`: Códigos de ativação
- `payment_requests`: Solicitações de pagamento
- `payments`: Histórico de pagamentos
- `owner_payments`: Pagamentos manuais
- `payment_inconsistencies`: Inconsistências

#### Configurações
- `insurances`: Convênios disponíveis
- `insurance_prices`: Preços por convênio/tratamento/duração
- `specialties`: Especialidades disponíveis

#### Auditoria
- `audit_log`: Log de todas as ações

---

## 🔐 Segurança e Permissões

### Middleware
- Verifica autenticação em todas as rotas protegidas
- Valida permissões por role
- Redireciona conforme necessário

### Validações
- **Server-side**: Todas as actions validam permissões
- **Client-side**: UI adapta conforme role
- **Banco de dados**: Constraints e foreign keys

### Auditoria
- Todas as ações importantes são registradas em `audit_log`
- Campos: usuário, ação, entidade, dados antes/depois, IP, user agent

---

## 📱 Rotas Principais

### Públicas
- `/` - Landing page
- `/authentication` - Login/Cadastro
- `/privacy` - Política de privacidade
- `/terms` - Termos de uso

### Protegidas (Owner/Admin/Gestor/Recepcionista)
- `/dashboard` - Dashboard principal
- `/doctors` - Lista de profissionais
- `/patients` - Lista de pacientes
- `/appointments` - Agendamentos
- `/prescriptions` - Prescrições
- `/patient-records` - Prontuários (metadados)
- `/profile` - Perfil do usuário
- `/subscription` - Assinatura

### Profissional (Doctor)
- `/professional/dashboard` - Dashboard do profissional
- `/professional/appointments` - Agenda do profissional
- `/professional/patient-records` - Prontuários (com conteúdo)

### Paciente (Patient)
- `/patient/dashboard` - Dashboard do paciente
- `/patient/appointments` - Meus agendamentos
- `/patient/evaluations` - Minhas avaliações
- `/patient/reports` - Meus relatórios
- `/patient/requests` - Minhas solicitações

### Master
- `/master/dashboard` - Dashboard master
- `/master/owners` - Gerenciar owners
- `/master/owners/[userId]` - Detalhes do owner
- `/master/payment-inconsistencies` - Inconsistências

---

## 🛠️ Scripts Úteis

### Banco de Dados
```bash
npm run db:generate    # Gerar migrations
npm run db:migrate     # Aplicar migrations (push)
npm run db:migrate:sql # Aplicar migrations SQL
npm run db:studio      # Abrir Drizzle Studio
```

### Seeds
```bash
npm run db:seed:plans      # Popular planos
npm run db:seed:codes      # Popular códigos de ativação
npm run db:seed:insurances # Popular convênios
```

### Acesso
```bash
npm run access:create-code # Criar código de acesso
npm run access:activate    # Ativar código
npm run access:status      # Status de acesso
npm run access:list        # Listar acessos
npm run access:extend      # Estender acesso
```

### Master
```bash
npm run create:master      # Criar usuário master
```

---

## 📝 Convenções de Código

### Nomenclatura
- **Arquivos**: kebab-case (`upsert-doctor-form.tsx`)
- **Componentes**: PascalCase (`UpsertDoctorForm`)
- **Variáveis**: camelCase (`isLoading`, `hasError`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_DOCTORS`)

### Estrutura de Componentes
- Componentes específicos em `_components/` dentro da pasta da página
- Componentes compartilhados em `components/`
- Server Actions em `src/actions/`

### Validação
- Sempre usar Zod para schemas
- Sempre usar React Hook Form para formulários
- Validações no schema Zod, não no componente

### TypeScript
- Sempre tipar props e retornos
- Usar tipos do Drizzle quando possível (`$inferSelect`, `$inferInsert`)
- Campos opcionais do banco devem ser opcionais nos tipos

---

## 🚀 Próximos Passos

### Melhorias Sugeridas
1. Notificações em tempo real
2. Integração com WhatsApp
3. Relatórios avançados
4. Exportação de dados
5. API pública para integrações
6. App mobile

---

## 📚 Documentação Adicional

- `docs/MULTI_TENANT_ARCHITECTURE.md` - Arquitetura multi-tenant
- `docs/PRONTUARIO_SECURITY_MVP.md` - Segurança de prontuários
- `scripts/README-master.md` - Documentação do sistema master
- `scripts/README-access.md` - Documentação de códigos de acesso

---

**Última atualização**: Janeiro 2026
