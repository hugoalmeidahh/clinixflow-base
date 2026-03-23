# 🤔 Estratégias de Código: Qual Usar?

## ❓ Pergunta: Precisamos de DOIS códigos únicos?

Você mencionou:
- ✅ Código da Clínica: `123-1393736`
- ✅ Código do Profissional: `DOC-001`
- ✅ Código do Paciente: `PAC-123-001`

**Será que precisa de TUDO isso?**

---

## 📊 3 Opções

### **Opção 1: Só Código da Clínica**

```
Clínica: 123-1393736

Profissional faz login com:
- Email OU CPF
- Senha
- Sistema sabe qual clínica (já está vinculado)
```

**Vantagens:**
- ✅ Simples
- ✅ Menos informação para memorizar
- ✅ Email/CPF já únicos

**Desvantagens:**
- ❌ Não tem "matrícula" específica
- ❌ Profissional precisa lembrar email/senha

---

### **Opção 2: Código Composto (Clínica + Tipo + Número)**

```
Clínica: 123-1393736

Profissional: 123-1393736-DOC-001
Paciente: 123-1393736-PAC-001

Login: Código completo + CPF
```

**Vantagens:**
- ✅ Identifica tudo de uma vez
- ✅ Único globalmente
- ✅ Fácil de verificar

**Desvantagens:**
- ❌ Muito longo para digitar
- ❌ Repetitivo (código clínica sempre igual)

---

### **Opção 3: Só Código Individual (MENOR número de casos)**

```
Clínica: Não tem código público

Profissional: DOC-001 (único na clínica)
Vehicle: PAC-001 (único na clínica)

Login: DOC-001 + CPF
Sistema busca qual clínica tem esse profissional
```

**Vantagens:**
- ✅ Curto e fácil
- ✅ Simples de digitar
- ✅ Parece com "matrícula"

**Desvantagens:**
- ❌ Precisa buscar clínica (mais lento)
- ❌ Complexidade no backend

---

## 🎯 Opção 4: **Híbrida Simples (RECOMENDADA!)**

### **Estratégia: Código da Clínica + Número Sequencial**

```
Clínica:
- ID interno: uuid
- Código amigável: "123" ou "PLENOSER"

Profissional:
- Código: "DOC-001" (único na clínica)
  OU
- Código completo: "123-DOC-001"

Paciente:
- Código: "PAC-001" (único na clínica)
  OU
- Código completo: "123-PAC-001"
```

### **Login:**
```
Opção A: Código Completo
- "123-DOC-001" + CPF

Opção B: Só Código Individual (se já sabe a clínica)
- "DOC-001" + CPF
- Sistema detecta clínica atual
```

---

## 💡 Minha Recomendação Final

### **Use APENAS 2 Níveis:**

#### **1. Código da Clínica**
```
clinic_code = "123" ou "PLENOSER"
```
- Curto
- Fácil de lembrar
- Identifica a clínica

#### **2. Código do Usuário (profissional/paciente)**
```
doctor_code = "001" (só o número)
patient_code = "002" (só o número)
```
- Curto
- Sequencial dentro da clínica
- Fácil de digitar

### **Login:**
```
Padrão:
  Código: "123-001" (clínica-usuário)
  CPF: 123.456.789-00
  
Alternativa:
  Código: "001" + Seleciona clínica
  OU
  Email: joao@email.com
```

---

## ✅ Implementação Proposta

```typescript
clinics:
  - id: uuid
  - clinic_code: "123" // Curto e único
  
doctors:
  - id: uuid
  - doctor_code: "001" // Número na clínica
  - clinic_id: uuid
  
patients:
  - id: uuid
  - patient_code: "001" // Número na clínica
  - clinic_id: uuid
```

### **Geração Automática:**
```typescript
// Ao criar clínica
clinic_code = generateShortCode() // "123"

// Ao criar profissional
doctor_code = getNextSequence(clinic_id) // "001", "002", "003"

// Ao criar paciente  
patient_code = getNextSequence(clinic_id) // "001", "002", "003"
```

### **Login:**
```typescript
// Usuário digita: "123-001" ou "DOC-001"
// Sistema:
1. Parse: "123-001" → clinic_code="123", user_code="001"
2. Busca: clinic WHERE clinic_code = "123"
3. Busca: doctor WHERE doctor_code = "001" AND clinic_id = clinic.id
4. Valida CPF
5. Login!
```

---

## 🎯 Resposta Direta

### **Precisa de DOIS códigos?**
✅ **SIM, mas SIMPLIFICADOS:**

1. **Código da Clínica:** `"123"` (curto)
2. **Código do Usuário:** `"001"` (número sequencial)

**Login:** `"123-001"` + CPF

### **Por que não precisa de 3 códigos?**
- ❌ Não precisa do código gigante `123-1393736`
- ❌ Não precisa prefixo `DOC-` ou `PAC-` (já sabe pelo login)
- ✅ Só precisa: Clínica + Número

---

## 💬 Conclusão

**Resumo:**
- ✅ Clínica: código curto (`"123"`)
- ✅ Usuário: número na clínica (`"001"`)
- ✅ Login: junta os dois (`"123-001"` + CPF)

**Isso é suficiente e simples!**

Quer que eu implemente assim? 🚀

