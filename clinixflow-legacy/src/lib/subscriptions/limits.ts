import { and, eq, or } from "drizzle-orm";

import { db } from "@/src/db";
import { plansTable, subscriptionsTable } from "@/src/db/schema";

export async function getSubscriptionLimits(userId: string) {
  const subscriptions = await db
    .select()
    .from(subscriptionsTable)
    .where(
      and(
        eq(subscriptionsTable.userId, userId),
        or(
          eq(subscriptionsTable.status, "active"),
          eq(subscriptionsTable.status, "pending_payment"),
        ),
      ),
    )
    .limit(1);

  const subscription = subscriptions[0];
  if (!subscription) {
    return null;
  }

  // Buscar plano
  const plans = await db
    .select()
    .from(plansTable)
    .where(eq(plansTable.id, subscription.planId))
    .limit(1);

  const plan = plans[0];
  if (!plan) {
    return null;
  }

  return {
    maxDoctors: plan.maxDoctors,
    maxPatients: plan.maxPatients,
  };
}

export async function checkDoctorLimit(clinicId: string, userId: string): Promise<{
  canAdd: boolean;
  current: number;
  max: number | null;
  message?: string;
}> {
  const limits = await getSubscriptionLimits(userId);

  if (!limits || limits.maxDoctors === null) {
    // Sem limite (plano customizado sem limite definido)
    return { canAdd: true, current: 0, max: null };
  }

  // Contar doctors da clínica
  const doctors = await db.query.doctorsTable.findMany({
    where: (doctors, { eq }) => eq(doctors.clinicId, clinicId),
  });

  const current = doctors.length;
  const canAdd = current < limits.maxDoctors;

  return {
    canAdd,
    current,
    max: limits.maxDoctors,
    message: canAdd
      ? undefined
      : `Limite de ${limits.maxDoctors} profissionais atingido. Faça upgrade do plano.`,
  };
}

export async function checkPatientLimit(clinicId: string, userId: string): Promise<{
  canAdd: boolean;
  current: number;
  max: number | null;
  message?: string;
}> {
  const limits = await getSubscriptionLimits(userId);

  if (!limits || limits.maxPatients === null) {
    // Sem limite (plano customizado sem limite definido)
    return { canAdd: true, current: 0, max: null };
  }

  // Contar patients da clínica
  const patients = await db.query.patientsTable.findMany({
    where: (patients, { eq }) => eq(patients.clinicId, clinicId),
  });

  const current = patients.length;
  const canAdd = current < limits.maxPatients;

  return {
    canAdd,
    current,
    max: limits.maxPatients,
    message: canAdd
      ? undefined
      : `Limite de ${limits.maxPatients} pacientes atingido. Faça upgrade do plano.`,
  };
}

