"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import {
  plansTable,
  subscriptionsTable,
  usersTable,
} from "@/src/db/schema";

import { approvePaymentSchema } from "./schema";

// Função auxiliar para calcular dias baseado no tipo de plano
function getDaysForPlanType(planType: string): number {
  switch (planType) {
    case "mensal":
      return 30;
    case "trimestral":
      return 90;
    case "semestral":
      return 180;
    case "anual":
      return 365;
    default:
      return 30;
  }
}

export const approvePayment = actionClient
  .schema(approvePaymentSchema)
  .action(async ({ parsedInput }) => {
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

    const { userId, plan, planType, notes } = parsedInput;

    // Buscar o usuário
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, userId),
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (user.role !== "clinic_owner") {
      throw new Error("Apenas owners podem ter pagamento aprovado");
    }

    // Calcular dias e datas
    const days = getDaysForPlanType(planType);
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    const periodStart = now;
    const periodEnd = expiresAt;

    // Buscar subscription existente ou criar nova
    const existingSubscription = await db.query.subscriptionsTable.findFirst({
      where: eq(subscriptionsTable.userId, userId),
      orderBy: (subscriptions, { desc }) => [desc(subscriptions.createdAt)],
    });

    await db.transaction(async (tx) => {
      if (existingSubscription) {
        // Atualizar subscription existente
        await tx
          .update(subscriptionsTable)
          .set({
            status: "active",
            paymentStatus: "paid",
            planType,
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            updatedAt: new Date(),
            updatedBy: session.user.id,
            notes: notes || existingSubscription.notes,
          })
          .where(eq(subscriptionsTable.id, existingSubscription.id));
      } else {
        // Criar nova subscription
        // Buscar ou criar plano
        let planRecord = await tx.query.plansTable.findFirst({
          where: (plans, { eq }) => eq(plans.name, plan),
        });

        // Se não existir, criar plano customizado
        if (!planRecord) {
          const [newPlan] = await tx
            .insert(plansTable)
            .values({
              name: plan,
              displayName: plan === "alpha" ? "Alpha" : "Beta Partner",
              description: `Plano ${plan} aprovado manualmente`,
              price: null,
              maxDoctors: null,
              maxPatients: null,
              isActive: true,
              isCustom: true,
            })
            .returning();
          planRecord = newPlan;
        }

        const newSubscription = await tx
          .insert(subscriptionsTable)
          .values({
            userId,
            licenseKey: `MASTER_${userId}_${Date.now()}`,
            planId: planRecord.id,
            planType,
            status: "active",
            paymentStatus: "paid",
            amount: 0,
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            createdBy: session.user.id,
            updatedBy: session.user.id,
            notes,
          })
          .returning();

        // Atualizar subscriptionId no user
        await tx
          .update(usersTable)
          .set({
            subscriptionId: newSubscription[0].id,
          })
          .where(eq(usersTable.id, userId));
      }

      // Atualizar usuário
      await tx
        .update(usersTable)
        .set({
          plan,
          planExpiresAt: expiresAt,
          activatedByCode: `MASTER_APPROVED_${session.user.id}_${new Date().toISOString()}`,
          updatedAt: new Date(),
        })
        .where(eq(usersTable.id, userId));
    });

    console.log(
      `✅ Master ${session.user.email} aprovou pagamento de ${user.email}: ${plan} ${planType}`,
    );

    revalidatePath("/master/dashboard");
    revalidatePath("/master/owners");

    return {
      success: true,
      message: `Pagamento aprovado! Plano ${plan} ${planType} ativado.`,
      expiresAt: expiresAt.toISOString(),
    };
  });
