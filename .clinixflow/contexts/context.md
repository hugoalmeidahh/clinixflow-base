# ClinixFlow v2 — Lovable Build Prompt
> Multi-Tenant SaaS | Modular Architecture | Up to Vaccines Module

---

## PROJECT OVERVIEW

Build **ClinixFlow**, a multi-tenant SaaS platform for health clinic management. The system must be **fully modular** — each organization activates only the modules included in their subscription plan. A separate backoffice application (managed by the SaaS Admin) controls tenants, plans, and global settings. That backoffice is **out of scope** for this build.

### Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js Server Actions + API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js v5
- **File Storage**: Supabase Storage or S3-compatible (for documents and signatures)
- **Design**: Clean, professional health-tech aesthetic. Primary palette: deep teal (`#0F766E`), white, dark slate. Use Inter or DM Sans. Avoid generic purple gradients.

---

## GLOBAL BUSINESS RULES

These rules apply across the entire system with no exceptions:

1. **Medical Record Numbers**: Sequential per tenant (`#0001`, `#0002`...). This number is NEVER the database ID — it is a human-readable identifier stored as a separate field with an auto-increment sequence per tenant.

2. **Appointment Codes**: Sequential with prefix, NEVER UUID. Format: `AGD-YYYY-NNNNN` (e.g. `AGD-2025-00042`). This is the code shown to users in all interfaces.

3. **Evaluation Results**: Immutable after finalization. Once a professional clicks "Finalize Evaluation", the record is locked — no edits allowed. This is a legal compliance requirement.

4. **Module Activation**: Every module (except the Base Clinic Module) must be individually activated per tenant. A tenant can only activate modules that their subscription plan allows. Plan permissions are configured by the SaaS Admin in the backoffice.

5. **Audit Trail**: Every critical action (finalize evaluation, register absence, financial entry, sign contract) must record `performed_by` (user ID), `performed_at` (timestamp), and `ip_address`.

6. **Tenant Isolation**: Every database table includes `tenant_id`. No data from one tenant is ever accessible by another. This must be enforced at the query level, not just the UI level.

---

## ROLES & PERMISSIONS

### Platform-Level Role
| Role | Scope | Description |
|------|-------|-------------|
| `SAAS_ADMIN` | Platform | Full access to backoffice. Manages tenants, plans, global configs. Cannot access tenant data. |

### Organization-Level Roles (per tenant)
| Role | Description |
|------|-------------|
| `ORG_ADMIN` | Full access to all organization features. Manages users, settings, modules, and subscription. |
| `MANAGER` | Access to reports, schedules, patient records, and operational settings. Cannot manage billing or subscription. |
| `HEALTH_PROFESSIONAL` | Sees only their own schedule and the records of patients assigned to them. Can register clinical notes, attendance, and absences. |
| `RECEPTIONIST` | Manages scheduling, patient registration, attendance confirmation. Cannot access financial data or clinical notes. |
| `FINANCIAL` | Access to financial module, reports, and billing. Cannot access clinical records. |
| `PATIENT` | Can view own appointments, confirm attendance, request appointments, download own documents (attendance certificate, care request). |

All roles except `SAAS_ADMIN` and `PATIENT` can be created and invited by an `ORG_ADMIN` via email. `PATIENT` users are created from patient records by an admin or receptionist.

---

## AUTHENTICATION

### `/sign-in` — Login Page
- ClinixFlow logo centered at top
- Email + password fields
- "Sign In" button
- "Forgot my password" link
- Link to `/sign-up`
- Tenant identification via subdomain (`clinicname.clinixflow.com`) or slug in URL

### `/sign-up` — New Organization Registration
- Organization name
- Clinic slug/URL (real-time availability check with inline feedback)
- Responsible person's full name
- Email + password + password confirmation
- Plan selection (display plan cards with features and pricing — fetched from API)
- Terms of use acceptance checkbox
- On submit: create tenant + admin user + redirect to onboarding

### Onboarding Wizard (post sign-up, 4 steps)
**Step 1 — Clinic Details**: CNPJ, address, phone, website, logo upload  
**Step 2 — First Professional**: Name, specialty, registration number (CRM/CRP/etc.)  
**Step 3 — Specialties & Conventions**: Add at least one specialty; optionally add health insurance conventions  
**Step 4 — Activate Modules**: Show available modules per plan with toggle switches. Base module is always on.

### `/forgot-password` and `/reset-password`
Standard secure password reset flow via email token.

---

## BASE MODULE — CLINIC CORE

> Always active. Cannot be disabled. This is the system's foundation.

---

### Dashboard

- Month/year filter (defaults to current month)
- KPI Cards:
  - Active Patients (total)
  - Appointments This Month (total scheduled)
  - Appointments Completed (attended)
  - Appointments Missed (no-show + justified absence)
  - Attendance Rate (%)
- Bar chart: appointments per week of the selected month
- Today's appointments (condensed list, next 8 shown)
- Inconsistencies panel (count by type, link to full Inconsistencies page)

---

### Professional Registration

**Profile data:**
- Full name, CPF (Brazilian tax ID), professional registration number (CRM / CRP / CREFITO / COREN — field label adapts per specialty), email, phone, profile photo

**Availability configuration:**
- Day-of-week toggles (Mon–Sun)
- Start time / end time per active day
- Appointment interval: 15, 20, 30, 45, or 60 minutes
- Specific date blocks (vacations, holidays) — calendar picker with date range

**Specialties:**
- Link to one or more specialties registered in the organization
- Default appointment fee per specialty (can be overridden per convention or patient)

---

### Patient Registration

**Patient data:**
- Full name, date of birth, CPF (optional), gender, phone, email, address (full)
- Profile photo (optional)

**Legal guardian (Responsible person):**
- Required if patient is under 18 years old
- Fields: full name, CPF, relationship to patient (parent, guardian, spouse, other), phone, email

**Health insurance:**
- Select convention from organization list (or "Private / No insurance")
- Insurance card number
- Card expiration date (with alert if expired or expiring within 30 days)

**Medical Record:**
- Automatically created upon patient registration
- Record number is a **sequential number per tenant** (e.g. `#0042`) — NOT the database ID
- This number is immutable and permanent

**Care Type — Treatment Classification:**
Each patient must have a care type classification:

- **Single Session (Avulso)**: One-time appointments. No contract required.
- **Ongoing Treatment (Tratamento Prolongado)**: Recurring treatment with defined frequency and goals.

When the care type is **Ongoing Treatment**, the system must generate a **Treatment Contract** (see Treatment Contract section below).

---

### Treatment Contract

Triggered when a patient's care type is set to "Ongoing Treatment".

**Contract contains:**
- Organization name, address, CNPJ, responsible professional
- Patient full name, date of birth, CPF, medical record number
- Legal guardian name and CPF (if applicable)
- Treatment description (free text by professional)
- Defined goals (structured or free text)
- Estimated session frequency (e.g. 2x per week)
- Estimated treatment duration (e.g. 6 months)
- Fee per session and payment terms
- Start date
- Cancellation and rescheduling policy (configurable template per organization)

**Signature section:**
- Space for patient or guardian digital acceptance
- "I accept the terms of this treatment contract" checkbox
- Full name field + date
- Optional: drawn signature field (canvas-based signature pad)
- Once accepted, the contract is locked and stored as a PDF in the patient's documents

**Contract management:**
- View current contract in patient record
- Renew contract (creates a new version, previous version archived)
- Print / download as PDF

---

### Medical Record (Prontuário)

Accessed from the patient list or search. Header shows: patient name, photo thumbnail, record number, age, convention, care type, and active treatment badge.

**Tab 1 — Information**
- Complete patient and guardian data (editable by Admin/Receptionist)
- Convention and card details
- Care type and treatment contract link (if ongoing treatment)
- General observations (free text)
- Allergy alerts (highlighted in red if present)

**Tab 2 — Schedule**
- Full appointment history for this patient
- Filter by: period, professional, specialty, status
- Each appointment row: code, date, time, professional, specialty, status badge
- Quick action: view details, reschedule, mark attendance

**Tab 3 — Clinical Record (Timeline)**
Chronological timeline of all clinical events. Each event shows date, time, professional name, and type icon.

Event types:
- 📋 **Evaluation** — links to evaluation record (Evaluations module)
- 📝 **Clinical Note / Evolution** — professional's technical note (free rich text, immutable after saving)
- ✅ **Attended** — patient was present
- ❌ **Absence** — patient did not attend
- ⚠️ **Justified Absence** — absent with justification text
- 📄 **Document** — document uploaded or generated

**Tab 4 — Documents**
- List of all patient documents (name, type, date, uploaded by)
- Upload button: drag-and-drop or file picker (PDF, JPG, PNG)
- Document categories: Medical Request, Lab Result, Insurance Authorization, Treatment Contract, Attendance Certificate, Other
- Generated documents (from system templates) also appear here
- Preview and download buttons per document

---

### Appointments

#### View Modes

The appointments section has **three view modes**, switchable via tabs or toggle:

