# Changelog - Versão 0.26.79

## 🛠️ Correções de Build e Deploy

### Build Errors Corrigidos

- ✅ **Todos os erros de build resolvidos** - Projeto agora compila sem erros para produção
- ✅ **Imports não utilizados removidos** - Limpeza de código em `app-sidebar.tsx`
- ✅ **Variáveis não utilizadas removidas** - Correção em `weekly-calendar-view.tsx`
- ✅ **Erros de tipo TypeScript corrigidos** em 14 arquivos:
  - `lib/auth.ts` - Type assertions para acessar propriedades de clinic
  - `get-doctor-specialties/index.ts` - Type assertions para specialty.name
  - `get-patient-records/index.ts` - Type assertions para doctor e appointment
  - `reschedule-appointment/index.ts` - Null checks e correção de array destructuring
  - `update-appointment/index.ts` - Null checks para clinic.id
  - `upsert-doctor-form.tsx` e `upsert-patient-form.tsx` - Type assertions para email
  - `doctors/page.tsx`, `prescriptions/page.tsx` - Type assertions para props
  - `professional/patient-records` - Type assertions para records
- ✅ **Referência circular corrigida** - Schema do banco de dados (`appointmentsTable`)

### Sidebar

- ✅ **Erro de chave duplicada corrigido** - Item "Inconsistências" não aparece mais duplicado
- ✅ **Menu inferior otimizado** - Item agora aparece apenas uma vez, baseado no role do usuário

### Deploy

- ✅ **36 rotas geradas com sucesso** - Build completo sem erros
- ✅ **Pronto para produção** - Pode fazer deploy com `vercel deploy --prod`

---

# Changelog - Versão 0.26.78

## 🎉 Novidades e Melhorias

### 📋 Prontuário do Paciente

- ✅ **Nova tela de prontuário completa** com visualização de dados do paciente e histórico de evoluções
- ✅ **Abas organizadas**: Dados do paciente e Evoluções em abas separadas para melhor navegação
- ✅ **Acesso rápido ao prontuário** diretamente da lista de pacientes e da tela de agendamentos
- ✅ **Visualização de evoluções** com indicação de atendimento normal ou avaliação (primeira consulta)
- ✅ **Edição de evoluções** diretamente do prontuário do paciente
- ✅ **Acesso liberado para proprietários** da clínica, além dos profissionais

### 📅 Agendamentos

- ✅ **Melhorias na tela de agendamentos** com acesso direto ao prontuário do paciente
- ✅ **Agendamento futuro** - Agora é possível agendar consultas para datas futuras
- ✅ **Agendamento múltiplo** - Funcionalidade para criar múltiplos agendamentos de uma vez
- ✅ **Acesso ao prontuário** a partir da lista de agendamentos e da visualização semanal
- ✅ **Tipos de agendamento** - Suporte para agendamentos de reposição e atendimento de avaliação

### 📊 Dashboard

- ✅ **Melhorias no filtro de datas** - Filtro agora mostra corretamente o primeiro e último dia do mês atual
- ✅ **Seleção de período** - Agora é possível selecionar um intervalo de datas dentro do mês atual
- ✅ **Correção de exibição** - Filtro de datas corrigido para não mostrar datas incorretas

### 🔐 Segurança e Acesso

- ✅ **Controle de acesso ao prontuário** - Proprietários da clínica podem visualizar prontuários completos
- ✅ **Máscara de conteúdo** - Profissionais só visualizam evoluções de seus próprios pacientes
- ✅ **Proteção de dados** - Sistema de permissões aprimorado para proteger informações sensíveis

### 🛠️ Correções Técnicas

- ✅ Correções de bugs e melhorias de performance
- ✅ Melhorias na estabilidade do sistema
- ✅ Otimizações de código para melhor experiência do usuário

---

## 📝 Detalhes Técnicos (Para Desenvolvedores)

### Novos Componentes

- `EvolutionModal` - Modal reutilizável para criação/edição de evoluções
- `PatientRecordPageClient` - Componente cliente para página de prontuário
- `add-multiple-appointments` - Ações para agendamento múltiplo

### Melhorias de Código

- Correção de tipos TypeScript em todo o sistema
- Ordenação automática de imports
- Remoção de código não utilizado
- Melhorias na estrutura de componentes

---

**Data de Lançamento:** 25 de Janeiro de 2026  
**Versão:** 0.26.78
