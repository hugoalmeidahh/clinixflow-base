# 🚀 Guia de Deployment - ClinixFlow

## 📋 Configuração do Banco de Dados (Neon + Vercel)

### 1. **Configuração do Neon Database**

1. Acesse [Neon Console](https://console.neon.tech/)
2. Crie um novo projeto
3. Copie a `DATABASE_URL` de conexão
4. Configure as variáveis de ambiente na Vercel

### 2. **Variáveis de Ambiente Necessárias**

Configure estas variáveis no painel da Vercel:

```bash
# Database
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Better Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=https://your-app.vercel.app

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. **GitHub Actions Secrets**

Configure estes secrets no GitHub:

```bash
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

## 🔄 Fluxo de Deployment

### **Opção 1: GitHub Actions (Recomendado)**

1. Push para branch `main` ou `develop`
2. GitHub Actions executa:
   - Instala dependências
   - Aplica migrações do Drizzle
   - Faz build da aplicação
   - Deploy na Vercel

### **Opção 2: Build Script na Vercel**

1. A Vercel executa automaticamente:
   - `npm ci` (instala dependências)
   - `npm run build` (que inclui `npm run db:migrate`)
   - Deploy da aplicação

## 🛠 Comandos Úteis

```bash
# Instalar dependências (com React 19)
npm run install:legacy

# Gerar migrações
npm run db:generate

# Aplicar migrações
npm run db:migrate

# Abrir Drizzle Studio
npm run db:studio

# Verificar schema
npm run db:check

# Build local com migrações
npm run build
```

## 🔧 Troubleshooting

### **Erro: "usersTables not found"**

Este erro ocorre quando:
1. As migrações não foram aplicadas
2. O schema não está sincronizado

**Solução:**
```bash
# Aplicar migrações manualmente
npm run db:migrate

# Ou forçar push do schema
npx drizzle-kit push --force
```

### **Erro de conexão com banco**

Verifique:
1. `DATABASE_URL` está correta
2. Banco Neon está ativo
3. Credenciais estão válidas

### **Erro: "ERESOLVE could not resolve" (React 19)**

Este erro ocorre devido a conflitos de dependências com React 19:

**Solução:**
```bash
# Instalar com legacy peer deps
npm install --legacy-peer-deps

# Ou usar o script configurado
npm run install:legacy
```

**Causa:** Algumas bibliotecas ainda não suportam React 19 completamente, como `react-day-picker@8.10.1`.

### **Build falha na Vercel**

1. Verifique logs da Vercel
2. Confirme variáveis de ambiente
3. Teste build local: `npm run build`

## 📊 Monitoramento

- **Vercel Dashboard**: Monitore deployments e logs
- **Neon Console**: Monitore performance do banco
- **GitHub Actions**: Acompanhe status dos workflows

## 🚨 Importante

- **Nunca** commite a `DATABASE_URL` no código
- **Sempre** teste migrações localmente primeiro
- **Backup** do banco antes de migrações importantes
- **Monitore** logs de erro após deployment