---

**View 1 — Daily View (Google Calendar Style)**

- Full-day view with time slots on the Y-axis (e.g. 07:00–20:00 in 30-min intervals)
- **Columns = Professionals** (one column per professional who has availability on that day)
- Appointment blocks show: patient name, specialty, duration, status color
- Navigate by day (prev/next arrows, date picker)
- Clicking an empty slot opens "New Appointment" modal pre-filled with professional + time
- Clicking an existing appointment opens the appointment detail panel
- Color coding by status: Scheduled (blue), Confirmed (teal), Attended (green), Absent (red), Cancelled (gray)

---

**View 2 — Weekly View (Google Calendar Style)**

- 7-day grid (Mon–Sun) with time slots on Y-axis
- **Columns = Days of the week** (standard), with professional differentiated by appointment block color or badge
- Toggle option: "Group by Professional" → columns become professionals, rows become days (kanban-like weekly per professional)
- Only shows days that have at least one appointment (can toggle to show full week)
- Navigate by week

---

**View 3 — List View**

Grouped hierarchy:

```
📅 Monday, March 10, 2025
  👤 Dr. Ana Lima — Physiotherapy
    ⏰ 08:00 — João Silva (AGD-2025-00031)
    ⏰ 09:00 — Maria Souza (AGD-2025-00032)
  👤 Dr. Carlos Mendes — Speech Therapy
    ⏰ 10:00 — Pedro Alves (AGD-2025-00033)

📅 Tuesday, March 11, 2025
  ...
```

- Filters: date range, professional, specialty, status
- Each row: appointment code, time, patient name, status badge, quick actions (confirm, mark attended, reschedule)

---

#### Creating an Appointment

