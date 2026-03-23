# 🔐 Estratégia de Segurança para Prontuários - ClinixFlow

## 📋 **Problema Identificado**

Atualmente:
- ❌ Dados dos prontuários estão em **plain text** no banco
- ❌ Admin/Owner podem ver **todo** o conteúdo clínico
- ❌ Profissionais podem ver evoluções de outros profissionais
- ❌ Sem auditoria de acessos
- ❌ Violação potencial da **LGPD** e códigos de ética

## ✅ **Solução Proposta**

### **1. Modelo de Segregação por Profissional**
- Cada profissional só vê suas próprias evoluções
- Admin/Owner veem apenas **metadados operacionais** (sem conteúdo clínico)
- Conteúdo clínico criptografado no banco

### **2. Criptografia Real (AES-256-GCM)**
- ❌ **NÃO usar Base64** (não é criptografia!)
- ✅ Usar **AES-256-GCM** (padrão militar)
- Chave armazenada em variável de ambiente
- IV (Initialization Vector) único por registro

### **3. Sistema de Auditoria**
- Log de todos os acessos
- Log de tentativas negadas
- Registro de quem acessou o quê e quando

### **4. Chave Mestre Temporária**
- Acesso emergencial com token temporário
- Requer justificativa
- Expira automaticamente
- Totalmente auditado

---

## 🏗️ **Arquitetura Técnica**

### **1. Estrutura de Dados**

```typescript
// Antes (INSEGURO):
patient_records {
  content: text  // Plain text! ❌
}

// Depois (SEGURO):
patient_records {
  content_encrypted: text      // Criptografado ✅
  content_iv: text             // IV único ✅
  metadata: jsonb              // Metadados não sensíveis ✅
}
```

### **2. Regras de Acesso (RBAC + ABAC)**

```typescript
// Profissional (doctor)
- Pode ver: Apenas evoluções onde doctor_id = user.doctor_id
- Pode criar: Apenas para seus próprios pacientes
- NÃO pode: Ver evoluções de outros profissionais

// Admin/Owner
- Pode ver: Apenas metadados (data, profissional, paciente)
- NÃO pode ver: Conteúdo clínico (content, avaliation_content)
- Pode ver: Estatísticas agregadas (sem conteúdo)

// Chave Mestre (temporária)
- Acesso total com token de emergência
- Requer justificativa
- Expira em X horas
- Totalmente auditado
```

### **3. Fluxo de Criptografia**

```
Criar Evolução:
1. Profissional escreve conteúdo
2. Sistema criptografa (AES-256-GCM) com chave + IV único
3. Salva encrypted_content + IV no banco
4. Descarta conteúdo plain text

Ler Evolução:
1. Sistema verifica permissões (ABAC)
2. Se autorizado, busca encrypted_content + IV
3. Descriptografa apenas para o profissional autorizado
4. Mostra conteúdo descriptografado
5. Registra acesso na auditoria
```

---

## 🔧 **Implementação**

### **Fase 1: Criptografia**
1. Criar utilitário de criptografia (AES-256-GCM)
2. Migration para adicionar campos de criptografia
3. Migrar dados existentes (criptografar)
4. Atualizar actions para criptografar/descriptografar

### **Fase 2: Controle de Acesso**
1. Criar função de verificação de permissão
2. Atualizar queries para filtrar por profissional
3. Remover acesso de admin/owner ao conteúdo
4. Criar views de metadados para admin/owner

### **Fase 3: Auditoria**
1. Criar tabela de auditoria
2. Log de acessos bem-sucedidos
3. Log de tentativas negadas
4. Dashboard de auditoria

### **Fase 4: Chave Mestre**
1. Sistema de geração de tokens temporários
2. Interface de solicitação de acesso emergencial
3. Aprovação/autorização
4. Expiração automática

---

## ⚠️ **IMPORTANTE: Base64 vs Criptografia**

### **Base64 (NÃO É SEGURO!)**
```typescript
// Base64 é apenas ENCODING, não CRIPTOGRAFIA
const encoded = Buffer.from("texto").toString('base64')  
// Qualquer um pode decodificar facilmente!

// Qualquer pessoa com acesso ao banco pode ver:
atob("dGV4dG8=") // = "texto" ❌
```

### **AES-256-GCM (CRIPTOGRAFIA REAL)**
```typescript
// AES-256-GCM é CRIPTOGRAFIA militar
const encrypted = encrypt("texto", secretKey, iv)
// Sem a chave secreta, é IMPOSSÍVEL descriptografar ✅

// Mesmo com acesso ao banco:
// - Sem a chave secreta = IMPOSSÍVEL ler ✅
// - Cada registro tem IV único = segurança máxima ✅
```

---

## 🔑 **Gerenciamento de Chaves**

### **Chave Principal**
```env
# .env
PATIENT_RECORDS_ENCRYPTION_KEY=<32-byte-hex-key>
```

### **Geração Segura**
```bash
# Gerar chave de 32 bytes (256 bits)
openssl rand -hex 32
```

### **Rotação de Chaves** (Futuro)
- Suportar múltiplas chaves
- Migração gradual
- Re-criptografação em background

---

## 📊 **Estrutura de Auditoria**

```sql
patient_records_access_log {
  id: uuid
  patient_record_id: uuid
  accessed_by: uuid (user_id)
  access_type: enum ('view', 'edit', 'master_key')
  granted: boolean
  reason: text (justificativa se master_key)
  ip_address: text
  user_agent: text
  accessed_at: timestamp
  expires_at: timestamp (se master_key)
}
```

---

## 🎯 **Próximos Passos**

1. ✅ Implementar criptografia AES-256-GCM
2. ✅ Restringir acesso por profissional
3. ✅ Remover acesso de admin/owner ao conteúdo
4. ✅ Implementar auditoria
5. ✅ Criar sistema de chave mestre temporária
