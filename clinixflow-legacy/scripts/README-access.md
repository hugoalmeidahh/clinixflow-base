# 🔐 Script de Gerenciamento de Acesso

Script para gerenciar acesso de usuários no sistema ClinixFlow.

## 📋 Comandos Disponíveis

### 1. Criar Código de Ativação

Cria um novo código de ativação que pode ser usado pelos usuários.

```bash
npm run access:create-code -- --code TESTE2024 --plan alpha --days 30
```

**Parâmetros:**
- `--code`: Código único (ex: TESTE2024, BETA2024)
- `--plan`: Tipo de plano (ex: alpha, beta_partner)
- `--days`: Duração em dias

---

### 2. Ativar Usuário Diretamente

Ativa um usuário diretamente sem precisar de código de ativação.

```bash
npm run access:activate -- --email user@example.com --plan alpha --days 30
```

**Parâmetros:**
- `--email`: Email do usuário
- `--plan`: Tipo de plano (ex: alpha, beta_partner)
- `--days`: Duração em dias

---

### 3. Verificar Status de Usuário

Mostra informações detalhadas sobre o status de acesso de um usuário.

```bash
npm run access:status -- --email user@example.com
```

**Parâmetros:**
- `--email`: Email do usuário

**Informações exibidas:**
- Nome e email
- Role (função)
- Plano atual
- Data de expiração
- Status (ATIVO, EXPIRANDO EM BREVE, EXPIRADO, SEM PLANO)
- Código usado para ativação

---

### 4. Listar Usuários

Lista todos os usuários com planos ativos ou busca por email/nome.

```bash
# Listar todos os usuários com planos
npm run access:list

# Buscar usuários
npm run access:list -- --search "joao"
```

**Parâmetros:**
- `--search`: (opcional) Buscar por email ou nome

---

### 5. Estender/Renovar Plano

Estende ou renova o plano de um usuário.

```bash
# Estender plano (adiciona dias à data atual de expiração)
npm run access:extend -- --email user@example.com --days 30

# Renovar plano (renova a partir de hoje)
npm run access:extend -- --email user@example.com --days 30 --renew
```

**Parâmetros:**
- `--email`: Email do usuário
- `--days`: Dias a adicionar
- `--renew`: (opcional) Renovar a partir de hoje (sem esta flag, estende a partir da data atual)

---

### 6. Limpar Planos Expirados

Remove planos expirados do sistema.

```bash
npm run access:cleanup
```

**Ação:**
- Busca todos os usuários com planos expirados
- Remove o plano, data de expiração e código de ativação
- Exibe relatório dos usuários limpos

---

### 7. Listar Códigos de Ativação

Lista todos os códigos de ativação cadastrados.

```bash
npm run access:codes
```

**Informações exibidas:**
- Código
- Plano
- Duração (dias)
- Status (DISPONÍVEL, USADO, INATIVO)
- Usuário que utilizou (se aplicável)

---

## 📝 Exemplos Práticos

### Cenário 1: Liberar acesso para um novo usuário

```bash
# Ativar diretamente por 30 dias
npm run access:activate -- --email novo@clinica.com --plan alpha --days 30

# Verificar se foi ativado
npm run access:status -- --email novo@clinica.com
```

### Cenário 2: Criar código para distribuir

```bash
# Criar código de teste de 7 dias
npm run access:create-code -- --code TESTE2024 --plan alpha --days 7

# Verificar códigos disponíveis
npm run access:codes
```

### Cenário 3: Renovar acesso de usuário existente

```bash
# Verificar status atual
npm run access:status -- --email user@example.com

# Renovar por mais 30 dias
npm run access:extend -- --email user@example.com --days 30

# Ou renovar a partir de hoje
npm run access:extend -- --email user@example.com --days 30 --renew
```

### Cenário 4: Manutenção - Limpar planos expirados

```bash
# Limpar planos expirados
npm run access:cleanup

# Listar usuários para verificar
npm run access:list
```

---

## ⚠️ Observações Importantes

1. **Email é obrigatório** para comandos que atuam em usuários específicos
2. **Códigos são case-insensitive** (TESTE2024 = teste2024)
3. **Planos expirados** são automaticamente removidos ao usar `cleanup`
4. **Renovar vs Estender:**
   - `--renew`: Renova a partir de hoje (ignora data atual)
   - Sem `--renew`: Estende a partir da data atual de expiração

---

## 🔍 Troubleshooting

### Erro: "Usuário não encontrado"
- Verifique se o email está correto
- Use `npm run access:list` para ver usuários cadastrados

### Erro: "Código já existe"
- Escolha outro código
- Use `npm run access:codes` para ver códigos existentes

### Erro: "Usuário não possui plano ativo"
- Use `activate` primeiro para criar um plano
- Ou use `extend` com `--renew` para renovar

---

## 📚 Planos Disponíveis

Os planos comuns no sistema:
- `alpha`: Plano Alpha
- `beta_partner`: Plano Beta Partner

Verifique os planos disponíveis no banco de dados ou na documentação do sistema.
