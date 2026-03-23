# Comparação de Abordagens SaaS para Multi-Tenancy

## 🎯 Problema
**Como lidar com usuários (profissionais e pacientes) que estão em múltiplas clínicas?**

---

## 📊 Abordagens Possíveis

### 1️⃣ **Subdomínios** (Proposto Inicialmente)
```
- plenoser.clinixflow.com.br → Acessa dados da PlenoSer
- xpto.clinixflow.com.br → Acessa dados da XPTO
```

**Fluxo do Usuário:**
```
1. Usuário recebe email de convite: "Acesse plenoser.clinixflow.com.br"
2. Faz login em plenoser.clinixflow.com.br
3. Vê apenas dados da PlenoSer
4. Para ir para XPTO, precisa acessar xpto.clinixflow.com.br
5. Precisa fazer login novamente (cookie isolado)
```

**❌ Problemas:**
- Usuário precisa lembrar URL diferente para cada clínica
- Login duplicado para cada subdomínio
- Cache/cookies separados (perde preferências)
- Configuração DNS complexa para cada cliente
- SEO complexo
- Custo alto de SSL wildcard
- Experiência confusa para usuários em múltiplas clínicas

**✅ Vantagens:**
- Isolamento visual total
- Cada clínica parece ter sistema próprio
- Cache isolado por subdomínio

---

### 2️⃣ **Domínio Único com Seletor de Clínica** ⭐ **RECOMENDADO**
```
- clinixflow.com.br → Sempre o mesmo domínio
```

**Fluxo do Usuário:**
```
1. Usuário faz login em clinixflow.com.br
2. Sistema detecta: "Você tem acesso a 3 clínicas:"
   - PlenoSer Terapias
   - XPTO Clinic
   - Centro Médico ABC
3. Usuário clica em "PlenoSer Terapias"
4. Interface muda para mostrar dados da PlenoSer
5. Pode trocar de clínica a qualquer momento (dropdown no header)
```

**✅ Vantagens:**
- **Experiência fluida** - Um único login para todas as clínicas
- **Troca fácil** - Dropdown no header para mudar de contexto
- **Simplicidade técnica** - Sem configuração DNS por cliente
- **Cache compartilhado** - Preferências mantidas
- **Padrão de mercado** - Slack, Notion, Linear usam isso
- **Escalável** - Funciona para 1 ou 1000 clínicas
- **SSO simplificado** - Login único

**❌ Desvantagens:**
- Precisar implementar seletor de clínica
- Pode parecer menos "dedicado" (mas isso é resolvido com branding)

---

## 🏆 Resposta: Qual é Melhor?

### Para um SaaS de Gestão de Clínicas
**✅ Domínio Único com Seletor é MELHOR**

### Por quê?

#### 1. **Caso de Uso Real**
```typescript
// Cenário comum:
Dr. João é profissional em:
- PlenoSer Terapias (seg-sex, manhã)
- Centro Médico ABC (ter-qui, tarde)
- Clínica XPTO (sábado, todo dia)

Paciente Maria é atendida em:
- PlenoSer Terapias (pediatria)
- Centro Médico ABC (cardiologia)
- Clínica do Bairro (checkups)
```

**Com Subdomínios:** Dr. João precisa:
- Fazer login em 3 URLs diferentes
- Lembrar 3 senhas diferentes
- Alternar entre 3 abas do navegador
- Não consegue ver agenda consolidada

**Com Seletor:** Dr. João:
- Login único
- Dropdown "Trocar Clínica" no header
- Agenda consolidada (se implementar feature)
- Experiência fluida

#### 2. **Exemplos de Mercado**
| Sistema | Abordagem |
|---------|-----------|
| Slack | Workspace selector |
| Notion | Workspace selector |
| Linear | Team selector |
| Figma | Team selector |
| Asana | Workspace selector |
| **Todo SaaS moderno** | Seletor! |

#### 3. **Quando Subdomínios Fazem Sentido**
Apenas para casos **muito específicos**:
- Compliance legal extremo (dados não podem passar por mesmo IP)
- Clientes Enterprise com exigências técnicas
- Diferentes marcas/softwares por cliente
- White-label completo (cliente compra domínio próprio)

**❌ NÃO é o caso de gestão de clínicas!**

---

## 🎯 Solução Final Recomendada

### Arquitetura com Seletor de Clínica

```typescript
// 1. Estrutura de Diretórios
src/app/(protected)/
├── layout.tsx                    # Layout base
│
├── dashboard/                    # Área compartilhada
│   └── clinic-selector/         # Componente de troca
│
├── (admin)/                      # Admin sempre acessa pelo subpath
├── (doctor)/                     # Doctor sempre acessa pelo subpath
└── (patient)/                    # Patient sempre acessa pelo subpath
```

### Componente Seletor de Clínica

