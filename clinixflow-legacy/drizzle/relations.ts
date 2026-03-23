import { relations } from "drizzle-orm/relations";

import { accounts, appointments, clinics, doctors, patientRecords,patients, prescriptions, sessions, users, usersToClinics } from "./schema";

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	accounts: many(accounts),
	sessions: many(sessions),
	usersToClinics: many(usersToClinics),
}));

export const appointmentsRelations = relations(appointments, ({one, many}) => ({
	patient: one(patients, {
		fields: [appointments.patientId],
		references: [patients.id]
	}),
	doctor: one(doctors, {
		fields: [appointments.doctorId],
		references: [doctors.id]
	}),
	clinic: one(clinics, {
		fields: [appointments.clinicId],
		references: [clinics.id]
	}),
	patientRecords: many(patientRecords),
}));

export const patientsRelations = relations(patients, ({one, many}) => ({
	appointments: many(appointments),
	clinic: one(clinics, {
		fields: [patients.clinicId],
		references: [clinics.id]
	}),
	prescriptions: many(prescriptions),
	patientRecords: many(patientRecords),
}));

export const doctorsRelations = relations(doctors, ({one, many}) => ({
	appointments: many(appointments),
	clinic: one(clinics, {
		fields: [doctors.clinicId],
		references: [clinics.id]
	}),
	prescriptions: many(prescriptions),
	patientRecords: many(patientRecords),
}));

export const clinicsRelations = relations(clinics, ({many}) => ({
	appointments: many(appointments),
	doctors: many(doctors),
	patients: many(patients),
	prescriptions: many(prescriptions),
	usersToClinics: many(usersToClinics),
	patientRecords: many(patientRecords),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const prescriptionsRelations = relations(prescriptions, ({one}) => ({
	patient: one(patients, {
		fields: [prescriptions.patientId],
		references: [patients.id]
	}),
	doctor: one(doctors, {
		fields: [prescriptions.doctorId],
		references: [doctors.id]
	}),
	clinic: one(clinics, {
		fields: [prescriptions.clinicId],
		references: [clinics.id]
	}),
}));

export const usersToClinicsRelations = relations(usersToClinics, ({one}) => ({
	user: one(users, {
		fields: [usersToClinics.userId],
		references: [users.id]
	}),
	clinic: one(clinics, {
		fields: [usersToClinics.clinicId],
		references: [clinics.id]
	}),
}));

export const patientRecordsRelations = relations(patientRecords, ({one}) => ({
	patient: one(patients, {
		fields: [patientRecords.patientId],
		references: [patients.id]
	}),
	doctor: one(doctors, {
		fields: [patientRecords.doctorId],
		references: [doctors.id]
	}),
	clinic: one(clinics, {
		fields: [patientRecords.clinicId],
		references: [clinics.id]
	}),
	appointment: one(appointments, {
		fields: [patientRecords.appointmentId],
		references: [appointments.id]
	}),
}));