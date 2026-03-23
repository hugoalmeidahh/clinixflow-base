"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import {
  paymentRequestsTable,
  paymentsTable,
  subscriptionsTable,
  usersTable,
} from "@/src/db/schema";

import { confirmPaymentSchema } from "./schema";

export const confirmPayment = actionClient
  .schema(confirmPaymentSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // TODO: Adicionar verificação de permissão (apenas admin pode confirmar)
    // Por enquanto, qualquer usuário autenticado pode confirmar (você pode ajustar depois)

    const { paymentRequestId, notes } = parsedInput;

    // Buscar payment request e subscription
    const paymentRequest = await db.query.paymentRequestsTable.findFirst({
      where: (req, { eq }) => eq(req.id, paymentRequestId),
    });

    if (!paymentRequest) {
      throw new Error("Solicitação de pagamento não encontrada");
    }

    const subscription = await db.query.subscriptionsTable.findFirst({
      where: (subs, { eq }) => eq(subs.id, paymentRequest.subscriptionId),
    });

    if (paymentRequest.status === "paid") {
      throw new Error("Pagamento já foi confirmado");
    }

    if (paymentRequest.status === "expired" || paymentRequest.status === "canceled") {
      throw new Error("Solicitação de pagamento expirada ou cancelada");
    }

    if (!subscription) {
      throw new Error("Subscription não encontrada");
    }

    const now = new Date();

    // Atualizar tudo em transação
    await db.transaction(async (tx) => {
      // Atualizar payment request
      await tx
        .update(paymentRequestsTable)
        .set({
          status: "paid",
          paidAt: now,
          updatedBy: session.user.id,
          updatedAt: now,
        })
        .where(eq(paymentRequestsTable.id, paymentRequestId));

      // Calcular próximo período baseado no planType
      let periodStart = subscription.currentPeriodStart || now;
      let periodEnd = subscription.currentPeriodEnd || now;
      
      // Se já passou o período atual, calcular próximo período
      if (periodEnd < now || !subscription.currentPeriodEnd) {
        const days = subscription.planType === "mensal" 
          ? 30 
          : subscription.planType === "semestral" 
            ? 180 
            : 365;
        periodStart = now;
        periodEnd = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      }

      // Criar registro de pagamento
      await tx.insert(paymentsTable).values({
        subscriptionId: subscription.id,
        paymentRequestId: paymentRequest.id,
        amount: paymentRequest.amount,
        paymentMethod: paymentRequest.paymentMethod,
        status: "succeeded",
        periodStart,
        periodEnd,
        paidAt: now,
        notes: notes || null,
        createdBy: session.user.id,
      });

      // Atualizar subscription
      await tx
        .update(subscriptionsTable)
        .set({
          status: "active",
          paymentStatus: "paid",
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
          updatedBy: session.user.id,
          updatedAt: now,
        })
        .where(eq(subscriptionsTable.id, subscription.id));

      // Buscar nome do plano
      const plan = await db.query.plansTable.findFirst({
        where: (plans, { eq }) => eq(plans.id, subscription.planId),
      });

      // Atualizar user
      await tx
        .update(usersTable)
        .set({
          plan: plan?.name || subscription.planId,
          planExpiresAt: periodEnd,
          updatedAt: now,
        })
        .where(eq(usersTable.id, subscription.userId));

      // Se for mensal (recorrente), criar novo payment_request para próximo mês
      if (subscription.planType === "mensal") {
        await tx.insert(paymentRequestsTable).values({
          subscriptionId: subscription.id,
          amount: subscription.amount,
          paymentMethod: subscription.paymentMethod || "pix",
          status: "pending",
          expiresAt: periodEnd, // Expira no fim do período
          createdBy: session.user.id,
        });
      }
    });

    console.log(
      `✅ Pagamento confirmado: ${paymentRequestId} para subscription ${subscription.licenseKey}`,
    );

    revalidatePath("/dashboard");
    revalidatePath("/subscription");

    return {
      success: true,
      message: "Pagamento confirmado com sucesso",
    };
  });

