"use server";

import { and,eq, isNotNull, lt } from "drizzle-orm";

import { db } from "@/src/db";
import {
  paymentInconsistenciesTable,
  usersTable,
} from "@/src/db/schema";

/**
 * Verifica planos expirados e cria inconsistências de pagamento
 * Deve ser executado periodicamente (cron job ou manualmente)
 */
export async function checkPaymentInconsistencies() {
  const now = new Date();

  // Buscar owners com planos expirados
  const expiredOwners = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      planExpiresAt: usersTable.planExpiresAt,
      subscriptionId: usersTable.subscriptionId,
    })
    .from(usersTable)
    .where(
      and(
        eq(usersTable.role, "clinic_owner"),
        isNotNull(usersTable.planExpiresAt),
        lt(usersTable.planExpiresAt, now),
        isNotNull(usersTable.plan),
      ),
    );

  let created = 0;

  for (const owner of expiredOwners) {
    // Verificar se já existe inconsistência
    const existing = await db.query.paymentInconsistenciesTable.findFirst({
      where: eq(paymentInconsistenciesTable.userId, owner.id),
    });

    if (!existing) {
      // Criar inconsistência
      await db.insert(paymentInconsistenciesTable).values({
        userId: owner.id,
        subscriptionId: owner.subscriptionId || null,
        expiredAt: owner.planExpiresAt || now,
        status: "pending",
      });
      created++;
    }
  }

  return {
    checked: expiredOwners.length,
    created,
  };
}
