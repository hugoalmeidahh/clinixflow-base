# Sistema de Ativação por Código

## 🎯 **Visão Geral**

Sistema implementado para permitir acesso temporário ao SaaS através de códigos de ativação, ideal para lançamento e validação do produto.

## 🚀 **Como Funciona**

### **1. Códigos Disponíveis**
```typescript
const ACTIVATION_CODES = {
  "ALFA2024": { plan: "alpha", days: 30 },
  "BETA2024": { plan: "alpha", days: 60 },
  "FOUNDER2024": { plan: "alpha", days: 365 },
  "TESTE2024": { plan: "alpha", days: 7 },
}
```

### **2. Fluxo de Ativação**
1. Usuário acessa `/new-subscription`
2. Escolhe "Tenho um código de ativação"
3. Digita o código
4. Sistema valida e ativa o plano
5. Usuário é redirecionado para `/dashboard`

### **3. Validação de Expiração**
- **Abordagem**: Desacoplada (cron job manual)
- **Endpoint**: `POST /api/cron/cleanup-expired-plans`
- **Frequência**: Manual (você roda quando quiser)

## 🛠️ **Estrutura do Banco**

### **Campos Adicionados na Tabela `users`:**
```sql
ALTER TABLE "users" ADD COLUMN "plan_expires_at" timestamp;
ALTER TABLE "users" ADD COLUMN "activated_by_code" text;
```

### **Campos:**
- `plan_expires_at`: Data de expiração do plano
- `activated_by_code`: Código usado para ativação (para rastreamento)

## 📁 **Arquivos Implementados**

### **Actions:**
- `src/actions/activate-code/index.ts` - Lógica de ativação
- `src/actions/activate-code/schema.ts` - Validação do código

### **Components:**
- `src/app/(protected)/subscription/_components/activation-code-form.tsx` - Formulário de ativação

### **Pages:**
- `src/app/new-subscription/page.tsx` - Atualizada com duas opções

### **API:**
- `src/app/api/cron/cleanup-expired-plans/route.ts` - Cron job para limpeza

## 🔄 **Como Usar**

### **1. Ativar um Usuário**
```bash
# Acesse a página /new-subscription
# Digite um dos códigos disponíveis
# Sistema ativa automaticamente
```

### **2. Limpar Planos Expirados**
```bash
# Via curl
curl -X POST http://localhost:3000/api/cron/cleanup-expired-plans

# Via interface (se implementar)
POST /api/cron/cleanup-expired-plans
```

### **3. Verificar Status**
```sql
-- Ver usuários com planos ativos
SELECT email, plan, plan_expires_at, activated_by_code 
FROM users 
WHERE plan = 'alpha';

-- Ver usuários com planos expirados
SELECT email, plan, plan_expires_at, activated_by_code 
FROM users 
WHERE plan = 'alpha' AND plan_expires_at < NOW();
```

## 🎯 **Vantagens**

### ✅ **Simplicidade**
- Implementação rápida (2-3 horas)
- Código limpo e fácil de manter
- Validação simples nas páginas

### ✅ **Controle**
- Você controla quem acessa
- Fácil distribuição de códigos
- Rastreamento de uso

### ✅ **Flexibilidade**
- Pode coexistir com Stripe
- Fácil de evoluir
- Diferentes períodos por código

### ✅ **Performance**
- Validação rápida nas páginas
- Cron job desacoplado
- Sem impacto na performance

## 🔮 **Evolução Futura**

### **Possíveis Melhorias:**
1. **Sistema de Convites**: Códigos únicos por convite
2. **Limites por Plano**: Número máximo de profissionais/pacientes
3. **Notificações**: Alertar antes da expiração
4. **Analytics**: Dashboard de uso dos códigos
5. **Automação**: Cron job automático

### **Integração com Stripe:**
- Quando configurar Stripe, o sistema continua funcionando
- Usuários podem migrar de código para assinatura
- Ambos os fluxos coexistem

## 🚨 **Segurança**

### **Boas Práticas:**
- ✅ Códigos hardcoded (não expostos no frontend)
- ✅ Validação server-side
- ✅ Logs de ativação
- ✅ Limpeza automática de dados expirados

### **Considerações:**
- 🔒 Códigos são case-insensitive
- 🔒 Validação em tempo real
- 🔒 Rastreamento de uso

## 📊 **Monitoramento**

### **Logs Importantes:**
```typescript
// Ativação bem-sucedida
console.log(`✅ Usuário ${email} ativado com código ${code} por ${days} dias`);

// Limpeza de planos expirados
console.log(`🧹 Limpo plano expirado do usuário: ${email} (ativado por: ${code})`);
```

### **Métricas Sugeridas:**
- Número de ativações por código
- Tempo médio de uso
- Taxa de conversão (código → assinatura)
- Usuários ativos vs expirados 