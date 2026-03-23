# 📋 Análise de Campos do Paciente

## 🔍 Requisitos vs Atual

### **Campos Necessários:**

| Requisito | Campo Atual | Status |
|-----------|-------------|--------|
| Nome Paciente | `name` | ✅ Existe |
| Origem (Convênio) | `insurance` | ✅ Existe (enum) |
| Data Nascimento | `birthDate` | ✅ Existe |
| Documento | `cpf`, `rg` | ✅ Existe |
| Responsável | `responsibleName`, `responsibleContact` | ✅ Existe |
| Tratamento (pode ter mais de um) | ❌ | ❌ Precisa adicionar |
| Endereço | `address`, `number`, `complement`, `neighborhood`, `city`, `state`, `zipCode` | ✅ Existe |
| Email | `email` | ✅ Existe |
| Telefone | `phoneNumber` | ✅ Existe |
| isWhatsapp | HIV | ❌ Precisa adicionar |
| CID | ❌ | ❌ Precisa adicionar |
| Carteirinha | `insuranceCard` | ✅ Existe |
| isActive | ❌ | ❌ Precisa adicionar |
| Observações | ❌ | ❌ Precisa adicionar |
| patientCode | `patientCode` | ✅ Já adicionamos |

---

## 📊 O Que Precisa Adicionar

### **1. Campos na Tabela patients:**
```sql
isWhatsapp: boolean
cid: text
isActive: boolean (default true)
observations: text
```

### **2. Nova Tabela para Tratamentos:**
```sql
treatments (enum):
  "terapia_ocupacional"
  "psicomotricidade"
  "fonoaudiologia"
  "psicologia"
  "fisioterapia"

patients_to_treatments (many-to-many):
  patient_id
  treatment_id
```

---

## ✅ Vou Implementar Agora!

