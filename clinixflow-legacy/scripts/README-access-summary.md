# 📋 Resumo: Duas Formas de Liberar Acesso

Este documento resume as duas formas de liberar acesso no sistema ClinixFlow.

---

## 🔧 1. Query SQL (Rápida e Direta)

### Arquivo: `scripts/update-access.sql`

**Quando usar:**
- Atualizações rápidas via banco de dados
- Ativações em massa
- Scripts automatizados
- Quando não tem acesso à interface web

### Exemplos:

```sql
-- Ativar usuário por 30 dias
UPDATE users
SET 
  plan = 'alpha',
  plan_expires_at = NOW() + INTERVAL '30 days',
  activated_by_code = 'MANUAL_SQL_' || NOW()::text,
  updated_at = NOW()
WHERE email = 'user@example.com';

-- Ativar todos os owners sem plano
UPDATE users
SET 
  plan = 'alpha',
  plan_expires_at = NOW() + INTERVAL '30 days',
  activated_by_code = 'MANUAL_SQL_ALL_OWNERS_' || NOW()::text,
  updated_at = NOW()
WHERE role = 'clinic_owner'
  AND (plan IS NULL OR plan_expires_at IS NULL OR plan_expires_at < NOW());
```

**Vantagens:**
- ✅ Rápido e direto
- ✅ Pode fazer em massa
- ✅ Não precisa de interface

**Desvantagens:**
- ❌ Precisa acesso ao banco
- ❌ Não tem validação visual
- ❌ Não tem histórico fácil

---

## 🖥️ 2. Interface Master (Visual e Completa)

### URL: `/master/owners`

**Quando usar:**
- Gerenciamento visual e intuitivo
- Ver status de todos os owners
- Atualizações pontuais
- Histórico e rastreamento

### Configuração:

1. **Adicionar role master:**
   ```bash
   npm run db:migrate:sql
   # Ou: psql $DATABASE_URL -f drizzle/0024_add_master_role.sql
   ```

2. **Criar usuário master:**
   ```sql
   UPDATE users 
   SET role = 'master' 
   WHERE email = 'seu-email@master.com';
   ```

3. **Acessar:**
   - Faça login com usuário master
   - No sidebar, clique em "Gerenciar Owners"
   - Veja lista de todos os owners
   - Clique em um owner para ver detalhes e atualizar

### Funcionalidades:

- ✅ **Lista de Owners:** Todos os owners com status visual
- ✅ **Detalhes:** Informações completas de cada owner
- ✅ **Atualização:** Formulário simples para atualizar plano e duração
- ✅ **Status Visual:** Cores indicam status (Ativo, Expirando, Expirado)
- ✅ **Segurança:** Apenas master pode acessar

**Vantagens:**
- ✅ Interface visual e intuitiva
- ✅ Ver todos os owners de uma vez
- ✅ Status em tempo real
- ✅ Validação automática
- ✅ Histórico de atualizações

**Desvantagens:**
- ❌ Precisa configurar usuário master primeiro
- ❌ Atualizações uma por uma (não em massa)

---

## 🎯 Qual Usar?

### Use SQL quando:
- Precisa ativar muitos usuários de uma vez
- Está fazendo manutenção no banco
- Precisa de script automatizado
- Não tem acesso à interface web

### Use Interface Master quando:
- Quer ver status visual de todos os owners
- Precisa atualizar poucos owners
- Quer interface amigável
- Precisa de rastreamento visual

---

## 📊 Comparação Rápida

| Característica | SQL | Interface Master |
|---------------|-----|------------------|
| Velocidade | ⚡⚡⚡ Muito rápida | ⚡⚡ Rápida |
| Visual | ❌ Não | ✅ Sim |
| Em massa | ✅ Sim | ❌ Não |
| Fácil de usar | ⚠️ Requer SQL | ✅ Muito fácil |
| Validação | ⚠️ Manual | ✅ Automática |
| Histórico | ⚠️ No banco | ✅ Visual |

---

## 🚀 Recomendação

**Para uso diário:** Use a **Interface Master** - é mais prática e visual.

**Para manutenção/scripts:** Use **SQL** - é mais rápida para atualizações em massa.

---

## 📝 Exemplos Práticos

### Cenário 1: Ativar um novo owner
**SQL:**
```sql
UPDATE users SET plan='alpha', plan_expires_at=NOW()+INTERVAL '30 days' WHERE email='novo@clinica.com';
```

**Interface:**
1. Acesse `/master/owners`
2. Clique no owner
3. Preencha formulário
4. Clique "Atualizar"

### Cenário 2: Ativar 10 owners de uma vez
**SQL:** ✅ Melhor opção
```sql
UPDATE users SET plan='alpha', plan_expires_at=NOW()+INTERVAL '30 days' 
WHERE email IN ('user1@email.com', 'user2@email.com', ...);
```

**Interface:** ❌ Terá que fazer 10 vezes

### Cenário 3: Ver status de todos os owners
**SQL:** ⚠️ Precisa fazer query manual
```sql
SELECT email, plan, plan_expires_at, 
  CASE WHEN plan_expires_at < NOW() THEN 'EXPIRADO' ELSE 'ATIVO' END as status
FROM users WHERE role='clinic_owner';
```

**Interface:** ✅ Melhor opção - visual e completo

---

## 🔗 Arquivos Relacionados

- `scripts/update-access.sql` - Queries SQL
- `scripts/README-master.md` - Documentação da interface master
- `drizzle/0024_add_master_role.sql` - Migration para role master
- `src/app/(protected)/master/owners/` - Páginas da interface master
