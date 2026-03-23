# 🔐 Segurança de Prontuários - Solução MVP (Simples)

## 🎯 **Objetivo**
Implementar controle de acesso básico no código, sem criptografia por enquanto.

## ✅ **O que vamos fazer AGORA (MVP)**

### **1. Controle de Acesso por Profissional**
- ✅ Profissional só vê suas próprias evoluções
- ✅ Admin/Owner **NÃO** veem conteúdo clínico
- ✅ Admin/Owner veem apenas metadados (data, profissional, paciente)

### **2. Ajustes no Código**
- ✅ Remover acesso de admin/owner às evoluções
- ✅ Garantir que queries filtram por `doctorId`
- ✅ Mostrar apenas metadados para admin/owner

### **3. Preparar para Futuro**
- 📝 Estrutura preparada para criptografia (depois)
- 📝 Campos no banco prontos para adicionar criptografia

---

## 🏗️ **Implementação Simples**

### **Regras de Acesso (Código)**

```typescript
// PROFISSIONAL (doctor)
✅ Pode ver: Apenas evoluções onde doctor_id = user.doctor_id
✅ Pode criar: Suas próprias evoluções
❌ NÃO pode ver: Evoluções de outros profissionais

// ADMIN/OWNER
✅ Pode ver: Apenas metadados (sem conteúdo)
  - Data da evolução
  - Nome do profissional
  - Nome do paciente
  - Status
❌ NÃO pode ver: 
  - content (conteúdo da evolução)
  - avaliationContent (avaliação)

// RECEPCIONIST/GESTOR
❌ NÃO pode ver: Nada de prontuários
```

### **Queries Atualizadas**

```typescript
// Para profissional
WHERE doctor_id = user.doctor_id

// Para admin/owner  
SELECT apenas:
  - id, patient_id, doctor_id, appointment_id
  - created_at, updated_at
  - first_consultation (boolean)
  // NÃO retorna: content, avaliationContent
```

---

## 📋 **Mudanças Necessárias**

### **1. Remover acesso de owner na página de prontuários**
- `professional/patient-records/[patientId]/page.tsx`
- Remover verificação `clinic_owner`

### **2. Criar função de permissão**
- `src/lib/permissions.ts`
- `canViewPatientRecordContent(role, doctorId, recordDoctorId)`

### **3. Atualizar actions**
- `get-patient-records/index.ts` - Filtrar conteúdo para admin/owner
- `get-patient-record-by-appointment/index.ts` - Filtrar conteúdo

### **4. Atualizar componentes**
- Mostrar apenas metadados para admin/owner
- Mostrar conteúdo completo apenas para profissional responsável

---

## 🔮 **Para o Futuro (Depois do MVP)**

Quando for necessário:
- ✅ Adicionar criptografia AES-256
- ✅ Sistema de auditoria completo
- ✅ Chave mestre temporária
- ✅ Dashboard de compliance

**Por enquanto:** Controle de acesso no código é suficiente para MVP! ✅
