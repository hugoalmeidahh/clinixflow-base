"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { usersTable } from "@/src/db/schema";

export const getOwners = actionClient.action(async () => {
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

  // Buscar todos os clinic_owners
  const owners = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      role: usersTable.role,
      plan: usersTable.plan,
      planExpiresAt: usersTable.planExpiresAt,
      activatedByCode: usersTable.activatedByCode,
      createdAt: usersTable.createdAt,
      updatedAt: usersTable.updatedAt,
    })
    .from(usersTable)
    .where(eq(usersTable.role, "clinic_owner"))
    .orderBy(usersTable.createdAt);

  // Calcular status de cada owner
  const now = new Date();
  const ownersWithStatus = owners.map((owner) => {
    const isExpired = owner.planExpiresAt
      ? new Date(owner.planExpiresAt) < now
      : !owner.plan;

    let status: "active" | "expiring_soon" | "expired" | "no_plan" = "no_plan";
    let daysUntilExpiration: number | null = null;

    if (owner.plan && owner.planExpiresAt) {
      daysUntilExpiration = Math.ceil(
        (new Date(owner.planExpiresAt).getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      if (isExpired) {
        status = "expired";
      } else if (daysUntilExpiration <= 7) {
        status = "expiring_soon";
      } else {
        status = "active";
      }
    }

    return {
      ...owner,
      status,
      daysUntilExpiration,
    };
  });

  return ownersWithStatus;
});
