# ✅ Schema do Paciente - Completo

## 📋 Campos Adicionados

### **Novos Campos:**
1. ✅ `isWhatsapp` - Boolean (telefone é WhatsApp?)
2. ✅ `cid` - Text (CID do paciente)
3. ✅ `isActive` - Boolean (paciente ativo?)
4. ✅ `observations` - Text (observações gerais)
5. ✅ `treatment` - Enum (novo enum de tratamentos)

### **Novas Tabelas:**
1. ✅ `patients_to_treatments` - Many-to-many para múltiplos tratamentos

---

## 🎯 Enum de Tratamentos

```typescript
treatmentEnum = [
  "terapia_ocupacional",
  "psicomotricidade",
  "fonoaudiologia",
  "psicologia",
  "fisioterapia",
  "neurologia",
  "outros",
]
```

### **Uso:**
- Um paciente pode ter múltiplos tratamentos
- Ex: Maria faz terapia ocupacional + psicomotricidade
- Tabela `patients_to_treatments` gerencia essa relação

---

## 📊 Todos os Campos do Paciente

### **Identificação:**
- ✅ name
- ✅ email
- ✅ patientCode (novo!)
- ✅ cpf
- ✅ rg

### **Contato:**
- ✅ phoneNumber
- ✅ isWhatsapp (novo!)
- ✅ responsibleName
- ✅ responsibleContact

### **Dados Pessoais:**
- ✅ birthDate
- ✅ sex
- ✅ motherName
- ✅ fatherName

### **Convênio:**
- ✅ insurance (enum)
- ✅ insuranceCard (carteirinha)
- ✅ cid (novo!)

### **Endereço:**
- ✅ address
- ✅ number
- ✅ complement
- ✅ neighborhood
- ✅ city
- ✅ state
- ✅ zip/zode

### **Status:**
- ✅ isActive (novo!)
- ✅ observations (novo!)
- ✅ clinicId

### **Tratamentos:**
- ✅ treatments (many-to-many) (novo!)

---

## 🚀 Próximo Passo

**Migration gerada:** `0006_pretty_captain_midlands.sql`

**Precisa aplicar:**
```bash
npm run db:migrate
```

**Depois atualizar:**
- Schema do formulário de paciente
- Action de upsert
- Card de exibição

