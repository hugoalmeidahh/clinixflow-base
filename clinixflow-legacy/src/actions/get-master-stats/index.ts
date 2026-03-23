"use server";

import { count, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import {
  clinicsTable,
  doctorsTable,
  ownerPaymentsTable,
  patientsTable,
  paymentInconsistenciesTable,
  subscriptionsTable,
  usersTable,
} from "@/src/db/schema";

export const getMasterStats = actionClient.action(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Apenas usuário master pode acessar
  if (session.user.role !== "master") {
    throw new Error("Forbidden: Apenas usuário master pode acessar");
  }

  // Buscar estatísticas
  const [
    totalOwners,
    totalClinics,
    totalPatients,
    totalDoctors,
    activeSubscriptions,
    pendingPayments,
    paymentInconsistencies,
    totalPayments,
  ] = await Promise.all([
    // Total de owners
    db
      .select({ count: count() })
      .from(usersTable)
      .where(eq(usersTable.role, "clinic_owner")),
    // Total de clínicas
    db.select({ count: count() }).from(clinicsTable),
    // Total de pacientes
    db.select({ count: count() }).from(patientsTable),
    // Total de profissionais
    db.select({ count: count() }).from(doctorsTable),
    // Subscriptions ativas
    db
      .select({ count: count() })
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.status, "active")),
    // Pagamentos pendentes
    db
      .select({ count: count() })
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.paymentStatus, "pending")),
    // Inconsistências de pagamento
    db
      .select({ count: count() })
      .from(paymentInconsistenciesTable)
      .where(eq(paymentInconsistenciesTable.status, "pending")),
    // Total de pagamentos registrados
    db.select({ count: count() }).from(ownerPaymentsTable),
  ]);

  return {
    totalOwners: totalOwners[0]?.count || 0,
    totalClinics: totalClinics[0]?.count || 0,
    totalPatients: totalPatients[0]?.count || 0,
    totalDoctors: totalDoctors[0]?.count || 0,
    activeSubscriptions: activeSubscriptions[0]?.count || 0,
    pendingPayments: pendingPayments[0]?.count || 0,
    paymentInconsistencies: paymentInconsistencies[0]?.count || 0,
    totalPayments: totalPayments[0]?.count || 0,
  };
});
