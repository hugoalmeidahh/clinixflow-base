import {
  boolean,
  date,
  foreignKey,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  time,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const insurance = pgEnum("insurance", [
  "unimed",
  "amil",
  "sulamerica",
  "bradesco_saude",
  "porto_seguro",
  "allianz",
  "hapvida",
  "cassei",
  "santa_casa_saude",
  "Cassi Saúde",
  "particular",
  "outros",
]);
export const patientSex = pgEnum("patient_sex", ["male", "female"]);

export const verifications = pgTable("verifications", {
  id: text().primaryKey().notNull(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }),
  updatedAt: timestamp("updated_at", { mode: "string" }),
});

export const accounts = pgTable(
  "accounts",
  {
    id: text().primaryKey().notNull(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      mode: "string",
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      mode: "string",
    }),
    scope: text(),
    password: text(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "accounts_user_id_users_id_fk",
    }).onDelete("cascade"),
  ],
);

export const appointments = pgTable(
  "appointments",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
    patientId: uuid("patient_id"),
    doctorId: uuid("doctor_id"),
    clinicId: uuid("clinic_id"),
    date: timestamp({ mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.patientId],
      foreignColumns: [patients.id],
      name: "appointments_patient_id_patients_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.doctorId],
      foreignColumns: [doctors.id],
      name: "appointments_doctor_id_doctors_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.clinicId],
      foreignColumns: [clinics.id],
      name: "appointments_clinic_id_clinics_id_fk",
    }).onDelete("cascade"),
  ],
);

export const doctors = pgTable(
  "doctors",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    avatarImageUrl: text("avatar_image_url"),
    specialty: text().notNull(),
    phoneNumber: text("phone_number").notNull(),
    availableFromWeekDay: integer("available_from_week_day").notNull(),
    availableToWeekDay: integer("available_to_week_day").notNull(),
    availableFromTime: time("available_from_time").notNull(),
    availableToTime: time("available_to_time").notNull(),
    appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
    clinicId: uuid("clinic_id"),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
    email: text().notNull(),
    classNumberRegister: text("class_number_register").notNull(),
    classNumberType: text("class_number_type").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.clinicId],
      foreignColumns: [clinics.id],
      name: "doctors_clinic_id_clinics_id_fk",
    }).onDelete("cascade"),
  ],
);

export const patients = pgTable(
  "patients",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    email: text().notNull(),
    phoneNumber: text("phone_number").notNull(),
    sex: patientSex().notNull(),
    clinicId: uuid("clinic_id"),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
    birthDate: date("birth_date").notNull(),
    motherName: text("mother_name").notNull(),
    fatherName: text("father_name").notNull(),
    responsibleName: text("responsible_name").notNull(),
    responsibleContact: text("responsible_contact").notNull(),
    insurance: insurance().notNull(),
    insuranceCard: text("insurance_card").notNull(),
    rg: text().notNull(),
    cpf: text().notNull(),
    zipCode: text("zip_code").notNull(),
    address: text().notNull(),
    number: text().notNull(),
    complement: text().notNull(),
    neighborhood: text().notNull(),
    city: text().notNull(),
    state: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.clinicId],
      foreignColumns: [clinics.id],
      name: "patients_clinic_id_clinics_id_fk",
    }).onDelete("cascade"),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    id: text().primaryKey().notNull(),
    expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
    token: text().notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "sessions_user_id_users_id_fk",
    }).onDelete("cascade"),
    unique("sessions_token_unique").on(table.token),
  ],
);

export const prescriptions = pgTable(
  "prescriptions",
  {
    id: serial().primaryKey().notNull(),
    patientId: uuid("patient_id"),
    doctorId: uuid("doctor_id"),
    clinicId: uuid("clinic_id"),
    content: text().notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.patientId],
      foreignColumns: [patients.id],
      name: "prescriptions_patient_id_patients_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.doctorId],
      foreignColumns: [doctors.id],
      name: "prescriptions_doctor_id_doctors_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.clinicId],
      foreignColumns: [clinics.id],
      name: "prescriptions_clinic_id_clinics_id_fk",
    }).onDelete("cascade"),
  ],
);

export const clinics = pgTable(
  "clinics",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    address: text().notNull(),
    phone: text().notNull(),
    email: text().notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
    cnpj: text().notNull(),
  },
  (table) => [unique("clinics_email_unique").on(table.email)],
);

export const users = pgTable(
  "users",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    email: text().notNull(),
    emailVerified: boolean("email_verified").notNull(),
    image: text(),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    plan: text(),
    planExpiresAt: timestamp("plan_expires_at", { mode: "string" }),
    activatedByCode: text("activated_by_code"),
    createdAt: timestamp("created_at", { mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
    address: text(),
    city: text(),
    state: text(),
    zipCode: text("zip_code"),
    cpf: text(),
    rg: text(),
    insuranceCard: text("insurance_card"),
    phoneNumber: text("phone_number"),
    responsiblePhone: text("responsible_phone"),
    motherName: text("mother_name"),
    fatherName: text("father_name"),
    insurance: insurance(),
  },
  (table) => [unique("users_email_unique").on(table.email)],
);

export const usersToClinics = pgTable(
  "users_to_clinics",
  {
    userId: text("user_id"),
    clinicId: uuid("clinic_id"),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "users_to_clinics_user_id_users_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.clinicId],
      foreignColumns: [clinics.id],
      name: "users_to_clinics_clinic_id_clinics_id_fk",
    }).onDelete("cascade"),
  ],
);

export const patientRecords = pgTable(
  "patient_records",
  {
    id: serial().primaryKey().notNull(),
    patientId: uuid("patient_id"),
    doctorId: uuid("doctor_id"),
    clinicId: uuid("clinic_id"),
    appointmentId: uuid("appointment_id"),
    firstConsultation: boolean("first_consultation").notNull(),
    avaliationContent: text("avaliation_content").notNull(),
    content: text().notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.patientId],
      foreignColumns: [patients.id],
      name: "patient_records_patient_id_patients_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.doctorId],
      foreignColumns: [doctors.id],
      name: "patient_records_doctor_id_doctors_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.clinicId],
      foreignColumns: [clinics.id],
      name: "patient_records_clinic_id_clinics_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.appointmentId],
      foreignColumns: [appointments.id],
      name: "patient_records_appointment_id_appointments_id_fk",
    }).onDelete("cascade"),
  ],
);
