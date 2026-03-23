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
  subscriptionsTable,
  usersTable,
} from "@/src/db/schema";

import { markPaymentStatusSchema } from "./schema";

// Função auxiliar para calcular dias baseado no período (assumindo mensal padrão)
function getDaysForPeriod(period: string = "mensal"): number {
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

export const markPaymentAsPaid = actionClient
  .schema(markPaymentStatusSchema)
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

    const { userId, notes } = parsedInput;

    // Buscar inconsistência
    const inconsistency = await db.query.paymentInconsistenciesTable.findFirst({
      where: eq(paymentInconsistenciesTable.userId, userId),
    });

    if (!inconsistency) {
      throw new Error("Inconsistência não encontrada");
    }

    // Buscar usuário e subscription
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, userId),
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const subscription = user.subscriptionId
      ? await db.query.subscriptionsTable.findFirst({
          where: eq(subscriptionsTable.id, user.subscriptionId),
        })
      : null;

    // Assumir período mensal (30 dias) quando marcar como pago
    const paymentPeriod = subscription?.planType || "mensal";
    const days = getDaysForPeriod(paymentPeriod);
    const now = new Date();
    const periodStart = now;
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + days);

    await db.transaction(async (tx) => {
      // Atualizar subscription se existir
      if (subscription) {
        await tx
          .update(subscriptionsTable)
          .set({
            status: "active",
            paymentStatus: "paid",
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            updatedAt: new Date(),
            updatedBy: session.user.id,
            notes: notes || subscription.notes,
          })
          .where(eq(subscriptionsTable.id, subscription.id));
      }

      // Criar registro de pagamento no histórico
      await tx.insert(ownerPaymentsTable).values({
        userId,
        subscriptionId: subscription?.id || null,
        amount: 0,
        paymentPeriod,
        periodStart,
        periodEnd,
        paymentDate: now,
        status: "paid",
        notes: notes || "Pagamento confirmado via inconsistência",
        createdBy: session.user.id,
      });

      // Atualizar usuário
      await tx
        .update(usersTable)
        .set({
          plan: user.plan || "alpha",
          planExpiresAt: periodEnd,
          updatedAt: new Date(),
        })
        .where(eq(usersTable.id, userId));

      // Resolver inconsistência
      await tx
        .update(paymentInconsistenciesTable)
        .set({
          status: "paid",
          resolvedAt: new Date(),
          resolvedBy: session.user.id,
          resolutionNotes: notes,
          updatedAt: new Date(),
        })
        .where(eq(paymentInconsistenciesTable.id, inconsistency.id));
    });

    console.log(
      `✅ Master ${session.user.email} marcou pagamento como pago para ${user.email}`,
    );

    revalidatePath("/master/dashboard");
    revalidatePath("/master/owners");
    revalidatePath("/master/payment-inconsistencies");

    return {
      success: true,
      message: `Pagamento marcado como pago! Plano renovado por ${days} dias.`,
    };
  });

export const markPaymentAsOverdue = actionClient
  .schema(markPaymentStatusSchema)
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

    const { userId, notes } = parsedInput;

    // Buscar inconsistência
    const inconsistency = await db.query.paymentInconsistenciesTable.findFirst({
      where: eq(paymentInconsistenciesTable.userId, userId),
    });

    if (!inconsistency) {
      throw new Error("Inconsistência não encontrada");
    }

    // Marcar como inadimplente
    await db
      .update(paymentInconsistenciesTable)
      .set({
        status: "overdue",
        resolvedAt: new Date(),
        resolvedBy: session.user.id,
        resolutionNotes: notes,
        updatedAt: new Date(),
      })
      .where(eq(paymentInconsistenciesTable.id, inconsistency.id));

    // Remover plano do usuário
    await db
      .update(usersTable)
      .set({
        plan: null,
        planExpiresAt: null,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, userId));

    console.log(
      `⚠️ Master ${session.user.email} marcou pagamento como inadimplente para ${userId}`,
    );

    revalidatePath("/master/dashboard");
    revalidatePath("/master/owners");
    revalidatePath("/master/payment-inconsistencies");

    return {
      success: true,
      message: "Pagamento marcado como inadimplente. Plano removido.",
    };
  });
