# Arquitetura Multi-Tenant - ClinixFlow

## 📋 Análise da Estrutura Atual

### Estado Atual
- ✅ Sistema básico multi-tenant com `users_to_clinics` (many-to-many)
- ✅ Autenticação usando BetterAuth
- ✅ Separação de dados por `clinicId` em todas as tabelas
- ❌ **Não existe usuário para profissionais**
- ❌ **Não existe usuário para pacientes**
- ❌ **Não existe suporte a subdomínios**
- ❌ **Não existe sistema de roles/permissões**

### Problemas Identificados
1. Profissionais e pacientes não têm acesso ao sistema
2. Não há separação lógica por subdomínio
3. Um paciente/profissional não pode estar em múltiplas clínicas
4. Não há controle de permissões granular

---

## 🎯 Solução Proposta

### 1. **Subdomínios como Estratégia de Tenant**

#### Vantagens
- ✅ **Isolamento visual** - cada clínica tem sua URL
- ✅ **SEO melhorado** - plenoser.clinixflow.com.br é indexado separadamente
- ✅ **Cache melhor** - cookies isolados por subdomínio
- ✅ **Experiência profissional** - parece sistema dedicado
- ✅ **Segmentação de marketing** - análises separadas

### ⚠️ **Importante: Todos os Usuários em (protected)**
- ✅ **Admin/Owner** → `(protected)/(admin)/` 
- ✅ **Doctor** → `(protected)/(doctor)/`
- ✅ **Patient** → `(protected)/(patient)/`
- ✅ **Proteção única** - Um único `layout.tsx` base em `(protected)/` que valida autenticação
- ✅ **Layouts específicos** - Cada grupo tem seu `layout.tsx` com sidebar apropriada

#### Implementação
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];
  
  // Domínio principal (landing page)
  if (hostname === 'clinixflow.com.br' || hostname.includes('localhost')) {
    return NextResponse.next();
  }
  
  // Redireciona para página de login com contexto do subdomínio
  if (subdomain && !request.nextUrl.pathname.startsWith('/authentication')) {
    // Adiciona contexto da clínica na URL
    const url = request.nextUrl.clone();
    url.searchParams.set('clinic', subdomain);
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next|static).*)',
};
```

---

## 2. **Schema de Banco - Usuários para Profissionais e Pacientes**

### Tabelas Necessárias

#### A. Tabela `user_roles` (Novo)
```typescript
export const userRolesEnum = pgEnum("user_role", [
  "clinic_owner",    // Proprietário da clínica
  "clinic_admin",    // Administrador da clínica
  "doctor",          // Médico década clínica
  "patient",         // Paciente
]);

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  role: userRolesEnum("role").notNull().default("clinic_owner"),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  // ... outros campos existentes
});
```

#### B. Relacionamento Profissional ↔ Usuário (Novo)
```typescript
export const doctorsToUsersTable = pgTable("doctors_to_users", {
  doctorId: uuid("doctor_id").references(() => doctorsTable.id, {
    onDelete: "cascade",
  }),
  userId: text("user_id").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// RELACIONAMENTO: Um profissional pode ter múltiplos usuários (em múltiplas clínicas)
// RELACIONAMENTO: Um usuário pode ser profissional em múltiplas clínicas
```

#### C. Relacionamento Paciente ↔ Usuário (Novo)
```typescript
export const patientsToUsersTable = pgTable("patients_to_users", {
  patientId: uuid("patient_id").references(() => patientsTable.id, {
    onDelete: "cascade",
  }),
  userId: text("user_id").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// RELACIONAMENTO: Um paciente pode ter múltiplos usuários (em múltiplas clínicas)
// RELACIONAMENTO: Um usuário pode ser paciente em múltiplas clínicas
```

#### D. Tabela `clinics` - Adicionar subdomain (Modificar)
```typescript
export const clinicsTable = pgTable("clinics", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  subdomain: text("subdomain").notNull().unique(), // NOVO
  // ... campos existentes
});
```

---

## 3. **Fluxo de Criação de Usuários**

### A. Criar Profissional com Usuário
```typescript
// src/actions/upsert-doctor/index.ts

export const upsertDoctor = actionClient
  .schema(upsertDoctorSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) throw new Error("Unauthorized");
    if (!session?.user.clinic?.id) throw new Error("Clinic not found");

    // 1. Criar o profissional
    const [doctor] = await db
      .insert(doctorsTable)
      .values({
        ...parsedInput,
        clinicId: session.user.clinic.id,
      })
      .returning();

    // 2. Se email foi fornecido, criar usuário e vincular
    if (parsedInput.email) {
      // 2.1. Criar usuário (se não existir)
      const existingUser = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, parsedInput.email),
      });

      let userId: string;
      if (existingUser) {
        userId = existingUser.id;
      } else {
        const newUser = await auth.api.signUpEmail({
          body: {
            email: parsedInput.email,
            password: generateRandomPassword(), // Gerar senha temporária
            name: parsedInput.name,
          },
        });
        userId = newUser.user.id;
        
        // Enviar email com senha temporária
        await sendWelcomeEmail({
          to: parsedInput.email,
          password: temporaryPassword,
          clinicName: session.user.clinic.name,
        });
      }

      // 2.2. Vincular profissional ao usuário nesta clínica
      await db.insert(doctorsToUsersTable).values({
        doctorId: doctor.id,
        userId: userId,
        clinicId: session.user.clinic.id,
      });

      // 2.3. Adicionar role "doctor" ao usuário
      await db
        .update(usersTable)
        .set({ role: "doctor" })
        .where(eq(usersTable.id, userId));
    }

    revalidatePath("/doctors");
  });
