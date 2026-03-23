import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  time,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Enum para convênios (DEPRECATED - usar insurancesTable)
// Mantido temporariamente para compatibilidade durante migração
export const insuranceEnum = pgEnum("insurance", [
  "unimed",
  "amil",
  "sulamerica",
  "bradesco_saude",
  "porto_seguro",
  "allianz",
  "hapvida",
  "cassems",
  "santa_casa_saude",
  "particular",
  "outros",
]);

// Enum para roles de usuário
export const userRoleEnum = pgEnum("user_role", [
  "master",
  "clinic_owner",
  "clinic_admin",
  "clinic_gestor",
  "clinic_recepcionist",
  "doctor",
  "patient",
]);

// Enum para tratamento
export const treatmentEnum = pgEnum("treatment", [
  "terapia_ocupacional",
  "psicomotricidade",
  "fonoaudiologia",
  "psicologia",
  "fisioterapia",
  "neurologia",
  "outros",
]);

// Enum para tipo de compensação do profissional
export const compensationTypeEnum = pgEnum("compensation_type", [
  "percentage",
  "fixed",
  "percentage_plus_fixed",
]);

// Enum para tipo de pessoa (física/jurídica)
export const personTypeEnum = pgEnum("person_type", ["physical", "legal"]);

// Enum para ações de auditoria
export const auditActionEnum = pgEnum("audit_action", [
  "create",
  "update",
  "delete",
  "view",
  "login",
  "logout",
  "export",
  "import",
]);

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  role: userRoleEnum("role").notNull().default("clinic_owner"),
  // Novos campos de endereço
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  // Novos campos de documentos
  cpf: text("cpf"),
  rg: text("rg"),
  insuranceCard: text("insurance_card"),
  // Novos campos de contato
  phoneNumber: text("phone_number"),
  responsiblePhone: text("responsible_phone"),
  // Novos campos de responsáveis
  motherName: text("mother_name"),
  fatherName: text("father_name"),
  // Campo de convênio
  insurance: insuranceEnum("insurance"),
  // Campos existentes
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  plan: text("plan"),
  planExpiresAt: timestamp("plan_expires_at"),
  activatedByCode: text("activated_by_code"),
  subscriptionId: uuid("subscription_id"),
  preferredLanguage: varchar("preferred_language", { length: 10 }).default("pt-BR"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// Tabela de códigos de ativação
export const activationCodesTable = pgTable("activation_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(),
  plan: text("plan").notNull(),
  days: integer("days").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  usedBy: text("used_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  usedAt: timestamp("used_at"),
  // Vincular com subscription (opcional - para códigos gerados automaticamente)
  subscriptionId: uuid("subscription_id").references(
    () => subscriptionsTable.id,
    { onDelete: "cascade" },
  ),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Tabela de convênios (insurances)
export const insurancesTable = pgTable("insurances", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(), // Nome único do convênio (ex: "unimed", "amil")
  slug: varchar("slug", { length: 255 }).unique(),
  displayName: text("display_name").notNull(), // Nome para exibição (ex: "Unimed", "Amil")
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Tabela de planos (configuração)
export const plansTable = pgTable("plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(), // 'essential', 'professional', 'super', 'custom'
  displayName: text("display_name").notNull(), // 'Essencial', 'Profissional', etc
  description: text("description"),
  price: integer("price"), // em centavos, null para customizado
  maxDoctors: integer("max_doctors"), // null para customizado
  maxPatients: integer("max_patients"), // null para customizado
  isActive: boolean("is_active").default(true).notNull(),
  isCustom: boolean("is_custom").default(false).notNull(), // se é customizado
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Tabela de subscriptions
export const subscriptionsTable = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  licenseKey: text("license_key").notNull().unique(), // Licença única
  planId: uuid("plan_id")
    .notNull()
    .references(() => plansTable.id, { onDelete: "restrict" }),
  planType: text("plan_type").notNull(), // 'mensal', 'semestral', 'anual'
  status: text("status").notNull(), // 'pending_payment', 'active', 'canceled', 'expired', 'trial'
  trialEndsAt: timestamp("trial_ends_at"), // 1 dia após criação
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  amount: integer("amount").notNull(), // em centavos
  paymentMethod: text("payment_method"), // 'pix', 'boleto', 'card', null
  paymentStatus: text("payment_status").notNull().default("pending"), // 'pending', 'paid', 'failed'
  // Campos Stripe (futuro)
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripeCustomerId: text("stripe_customer_id"),
  // Metadata
  notes: text("notes"),
  canceledAt: timestamp("canceled_at"),
  canceledReason: text("canceled_reason"),
  createdBy: text("created_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  updatedBy: text("updated_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Tabela de solicitações de pagamento
export const paymentRequestsTable = pgTable("payment_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  subscriptionId: uuid("subscription_id")
    .notNull()
    .references(() => subscriptionsTable.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(), // em centavos
  paymentMethod: text("payment_method").notNull(), // 'pix', 'boleto'
  status: text("status").notNull().default("pending"), // 'pending', 'paid', 'expired', 'canceled'
  // PIX
  pixKey: text("pix_key"),
  pixQrCode: text("pix_qr_code"),
  pixExpiresAt: timestamp("pix_expires_at"),
  // Boleto
  boletoCode: text("boleto_code"),
  boletoUrl: text("boleto_url"),
  boletoDueDate: timestamp("boleto_due_date"),
  // Controle
  expiresAt: timestamp("expires_at").notNull(), // 1 dia
  paidAt: timestamp("paid_at"),
  createdBy: text("created_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  updatedBy: text("updated_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Tabela de pagamentos (histórico)
export const paymentsTable = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  subscriptionId: uuid("subscription_id")
    .notNull()
    .references(() => subscriptionsTable.id, { onDelete: "cascade" }),
  paymentRequestId: uuid("payment_request_id").references(
    () => paymentRequestsTable.id,
    { onDelete: "set null" },
  ),
  amount: integer("amount").notNull(), // em centavos
  paymentMethod: text("payment_method").notNull(),
  status: text("status").notNull(), // 'succeeded', 'failed', 'refunded'
  // Período coberto
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  paidAt: timestamp("paid_at").notNull(),
  notes: text("notes"),
  createdBy: text("created_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  updatedBy: text("updated_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Tabela de pagamentos de owners (histórico manual)
export const ownerPaymentsTable = pgTable("owner_payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  subscriptionId: uuid("subscription_id").references(
    () => subscriptionsTable.id,
    { onDelete: "set null" },
  ),
  amount: integer("amount").notNull(), // em centavos
  paymentPeriod: text("payment_period").notNull(), // 'diario', 'mensal', 'trimestral', 'semestral', 'anual'
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  paymentDate: timestamp("payment_date").notNull(), // Data em que o pagamento foi informado
  status: text("status").notNull().default("paid"), // 'paid', 'overdue', 'cancelled'
  notes: text("notes"),
  createdBy: text("created_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Tabela de inconsistências de pagamento
export const paymentInconsistenciesTable = pgTable("payment_inconsistencies", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  subscriptionId: uuid("subscription_id").references(
    () => subscriptionsTable.id,
    { onDelete: "set null" },
  ),
  expiredAt: timestamp("expired_at").notNull(), // Data em que o plano expirou
  status: text("status").notNull().default("pending"), // 'pending', 'paid', 'overdue', 'resolved'
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: text("resolved_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  resolutionNotes: text("resolution_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verificationsTable = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  usersToClinics: many(usersToClinicsTable),
  auditLogs: many(auditLogTable),
}));

export const clinicsTable = pgTable("clinics", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull().unique(),
  cnpj: text("cnpj").notNull(),
  clinicCode: text("clinic_code").notNull().unique(),
  createdBy: text("created_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  updatedBy: text("updated_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const usersToClinicsTable = pgTable("users_to_clinics", {
  userId: text("user_id").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const usersToClinicsTableRelations = relations(
  usersToClinicsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [usersToClinicsTable.userId],
      references: [usersTable.id],
    }),
    clinic: one(clinicsTable, {
      fields: [usersToClinicsTable.clinicId],
      references: [clinicsTable.id],
    }),
  }),
);

// Tabela de auditoria (audit log) - Definida depois de usersTable e clinicsTable
export const auditLogTable = pgTable("audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  action: auditActionEnum("action").notNull(),
  entityType: text("entity_type").notNull(), // 'doctor', 'patient', 'appointment', etc.
  entityId: text("entity_id").notNull(), // ID do registro alterado
  // Dados antes e depois da alteração (JSON)
  oldValues: text("old_values"), // JSON com valores antigos
  newValues: text("new_values"), // JSON com valores novos
  // Informações adicionais
  description: text("description"), // Descrição legível da ação
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  // Metadata
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogTableRelations = relations(auditLogTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [auditLogTable.userId],
    references: [usersTable.id],
  }),
  clinic: one(clinicsTable, {
    fields: [auditLogTable.clinicId],
    references: [clinicsTable.id],
  }),
}));

export const clinicsTableRelations = relations(clinicsTable, ({ many }) => ({
  doctors: many(doctorsTable),
  patients: many(patientsTable),
  appointments: many(appointmentsTable),
  usersToClinics: many(usersToClinicsTable),
  insurancePrices: many(insurancePricesTable),
  auditLogs: many(auditLogTable),
}));

// Tabela de preços de convênios por tratamento e duração
export const insurancePricesTable = pgTable("insurance_prices", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  insurance: insuranceEnum("insurance").notNull(),
  treatment: treatmentEnum("treatment").notNull(),
  durationInMinutes: integer("duration_in_minutes").notNull(), // 30, 40, 50, 60, etc.
  priceInCents: integer("price_in_cents").notNull(), // Valor do repasse para a clínica (em centavos)
  isActive: boolean("is_active").default(true).notNull(),
  createdBy: text("created_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  updatedBy: text("updated_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insurancePricesTableRelations = relations(
  insurancePricesTable,
  ({ one }) => ({
    clinic: one(clinicsTable, {
      fields: [insurancePricesTable.clinicId],
      references: [clinicsTable.id],
    }),
  }),
);

// Tabela de especialidades disponíveis
export const specialtiesTable = pgTable("specialties", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  slug: varchar("slug", { length: 255 }).unique(),
  description: text("description"),
  councilCode: text("council_code"), // Código do conselho (CRM, CRP, CREFITO, etc.)
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, {
    onDelete: "cascade",
  }), // NULL = system specialty, UUID = clinic custom specialty
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Relações de specialtiesTable serão definidas após doctorSpecialtiesTable

// Tabela de especialidades dos profissionais (relação N:N)
export const doctorSpecialtiesTable = pgTable("doctor_specialties", {
  id: uuid("id").defaultRandom().primaryKey(),
  doctorId: uuid("doctor_id")
    .notNull()
    .references(() => doctorsTable.id, { onDelete: "cascade" }),
  specialtyId: uuid("specialty_id").references(() => specialtiesTable.id, {
    onDelete: "restrict",
  }),
  specialty: text("specialty"), // DEPRECATED: usar specialtyId, mantido para compatibilidade durante migração
  classNumberType: text("class_number_type").notNull(), // Tipo do conselho (CRM, CRO, etc.)
  classNumberRegister: text("class_number_register").notNull(), // Número do registro
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const doctorSpecialtiesTableRelations = relations(
  doctorSpecialtiesTable,
  ({ one }) => ({
    doctor: one(doctorsTable, {
      fields: [doctorSpecialtiesTable.doctorId],
      references: [doctorsTable.id],
    }),
    specialty: one(specialtiesTable, {
      fields: [doctorSpecialtiesTable.specialtyId],
      references: [specialtiesTable.id],
    }),
  }),
);

// Relações de specialtiesTable (definida após doctorSpecialtiesTable para evitar referência circular)
export const specialtiesTableRelations = relations(
  specialtiesTable,
  ({ many }) => ({
    doctorSpecialties: many(doctorSpecialtiesTable),
  }),
);

// Tabela de disponibilidade por dia da semana
export const doctorAvailabilityTable = pgTable(
  "doctor_availability",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    doctorId: uuid("doctor_id")
      .notNull()
      .references(() => doctorsTable.id, { onDelete: "cascade" }),
    dayOfWeek: integer("day_of_week").notNull(), // 1=Segunda, 2=Terça, ..., 7=Domingo
    isAvailable: boolean("is_available").default(false).notNull(),
    startTime: time("start_time"), // Nullable se não estiver disponível
    endTime: time("end_time"), // Nullable se não estiver disponível
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    uniqueDoctorDay: unique().on(table.doctorId, table.dayOfWeek),
  }),
);

export const doctorAvailabilityTableRelations = relations(
  doctorAvailabilityTable,
  ({ one }) => ({
    doctor: one(doctorsTable, {
      fields: [doctorAvailabilityTable.doctorId],
      references: [doctorsTable.id],
    }),
  }),
);

export const doctorsTable = pgTable("doctors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  avatarImageUrl: text("avatar_image_url"),
  // Campos antigos mantidos para compatibilidade (serão removidos futuramente)
  specialty: text("specialty"), // DEPRECATED: usar doctorSpecialtiesTable
  classNumberRegister: text("class_number_register"), // DEPRECATED: usar doctorSpecialtiesTable
  classNumberType: text("class_number_type"), // DEPRECATED: usar doctorSpecialtiesTable
  cnpj: text("cnpj"), // DEPRECATED: usar document
  // Novos campos
  personType: personTypeEnum("person_type").default("physical").notNull(), // Tipo de pessoa (física/jurídica)
  document: text("document"), // CPF, CNPJ ou documento internacional
  cpf: text("cpf"), // CPF separado (mesmo para pessoa jurídica)
  rg: text("rg"), // RG (pessoa física) ou Inscrição Estadual (pessoa jurídica)
  birthDate: date("birth_date"), // Data de nascimento (pessoa física)
  openingDate: date("opening_date"), // Data de abertura empresa (pessoa jurídica)
  accessType: text("access_type").default("code").notNull(), // 'code' ou 'email'
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
  doctorCode: text("doctor_code").notNull(),
  //1 - Monday, 2 - Tuesday, 3 - Wednesday, 4 - Thursday, 5 - Friday, 6 - Saturday, 7 - Sunday
  // DEPRECATED: usar doctorAvailabilityTable
  availableFromWeekDay: integer("available_from_week_day"),
  availableToWeekDay: integer("available_to_week_day"),
  availableFromTime: time("available_from_time"),
  availableToTime: time("available_to_time"),
  // Campos de compensação do profissional
  compensationType: compensationTypeEnum("compensation_type").notNull(),
  compensationPercentage: integer("compensation_percentage"), // 0-100, nullable
  compensationFixedAmountInCents: integer("compensation_fixed_amount_in_cents"), // em centavos, nullable
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, {
    onDelete: "cascade",
  }),
  createdBy: text("created_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  updatedBy: text("updated_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const doctorsTableRelations = relations(
  doctorsTable,
  ({ one, many }) => ({
    clinic: one(clinicsTable, {
      fields: [doctorsTable.clinicId],
      references: [clinicsTable.id],
    }),
    specialties: many(doctorSpecialtiesTable),
    availability: many(doctorAvailabilityTable),
    appointments: many(appointmentsTable),
    patientRecords: many(patientRecordsTable),
    prescriptions: many(prescriptionsTable),
  }),
);

export const patientSexEnum = pgEnum("patient_sex", ["male", "female"]);

export const patientsTable = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  patientCode: text("patient_code").notNull(),
  phoneNumber: text("phone_number").notNull(),
  isWhatsapp: boolean("is_whatsapp").default(false).notNull(),
  sex: patientSexEnum("sex").notNull(),
  birthDate: date("birth_date").notNull(),
  motherName: text("mother_name").notNull(),
  fatherName: text("father_name").notNull(),
  responsibleName: text("responsible_name").notNull(),
  responsibleContact: text("responsible_contact").notNull(),
  // Acompanhante
  accompaniantName: text("accompaniant_name"), // Nome do acompanhante
  accompaniantRelationship: text("accompaniant_relationship"), // Grau de parentesco (ex: "Mãe", "Pai", "Avó", etc.)
  insuranceId: uuid("insurance_id").references(() => insurancesTable.id, {
    onDelete: "set null",
  }), // Referência ao convênio na tabela insurances
  insurance: insuranceEnum("insurance"), // DEPRECATED - manter temporariamente para compatibilidade
  insuranceCard: text("insurance_card").notNull(),
  insurancePlan: text("insurance_plan"), // Plano do convênio
  susCard: text("sus_card"), // Número do Cartão Nacional de Saúde (CRA)
  susRegion: text("sus_region"), // Região de atendimento SUS
  cid: text("cid"),
  rg: text("rg").notNull(),
  cpf: text("cpf").notNull(),
  zipCode: text("zip_code").notNull(),
  address: text("address").notNull(),
  number: text("number").notNull(),
  complement: text("complement").notNull(),
  neighborhood: text("neighborhood").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  inactivationReasonId: uuid("inactivation_reason_id"), // References inactivationReasonsTable (defined later)
  inactivationNotes: text("inactivation_notes"),
  inactivatedAt: timestamp("inactivated_at"),
  observations: text("observations"),
  patientRecordNumber: integer("patient_record_number"), // Número único do prontuário (iniciando em 1)
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, {
    onDelete: "cascade",
  }),
  createdBy: text("created_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  updatedBy: text("updated_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Tabela para tratamentos do paciente (many-to-many)
export const patientsToTreatmentsTable = pgTable("patients_to_treatments", {
  patientId: uuid("patient_id").references(() => patientsTable.id, {
    onDelete: "cascade",
  }),
  treatment: treatmentEnum("treatment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const patientsTableRelations = relations(
  patientsTable,
  ({ one, many }) => ({
    clinic: one(clinicsTable, {
      fields: [patientsTable.clinicId],
      references: [clinicsTable.id],
    }),
    appointments: many(appointmentsTable),
    patientRecords: many(patientRecordsTable),
    prescriptions: many(prescriptionsTable),
    treatments: many(patientsToTreatmentsTable),
  }),
);

// Tabela para vincular profissionais a usuários (múltiplas clínicas)
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
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Tabela para vincular pacientes a usuários (múltiplas clínicas)
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
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const appointmentsTable: any = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
  doctorCompensationInCents: integer("doctor_compensation_in_cents"), // Valor calculado do repasse do profissional (em centavos)
  patientId: uuid("patient_id").references(() => patientsTable.id, {
    onDelete: "cascade",
  }),
  doctorId: uuid("doctor_id").references(() => doctorsTable.id, {
    onDelete: "cascade",
  }),
  doctorSpecialtyId: uuid("doctor_specialty_id").references(
    () => doctorSpecialtiesTable.id,
    {
      onDelete: "set null",
    },
  ), // Especialidade do profissional para este agendamento
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, {
    onDelete: "cascade",
  }),
  date: timestamp("date").notNull(),
  durationInMinutes: integer("duration_in_minutes").default(30).notNull(), // Duração do atendimento em minutos
  confirmed: boolean("confirmed").default(false).notNull(), // Confirmação de comparecimento
  attended: boolean("attended"), // null = não definido, true = compareceu, false = faltou
  attendanceJustification: text("attendance_justification"),
  reposicao: boolean("reposicao").default(false).notNull(), // Se é um agendamento de reposição
  atendimentoAvaliacao: boolean("atendimento_avaliacao")
    .default(false)
    .notNull(), // Se é atendimento/avaliação
  guideNumber: varchar("guide_number", { length: 100 }), // Numero da guia de autorização
  isRescheduled: boolean("is_rescheduled").default(false).notNull(), // Se é um reagendamento (marcado quando foi reagendado)
  rescheduledFromId: uuid("rescheduled_from_id").references(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => (appointmentsTable as any).id,
    {
      onDelete: "set null",
    },
  ), // ID do agendamento original que foi reagendado
  createdBy: text("created_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  updatedBy: text("updated_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const appointmentsTableRelations = relations(
  appointmentsTable,
  ({ one, many }) => ({
    clinic: one(clinicsTable, {
      fields: [appointmentsTable.clinicId],
      references: [clinicsTable.id],
    }),
    patient: one(patientsTable, {
      fields: [appointmentsTable.patientId],
      references: [patientsTable.id],
    }),
    doctor: one(doctorsTable, {
      fields: [appointmentsTable.doctorId],
      references: [doctorsTable.id],
    }),
    doctorSpecialty: one(doctorSpecialtiesTable, {
      fields: [appointmentsTable.doctorSpecialtyId],
      references: [doctorSpecialtiesTable.id],
    }),
    patientRecords: many(patientRecordsTable),
  }),
);

// Tabela de prontuários do paciente
export const patientRecordsTable = pgTable("patient_records", {
  id: serial("id").primaryKey(),
  patientId: uuid("patient_id").references(() => patientsTable.id, {
    onDelete: "cascade",
  }),
  doctorId: uuid("doctor_id").references(() => doctorsTable.id, {
    onDelete: "cascade",
  }),
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, {
    onDelete: "cascade",
  }),
  appointmentId: uuid("appointment_id").references(() => appointmentsTable.id, {
    onDelete: "cascade",
  }),
  firstConsultation: boolean("first_consultation").notNull(),
  avaliationContent: text("avaliation_content").notNull(),
  content: text("content").notNull(),
  canEdit: boolean("can_edit").default(false).notNull(), // Se pode editar (após autorização da gestão)
  editAuthorizedBy: text("edit_authorized_by"), // userId de quem autorizou a edição
  editAuthorizedAt: timestamp("edit_authorized_at"), // Data da autorização
  createdBy: text("created_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  updatedBy: text("updated_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const patientRecordsTableRelations = relations(
  patientRecordsTable,
  ({ one }) => ({
    clinic: one(clinicsTable, {
      fields: [patientRecordsTable.clinicId],
      references: [clinicsTable.id],
    }),
    patient: one(patientsTable, {
      fields: [patientRecordsTable.patientId],
      references: [patientsTable.id],
    }),
    doctor: one(doctorsTable, {
      fields: [patientRecordsTable.doctorId],
      references: [doctorsTable.id],
    }),
    appointment: one(appointmentsTable, {
      fields: [patientRecordsTable.appointmentId],
      references: [appointmentsTable.id],
    }),
  }),
);

export const prescriptionsTable = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  patientId: uuid("patient_id").references(() => patientsTable.id, {
    onDelete: "cascade",
  }),
  doctorId: uuid("doctor_id").references(() => doctorsTable.id, {
    onDelete: "cascade",
  }),
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, {
    onDelete: "cascade",
  }),
  content: text("content").notNull(),
  createdBy: text("created_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  updatedBy: text("updated_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const prescriptionsTableRelations = relations(
  prescriptionsTable,
  ({ one }) => ({
    clinic: one(clinicsTable, {
      fields: [prescriptionsTable.clinicId],
      references: [clinicsTable.id],
    }),
    patient: one(patientsTable, {
      fields: [prescriptionsTable.patientId],
      references: [patientsTable.id],
    }),
    doctor: one(doctorsTable, {
      fields: [prescriptionsTable.doctorId],
      references: [doctorsTable.id],
    }),
  }),
);

// Relations para doctors_to_users
export const doctorsToUsersTableRelations = relations(
  doctorsToUsersTable,
  ({ one }) => ({
    doctor: one(doctorsTable, {
      fields: [doctorsToUsersTable.doctorId],
      references: [doctorsTable.id],
    }),
    user: one(usersTable, {
      fields: [doctorsToUsersTable.userId],
      references: [usersTable.id],
    }),
    clinic: one(clinicsTable, {
      fields: [doctorsToUsersTable.clinicId],
      references: [clinicsTable.id],
    }),
  }),
);

// Relations para patients_to_users
export const patientsToUsersTableRelations = relations(
  patientsToUsersTable,
  ({ one }) => ({
    patient: one(patientsTable, {
      fields: [patientsToUsersTable.patientId],
      references: [patientsTable.id],
    }),
    user: one(usersTable, {
      fields: [patientsToUsersTable.userId],
      references: [usersTable.id],
    }),
    clinic: one(clinicsTable, {
      fields: [patientsToUsersTable.clinicId],
      references: [clinicsTable.id],
    }),
  }),
);

// ===== TABELAS ADICIONAIS (Phase 1+) =====

// Tabela de motivos de inativação de pacientes
export const inactivationReasonsTable = pgTable("inactivation_reasons", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, {
    onDelete: "cascade",
  }), // NULL = system reason, UUID = clinic custom reason
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Tabela de status de agendamento
export const appointmentStatusesTable = pgTable("appointment_statuses", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  color: varchar("color", { length: 20 }), // Cor para exibição (hex)
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Enum para status de guia de autorização
export const guideStatusEnum = pgEnum("guide_status", [
  "active",
  "completed",
  "expired",
  "cancelled",
]);

// Tabela de guias de autorização
export const authorizationGuidesTable = pgTable("authorization_guides", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patientsTable.id, { onDelete: "cascade" }),
  insuranceProviderId: uuid("insurance_provider_id").references(
    () => insurancesTable.id,
    { onDelete: "set null" },
  ),
  guideNumber: varchar("guide_number", { length: 100 }).notNull().unique(),
  totalSessions: integer("total_sessions").notNull(),
  completedSessions: integer("completed_sessions").default(0).notNull(),
  sessionValueInCents: integer("session_value_in_cents").notNull(),
  issueDate: date("issue_date").notNull(),
  expiryDate: date("expiry_date"),
  status: guideStatusEnum("status").default("active").notNull(),
  createdBy: text("created_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  updatedBy: text("updated_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Enum para status da sessão de guia
export const guideSessionStatusEnum = pgEnum("guide_session_status", [
  "pending",
  "scheduled",
  "completed",
]);

// Tabela de sessões de guia
export const guideSessionsTable = pgTable(
  "guide_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    guideId: uuid("guide_id")
      .notNull()
      .references(() => authorizationGuidesTable.id, { onDelete: "cascade" }),
    appointmentId: uuid("appointment_id").references(
      () => appointmentsTable.id,
      { onDelete: "set null" },
    ),
    sessionNumber: integer("session_number").notNull(),
    status: guideSessionStatusEnum("status").default("pending").notNull(),
    scheduledDate: date("scheduled_date"),
    scheduledTime: time("scheduled_time"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    uniqueGuideSession: unique().on(table.guideId, table.sessionNumber),
  }),
);

// Enum para tipo de transação financeira
export const transactionTypeEnum = pgEnum("transaction_type", [
  "income",
  "expense",
]);

// Tabela de transações financeiras
export const financialTransactionsTable = pgTable("financial_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  type: transactionTypeEnum("type").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  amount: integer("amount").notNull(), // em centavos
  description: text("description"),
  transactionDate: date("transaction_date").notNull(),
  appointmentId: uuid("appointment_id").references(
    () => appointmentsTable.id,
    { onDelete: "set null" },
  ),
  createdBy: text("created_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Tabela de fechamento mensal
export const monthlyClosingsTable = pgTable("monthly_closings", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicsTable.id, { onDelete: "cascade" }),
  month: integer("month").notNull(), // 1-12
  year: integer("year").notNull(),
  totalIncome: integer("total_income").notNull(), // em centavos
  totalExpenses: integer("total_expenses").notNull(), // em centavos
  netProfit: integer("net_profit").notNull(), // em centavos
  isClosed: boolean("is_closed").default(false).notNull(),
  closedAt: timestamp("closed_at"),
  closedBy: text("closed_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// ===== RELATIONS para novas tabelas =====

export const authorizationGuidesTableRelations = relations(
  authorizationGuidesTable,
  ({ one, many }) => ({
    clinic: one(clinicsTable, {
      fields: [authorizationGuidesTable.clinicId],
      references: [clinicsTable.id],
    }),
    patient: one(patientsTable, {
      fields: [authorizationGuidesTable.patientId],
      references: [patientsTable.id],
    }),
    insuranceProvider: one(insurancesTable, {
      fields: [authorizationGuidesTable.insuranceProviderId],
      references: [insurancesTable.id],
    }),
    sessions: many(guideSessionsTable),
  }),
);

export const guideSessionsTableRelations = relations(
  guideSessionsTable,
  ({ one }) => ({
    guide: one(authorizationGuidesTable, {
      fields: [guideSessionsTable.guideId],
      references: [authorizationGuidesTable.id],
    }),
    appointment: one(appointmentsTable, {
      fields: [guideSessionsTable.appointmentId],
      references: [appointmentsTable.id],
    }),
  }),
);

export const inactivationReasonsTableRelations = relations(
  inactivationReasonsTable,
  ({ one }) => ({
    clinic: one(clinicsTable, {
      fields: [inactivationReasonsTable.clinicId],
      references: [clinicsTable.id],
    }),
  }),
);

export const financialTransactionsTableRelations = relations(
  financialTransactionsTable,
  ({ one }) => ({
    clinic: one(clinicsTable, {
      fields: [financialTransactionsTable.clinicId],
      references: [clinicsTable.id],
    }),
    appointment: one(appointmentsTable, {
      fields: [financialTransactionsTable.appointmentId],
      references: [appointmentsTable.id],
    }),
  }),
);
