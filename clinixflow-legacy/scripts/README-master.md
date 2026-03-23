# 🔐 Sistema Master - Gerenciamento de Owners

Sistema para usuário **MASTER** gerenciar acesso, licenças e pagamentos dos owners do sistema.

## 🚀 Configuração Inicial

### 1. Adicionar Role Master ao Banco

Execute a migration para adicionar o role `master`:

```bash
# Via script
npm run db:migrate:sql

# Ou diretamente no banco
psql $DATABASE_URL -f drizzle/0024_add_master_role.sql
```

### 2. Criar Usuário Master

```sql
-- Atualizar um usuário existente para ser master
UPDATE users 
SET role = 'master' 
WHERE email = 'seu-email@master.com';
```

**⚠️ IMPORTANTE:** 
- Apenas um usuário deve ter role `master`
- Guarde as credenciais com segurança
- O usuário master não precisa de plano (bypassa verificação)

## 📋 Funcionalidades

### Página de Listagem (`/master/owners`)

- Lista todos os owners cadastrados
- Mostra status de cada owner (Ativo, Expirando, Expirado, Sem Plano)
- Exibe data de expiração e dias restantes
- Link para página de detalhes

### Página de Detalhes (`/master/owners/[userId]`)

- **Informações do Owner:**
  - Nome, email, data de cadastro
  - Status atual do plano
  - Plano atual e data de expiração
  - Dias restantes

- **Formulário de Atualização:**
  - Selecionar plano (Alpha, Beta Partner)
  - Definir duração em dias
  - Adicionar observações
  - Atualizar acesso com um clique

## 🔒 Segurança

- **Acesso Restrito:** Apenas usuários com role `master` podem acessar
- **Validação Server-Side:** Todas as actions validam o role antes de executar
- **Logs:** Todas as atualizações são registradas com ID do master

## 📝 Uso

### Acessar a Interface

1. Faça login com usuário master
2. No sidebar, clique em "Gerenciar Owners"
3. Veja a lista de todos os owners

### Atualizar Acesso de um Owner

1. Na lista, clique em "Ver Detalhes" no owner desejado
2. Preencha o formulário:
   - **Plano:** Selecione o tipo de plano
   - **Duração:** Número de dias a partir de hoje
   - **Observações:** (opcional) Notas sobre a atualização
3. Clique em "Atualizar Acesso"
4. O sistema atualiza automaticamente e mostra confirmação

## 🎯 Exemplos Práticos

### Ativar Owner por 30 dias

1. Acesse `/master/owners`
2. Clique no owner
3. Selecione plano "Alpha"
4. Digite "30" em dias
5. Clique em "Atualizar Acesso"

### Renovar Plano Expirado

1. Na lista, identifique owners com status "Expirado"
2. Clique em "Ver Detalhes"
3. Selecione o plano desejado
4. Digite os dias (ex: 365 para 1 ano)
5. Atualize

## 🔍 Status dos Owners

- **Ativo (verde):** Plano válido com mais de 7 dias restantes
- **Expirando (amarelo):** Plano válido mas expira em 7 dias ou menos
- **Expirado (vermelho):** Plano já expirou
- **Sem Plano (cinza):** Owner não possui plano ativo

## 📊 Integração com SQL

Você também pode usar as queries SQL em `scripts/update-access.sql` para atualizações em massa ou via banco de dados diretamente.

## ⚠️ Observações

- O usuário master **não precisa de plano** para acessar o sistema
- Todas as atualizações são registradas com timestamp e ID do master
- O sistema não permite que owners se tornem master (apenas via SQL)
- A página de detalhes mostra informações em tempo real