Modal or side panel with:
- Patient search (autocomplete by name or record number)
- Professional (dropdown — filtered by specialty)
- Specialty (auto-filled if professional has only one)
- Date picker
- Time picker (shows only available slots based on professional's schedule — no conflicts)
- Duration (auto-filled from professional's interval setting, editable)
- Notes (optional)
- **Real-time conflict validation**: if selected professional + date + time is already booked, show inline error immediately

**Recurrent Appointment:**
- Toggle: "Make this a recurring appointment"
- When enabled:
  - Select days of week (e.g. Mon + Wed)
  - Select end date
  - Preview: show list of all generated appointments before confirming
  - System validates each generated slot for conflicts and warns on any conflict found
  - Conflicting slots can be skipped or rescheduled individually before saving

#### Appointment Status Flow
```
SCHEDULED → CONFIRMED → ATTENDED
                      → ABSENCE
                      → JUSTIFIED_ABSENCE
SCHEDULED → CANCELLED
SCHEDULED → RESCHEDULED (creates new appointment, links to original)
```

#### Actions on an Appointment
- **Confirm**: patient confirmation (can also be done by patient via their portal)
- **Mark Attended**: triggers clinical note prompt ("Do you want to add a clinical note now?")
- **Mark Absence / Justified Absence**: if justified, requires text justification
- **Reschedule**: opens date/time picker, original appointment is archived as RESCHEDULED, new one created
- **Cancel**: requires cancellation reason (free text)

---

### Inconsistencies Panel

Full-page panel accessible from dashboard shortcut or main nav.

| Priority | Inconsistency | Description |
|----------|---------------|-------------|
| 🔴 High | Past appointment without action | Appointment date passed, no attended/absence recorded |
| 🔴 High | Appointment without fee defined | (Admin/Manager only) Appointment has no value configured |
| 🟡 Medium | Attended without clinical note | Professional marked attended but wrote no evolution note |
| 🟡 Medium | Expired insurance card | Patient's insurance card is expired |
| 🔵 Info | First appointment without anamnesis | New patient with 1st session but no anamnesis evaluation recorded |
| 🔵 Info | Professional without availability set | Professional account exists but no schedule configured |
| 🔵 Info | Insurance card expiring soon | Card expires within 30 days |

Each row shows: patient name (linked), professional name, appointment code (linked), date, and a **Quick Action button** that takes the user directly to the resolution screen.

Filters: by type, by professional, by period. Export to CSV.

---

### Documents Sub-module

Accessible from patient record and as a standalone menu item.

**Receiving documents:**
- Upload document for a patient
- Category selection (Medical Request, Lab Result, Insurance Authorization, Other)
- Auto-link to patient record and timeline

**Generating documents:**

*Attendance Certificate:*
- Patient name, record number, clinic name
- Date(s) of attendance and duration per session
- Professional name and registration number
- Clinic stamp area
- Generated as PDF, stored in patient documents

*Insurance Care Request (Solicitação de Atendimento):*
- Patient data + insurance card number
- CID-10 code (searchable field)
- Specialty and number of requested sessions
- Professional justification (free text)
- Professional signature block
- Generated as PDF

**Document Templates:**
- Admin can edit the base templates (HTML editor with variable placeholders: `{{patient_name}}`, `{{date}}`, `{{professional}}`, `{{clinic_name}}`, `{{record_number}}`, etc.)

---

### Organization Settings

Sidebar navigation within settings:

**Clinic Profile**
- Name, CNPJ, address, phone, email, website, logo upload
- Business hours (per day of week, open/closed toggle + hours)
- Holiday and agenda block management (date range picker)

**Reference Tables**
- Health Insurance Conventions: name, CNPJ, contact, default fee table (per specialty)
- Specialties: name, category (health, aesthetic, veterinary, occupational), default appointment duration
- Appointment Types: in-person, online, home visit
- Rooms / Offices: name, capacity, available equipment notes

**Document Templates**
- List of system templates (Attendance Certificate, Care Request)
- Edit button opens rich text editor with variable support
- Preview rendered PDF

**Notifications & Integrations**
- WhatsApp (Evolution API): phone number, API token, connection status, test button
- Email SMTP config (or use platform default)
- Notification triggers config: appointment reminder (24h before), confirmation request, missed appointment alert

**Subscription & Modules**
- Current plan name, billing cycle, renewal date
- Module list: for each module, show (Active / Inactive / Upgrade Required) based on plan
- Inactive modules allowed by plan: toggle to activate
- Modules not in plan: show "Upgrade Plan" CTA
- Link to billing portal (external, managed by backoffice)

**User Management**
- User list: name, email, role, status (Active/Inactive), last login
- "Invite User" button: enter email + select role → sends invite email
- Edit role / deactivate user
- Patient users: created from patient records, not from this screen (but listed here)

---

## APPOINTMENTS — PATIENT PORTAL ACCESS

When a user logs in with the `PATIENT` role:

**My Appointments page:**
- List of upcoming and past appointments
- Status badge per appointment
- "Confirm my attendance" button (visible 48h before appointment, changes status to CONFIRMED)
- "Request Rescheduling" button (sends notification to receptionist)

**Request New Appointment:**
- Form: preferred specialty, preferred professional (optional), preferred dates/times (3 options)
- Submitted as a request — receptionist completes the scheduling

**My Documents:**
- Download Attendance Certificate (for attended sessions)
- Download Insurance Care Request (if generated by clinic)
- Cannot upload documents (upload is done by clinic staff)

---

## EVALUATIONS MODULE

> Optional. Activatable per tenant if plan allows.

**Setup (by Admin):**
- Each specialty can have one or more evaluation types assigned
- Built-in evaluation types to include by default (configurable at specialty level):
  - TGMD-2 (motor development)
  - Portage (developmental screening)
  - Sensory Profile
  - Anamnesis (base form, required for first appointment)
  - Custom (admin creates custom form with field builder)

**Creating an Evaluation:**
- Linked to: patient + professional + date (optionally linked to a specific appointment)
- Select evaluation type
- Fill structured form (fields vary by evaluation type)
- System calculates score/result automatically where applicable
- "Save Draft" keeps it editable
- "Finalize Evaluation" locks the record permanently (confirmation dialog: "This action cannot be undone")

**After finalization:**
- Evaluation appears in patient's clinical timeline
- PDF export available
- Result is permanently immutable — no edit, no delete

---

## FINANCIAL MODULE (Basic)

> Optional. Activatable per tenant if plan allows.

**Fee Configuration:**
- Default fee per specialty
- Override per convention (convention table)
- Override per professional per specialty (professional-specific pricing)
- Priority: Professional-specific > Convention > Specialty default

**Transactions:**
- **Automatic income entry**: created when an appointment is marked as ATTENDED, using configured fee
- **Manual income entry**: other receipts (free text description, category, amount, date)
- **Expense entry**: clinic expenses (categories: rent, materials, salaries, taxes, other), amount, date, notes
- All entries linked to cost center

**Cash Book / Cost Center:**
- Period filter (date range)
- Filter by type (income/expense), category, professional, convention
- Running balance
- Exportable to CSV

**Closing Reports:**
- **By Convention**: sessions count, gross amount, discounts, net receivable
- **By Patient**: session list, amounts, payment status
- **By Professional**: sessions performed, commission/share calculated
- **General**: full period consolidation

**Overdue / Unpaid:**
- List of attended appointments with no payment registered
- Days since appointment, patient name, fee, quick "Mark Paid" action

**Receipts:**
- Generate receipt per appointment or per period (date range)
- Template uses clinic letterhead (same template engine as documents)
- Stored in patient documents automatically

---

## REPORTS MODULE

> Optional. Activatable per tenant if plan allows.

All reports support: date range filter, export to CSV and PDF.

**Operational Reports:**
- Appointments by period (filters: professional, specialty, convention, status)
- Attendance rate by professional
- Attendance rate by specialty
- Attendance rate by convention

**Financial Reports:**
- Revenue by convention: scheduled value vs realized vs received vs difference
- Revenue by professional
- Revenue by specialty
- Simplified P&L (income vs expenses by period)

**Convention Billing Report:**
- Full list of attended sessions for insurance reimbursement claim
- Includes: patient name, insurance card, CID, professional, session date, value

**Patient Reports:**
- Active patients count
- New patients by period
- Inactive patients (no appointments in X days — configurable threshold)
- Attendance frequency per patient

**Professional Reports:**
- Scheduled vs completed sessions
- Productivity per professional per period

**Patient Devolutiva (Progress Summary):**
- Select: patient + period
- System compiles: appointments (scheduled vs attended), professional evolution notes (timeline), evaluation summaries
- Generates a structured PDF document suitable to share with patient or family
- Clinic letterhead, professional signature block

---

## VACCINES MODULE

> Optional. Activatable per tenant if plan allows. Allows ClinixFlow to serve vaccination clinics.

**Vaccine Registry:**
- Name, manufacturer, description
- Indications (free text)
- Contraindications (free text, shown as alert during application)
- Number of required doses and labels (D1, D2, D3, Booster, Annual)
- Minimum interval between doses (in days) — enforced during scheduling

**Stock Management:**
- Receive stock (batch entry):
  - Vaccine, lot number, manufacturer, quantity received, manufacturing date, expiration date, storage temperature range (min/max °C)
- Current stock view: vaccine name, lot, quantity remaining, expiration date, status (OK / Expiring Soon / Expired)
- Alerts:
  - 🟡 Lot expiring within 30 days
  - 🔴 Lot expired
  - 🔴 Stock below minimum threshold (configurable per vaccine)
- Temperature log: manual daily record (date, measured temp, responsible user) with alert if out of range
- Stock is automatically decremented when a vaccine application is registered

**Vaccine Application:**
- Linked to: patient + professional (applicator)
- Select: vaccine → available lot (only non-expired, in-stock lots shown) → dose (D1, D2...)
- System enforces minimum interval: if previous dose was too recent, shows warning with minimum allowed date
- Record: application date/time, injection site (left arm, right arm, thigh, etc.), lot number, applicator professional
- Post-application observations (reactions, notes)
- Application saved = stock automatically decremented by 1

**Patient Vaccination Card (Calendário Vacinal):**
- Per patient: visual card showing all vaccines
- Each vaccine row shows: doses received (with date, lot), doses pending (with recommended date)
- Next dose due dates with status: Pending / Scheduled / Overdue
- Print / export vaccination card as PDF

**Vaccination Reports:**
- Vaccine coverage by vaccine type and period
- Applications per professional per period
- Stock status report (current levels, expiring soon)
- Traceability by lot number (which patients received which lot)

---

## UI/UX REQUIREMENTS

**Layout:**
- Persistent left sidebar navigation
- Sidebar shows only active modules for the tenant
- Inactive modules show with a lock icon and "Upgrade" tooltip
- Top bar: organization name, current user avatar, notifications bell, settings shortcut

**Design System:**
- Use shadcn/ui components as base
- Extend with custom tokens: `--color-primary: #0F766E`, `--color-primary-dark: #0D5C56`
- Status badges must be consistent across entire app: use the same badge component with color variants
- Typography: DM Sans for headings, Inter for body text

**Empty States:**
- Every list/table must have a designed empty state with icon, message, and primary CTA
- Example: "No appointments today. [+ Schedule Appointment]"

**Loading States:**
- Skeleton loaders for all data-fetching components (not spinners)

**Confirmations:**
- Destructive actions (finalize evaluation, cancel appointment, delete record) must use a confirmation dialog
- Dialog must describe the consequence clearly: "This action is irreversible."

**Notifications:**
- Toast notifications (top-right) for: success, error, warning
- In-app notification center (bell icon) for: new appointment request from patient, inconsistency alert, document uploaded

**Forms:**
- Inline validation (on blur)
- Required fields marked with asterisk
- Submission disabled until required fields are valid

**Responsiveness:**
- Desktop first (1280px+)
- Tablet usable (768px–1279px) — sidebar collapses to icons
- Mobile not a priority for this phase

---

## DATABASE SCHEMA NOTES (for Lovable context)

Key tables and their critical fields:

- `tenants`: id, slug, name, plan_id, active_modules (array), created_at
- `users`: id, tenant_id, email, role, status, created_at
- `patients`: id, tenant_id, record_number (sequential, not PK), name, dob, care_type (SINGLE | ONGOING), created_at
- `professionals`: id, tenant_id, user_id, name, registration_number, created_at
- `appointments`: id, tenant_id, code (AGD-YYYY-NNNNN), patient_id, professional_id, specialty_id, scheduled_at, duration_min, status, created_by, created_at
- `appointment_recurrence`: id, appointment_id (origin), pattern (days of week), end_date
- `medical_records`: id, tenant_id, patient_id, record_number (human-readable sequential)
- `clinical_events`: id, tenant_id, patient_id, event_type (EVALUATION|NOTE|ATTENDED|ABSENCE|JUSTIFIED_ABSENCE|DOCUMENT), content, performed_by, performed_at, immutable (bool)
- `treatment_contracts`: id, tenant_id, patient_id, professional_id, content_html, signed_at, signed_by_name, signature_data, locked (bool)
- `evaluations`: id, tenant_id, patient_id, professional_id, type, form_data (JSON), result (JSON), finalized_at, finalized_by, locked (bool)
- `documents`: id, tenant_id, patient_id, category, file_url, generated (bool), created_by, created_at
- `vaccines`: id, tenant_id, name, manufacturer, doses_required, min_interval_days
- `vaccine_batches`: id, tenant_id, vaccine_id, lot_number, quantity, quantity_remaining, expiration_date, min_temp, max_temp
- `vaccine_applications`: id, tenant_id, patient_id, professional_id, vaccine_id, batch_id, dose_label, applied_at, site, observations
- `transactions`: id, tenant_id, type (INCOME|EXPENSE), amount, category, appointment_id (nullable), patient_id (nullable), professional_id (nullable), description, date, created_by

---

## WHAT IS OUT OF SCOPE FOR THIS BUILD

The following will be built in a subsequent phase — do NOT include now:

- Petshop module
- Occupational Medicine module
- Laboratory module
- Backoffice (SaaS Admin panel for tenant and plan management)
- WhatsApp notification automation (config UI only, no actual sending)
- Native mobile app



# ClinixFlow v2 — Lovable Build Prompt > Multi-Tenant SaaS | Modular Architecture | Up to Vaccines Module --- ## PROJECT OVERVIEW Build **ClinixFlow**, a multi-tenant SaaS platform for health clinic management. The system must be **fully modular** — each organization activates only the modules in



Análise Completa - ClinixFlow
1. Gestão de Clínica
O que faz hoje:

Formulário de criação única (nome, CNPJ, endereço, telefone, email)
Gera código único da clínica automaticamente
Problemas encontrados:

Sem tela de edição (dados imutáveis após criação)
CNPJ validado apenas no formato, não no dígito verificador
Sem prevenção de duplicatas por CNPJ/email
Sem campos de horário de funcionamento, logo, informações legais
Melhorias sugeridas:

Adicionar página de edição da clínica
Validação real de CNPJ (checksum)
Campos extras: logo, horário de funcionamento, redes sociais
Constraint de unicidade por CNPJ no banco
2. Configurações (Settings)
O que faz hoje:

Apenas 1 aba: motivos de inativação de paciente
5 motivos padrão (mudança, insatisfação, convênio, óbito, outros)
CRUD apenas em memória (sem persistência no banco)
Problemas encontrados:

Nenhum dado é salvo no banco (operações 100% em memória)
Server actions com TODOs indicando que falta implementar
Escopo muito limitado para uma página de "configurações"
Melhorias sugeridas:

Implementar as server actions para persistir motivos de inativação
Adicionar abas: configurações gerais da clínica, convênios/preços, gestão de usuários, preferências de agendamento, integrações
3. Gestão de Profissionais (Doctors)
O que faz hoje:

CRUD completo com wizard de 6 etapas
Cadastro PF/PJ, documentos, múltiplas especialidades
Disponibilidade por dia da semana com horários
Compensação: percentual, fixo, ou ambos
Criação de conta de acesso (email ou código)
Conversão de timezone para UTC
Problemas encontrados:

Upload de avatar desabilitado ("feature disabled")
Sem busca/filtro na lista de profissionais
Sem paginação
CPF/CNPJ sem validação de dígitos verificadores
Sem controle de exceções de agenda (férias, feriados)
Mesmo profissional pode ser cadastrado 2x com emails diferentes
Sem soft delete (deleção é permanente)
Melhorias sugeridas:

Habilitar upload de avatar (Cloudinary já configurado)
Adicionar busca e filtro por nome/especialidade
Paginação na lista
Validação real de CPF/CNPJ
Gestão de exceções de agenda (férias, feriados, bloqueios)
Soft delete com motivo de desligamento
Importação/exportação em lote
4. Gestão de Pacientes
O que faz hoje:

CRUD completo com formulário em abas
Cadastro completo: dados pessoais, endereço, documentos, contatos
Acompanhante obrigatório para menores de 18 anos
Convênio e carteirinha
Criação de conta de acesso opcional
Número de prontuário sequencial automático
Problemas encontrados:

Sem verificação de CPF duplicado no formulário
Flag isActive existe no banco mas sem UI de inativação
Convênio usa enum antigo + tabela nova (inconsistência na migração)
Sem validação de formato de telefone
Sem busca avançada por convênio, tratamento, etc.
Melhorias sugeridas:

Implementar workflow de inativação/reativação com motivos (conectar com Settings)
Validação de unicidade de CPF
Finalizar migração do enum de convênio para a tabela insurancesTable
Busca/filtro avançado na lista
Histórico de alterações do cadastro
5. Agendamentos (Appointments)
O que faz hoje:

CRUD completo com múltiplas visualizações (tabela, calendário diário/semanal, cards)
Agendamento recorrente (dias da semana + data fim)
Reagendamento com rastreamento do original
Controle de presença: compareceu, faltou, falta justificada
Bloqueio de exclusão se tem prontuário vinculado
Exclusão em lote de agendamentos futuros
Flags: reposição, atendimento/avaliação, número de guia
Problemas encontrados:

Sem notificação por SMS/email na criação ou lembrete
Sem workflow de confirmação (flag confirmed manual, sem envio ao paciente)
Preço armazenado mas sem integração com faturamento
Sem lógica de overbooking/conflito
Agendamento recorrente não trata feriados
Sem buffer entre consultas
Melhorias sugeridas:

Sistema de notificações (WhatsApp/SMS/email) para lembretes e confirmações
Validação de conflito de horários (overbooking prevention)
Buffer configurável entre consultas (ex: 10min entre cada)
Integração com o módulo financeiro (gerar receita ao marcar presença)
Tratamento de feriados no agendamento recorrente
Workflow de confirmação pelo paciente (link de confirmação)
6. Prontuários (Patient Records)
O que faz hoje:

Criação/edição de evolução vinculada ao agendamento
Primeira consulta exige conteúdo de avaliação obrigatório
Mascaramento LGPD: profissional só vê suas próprias evoluções
Owner da clínica vê tudo sem máscara
Bloqueio de edição (campo canEdit com autorização da gestão)
Visualização separada para profissional e paciente
Problemas encontrados:

Workflow de autorização de edição existe no schema mas não tem UI
Sem versionamento de edições (sem histórico de alterações)
Sem anexos (imagens, documentos, exames)
Sem templates para notas clínicas
Sem assinatura digital
Sem exportação PDF do prontuário
Sem prevenção de edição concorrente
Melhorias sugeridas:

Implementar UI para o workflow de autorização de edição
Versionamento: histórico de todas as alterações com diff
Suporte a anexos (fotos, documentos, exames)
Templates de evolução por especialidade
Exportação PDF do prontuário completo
Assinatura digital do profissional
Editor rich text (como o das prescrições)
7. Prescrições
O que faz hoje:

Criação com editor rich text (TipTap: bold, italic, listas, alinhamento)
Geração de PDF com Puppeteer
Listagem em tabela com dados do paciente/profissional
Problemas encontrados:

Sem edição ou exclusão de prescrições existentes
Sem visualização do conteúdo na tabela (só metadados)
Sem botão de download do PDF na UI
Melhorias sugeridas:

Adicionar edição e exclusão
Visualização do conteúdo diretamente na tabela/modal
Botão de download/impressão do PDF
Templates de prescrição por tipo
Histórico de prescrições por paciente
8. Guias de Autorização
O que faz hoje:

UI completa: formulário de criação, tabela com busca, cards de resumo, badges de status
Schema no banco completo (guias + sessões)
Filtro por número, paciente, convênio
Problemas encontrados:

ZERO backend implementado - nenhuma server action existe
Recebe array vazio guides=[], sempre mostra estado vazio
Tela bonita mas 100% não funcional
Melhorias sugeridas:

Implementar CRUD completo (server actions)
Vincular sessões da guia com agendamentos automaticamente
Alertas de guia prestes a expirar
Controle automático de sessões completadas ao marcar presença
Dashboard de utilização de guias por convênio
9. Financeiro (Finance)
O que faz hoje:

Dashboard com 4 cards de resumo e 2 gráficos
Seletor de mês
Problemas encontrados:

Dados 100% hardcoded/mock (R$ 158.500, R$ 42.300, etc.)
TODOs no código indicando que precisa buscar do banco
Sem integração com agendamentos, preços, compensações
Sem livro caixa, sem fechamento mensal funcional
Melhorias sugeridas:

Integrar com dados reais: receita = soma dos atendimentos realizados
Calcular repasse dos profissionais automaticamente
Livro caixa com lançamentos de receita/despesa
Fechamento mensal funcional
DRE simplificado (receita - despesas - repasses = lucro)
Exportação para Excel/PDF
10. Relatórios (Reports)
O que faz hoje:

Hub com 4 categorias (financeiro, agendamentos, performance, pacientes)
Gráficos de agendamentos e financeiro com dados mock
Performance e pacientes: páginas não implementadas
Problemas encontrados:

Todos os dados são mock/hardcoded
Nenhum relatório conectado ao banco de dados
Páginas de performance e pacientes nem existem
Melhorias sugeridas:

Conectar todos os relatórios ao banco real
Relatório de agendamentos: taxa de comparecimento, faltas por profissional/paciente
Relatório financeiro: receita por convênio, por profissional, por período
Relatório de pacientes: ativos/inativos, novos por mês, por convênio
Relatório de performance: produtividade por profissional
Filtros de período e exportação PDF/Excel
11. Portal do Paciente
O que faz hoje:

Dashboard: agendamentos de hoje, próximos 7 dias, mensal
Consultas: lista completa com status colorido
Status dinâmico: agendado, atendido, sem evolução, faltou, falta justificada
Problemas encontrados:

Avaliações: "Em Desenvolvimento" (stub)
Solicitações: "Em Desenvolvimento" (stub)
Relatórios: "Em Desenvolvimento" (stub)
Paciente não consegue agendar consulta pelo portal
Melhorias sugeridas:

Implementar avaliação de atendimento (rating + comentário)
Implementar solicitações (pedidos de exames, declarações)
Exibir documentos/relatórios do paciente
Permitir solicitação de agendamento pelo portal
Notificações de lembretes de consulta
12. Portal do Profissional
O que faz hoje:

Dashboard com total de pacientes e consultas do dia
Lista de agendamentos (hoje + próximos)
Prontuários com mascaramento LGPD
CRUD de evoluções por paciente
Status: COMPLETO - Módulo mais maduro do sistema.

Melhorias sugeridas:

Agenda visual (calendário)
Relatório de produtividade pessoal
Visualização de compensação/repasse mensal
13. Dashboard Principal (Owner/Admin)
O que faz hoje:

Cards: agendamentos hoje, confirmados, pendentes
Estatísticas: receita agendada/atendida, total consultas, faltas, pacientes
Gráficos: agendamentos diários, ranking de profissionais, por convênio
Filtro por período (mês)
Dados reais do banco
Status: QUASE COMPLETO

Melhorias sugeridas:

Alertas de guias prestes a expirar
Indicador de inconsistências pendentes
Comparativo com período anterior
14. Assinaturas e Licenciamento
O que faz hoje:

3 planos: Essential (R$89,90), Professional (R$129,90), Super (R$189,90)
Períodos: mensal, semestral (-10%), anual (-20%)
Trial de 1 dia ao solicitar assinatura
Licença única gerada (LIC-ANO-RANDOM)
Códigos de ativação via CLI
Stripe para planos premium
Cron de limpeza de planos expirados
Problemas encontrados:

Trial de apenas 1 dia é muito curto
Webhook do Stripe hardcoda plan = 'essential' ignorando o plano real
Sem emails de notificação (criação, expiração, pagamento)
Sem mecanismo de reembolso
Sem validação de valor do pagamento manual vs valor da assinatura
Melhorias sugeridas:

Corrigir webhook do Stripe para usar o plano correto
Trial de 7 dias
Emails transacionais (boas-vindas, expiração, pagamento confirmado)
Validação de valor no pagamento manual
Portal do cliente para gestão da assinatura
15. Painel Master
O que faz hoje:

Dashboard com métricas gerais (owners, clínicas, pacientes, profissionais, assinaturas)
Lista de owners com status (ativo, expirando, expirado)
Registro de pagamento manual
Aprovação de pagamento pendente
Detecção e resolução de inconsistências de pagamento
Status: COMPLETO

Melhorias sugeridas:

Exportação de relatórios de owners/pagamentos
Histórico completo de pagamentos por owner
Alertas automáticos para owners prestes a expirar
16. Auditoria
O que faz hoje:

Schema completo (ações: create, update, delete, view, login, logout, export, import)
Campos: IP, user agent, valores antigos/novos, descrição
Relations com user e clinic
Problemas encontrados:

Sem UI para visualização dos logs
Sem evidência de que as actions realmente gravam logs de auditoria
Melhorias sugeridas:

Implementar registro de auditoria em todas as server actions
Criar tela de visualização de logs com filtros
Exportação de logs
Resumo Visual de Maturidade
Módulo    Status    Prioridade
Portal Profissional    95%    Baixa
Dashboard Principal    90%    Baixa
Painel Master    90%    Baixa
Profissionais    85%    Média
Pacientes    80%    Média
Agendamentos    80%    Média
Assinaturas    75%    Alta
Prontuários    70%    Média
Prescrições    60%    Média
Portal do Paciente    40%    Alta
Guias de Autorização    20%    Crítica
Relatórios    10%    Alta
Financeiro    5%    Crítica
Configurações    5%    Alta
Auditoria    5%    Média
Top 3 prioridades críticas:

Financeiro - Core do negócio, 100% mock
Guias - UI pronta, zero backend
Relatórios - Essencial para gestão, 100% mock

Vou iniciar um novo chat para falarmos do clinix-flow ... 

eu estou rescrevendo ele com a lovable ( até por conta da necessidade de agora modularizar e trazer melhorias drasticas de layout ux ui e funcionalidades )

o ClinixFlow é um SAAS / ERP para gestão de clinicas/ consultorios / laboratorios, hospitais, medicina do trbalho, é uma suite completa para varios nichos da saude. 

--- nossa ultima conversa sobre o sistema :: ---- 
( colado no chat ) 
prompt ja executados... ( colado no chat )

com essas informações e seguindo o flow de melhoria e algumas novidades e particularidades

como saas ... ter cadastro de clinicas como Orgnizações Multi Tennant. 

então o usuário se cadastra no sistema. 
no cadastro ele cria uma accont ( organização multitennant )
extras .. 

a org já cria uma accont ( clinica ) ou pode cadastrar mais de uma filial, podemos abordar isso em fases futura! )

o owner que criou a conta, muitas vezes ele é um profissional da saúde ativo e realiza atendimentos... na tela de profissionais ter uma funcionalidade para criar um usuário automaticamente para esse usuário com a role de profissional da saude. 

o que eu quero. 

quero trazer tração e organizar as coisa na recriação com o lovable, pois no primeiro momento, não mapeamos todas as informações necessarias para alguns modelos e ficou bem podre. 

então quero que liste cada funcionalidade dada acima e gere os pontos que precisamos desenvolver e melhorar. 
o que sera cada funcionaldiade, o modelo de dados, e o que for necessario para termos o sistema funcional.

vamos lá?

Show more
Mar 10

Check available skills
Check available skills

Check available skills
Done
Boa, Hugo. Vamos organizar isso direito.

Você tem um sistema rico, com histórico de decisões técnicas, e agora está fazendo uma reescrita focada. A melhor abordagem aqui é gerar um documento de referência técnica completo que vai servir como base para os prompts do Lovable — com modelo de dados, regras de negócio, e o que precisa melhorar em cada módulo.

Deixa eu montar isso agora.


Viewed 2 files, created a file, ran a command
Viewed 2 files, created a file, ran a command
Sem internet aqui — vou gerar um HTML bem formatado para você usar como referência e depois exportar como PDF ou imprimir.


Created a file, read a file
Created a file, read a file
Documento completo. Aqui estão os highlights do que organizei e as decisões que tomei:

Sobre o modelo de dados, três decisões que merecem atenção especial para a v2:

O record_number do paciente aparece tanto em patients quanto em medical_records — desnormalizado intencionalmente para facilitar buscas sem join. O code do agendamento (AGD-YYYY-NNNNN) é gerado com sequence por tenant no banco, não na aplicação, para evitar race condition em ambientes multi-instância. O campo is_owner_user em professionals resolve aquele caso do dono da conta que também atende — um boolean simples que vincula o user_id do ORG_ADMIN ao registro de profissional, sem duplicar usuário.

Sobre os problemas críticos da v1, os três que eu marcaria como "não pode entrar em produção assim": Financeiro (100% mock), Guias (UI linda com zero backend) e o trial de 1 dia que precisa virar 7. O webhook do Stripe hardcodando plan = 'essential' é particularmente grave porque significa que qualquer um que pagou o plano Professional ou Super na v1 estava sendo tratado como Essential no banco.

Sugestão de abordagem no Lovable para o rebuild: começa pelo Auth + Multi-tenancy + Configurações da Org. Valida que o isolamento de tenant está funcionando antes de qualquer coisa. Depois Base Module (Profissionais + Pacientes + Prontuário). Só então Agendamentos + Financeiro juntos (porque precisam estar integrados desde o início). Os módulos opcionais entram em sprints separados.

Quer que eu já monte o primeiro prompt em inglês para o Lovable focado no Auth + Multi-tenancy + Base?

Clinixflow v2 reference
Document · MD 

# ClinixFlow — Prompt Completo para Lovable > Versão 2.0 | SaaS Multi-Tenant | Arquitetura Modular --- ## CONTEXTO GERAL Você está construindo o **ClinixFlow**, uma plataforma SaaS multi-tenant para gestão de clínicas de saúde. A plataforma deve ser **modular**, permitindo que cada organização at

pasted


# ClinixFlow v2 — Lovable Build Prompt > Multi-Tenant SaaS | Modular Architecture | Up to Vaccines Module --- ## PROJECT OVERVIEW Build **ClinixFlow**, a multi-tenant SaaS platform for health clinic management. The system must be **fully modular** — each organization activates only the modules in

pasted

eu nao lembro se mandei os dois prompts que vc me deu e se isso ajuda em algo, senão ajudar ignore... 

concordo com os pontos que vc mencioou acima, pode me dar o prompt em ingles? 

o reports, financials temos que implementar o básico, entrada, saida, fechamendo por convênio 
o fechamento por convênio só pode entrar após recebermos, então ele deve aparecer em provisoes ( ou planejamento futuro , nao sei que nome dar para o financeiro para isso )
Sim podemos colocar 10 dias para testar a aplicação e já deixar pronta a integração com a stripe ( estou aguardando liberar a conta )

acho que podemos implementar tbem, agendamento e confirmação por wpp e email 

para email eu criei uma conta na resend, como podemos configurar local e na lovable, vou trabalhar na lovable por enquanto para acelerar o desenvolvito dessa v2.. 

a tela de guias é conseguirmos mapear as guias dos convenios aos atendimentos realizados 
por exemplo cada guia tem uma numeração associar a guia ao atendimento realizado ou até mesmo ao agendamento pode ser algo novo e ajuda a melhorar a entregar depois pelo TISS ( ainda nao sei o padrão e como podemos integrar isso, se você souber como já me de um direcionamento de como podemos ter a base para ter essa integração pronta para usarmos, dentro do nosso contexto ).

no lovable, ja começamos, precisamos continuar e avnaçar com ugencia...

Show more
Mar 10
Ótimo, os dois prompts anteriores ajudam muito — confirmam o que já foi construído e o que não foi. Deixa eu responder os pontos antes do prompt:

Sobre o Financeiro: "Provisões" é o termo correto para o que você descreveu — valor esperado vs valor realizado. Na prática: Previsto (agendado), Realizado (compareceu), Recebido (pago). O fechamento por convênio fica na camada "Recebido", com uma visão de "A Receber" como intermediária.

Sobre TISS: é o padrão XML da ANS para troca de informações entre prestadores e operadoras de planos. Para ter a base pronta você precisa: (1) campo CID-10 no agendamento/atendimento, (2) campo código TUSS nos procedimentos/especialidades, (3) registro ANS da operadora no cadastro do convênio, (4) número da guia vinculado ao atendimento — exatamente o módulo de Guias que já mapeamos. Com isso o export TISS XML vira uma feature posterior sem refatoração.

Sobre Resend no Lovable: você configura como variável de ambiente RESEND_API_KEY no painel do Lovable (Settings → Environment Variables). Localmente vai no .env.local. A lib é resend (npm), e você chama resend.emails.send({...}) direto de um Server Action.

Sobre WhatsApp + Email: vou incluir no prompt com a Evolution API para WhatsApp e Resend para email, mas como "send triggers" — a config de credenciais fica nas settings da org.

Agora o prompt:


Viewed a file, created a file, read a file
Viewed a file, created a file, read a file
Prompt completo. Alguns destaques das decisões que tomei:

PROJECTED / REALIZED / RECEIVED — esse é o core do financeiro. Resolvi o problema do "fechamento por convênio só pode entrar após receber" com um campo financialStatus no Transaction com esses três estados. Assim a mesma tabela cobre as três visões sem duplicar dados. O "A Receber" fica automático: REALIZED - RECEIVED.

TISS base — coloquei os campos agora sem complexidade extra: ansCode no convênio, tussCode na especialidade, cid10Code e insuranceGuideId no agendamento. Com isso, quando você precisar gerar o XML TISS, todos os campos já estão no lugar — vai ser só montar o envelope XML em cima de dados que já existem.

Guias vinculadas a agendamentos — no modal de criar agendamento, quando o paciente tem convênio, o sistema busca as guias ativas para aquele convênio + especialidade e mostra para vinculação. Quando marcar "Compareceu", o usedSessions é decrementado automaticamente. Isso fecha o ciclo sem nenhuma etapa manual.

Resend — documentei as duas formas: RESEND_API_KEY como variável de ambiente da plataforma (no Lovable: Settings → Environment Variables), e opcionalmente cada tenant pode colocar a própria chave em OrganizationSettings.resendApiKey. Perfeito para o cenário atual.

Trial de 10 dias + Stripe ready — trial criado no sign-up, lógica de expiração no middleware, mas com STRIPE_ENABLED=false como flag de desenvolvimento para não bloquear o build enquanto aguarda a conta liberar.

Quer que eu monte agora um segundo prompt para a continuidade — focado nos módulos opcionais (Avaliações completas com os instrumentos específicos, Financeiro avançado, e Relatórios)?

Clinixflow v2 lovable prompt
Document · MD 





Claude is AI and can make mistakes. Please double-check responses.
Pasted content
26.77 KB •649 lines
•
Formatting may be inconsistent from source
# ClinixFlow v2 — Lovable Build Prompt
> Multi-Tenant SaaS | Modular Architecture | Up to Vaccines Module

---

## PROJECT OVERVIEW

Build **ClinixFlow**, a multi-tenant SaaS platform for health clinic management. The system must be **fully modular** — each organization activates only the modules included in their subscription plan. A separate backoffice application (managed by the SaaS Admin) controls tenants, plans, and global settings. That backoffice is **out of scope** for this build.

### Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js Server Actions + API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js v5
- **File Storage**: Supabase Storage or S3-compatible (for documents and signatures)
- **Design**: Clean, professional health-tech aesthetic. Primary palette: deep teal (`#0F766E`), white, dark slate. Use Inter or DM Sans. Avoid generic purple gradients.

---

## GLOBAL BUSINESS RULES

These rules apply across the entire system with no exceptions:

1. **Medical Record Numbers**: Sequential per tenant (`#0001`, `#0002`...). This number is NEVER the database ID — it is a human-readable identifier stored as a separate field with an auto-increment sequence per tenant.

2. **Appointment Codes**: Sequential with prefix, NEVER UUID. Format: `AGD-YYYY-NNNNN` (e.g. `AGD-2025-00042`). This is the code shown to users in all interfaces.

3. **Evaluation Results**: Immutable after finalization. Once a professional clicks "Finalize Evaluation", the record is locked — no edits allowed. This is a legal compliance requirement.

4. **Module Activation**: Every module (except the Base Clinic Module) must be individually activated per tenant. A tenant can only activate modules that their subscription plan allows. Plan permissions are configured by the SaaS Admin in the backoffice.

5. **Audit Trail**: Every critical action (finalize evaluation, register absence, financial entry, sign contract) must record `performed_by` (user ID), `performed_at` (timestamp), and `ip_address`.

6. **Tenant Isolation**: Every database table includes `tenant_id`. No data from one tenant is ever accessible by another. This must be enforced at the query level, not just the UI level.

---

## ROLES & PERMISSIONS

### Platform-Level Role
| Role | Scope | Description |
|------|-------|-------------|
| `SAAS_ADMIN` | Platform | Full access to backoffice. Manages tenants, plans, global configs. Cannot access tenant data. |

### Organization-Level Roles (per tenant)
| Role | Description |
|------|-------------|
| `ORG_ADMIN` | Full access to all organization features. Manages users, settings, modules, and subscription. |
| `MANAGER` | Access to reports, schedules, patient records, and operational settings. Cannot manage billing or subscription. |
| `HEALTH_PROFESSIONAL` | Sees only their own schedule and the records of patients assigned to them. Can register clinical notes, attendance, and absences. |
| `RECEPTIONIST` | Manages scheduling, patient registration, attendance confirmation. Cannot access financial data or clinical notes. |
| `FINANCIAL` | Access to financial module, reports, and billing. Cannot access clinical records. |
| `PATIENT` | Can view own appointments, confirm attendance, request appointments, download own documents (attendance certificate, care request). |

All roles except `SAAS_ADMIN` and `PATIENT` can be created and invited by an `ORG_ADMIN` via email. `PATIENT` users are created from patient records by an admin or receptionist.

---

## AUTHENTICATION

### `/sign-in` — Login Page
- ClinixFlow logo centered at top
- Email + password fields
- "Sign In" button
- "Forgot my password" link
- Link to `/sign-up`
- Tenant identification via subdomain (`clinicname.clinixflow.com`) or slug in URL

### `/sign-up` — New Organization Registration
- Organization name
- Clinic slug/URL (real-time availability check with inline feedback)
- Responsible person's full name
- Email + password + password confirmation
- Plan selection (display plan cards with features and pricing — fetched from API)
- Terms of use acceptance checkbox
- On submit: create tenant + admin user + redirect to onboarding

### Onboarding Wizard (post sign-up, 4 steps)
**Step 1 — Clinic Details**: CNPJ, address, phone, website, logo upload  
**Step 2 — First Professional**: Name, specialty, registration number (CRM/CRP/etc.)  
**Step 3 — Specialties & Conventions**: Add at least one specialty; optionally add health insurance conventions  
**Step 4 — Activate Modules**: Show available modules per plan with toggle switches. Base module is always on.

### `/forgot-password` and `/reset-password`
Standard secure password reset flow via email token.

---

## BASE MODULE — CLINIC CORE

> Always active. Cannot be disabled. This is the system's foundation.

---

### Dashboard

- Month/year filter (defaults to current month)
- KPI Cards:
  - Active Patients (total)
  - Appointments This Month (total scheduled)
  - Appointments Completed (attended)
  - Appointments Missed (no-show + justified absence)
  - Attendance Rate (%)
- Bar chart: appointments per week of the selected month
- Today's appointments (condensed list, next 8 shown)
- Inconsistencies panel (count by type, link to full Inconsistencies page)

---

### Professional Registration

**Profile data:**
- Full name, CPF (Brazilian tax ID), professional registration number (CRM / CRP / CREFITO / COREN — field label adapts per specialty), email, phone, profile photo

**Availability configuration:**
- Day-of-week toggles (Mon–Sun)
- Start time / end time per active day
- Appointment interval: 15, 20, 30, 45, or 60 minutes
- Specific date blocks (vacations, holidays) — calendar picker with date range

**Specialties:**
- Link to one or more specialties registered in the organization
- Default appointment fee per specialty (can be overridden per convention or patient)

---

### Patient Registration

**Patient data:**
- Full name, date of birth, CPF (optional), gender, phone, email, address (full)
- Profile photo (optional)

**Legal guardian (Responsible person):**
- Required if patient is under 18 years old
- Fields: full name, CPF, relationship to patient (parent, guardian, spouse, other), phone, email

**Health insurance:**
- Select convention from organization list (or "Private / No insurance")
- Insurance card number
- Card expiration date (with alert if expired or expiring within 30 days)

**Medical Record:**
- Automatically created upon patient registration
- Record number is a **sequential number per tenant** (e.g. `#0042`) — NOT the database ID
- This number is immutable and permanent

**Care Type — Treatment Classification:**
Each patient must have a care type classification:

- **Single Session (Avulso)**: One-time appointments. No contract required.
- **Ongoing Treatment (Tratamento Prolongado)**: Recurring treatment with defined frequency and goals.

When the care type is **Ongoing Treatment**, the system must generate a **Treatment Contract** (see Treatment Contract section below).

---

### Treatment Contract

Triggered when a patient's care type is set to "Ongoing Treatment".

**Contract contains:**
- Organization name, address, CNPJ, responsible professional
- Patient full name, date of birth, CPF, medical record number
- Legal guardian name and CPF (if applicable)
- Treatment description (free text by professional)
- Defined goals (structured or free text)
- Estimated session frequency (e.g. 2x per week)
- Estimated treatment duration (e.g. 6 months)
- Fee per session and payment terms
- Start date
- Cancellation and rescheduling policy (configurable template per organization)

**Signature section:**
- Space for patient or guardian digital acceptance
- "I accept the terms of this treatment contract" checkbox
- Full name field + date
- Optional: drawn signature field (canvas-based signature pad)
- Once accepted, the contract is locked and stored as a PDF in the patient's documents

**Contract management:**
- View current contract in patient record
- Renew contract (creates a new version, previous version archived)
- Print / download as PDF

---

### Medical Record (Prontuário)

Accessed from the patient list or search. Header shows: patient name, photo thumbnail, record number, age, convention, care type, and active treatment badge.

**Tab 1 — Information**
- Complete patient and guardian data (editable by Admin/Receptionist)
- Convention and card details
- Care type and treatment contract link (if ongoing treatment)
- General observations (free text)
- Allergy alerts (highlighted in red if present)

**Tab 2 — Schedule**
- Full appointment history for this patient
- Filter by: period, professional, specialty, status
- Each appointment row: code, date, time, professional, specialty, status badge
- Quick action: view details, reschedule, mark attendance

**Tab 3 — Clinical Record (Timeline)**
Chronological timeline of all clinical events. Each event shows date, time, professional name, and type icon.

Event types:
- 📋 **Evaluation** — links to evaluation record (Evaluations module)
- 📝 **Clinical Note / Evolution** — professional's technical note (free rich text, immutable after saving)
- ✅ **Attended** — patient was present
- ❌ **Absence** — patient did not attend
- ⚠️ **Justified Absence** — absent with justification text
- 📄 **Document** — document uploaded or generated

**Tab 4 — Documents**
- List of all patient documents (name, type, date, uploaded by)
- Upload button: drag-and-drop or file picker (PDF, JPG, PNG)
- Document categories: Medical Request, Lab Result, Insurance Authorization, Treatment Contract, Attendance Certificate, Other
- Generated documents (from system templates) also appear here
- Preview and download buttons per document

---

### Appointments

#### View Modes

The appointments section has **three view modes**, switchable via tabs or toggle:

---

**View 1 — Daily View (Google Calendar Style)**

- Full-day view with time slots on the Y-axis (e.g. 07:00–20:00 in 30-min intervals)
- **Columns = Professionals** (one column per professional who has availability on that day)
- Appointment blocks show: patient name, specialty, duration, status color
- Navigate by day (prev/next arrows, date picker)
- Clicking an empty slot opens "New Appointment" modal pre-filled with professional + time
- Clicking an existing appointment opens the appointment detail panel
- Color coding by status: Scheduled (blue), Confirmed (teal), Attended (green), Absent (red), Cancelled (gray)

---

**View 2 — Weekly View (Google Calendar Style)**

- 7-day grid (Mon–Sun) with time slots on Y-axis
- **Columns = Days of the week** (standard), with professional differentiated by appointment block color or badge
- Toggle option: "Group by Professional" → columns become professionals, rows become days (kanban-like weekly per professional)
- Only shows days that have at least one appointment (can toggle to show full week)
- Navigate by week

---

**View 3 — List View**

Grouped hierarchy:

```
📅 Monday, March 10, 2025
  👤 Dr. Ana Lima — Physiotherapy
    ⏰ 08:00 — João Silva (AGD-2025-00031)
    ⏰ 09:00 — Maria Souza (AGD-2025-00032)
  👤 Dr. Carlos Mendes — Speech Therapy
    ⏰ 10:00 — Pedro Alves (AGD-2025-00033)

📅 Tuesday, March 11, 2025
  ...
```

- Filters: date range, professional, specialty, status
- Each row: appointment code, time, patient name, status badge, quick actions (confirm, mark attended, reschedule)

---

#### Creating an Appointment

Modal or side panel with:
- Patient search (autocomplete by name or record number)
- Professional (dropdown — filtered by specialty)
- Specialty (auto-filled if professional has only one)
- Date picker
- Time picker (shows only available slots based on professional's schedule — no conflicts)
- Duration (auto-filled from professional's interval setting, editable)
- Notes (optional)
- **Real-time conflict validation**: if selected professional + date + time is already booked, show inline error immediately

**Recurrent Appointment:**
- Toggle: "Make this a recurring appointment"
- When enabled:
  - Select days of week (e.g. Mon + Wed)
  - Select end date
  - Preview: show list of all generated appointments before confirming
  - System validates each generated slot for conflicts and warns on any conflict found
  - Conflicting slots can be skipped or rescheduled individually before saving

#### Appointment Status Flow
```
SCHEDULED → CONFIRMED → ATTENDED
                      → ABSENCE
                      → JUSTIFIED_ABSENCE
SCHEDULED → CANCELLED
SCHEDULED → RESCHEDULED (creates new appointment, links to original)
```

#### Actions on an Appointment
- **Confirm**: patient confirmation (can also be done by patient via their portal)
- **Mark Attended**: triggers clinical note prompt ("Do you want to add a clinical note now?")
- **Mark Absence / Justified Absence**: if justified, requires text justification
- **Reschedule**: opens date/time picker, original appointment is archived as RESCHEDULED, new one created
- **Cancel**: requires cancellation reason (free text)

---

### Inconsistencies Panel

Full-page panel accessible from dashboard shortcut or main nav.

| Priority | Inconsistency | Description |
|----------|---------------|-------------|
| 🔴 High | Past appointment without action | Appointment date passed, no attended/absence recorded |
| 🔴 High | Appointment without fee defined | (Admin/Manager only) Appointment has no value configured |
| 🟡 Medium | Attended without clinical note | Professional marked attended but wrote no evolution note |
| 🟡 Medium | Expired insurance card | Patient's insurance card is expired |
| 🔵 Info | First appointment without anamnesis | New patient with 1st session but no anamnesis evaluation recorded |
| 🔵 Info | Professional without availability set | Professional account exists but no schedule configured |
| 🔵 Info | Insurance card expiring soon | Card expires within 30 days |

Each row shows: patient name (linked), professional name, appointment code (linked), date, and a **Quick Action button** that takes the user directly to the resolution screen.

Filters: by type, by professional, by period. Export to CSV.

---

### Documents Sub-module

Accessible from patient record and as a standalone menu item.

**Receiving documents:**
- Upload document for a patient
- Category selection (Medical Request, Lab Result, Insurance Authorization, Other)
- Auto-link to patient record and timeline

**Generating documents:**

*Attendance Certificate:*
- Patient name, record number, clinic name
- Date(s) of attendance and duration per session
- Professional name and registration number
- Clinic stamp area
- Generated as PDF, stored in patient documents

*Insurance Care Request (Solicitação de Atendimento):*
- Patient data + insurance card number
- CID-10 code (searchable field)
- Specialty and number of requested sessions
- Professional justification (free text)
- Professional signature block
- Generated as PDF

**Document Templates:**
- Admin can edit the base templates (HTML editor with variable placeholders: `{{patient_name}}`, `{{date}}`, `{{professional}}`, `{{clinic_name}}`, `{{record_number}}`, etc.)

---

### Organization Settings

Sidebar navigation within settings:

**Clinic Profile**
- Name, CNPJ, address, phone, email, website, logo upload
- Business hours (per day of week, open/closed toggle + hours)
- Holiday and agenda block management (date range picker)

**Reference Tables**
- Health Insurance Conventions: name, CNPJ, contact, default fee table (per specialty)
- Specialties: name, category (health, aesthetic, veterinary, occupational), default appointment duration
- Appointment Types: in-person, online, home visit
- Rooms / Offices: name, capacity, available equipment notes

**Document Templates**
- List of system templates (Attendance Certificate, Care Request)
- Edit button opens rich text editor with variable support
- Preview rendered PDF

**Notifications & Integrations**
- WhatsApp (Evolution API): phone number, API token, connection status, test button
- Email SMTP config (or use platform default)
- Notification triggers config: appointment reminder (24h before), confirmation request, missed appointment alert

**Subscription & Modules**
- Current plan name, billing cycle, renewal date
- Module list: for each module, show (Active / Inactive / Upgrade Required) based on plan
- Inactive modules allowed by plan: toggle to activate
- Modules not in plan: show "Upgrade Plan" CTA
- Link to billing portal (external, managed by backoffice)

**User Management**
- User list: name, email, role, status (Active/Inactive), last login
- "Invite User" button: enter email + select role → sends invite email
- Edit role / deactivate user
- Patient users: created from patient records, not from this screen (but listed here)

---

## APPOINTMENTS — PATIENT PORTAL ACCESS

When a user logs in with the `PATIENT` role:

**My Appointments page:**
- List of upcoming and past appointments
- Status badge per appointment
- "Confirm my attendance" button (visible 48h before appointment, changes status to CONFIRMED)
- "Request Rescheduling" button (sends notification to receptionist)

**Request New Appointment:**
- Form: preferred specialty, preferred professional (optional), preferred dates/times (3 options)
- Submitted as a request — receptionist completes the scheduling

**My Documents:**
- Download Attendance Certificate (for attended sessions)
- Download Insurance Care Request (if generated by clinic)
- Cannot upload documents (upload is done by clinic staff)

---

## EVALUATIONS MODULE

> Optional. Activatable per tenant if plan allows.

**Setup (by Admin):**
- Each specialty can have one or more evaluation types assigned
- Built-in evaluation types to include by default (configurable at specialty level):
  - TGMD-2 (motor development)
  - Portage (developmental screening)
  - Sensory Profile
  - Anamnesis (base form, required for first appointment)
  - Custom (admin creates custom form with field builder)

**Creating an Evaluation:**
- Linked to: patient + professional + date (optionally linked to a specific appointment)
- Select evaluation type
- Fill structured form (fields vary by evaluation type)
- System calculates score/result automatically where applicable
- "Save Draft" keeps it editable
- "Finalize Evaluation" locks the record permanently (confirmation dialog: "This action cannot be undone")

**After finalization:**
- Evaluation appears in patient's clinical timeline
- PDF export available
- Result is permanently immutable — no edit, no delete

---

## FINANCIAL MODULE (Basic)

> Optional. Activatable per tenant if plan allows.

**Fee Configuration:**
- Default fee per specialty
- Override per convention (convention table)
- Override per professional per specialty (professional-specific pricing)
- Priority: Professional-specific > Convention > Specialty default

**Transactions:**
- **Automatic income entry**: created when an appointment is marked as ATTENDED, using configured fee
- **Manual income entry**: other receipts (free text description, category, amount, date)
- **Expense entry**: clinic expenses (categories: rent, materials, salaries, taxes, other), amount, date, notes
- All entries linked to cost center

**Cash Book / Cost Center:**
- Period filter (date range)
- Filter by type (income/expense), category, professional, convention
- Running balance
- Exportable to CSV

**Closing Reports:**
- **By Convention**: sessions count, gross amount, discounts, net receivable
- **By Patient**: session list, amounts, payment status
- **By Professional**: sessions performed, commission/share calculated
- **General**: full period consolidation

**Overdue / Unpaid:**
- List of attended appointments with no payment registered
- Days since appointment, patient name, fee, quick "Mark Paid" action

**Receipts:**
- Generate receipt per appointment or per period (date range)
- Template uses clinic letterhead (same template engine as documents)
- Stored in patient documents automatically

---

## REPORTS MODULE

> Optional. Activatable per tenant if plan allows.

All reports support: date range filter, export to CSV and PDF.

**Operational Reports:**
- Appointments by period (filters: professional, specialty, convention, status)
- Attendance rate by professional
- Attendance rate by specialty
- Attendance rate by convention

**Financial Reports:**
- Revenue by convention: scheduled value vs realized vs received vs difference
- Revenue by professional
- Revenue by specialty
- Simplified P&L (income vs expenses by period)

**Convention Billing Report:**
- Full list of attended sessions for insurance reimbursement claim
- Includes: patient name, insurance card, CID, professional, session date, value

**Patient Reports:**
- Active patients count
- New patients by period
- Inactive patients (no appointments in X days — configurable threshold)
- Attendance frequency per patient

**Professional Reports:**
- Scheduled vs completed sessions
- Productivity per professional per period

**Patient Devolutiva (Progress Summary):**
- Select: patient + period
- System compiles: appointments (scheduled vs attended), professional evolution notes (timeline), evaluation summaries
- Generates a structured PDF document suitable to share with patient or family
- Clinic letterhead, professional signature block

---

## VACCINES MODULE

> Optional. Activatable per tenant if plan allows. Allows ClinixFlow to serve vaccination clinics.

**Vaccine Registry:**
- Name, manufacturer, description
- Indications (free text)
- Contraindications (free text, shown as alert during application)
- Number of required doses and labels (D1, D2, D3, Booster, Annual)
- Minimum interval between doses (in days) — enforced during scheduling

**Stock Management:**
- Receive stock (batch entry):
  - Vaccine, lot number, manufacturer, quantity received, manufacturing date, expiration date, storage temperature range (min/max °C)
- Current stock view: vaccine name, lot, quantity remaining, expiration date, status (OK / Expiring Soon / Expired)
- Alerts:
  - 🟡 Lot expiring within 30 days
  - 🔴 Lot expired
  - 🔴 Stock below minimum threshold (configurable per vaccine)
- Temperature log: manual daily record (date, measured temp, responsible user) with alert if out of range
- Stock is automatically decremented when a vaccine application is registered

**Vaccine Application:**
- Linked to: patient + professional (applicator)
- Select: vaccine → available lot (only non-expired, in-stock lots shown) → dose (D1, D2...)
- System enforces minimum interval: if previous dose was too recent, shows warning with minimum allowed date
- Record: application date/time, injection site (left arm, right arm, thigh, etc.), lot number, applicator professional
- Post-application observations (reactions, notes)
- Application saved = stock automatically decremented by 1

**Patient Vaccination Card (Calendário Vacinal):**
- Per patient: visual card showing all vaccines
- Each vaccine row shows: doses received (with date, lot), doses pending (with recommended date)
- Next dose due dates with status: Pending / Scheduled / Overdue
- Print / export vaccination card as PDF

**Vaccination Reports:**
- Vaccine coverage by vaccine type and period
- Applications per professional per period
- Stock status report (current levels, expiring soon)
- Traceability by lot number (which patients received which lot)

---

## UI/UX REQUIREMENTS

**Layout:**
- Persistent left sidebar navigation
- Sidebar shows only active modules for the tenant
- Inactive modules show with a lock icon and "Upgrade" tooltip
- Top bar: organization name, current user avatar, notifications bell, settings shortcut

**Design System:**
- Use shadcn/ui components as base
- Extend with custom tokens: `--color-primary: #0F766E`, `--color-primary-dark: #0D5C56`
- Status badges must be consistent across entire app: use the same badge component with color variants
- Typography: DM Sans for headings, Inter for body text

**Empty States:**
- Every list/table must have a designed empty state with icon, message, and primary CTA
- Example: "No appointments today. [+ Schedule Appointment]"

**Loading States:**
- Skeleton loaders for all data-fetching components (not spinners)

**Confirmations:**
- Destructive actions (finalize evaluation, cancel appointment, delete record) must use a confirmation dialog
- Dialog must describe the consequence clearly: "This action is irreversible."

**Notifications:**
- Toast notifications (top-right) for: success, error, warning
- In-app notification center (bell icon) for: new appointment request from patient, inconsistency alert, document uploaded

**Forms:**
- Inline validation (on blur)
- Required fields marked with asterisk
- Submission disabled until required fields are valid

**Responsiveness:**
- Desktop first (1280px+)
- Tablet usable (768px–1279px) — sidebar collapses to icons
- Mobile not a priority for this phase

---

## DATABASE SCHEMA NOTES (for Lovable context)

Key tables and their critical fields:

- `tenants`: id, slug, name, plan_id, active_modules (array), created_at
- `users`: id, tenant_id, email, role, status, created_at
- `patients`: id, tenant_id, record_number (sequential, not PK), name, dob, care_type (SINGLE | ONGOING), created_at
- `professionals`: id, tenant_id, user_id, name, registration_number, created_at
- `appointments`: id, tenant_id, code (AGD-YYYY-NNNNN), patient_id, professional_id, specialty_id, scheduled_at, duration_min, status, created_by, created_at
- `appointment_recurrence`: id, appointment_id (origin), pattern (days of week), end_date
- `medical_records`: id, tenant_id, patient_id, record_number (human-readable sequential)
- `clinical_events`: id, tenant_id, patient_id, event_type (EVALUATION|NOTE|ATTENDED|ABSENCE|JUSTIFIED_ABSENCE|DOCUMENT), content, performed_by, performed_at, immutable (bool)
- `treatment_contracts`: id, tenant_id, patient_id, professional_id, content_html, signed_at, signed_by_name, signature_data, locked (bool)
- `evaluations`: id, tenant_id, patient_id, professional_id, type, form_data (JSON), result (JSON), finalized_at, finalized_by, locked (bool)
- `documents`: id, tenant_id, patient_id, category, file_url, generated (bool), created_by, created_at
- `vaccines`: id, tenant_id, name, manufacturer, doses_required, min_interval_days
- `vaccine_batches`: id, tenant_id, vaccine_id, lot_number, quantity, quantity_remaining, expiration_date, min_temp, max_temp
- `vaccine_applications`: id, tenant_id, patient_id, professional_id, vaccine_id, batch_id, dose_label, applied_at, site, observations
- `transactions`: id, tenant_id, type (INCOME|EXPENSE), amount, category, appointment_id (nullable), patient_id (nullable), professional_id (nullable), description, date, created_by

---

## WHAT IS OUT OF SCOPE FOR THIS BUILD

The following will be built in a subsequent phase — do NOT include now:

- Petshop module
- Occupational Medicine module
- Laboratory module
- Backoffice (SaaS Admin panel for tenant and plan management)
- WhatsApp notification automation (config UI only, no actual sending)
- Native mobile app
Claude