```

### B. Criar Paciente com Usuário
```typescript
// src/actions/upsert-patient/index.ts

export const upsertPatient = actionClient
  .schema(upsertPatientSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user?.clinic?.id) throw new Error("Clinic not found");

    // 1. Criar o paciente
    const [patient] = await db
      .insert(patientsTable)
      .values({
        ...parsedInput,
        clinicId: session.user.clinic.id,
      })
      .returning();

    // 2. Criar usuário para o paciente
    const existingUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, parsedInput.email),
    });

    let userId: string;
    if (existingUser) {
      userId = existingUser.id;
    } else {
      const newUser = await auth.api.signUpEmail({
        body: {
          email: parsedInput.email,
          password: generateRandomPassword(),
          name: parsedInput.name,
        },
      });
      userId = newUser.user.id;
      
      await sendWelcomeEmail({
        to: parsedInput.email,
        password: temporaryPassword,
        clinicName: session.user.clinic.name,
      });
    }

    // 3. Vincular paciente ao usuário
    await db.insert(patientsToUsersTable).values({
      patientId: patient.id,
      userId: userId,
      clinicId: session.user.clinic.id,
    });

    // 4. Adicionar role "patient" ao usuário
    await db
      .update(usersTable)
      .set({ role: "patient" })
      .where(eq(usersTable.id, userId));

    revalidatePath("/patients");
  });
```

---

## 4. **Sistema de Autenticação com Contexto de Clínica**

### Modificar `lib/auth.ts`
```typescript
// lib/auth.ts - Atualizar customSession

plugins: [
  customSession(async ({ user, session }) => {
    const [userData, clinics] = await Promise.all([
      db.query.usersTable.findFirst({
        where: eq(usersTable.id, user.id),
      }),
      db.query.usersToClinicsTable.findMany({
        where: eq(usersToClinicsTable.userId, user.id),
        with: { clinic: true },
      }),
    ]);

    // Buscar clínicas onde o usuário é profissional
    const doctorClinics = await db.query.doctorsToUsersTable.findMany({
      where: eq(doctorsToUsersTable.userId, user.id),
      with: { clinic: true, doctor: true },
    });

    // Buscar clínicas onde o usuário é paciente
    const patientClinics = await db.query.patientsToUsersTable.findMany({
      where: eq(patientsToUsersTable.userId, user.id),
      with: { clinic: true, patient: true },
    });

    return {
      user: {
        ...user,
        plan: userData?.plan,
        role: userData?.role,
        clinic: clinic?.clinicId
          ? {
              id: clinic.clinicId,
              name: clinic.clinic?.name,
              subdomain: clinic.clinic?.subdomain,
            }
          : undefined,
        // NOVO: Informações de clínicas como profissional
        doctorClinics: doctorClinics.map(dc => ({
          clinicId: dc.clinicId,
          clinicName: dc.clinic?.name,
          subdomain: dc.clinic?.subdomain,
          doctorId: dc.doctorId,
          doctorName: dc.doctor?.name,
        })),
        // NOVO: Informações de clínicas como paciente
        patientClinics: patientClinics.map(pc => ({
          clinicId: pc.clinicId,
          clinicName: pc.clinic?.name,
          subdomain: pc.clinic?.subdomain,
          patientId: pc.patientId,
          patientName: pc.patient?.name,
        })),
      },
      session,
    };
  }),
],
```

---

## 5. **Dashboards por Tipo de Usuário**

### Layout Base (Protected)
```typescript
// src/app/(protected)/layout.tsx

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  // Renderiza children (que será o layout específico por role)
  return <>{children}</>;
}
```

### Layout para Médico
```typescript
// src/app/(protected)/(doctor)/layout.tsx

