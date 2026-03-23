# 🔐 Guia Completo das Variáveis de Ambiente - ClinixFlow

## 📋 **BETTER_AUTH_SECRET**

### **O que é:**
- É uma chave secreta usada pelo Better Auth para **criptografar e assinar tokens de sessão**
- Funciona como uma "senha mestra" para a autenticação
- **OBRIGATÓRIA** para o funcionamento da autenticação

### **Como gerar:**
```bash
# Opção 1: Usando Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Opção 2: Usando OpenSSL
openssl rand -hex 32

# Opção 3: Online (não recomendado para produção)
# https://generate-secret.vercel.app/32
```

### **Exemplo:**
```env
BETTER_AUTH_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

### **Importante:**
- ✅ **NUNCA** commite esta chave no código
- ✅ Use uma chave **diferente** para desenvolvimento e produção
- ✅ Mantenha esta chave **secreta** e **segura**

---

## 🌐 **GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET**

### **O que são:**
- Credenciais para **autenticação via Google OAuth**
- Permitem que usuários façam login usando sua conta Google
- **OPCIONAIS** - se não configuradas, apenas login com email/senha funciona

### **Como obter:**

#### **1. Acesse o Google Cloud Console:**
- Vá para: https://console.cloud.google.com/

#### **2. Crie um novo projeto (ou selecione existente):**
- Clique em "New Project"
- Dê um nome (ex: "ClinixFlow")
- Clique em "Create"

#### **3. Habilite a Google+ API:**
- Vá para "APIs & Services" > "Library"
- Procure por "Google+ API" ou "Google Identity"
- Clique em "Enable"

#### **4. Configure as credenciais:**
- Vá para "APIs & Services" > "Credentials"
- Clique em "Create Credentials" > "OAuth client ID"
- Escolha "Web application"
- Configure:
  - **Name**: ClinixFlow Web Client
  - **Authorized JavaScript origins**: 
    - `http://localhost:3000` (desenvolvimento)
    - `https://seu-dominio.vercel.app` (produção)
  - **Authorized redirect URIs**:
    - `http://localhost:3000/api/auth/callback/google` (desenvolvimento)
    - `https://seu-dominio.vercel.app/api/auth/callback/google` (produção)

#### **5. Copie as credenciais:**
- Após criar, você receberá:
  - **Client ID**: `123456789-abcdef.apps.googleusercontent.com`
  - **Client Secret**: `GOCSPX-abcdef123456`

### **Exemplo:**
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz123456
```

### **Importante:**
- ✅ Configure as **URLs corretas** no Google Console
- ✅ Use **domínios diferentes** para dev/prod
- ✅ **NUNCA** commite essas credenciais no código

---

## 🗄️ **DATABASE_URL**

### **O que é:**
- URL de conexão com o banco de dados PostgreSQL (Neon)
- Contém todas as informações necessárias para conectar ao banco

### **Como obter (Neon):**

#### **1. Acesse o Neon Console:**
- Vá para: https://console.neon.tech/

#### **2. Crie um novo projeto:**
- Clique em "Create Project"
- Dê um nome (ex: "clinixflow-prod")
- Escolha região (recomendo São Paulo)
- Clique em "Create Project"

#### **3. Copie a connection string:**
- No dashboard do projeto, vá para "Connection Details"
- Copie a **Connection String** (não a Session Connection String)

### **Exemplo:**
```env
DATABASE_URL=postgresql://username:password@ep-cool-name-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### **Importante:**
- ✅ Use **SSL** (sslmode=require) para produção
- ✅ **NUNCA** commite esta URL no código
- ✅ Use bancos **separados** para dev/prod

---

## 🌍 **BETTER_AUTH_URL**

### **O que é:**
- URL base da sua aplicação
- Usada pelo Better Auth para gerar URLs de callback

### **Exemplo:**
```env
# Desenvolvimento
BETTER_AUTH_URL=http://localhost:3000

# Produção
BETTER_AUTH_URL=https://clinixflow.vercel.app
```

---

## 📝 **Arquivo .env.local completo (desenvolvimento):**

```env
# Database
DATABASE_URL=postgresql://username:password@ep-cool-name-123456.us-east-1.aws.neon.tech/neondb?sslmode=require

# Better Auth
BETTER_AUTH_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz123456

# Stripe (opcional - para pagamentos)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_ESSENTIAL_PLAN_PRICE_ID=price_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 **Como configurar na Vercel:**

### **1. Acesse o painel da Vercel:**
- Vá para: https://vercel.com/dashboard

### **2. Selecione seu projeto:**
- Clique no projeto ClinixFlow

### **3. Vá para Settings > Environment Variables:**
- Clique em "Add New"
- Adicione cada variável:
  - **Name**: `DATABASE_URL`
  - **Value**: `postgresql://...`
  - **Environment**: Production, Preview, Development
- Repita para todas as variáveis

### **4. Faça redeploy:**
- Após adicionar as variáveis, clique em "Redeploy"

---

## ⚠️ **Checklist de Segurança:**

- [ ] **NUNCA** commite arquivos `.env*` no Git
- [ ] Use `.env.example` para documentar as variáveis necessárias
- [ ] Use chaves **diferentes** para dev/prod
- [ ] **Rotacione** as chaves periodicamente
- [ ] **Monitore** o uso das APIs (Google, Stripe)
- [ ] Use **HTTPS** em produção
- [ ] Configure **domínios corretos** nos OAuth providers

---

## 🔧 **Troubleshooting:**

### **Erro: "BETTER_AUTH_SECRET is required"**
- ✅ Verifique se a variável está configurada
- ✅ Confirme que não há espaços extras
- ✅ Use uma chave de pelo menos 32 caracteres

### **Erro: "Invalid Google OAuth credentials"**
- ✅ Verifique Client ID e Secret
- ✅ Confirme URLs de callback no Google Console
- ✅ Teste em ambiente local primeiro

### **Erro: "Database connection failed"**
- ✅ Verifique a DATABASE_URL
- ✅ Confirme se o banco Neon está ativo
- ✅ Teste a conexão localmente

---

## 📚 **Recursos Adicionais:**

- [Better Auth Documentation](https://www.better-auth.com/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Neon Documentation](https://neon.tech/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
