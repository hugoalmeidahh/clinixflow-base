"use server";

import { eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import {
  subscriptionsTable,
  usersTable,
} from "@/src/db/schema";

export const getOwnersWithSubscriptions = actionClient.action(async () => {
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
      subscriptionId: usersTable.subscriptionId,
    })
    .from(usersTable)
    .where(eq(usersTable.role, "clinic_owner"))
    .orderBy(usersTable.createdAt);

  // Buscar subscriptions para cada owner
  const ownerIds = owners.map((o) => o.id);
  let subscriptions: (typeof subscriptionsTable.$inferSelect)[] = [];
  
  if (ownerIds.length > 0) {
    subscriptions = await db
      .select()
      .from(subscriptionsTable)
      .where(inArray(subscriptionsTable.userId, ownerIds));
    
    // Ordenar por createdAt desc
    subscriptions.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  // Agrupar subscriptions por userId
  const subscriptionsByUserId = new Map<string, typeof subscriptions[0]>();
  for (const sub of subscriptions) {
    if (!subscriptionsByUserId.has(sub.userId)) {
      subscriptionsByUserId.set(sub.userId, sub);
    }
  }

  const now = new Date();

  // Calcular status de cada owner
  const ownersWithStatus = owners.map((owner) => {
    const subscription = subscriptionsByUserId.get(owner.id);
    
    // Status do plano
    const isExpired = owner.planExpiresAt
      ? new Date(owner.planExpiresAt) < now
      : !owner.plan;

    let planStatus: "active" | "expiring_soon" | "expired" | "no_plan" = "no_plan";
    let daysUntilExpiration: number | null = null;

    if (owner.plan && owner.planExpiresAt) {
      daysUntilExpiration = Math.ceil(
        (new Date(owner.planExpiresAt).getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      if (isExpired) {
        planStatus = "expired";
      } else if (daysUntilExpiration <= 7) {
        planStatus = "expiring_soon";
      } else {
        planStatus = "active";
      }
    }

    // Status da subscription
    const subscriptionStatus = subscription?.status || null;
    const paymentStatus = subscription?.paymentStatus || null;
    const needsPayment = subscriptionStatus === "pending_payment" || paymentStatus === "pending";

    return {
      id: owner.id,
      name: owner.name,
      email: owner.email,
      role: owner.role,
      plan: owner.plan,
      planExpiresAt: owner.planExpiresAt,
      activatedByCode: owner.activatedByCode,
      createdAt: owner.createdAt,
      updatedAt: owner.updatedAt,
      planStatus,
      daysUntilExpiration,
      subscription: subscription
        ? {
            id: subscription.id,
            status: subscription.status,
            paymentStatus: subscription.paymentStatus,
            planType: subscription.planType,
            amount: subscription.amount,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd,
            needsPayment,
          }
        : null,
    };
  });

  return ownersWithStatus;
});
