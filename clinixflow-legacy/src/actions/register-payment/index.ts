"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import {
  ownerPaymentsTable,
  paymentInconsistenciesTable,
  plansTable,
  subscriptionsTable,
  usersTable,
} from "@/src/db/schema";

import { registerPaymentSchema } from "./schema";

// Função auxiliar para calcular dias baseado no período
function getDaysForPeriod(period: string): number {
  switch (period) {
    case "diario":
      return 1;
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

export const registerPayment = actionClient
  .schema(registerPaymentSchema)
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

    const { userId, plan, paymentPeriod, paymentDate, notes } = parsedInput;

    // Buscar o usuário
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, userId),
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (user.role !== "clinic_owner") {
      throw new Error("Apenas owners podem ter pagamento registrado");
    }

    // Calcular dias e datas
    const days = getDaysForPeriod(paymentPeriod);
    const paymentDateObj = paymentDate
      ? new Date(paymentDate)
      : new Date();
    const periodStart = paymentDateObj;
    const periodEnd = new Date(paymentDateObj);
    periodEnd.setDate(periodEnd.getDate() + days);

    // Buscar ou criar subscription
    const existingSubscription = await db.query.subscriptionsTable.findFirst({
      where: eq(subscriptionsTable.userId, userId),
      orderBy: (subs, { desc }) => [desc(subs.createdAt)],
    });

    await db.transaction(async (tx) => {
      let subscriptionId = existingSubscription?.id;

      // Se não tem subscription, criar
      if (!subscriptionId) {
        // Buscar ou criar plano
        let planRecord = await tx.query.plansTable.findFirst({
          where: (plans, { eq }) => eq(plans.name, plan),
        });

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

        const [newSubscription] = await tx
          .insert(subscriptionsTable)
          .values({
            userId,
            licenseKey: `MASTER_${userId}_${Date.now()}`,
            planId: planRecord.id,
            planType: paymentPeriod,
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

        subscriptionId = newSubscription.id;

        // Atualizar subscriptionId no user
        await tx
          .update(usersTable)
          .set({
            subscriptionId: newSubscription.id,
          })
          .where(eq(usersTable.id, userId));
      } else {
        // Atualizar subscription existente
        await tx
          .update(subscriptionsTable)
          .set({
            status: "active",
            paymentStatus: "paid",
            planType: paymentPeriod,
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            updatedAt: new Date(),
            updatedBy: session.user.id,
            notes: notes || existingSubscription?.notes,
          })
          .where(eq(subscriptionsTable.id, subscriptionId));
      }

      // Criar registro de pagamento no histórico
      await tx.insert(ownerPaymentsTable).values({
        userId,
        subscriptionId,
        amount: 0, // Pode ser ajustado depois
        paymentPeriod,
        periodStart,
        periodEnd,
        paymentDate: paymentDateObj,
        status: "paid",
        notes,
        createdBy: session.user.id,
      });

      // Atualizar usuário
      await tx
        .update(usersTable)
        .set({
          plan,
          planExpiresAt: periodEnd,
          activatedByCode: `MASTER_PAYMENT_${session.user.id}_${new Date().toISOString()}`,
          updatedAt: new Date(),
        })
        .where(eq(usersTable.id, userId));

      // Remover inconsistência de pagamento se existir
      await tx
        .delete(paymentInconsistenciesTable)
        .where(eq(paymentInconsistenciesTable.userId, userId));
    });

    console.log(
      `✅ Master ${session.user.email} registrou pagamento de ${user.email}: ${plan} ${paymentPeriod}`,
    );

    revalidatePath("/master/dashboard");
    revalidatePath("/master/owners");

    return {
      success: true,
      message: `Pagamento registrado! Plano ${plan} ${paymentPeriod} ativado até ${periodEnd.toLocaleDateString("pt-BR")}.`,
      expiresAt: periodEnd.toISOString(),
    };
  });
