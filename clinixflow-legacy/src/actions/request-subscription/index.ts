"use server";

import { and, eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import {
  activationCodesTable,
  paymentRequestsTable,
  plansTable,
  subscriptionsTable,
  usersTable,
} from "@/src/db/schema";

import { requestSubscriptionSchema } from "./schema";

// Função para gerar license key único
function generateLicenseKey(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `LIC-${year}-${random}`;
}

// Calcular dias baseado no tipo de plano
function getDaysForPlanType(planType: string): number {
  switch (planType) {
    case "mensal":
      return 30;
    case "semestral":
      return 180;
    case "anual":
      return 365;
    default:
      return 30;
  }
}

export const requestSubscription = actionClient
  .schema(requestSubscriptionSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // Apenas owners podem solicitar subscription
    if (session.user.role === "doctor" || session.user.role === "patient") {
      throw new Error(
        "Apenas proprietários de clínica podem solicitar licenças",
      );
    }

    const { planName, planType, paymentMethod } = parsedInput;

    console.log("📋 Solicitação de subscription:", {
      planName,
      planType,
      paymentMethod,
      userId: session.user.id,
    });

    // Para beta_trial ou beta_partner, criar plano virtual (1 dia grátis)
    const isBetaTrial = planName === "beta_trial" || planName === "beta_partner";
    
    // Buscar plano (ou criar virtual para beta)
    let plan = await db.query.plansTable.findFirst({
      where: (plans, { eq }) => eq(plans.name, planName),
    });

    // Se for beta_trial/beta_partner e não existir no banco, criar plano virtual
    if (!plan && isBetaTrial) {
      plan = {
        id: `${planName}_virtual`,
        name: planName,
        displayName: planName === "beta_partner" ? "Beta Partner" : "Beta Tester",
        description: "Experimente o ClinixFlow gratuitamente por 1 dia",
        price: 0,
        maxDoctors: 10,
        maxPatients: 50,
        isActive: true,
        isCustom: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    if (!plan) {
      console.error(`❌ Plano ${planName} não encontrado no banco`);
      throw new Error(
        `Plano ${planName} não encontrado. Execute 'npm run db:seed:plans' para popular os planos.`,
      );
    }

    console.log("✅ Plano encontrado:", {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      isActive: plan.isActive,
      isBetaTrial,
    });

    if (!plan.isActive) {
      throw new Error("Plano não está ativo");
    }

    // Verificar se usuário já tem subscription ativa ou pendente
    const existingSubscription = await db
      .select()
      .from(subscriptionsTable)
      .where(
        and(
          eq(subscriptionsTable.userId, session.user.id),
          or(
            eq(subscriptionsTable.status, "active"),
            eq(subscriptionsTable.status, "pending_payment"),
          ),
        ),
      )
      .limit(1);

    if (existingSubscription.length > 0) {
      const existing = existingSubscription[0];
      if (existing.status === "active") {
        throw new Error(
          "Você já possui uma subscription ativa. Acesse a página de assinaturas para gerenciar sua licença atual.",
        );
      }
      
      // Se for pending_payment, mostrar mensagem com contatos
      throw new Error(
        "Você já possui uma subscription pendente de pagamento. Entre em contato com nossa equipe para regularização e liberação: contato@clinixflow.com.br, financeiro@clinixflow.com.br ou (12) 98156-5612.",
      );
    }

    // Calcular valores
    // Para beta_trial, duração é sempre 1 dia
    const days = isBetaTrial ? 1 : getDaysForPlanType(planType);
    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 dia
    const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    // Calcular preço (beta_trial é gratuito)
    let amount = 0;
    
    if (!isBetaTrial) {
      if (!plan.price) {
        throw new Error(`Plano ${planName} não tem preço definido`);
      }

      amount = plan.price;
      if (plan.isCustom) {
        throw new Error("Plano customizado deve ser criado manualmente");
      }

      // Aplicar descontos por tipo
      if (planType === "semestral") {
        amount = Math.round(amount * 6 * 0.9); // 10% desconto
      } else if (planType === "anual") {
        amount = Math.round(amount * 12 * 0.8); // 20% desconto
      }
    }

    // Gerar license key único
    let licenseKey = generateLicenseKey();
    let keyExists = true;
    while (keyExists) {
      const existing = await db.query.subscriptionsTable.findFirst({
        where: (subs, { eq }) => eq(subs.licenseKey, licenseKey),
      });
      if (!existing) {
        keyExists = false;
      } else {
        licenseKey = generateLicenseKey();
      }
    }

    // Criar subscription e payment request em transação
    let result;
    try {
      result = await db.transaction(async (tx) => {
        // Para beta_trial/beta_partner, precisamos buscar ou criar o plano no banco
        let planId = plan.id;
        if (isBetaTrial && plan.id.endsWith("_virtual")) {
          // Buscar se existe plano no banco
          const existingPlan = await tx.query.plansTable.findFirst({
            where: (plans, { eq }) => eq(plans.name, planName),
          });
          
          if (existingPlan) {
            planId = existingPlan.id;
          } else {
            // Criar o plano no banco
            const [newPlan] = await tx
              .insert(plansTable)
              .values({
                name: planName,
                displayName: planName === "beta_partner" ? "Beta Partner" : "Beta Tester",
                description: "Experimente o ClinixFlow gratuitamente por 1 dia",
                price: 0,
                maxDoctors: 10,
                maxPatients: 50,
                isActive: true,
                isCustom: false,
              })
              .returning();
            planId = newPlan.id;
          }
        }

        // Criar subscription
        // Beta trial é criado como "active" (gratuito), outros como "pending_payment"
        const [subscription] = await tx
          .insert(subscriptionsTable)
          .values({
            userId: session.user.id,
            licenseKey,
            planId,
            planType,
            status: isBetaTrial ? "active" : "pending_payment",
            trialEndsAt,
            currentPeriodStart: now,
            currentPeriodEnd: expiresAt,
            amount,
            paymentMethod,
            paymentStatus: isBetaTrial ? "completed" : "pending",
            createdBy: session.user.id,
          })
          .returning();

        if (!subscription) {
          throw new Error("Falha ao criar subscription");
        }

        // Criar payment request apenas para planos pagos
        let paymentRequest = null;
        if (!isBetaTrial) {
          const paymentRequestExpiresAt = new Date(
            now.getTime() + 24 * 60 * 60 * 1000,
          ); // 1 dia

          const [pr] = await tx
            .insert(paymentRequestsTable)
            .values({
              subscriptionId: subscription.id,
              amount,
              paymentMethod,
              status: "pending",
              expiresAt: paymentRequestExpiresAt,
              createdBy: session.user.id,
            })
            .returning();

          if (!pr) {
            throw new Error("Falha ao criar payment request");
          }
          paymentRequest = pr;
        }

        // Criar activation code automaticamente vinculado à subscription
        // Usar o licenseKey como código de ativação
        try {
          await tx.insert(activationCodesTable).values({
            code: licenseKey, // Usar o mesmo licenseKey como código
            plan: planName,
            days: days,
            isActive: true,
            usedBy: session.user.id,
            usedAt: now,
            subscriptionId: subscription.id, // Vincular com subscription
          });
        } catch (activationError: unknown) {
          console.error("Erro ao criar activation code:", activationError);
          // Se der erro por constraint (código duplicado), tentar sem subscriptionId
          if (
            activationError &&
            typeof activationError === "object" &&
            "code" in activationError &&
            activationError.code === "23505"
          ) {
            await tx.insert(activationCodesTable).values({
              code: licenseKey,
              plan: planName,
              days: days,
              isActive: true,
              usedBy: session.user.id,
              usedAt: now,
              // subscriptionId pode ser null se já existir
            });
          } else {
            throw activationError;
          }
        }

        // Atualizar user
        await tx
          .update(usersTable)
          .set({
            subscriptionId: subscription.id,
            plan: planName,
            planExpiresAt: expiresAt, // Usar data completa do período
            activatedByCode: licenseKey, // Guardar o código usado
            updatedAt: new Date(),
          })
          .where(eq(usersTable.id, session.user.id));

        return { subscription, paymentRequest, activationCode: licenseKey };
      });
    } catch (error: unknown) {
      console.error("Erro na transação:", error);
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Erro ao processar assinatura. Verifique os logs do servidor.";
      console.error("Detalhes do erro:", {
        message: errorMessage,
        code:
          error && typeof error === "object" && "code" in error
            ? error.code
            : undefined,
        detail:
          error && typeof error === "object" && "detail" in error
            ? error.detail
            : undefined,
        constraint:
          error && typeof error === "object" && "constraint" in error
            ? error.constraint
            : undefined,
      });
      throw new Error(errorMessage);
    }

    console.log(
      `✅ Subscription solicitada: ${licenseKey} para usuário ${session.user.email}`,
    );

    revalidatePath("/dashboard");
    revalidatePath("/subscription/checkout");
    revalidatePath("/new-subscription");
    revalidatePath("/license-expired");
    revalidatePath("/", "layout"); // Revalidar layout raiz para atualizar sessão

    return {
      success: true,
      subscriptionId: result.subscription.id,
      licenseKey: result.subscription.licenseKey,
      paymentRequestId: result.paymentRequest?.id ?? null,
      amount,
      trialEndsAt,
      expiresAt,
      isBetaTrial,
    };
  });
