"use server";

import { eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import {
  paymentInconsistenciesTable,
  usersTable,
} from "@/src/db/schema";

export const getPaymentInconsistencies = actionClient.action(async () => {
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

  // Buscar inconsistências pendentes
  const inconsistencies = await db
    .select({
      id: paymentInconsistenciesTable.id,
      userId: paymentInconsistenciesTable.userId,
      expiredAt: paymentInconsistenciesTable.expiredAt,
      status: paymentInconsistenciesTable.status,
      createdAt: paymentInconsistenciesTable.createdAt,
    })
    .from(paymentInconsistenciesTable)
    .where(eq(paymentInconsistenciesTable.status, "pending"))
    .orderBy(paymentInconsistenciesTable.createdAt);

  // Buscar dados dos owners (apenas campos necessários)
  const userIds = inconsistencies.map((i) => i.userId);
  type OwnerSummary = {
    id: string;
    name: string;
    email: string;
    plan: string | null;
    planExpiresAt: Date | null;
  };
  let owners: OwnerSummary[] = [];

  if (userIds.length > 0) {
    owners = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        plan: usersTable.plan,
        planExpiresAt: usersTable.planExpiresAt,
      })
      .from(usersTable)
      .where(inArray(usersTable.id, userIds));
  }

  // Combinar dados
  const ownersMap = new Map(owners.map((o) => [o.id, o]));

  return inconsistencies.map((inc) => ({
    ...inc,
    owner: ownersMap.get(inc.userId) || null,
  }));
});