import { DoctorSidebar } from "./_components/doctor-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DoctorSidebar />
      <main className="flex h-screen w-full flex-col">
        {children}
      </main>
    </SidebarProvider>
  );
}
```

### Layout para Paciente
```typescript
// src/app/(protected)/(patient)/layout.tsx

import { PatientSidebar } from "./_components/patient-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <PatientSidebar />
      <main className="flex h-screen w-full flex-col">
        {children}
      </main>
    </SidebarProvider>
  );
}
```

### Dashboard de Profissional (Médico)
```typescript
// src/app/(protected)/(doctor)/dashboard/page.tsx

const DoctorDashboard = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  
  // Validar que é médico
  if (session.user.role !== "doctor") {
    redirect("/dashboard");
  }

  // Buscar doctorId da sessão
  const doctorRelation = await db.query.doctorsToUsersTable.findFirst({
    where: and(
      eq(doctorsToUsersTable.userId, session.user.id),
      eq(doctorsToUsersTable.clinicId, session.user.clinic.id),
    ),
  });

  // Buscar agenda do profissional nesta clínica
  const appointments = await db.query.appointmentsTable.findMany({
    where: and(
      eq(appointmentsTable.clinicId, session.user.clinic.id),
      eq(appointmentsTable.doctorId, doctorRelation.doctorId),
      gte(appointmentsTable.date, new Date()),
    ),
    with: { patient: true },
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Minha Agenda</PageTitle>
        <PageDescription>Agenda do Dr. {session.user.name}</PageDescription>
      </PageHeader>
      {/* Agenda */}
      {/* Prontuários pendentes */}
    </PageContainer>
  );
};
```

### Dashboard de Paciente
```typescript
// src/app/(protected)/(patient)/dashboard/page.tsx

const PatientDashboard = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  
  // Validar que é paciente
  if (session.user.role !== "patient") {
    redirect("/dashboard");
  }

  // Buscar patientId da sessão
  const patientRelation = await db.query.patientsToUsersTable.findFirst({
    where: and(
      eq(patientsToUsersTable.userId, session.user.id),
      eq(patientsToUsersTable.clinicId, session.user.clinic.id),
    ),
  });

  // Buscar agendamentos do paciente nesta clínica
  const appointments = await db.query.appointmentsTable.findMany({
    where: and(
      eq(appointmentsTable.clinicId, session.user.clinic.id),
      eq(appointmentsTable.patientId, patientRelation.patientId),
      gte(appointmentsTable.date, new Date()),
    ),
    with: { doctor: true },
  });

  // Buscar prontuários disponíveis
  const records = await db.query.patientRecordsTable.findMany({
    where: and(
      eq(patientRecordsTable.clinicId, session.user.clinic.id),
      eq(patientRecordsTable.patientId, patientRelation.patientId),
    ),
    with: { doctor: true },
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Minha Área</PageTitle>
        <PageDescription>Área do Paciente</PageDescription>
      </PageHeader>
      {/* Próximos agendamentos */}
      {/* Histórico de consultas */}
      {/* Meus prontuários */}
      {/* Gráficos */}
    </PageContainer>
  );
};
```

---

## 6. **Estrutura de Diretórios Sugerida**

```
src/
├── app/
│   ├── (protected)/          # ÁREA LOGADA - Todos os tipos de usuários
│   │   │
│   │   ├── layout.tsx        # Layout base para todos
│   │   │
│   │   ├── (admin)/          # Grupo para Admin/Owner
│   │   │   ├── layout.tsx    # Layout com sidebar completo
│   │   │   ├── dashboard/    # Dashboard administrativo
│   │   │   ├── doctors/      # Gestão de profissionais
│   │   │   ├── patients/     # Gestão de pacientes
│   │   │   ├── appointments/ # Gestão de agendamentos
│   │   │   └── ...
│   │   │
│   │   ├── (doctor)/         # Grupo para Médicos
│   │   │   ├── layout.tsx    # Layout com sidebar médico
│   │   │   ├── dashboard/    # Agenda do médico
│   │   │   ├── my-appointments/ # Minhas consultas
│   │   │   └── patient-records/ # Prontuários do médico
│   │   │
│   │   ├── (patient)/        # Grupo para Pacientes
│   │   │   ├── layout.tsx    # Layout com sidebar paciente
│   │   │   ├── dashboard/    # Área do paciente
│   │   │   ├── my-appointments/ # Meus agendamentos
│   │   │   ├── my-records/   # Meus prontuários
│   │   │   └── prescriptions/ # Minhas receitas
│   │   │
│   │   └── _components/
│   │       ├── app-sidebar.tsx      # Sidebar compartilhada
│   │       ├── doctor-sidebar.tsx   # Sidebar para médico
│   │       ├── patient-sidebar.tsx  # Sidebar para paciente
│   │       └── app-breadcrumb.tsx
│   │
│   ├── [subdomain]/          # Dynamic route para subdomínios
│   │   └── layout.tsx        # Layout de subdomínio
│   │
│   └── api/
│       └── middleware.ts     # Middleware de subdomínio
```

---

## 📊 Diagrama de Relacionamentos

```
┌─────────────┐
│   USERS     │
│  (id, email)│
└──────┬──────┘
       │
       │ 1:N
       ├─────────────────────────────────┐
       │                                 │