```typescript
// src/components/clinic-selector.tsx
"use client";

import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building2 } from "lucide-react";

export function ClinicSelector() {
  const { data: session } = useSession();
  const router = useRouter();

  // Pega todas as clínicas que o usuário acessa
  const clinics = [
    ...session.user.clinics,           // Clínicas onde é owner/admin
    ...session.user.doctorClinics,      // Clínicas onde é doctor
    ...session.user.patientClinics,     // Clínicas onde é patient
  ];

  const currentClinic = session.user.clinic;

  const handleSwitchClinic = (clinicId: string) => {
    // Salva no cookie/session
    // Reload com novo contexto
    router.push(`/dashboard?clinic=${clinicId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
        <Building2 className="h-5 w-5" />
        <span className="font-medium">{currentClinic.name}</span>
        <span className="text-muted-foreground">
          ({clinics.length} clínicas)
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {clinics.map((clinic) => (
          <DropdownMenuItem
            key={clinic.id}
            onClick={() => handleSwitchClinic(clinic.id)}
            className={currentClinic.id === clinic.id ? "bg-muted" : ""}
          >
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <div>
                <p className="font-medium">{clinic.name}</p>
                <p className="text-xs text-muted-foreground">{clinic.role}</p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Modificar lib/auth.ts

```typescript
// lib/auth.ts - Session customizada

plugins: [
  customSession(async ({ user, session }) => {
    // Buscar TODAS as clínicas do usuário
    const [ownerClinics, doctorClinics, patientClinics] = await Promise.all([
      db.query.usersToClinicsTable.findMany({
        where: eq(usersToClinicsTable.userId, user.id),
        with: { clinic: true },
      }),
      db.query.doctorsToUsersTable.findMany({
        where: eq(doctorsToUsersTable.userId, user.id),
        with: { clinic: true, doctor: true },
      }),
      db.query.patientsToUsersTable.findMany({
        where: eq(patientsToUsersTable.userId, user.id),
        with: { clinic: true, patient: true },
      }),
    ]);

    // Pega a clínica ativa da query param ou cookie
    const activeClinicId = getActiveClinicId(); // Implementar

    return {
      user: {
        ...user,
        role: userData?.role,
        
        // Clínica atualmente ativa
        clinic: {
          id: activeClinicId,
          name: getClinicName(activeClinicId),
        },
        
        // TODAS as clínicas disponíveis
        clinics: [
          ...ownerClinics.map(c => ({ id: c.clinicId, name: c.clinic?.name, role: 'owner' })),
          ...doctorClinics.map(c => ({ id: c.clinicId, name: c.clinic?.name, role: 'doctor' })),
          ...patientClinics.map(c => ({ id: c.clinicId, name: c.clinic?.name, role: 'patient' })),
        ],
      },
      session,
    };
  }),
],
```

### Implementar Context Switcher

```typescript
// src/hooks/use-clinic-context.ts
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export function useClinicContext() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const activeClinic = searchParams.get('clinic') || null;
  
  const switchClinic = (clinicId: string) => {
    const currentPath = window.location.pathname;
    router.push(`${currentPath}?clinic=${clinicId}`);
  };
  
  return { activeClinic, switchClinic };
}
```

---

## 📋 Checklist de Implementação

### Remover:
- ❌ Middleware de subdomínios
- ❌ Campo `subdomain` na tabela `clinics`
- ❌ Lógica de routing por subdomínio

### Adicionar:
- ✅ Componente `ClinicSelector` no header
- ✅ Query param `?clinic=xxxx` nas URLs
- ✅ Middleware para ler/write de clínica ativa
- ✅ Função para trocar contexto de clínica
- ✅ Lista de todas clínicas no session

---

## 🎨 UX Melhorada

```
┌─────────────────────────────────────────┐
│ [≡] ClinixFlow    [🏥 PlenoSer ▼] [👤] │
├─────────────────────────────────────────┤
│                                         │
│  Menu Lateral                           │
│  - Dashboard                            │
│  - Agendamentos                         │
│  - Meus Pacientes                       │
│                                         │
│  Dropdown ao clicar:                    │
│  ├─ 🏥 PlenoSer Terapias (Doctor)      │
│  ├─ 🏥 Centro Médico ABC (Doctor)  ←   │
│  └─ 👤 XPTO Clinic (Patient)            │
│                                         │
└─────────────────────────────────────────┘
```

**Usuário clica no dropdown → Troca instantânea de contexto!**

---

## ✅ Conclusão

**Para um SaaS de gestão de clínicas:**
- ✅ **Usar domínio único com seletor de clínica**
- ❌ **NÃO usar subdomínios**

**Motivo:** É o padrão da indústria, oferece melhor UX, é mais escalável e resolve perfeitamente o caso de uso de usuários em múltiplas clínicas.

**Quer que eu refaça a arquitetura documentada com essa abordagem?**