┌──────▼──────┐              ┌───────────▼────────┐
│ USERS_TO    │              │DOCTORS_TO_USERS    │
│_CLINICS     │              │(userId, doctorId,  │
│(owner/admin)│              │ clinicId)          │
└─────────────┘              └───────────▲────────┘
                                         │
┌─────────────┐              ┌───────────┴────────┐
│ CLINICS     │              │   DOCTORS          │
│(subdomain)  │◄─────────────┤  (clinicId)        │
└──────▲──────┘              └────────────────────┘
       │
       │ 1:N
       ├───────────────────────────────┐
       │                               │
┌──────▼────────┐          ┌───────────▼────────┐
│ PATIENTS      │          │ PATIENTS_TO_USERS  │
│(clinicId)     │          │ (userId, patientId,│
│               │◄─────────┤  clinicId)         │
└───────────────┘          └────────────────────┘
```

---

## 🚀 Roadmap de Implementação

### Fase 1: Estrutura Base (1-2 semanas)
1. ✅ Adicionar campo `subdomain` na tabela `clinics`
2. ✅ Adicionar enum `user_role` e campo `role` em `users`
3. ✅ Criar tabelas `doctors_to_users` e `patients_to_users`
4. ✅ Criar migrations
5. ✅ Atualizar schema e relations

### Fase 2: Autenticação Multi-Role (2-3 semanas)
1. ✅ Implementar middleware de subdomínio
2. ✅ Atualizar `customSession` para suportar múltiplos roles
3. ✅ Criar lógica de criação de usuários ao criar profissional
4. ✅ Criar lógica de criação de usuários ao criar paciente
5. ✅ Implementar troca de contexto (clínica A → clínica B)

### Fase 3: Dashboards (2-3 semanas)
1. ✅ Criar sub-pastas (doctor) e (patient) dentro de (protected)
2. ✅ Criar layouts específicos para cada role
3. ✅ Criar sidebars específicas (doctor-sidebar, patient-sidebar)
4. ✅ Implementar dashboard de profissional (agenda, prontuários)
5. ✅ Implementar dashboard de paciente (agendamentos, histórico, gráficos)
6. ✅ Implementar middleware de verificação de role nas rotas

### Fase 4: Permissões e Segurança (1 semana)
1. ✅ Criar middleware de verificação de permissões
2. ✅ Implementar guards em todas as actions
3. ✅ Adicionar validações de acesso aos dados

### Fase 5: Notificações e Comunicação (1-2 semanas)
1. ✅ Sistema de notificações por email
2. ✅ Recuperação de senha
3. ✅ Confirmação de agendamentos

---

## 🔒 Segurança

### Considerações
1. **Isolamento de dados**: Sempre filtrar por `clinicId` em todas as queries
2. **Validação de permissões**: Verificar role em todas as actions
3. **Rate limiting**: Implementar por subdomínio
4. **Logs de auditoria**: Rastrear ações por usuário/clínica
5. **Criptografia**: Senhas hashadas (BetterAuth já faz isso)

---

## 📝 Considerações Finais

### Vantagens desta Abordagem
✅ **Escalável**: Suporta milhares de clínicas
✅ **Flexível**: Usuário pode ter múltiplas clínicas
✅ **Seguro**: Isolamento por subdomínio e role
✅ **Profissional**: Cada clínica tem URL própria
✅ **SEO**: Melhor indexação por subdomínio

### Desafios
⚠️ **Configuração DNS**: Cada clínica precisa de subdomínio
⚠️ **SSL**: Certificado wildcard para todos subdomínios
⚠️ **Cache**: Estratégia de cache por subdomínio
⚠️ **Testing**: Testar com múltiplos subdomínios

---

## 🎯 Próximos Passos

1. Revisar e aprovar esta arquitetura
2. Criar migrations para novas tabelas
3. Implementar middleware de subdomínio
4. Atualizar sistema de autenticação
5. Implementar dashboards por role

**Precisa de ajuda com alguma parte específica?** 🚀

