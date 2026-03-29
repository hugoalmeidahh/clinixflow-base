import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import { db } from "@/src/db";
import * as schema from "@/src/db/schema";
import {
  doctorsToUsersTable,
  patientsToUsersTable,
  subscriptionsTable,
  usersTable,
  usersToClinicsTable,
} from "@/src/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  socialProviders: {
    // google: {
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    // },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      // Buscar dados do usuário e todas as clínicas
      const [userData, ownerClinics, doctorClinics, patientClinics] =
        await Promise.all([
          db.query.usersTable.findFirst({
            where: eq(usersTable.id, user.id),
          }),
          // Clínicas onde é owner/admin
          db.query.usersToClinicsTable.findMany({
            where: eq(usersToClinicsTable.userId, user.id),
            with: { clinic: true },
          }),
          // Clínicas onde é profissional
          db.query.doctorsToUsersTable.findMany({
            where: eq(doctorsToUsersTable.userId, user.id),
            with: { clinic: true, doctor: true },
          }),
          // Clínicas onde é paciente
          db.query.patientsToUsersTable.findMany({
            where: eq(patientsToUsersTable.userId, user.id),
            with: { clinic: true },
          }),
        ]);

      if (!userData) {
        throw new Error(`Usuário ${user.id} não encontrado na tabela users`);
      }

      // Todas as clínicas disponíveis para o usuário
      const allClinics = [
        ...ownerClinics.map((c) => ({
          id: c.clinicId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          name: (c.clinic as any)?.name,
          role: "owner" as const,
        })),
        ...doctorClinics.map((c) => ({
          id: c.clinicId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          name: (c.clinic as any)?.name,
          role: "doctor" as const,
        })),
        ...patientClinics.map((c) => ({
          id: c.clinicId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          name: (c.clinic as any)?.name,
          role: "patient" as const,
        })),
      ];

      // Clínica padrão (primeira da lista)
      // Master não precisa de clínica
      const defaultClinic =
        userData?.role === "master" ? undefined : allClinics[0];

      // Se for profissional, buscar o doctorId da clínica atual
      let doctorId: string | undefined;
      if (userData?.role === "doctor" && defaultClinic) {
        const doctorRelation = doctorClinics.find(
          (dc) => dc.clinicId === defaultClinic.id,
        );
        doctorId = doctorRelation?.doctorId ?? undefined;
      }

      // Se for paciente, buscar o patientId da clínica atual
      let patientId: string | undefined;
      if (userData?.role === "patient" && defaultClinic) {
        const patientRelation = patientClinics.find(
          (pc) => pc.clinicId === defaultClinic.id,
        );
        patientId = patientRelation?.patientId ?? undefined;
      }

      // Buscar subscription ativa ou pendente
      let subscription = null;
      if (userData?.subscriptionId) {
        const subscriptions = await db
          .select()
          .from(subscriptionsTable)
          .where(eq(subscriptionsTable.id, userData.subscriptionId))
          .limit(1);
        subscription = subscriptions[0] || null;
      }

      // Verificar se o plano está expirado
      const now = new Date();

      // Prioridade: subscription > planExpiresAt do user
      let planExpiresAt: Date | null = null;
      let subscriptionStatus: string | null = null;
      let hasPendingPayment = false;
      let trialEndsAt: Date | null = null;

      if (subscription) {
        subscriptionStatus = subscription.status;

        // Se está em trial (pending_payment), usar trialEndsAt
        if (
          subscription.status === "pending_payment" &&
          subscription.trialEndsAt
        ) {
          trialEndsAt = new Date(subscription.trialEndsAt);
          planExpiresAt = trialEndsAt;
          hasPendingPayment = subscription.paymentStatus === "pending";
        } else if (
          subscription.status === "active" &&
          subscription.currentPeriodEnd
        ) {
          planExpiresAt = new Date(subscription.currentPeriodEnd);
        } else if (subscription.currentPeriodEnd) {
          planExpiresAt = new Date(subscription.currentPeriodEnd);
        }
      } else if (userData?.planExpiresAt) {
        planExpiresAt = new Date(userData.planExpiresAt);
      }

      // Determinar se o plano está expirado
      let isPlanExpired = false;

      if (subscription) {
        // Se tem subscription cancelada ou expirada, está expirado
        if (["canceled", "expired"].includes(subscription.status)) {
          isPlanExpired = true;
        }
        // Se está em trial (pending_payment), verificar se o trial ainda é válido
        else if (
          subscription.status === "pending_payment" &&
          subscription.trialEndsAt
        ) {
          const trialEndDate = new Date(subscription.trialEndsAt);
          // Trial ainda válido = NÃO está expirado
          // Trial expirado = está expirado
          isPlanExpired = trialEndDate < now;
        }
        // Se tem data de expiração, verificar se passou
        else if (planExpiresAt) {
          isPlanExpired = planExpiresAt < now;
        }
      } else {
        // Se não tem subscription, verificar se tem planExpiresAt no user
        if (userData?.planExpiresAt) {
          const userPlanExpiresAt = new Date(userData.planExpiresAt);
          isPlanExpired = userPlanExpiresAt < now;
        } else {
          // Usuário novo sem subscription e sem planExpiresAt = sem plano = expirado
          isPlanExpired = true;
        }
      }

      // Verificar se está próximo de expirar (7 dias)
      const daysUntilExpiration = planExpiresAt
        ? Math.ceil(
            (planExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
          )
        : null;
      const isPlanExpiringSoon =
        !isPlanExpired &&
        (userData?.plan || subscription) &&
        daysUntilExpiration !== null &&
        daysUntilExpiration <= 7 &&
        daysUntilExpiration > 0;

      return {
        user: {
          ...user,
          plan: userData?.plan,
          planExpiresAt: planExpiresAt?.toISOString() ?? null,
          isPlanExpired,
          isPlanExpiringSoon,
          daysUntilExpiration,
          subscriptionStatus,
          hasPendingPayment,
          trialEndsAt: trialEndsAt?.toISOString() ?? null,
          role: userData?.role,
          subscriptionId: userData?.subscriptionId ?? null,
          preferredLanguage: userData?.preferredLanguage ?? null,
          // Clínica atualmente ativa (pode vir de query param ou cookie)
          clinic: defaultClinic
            ? {
                id: defaultClinic.id,
                name: defaultClinic.name,
              }
            : undefined,
          // Lista completa de clínicas
          availableClinics: allClinics,
          // ID do profissional se for doctor
          doctorId: doctorId,
          // ID do paciente se for patient
          patientId: patientId,
        },
        session,
      };
    }),
  ],
  user: {
    modelName: "usersTable",
    additionalFields: {
      // Campos de endereço
      address: {
        type: "string",
        fieldName: "address",
        required: false,
      },
      city: {
        type: "string",
        fieldName: "city",
        required: false,
      },
      state: {
        type: "string",
        fieldName: "state",
        required: false,
      },
      zipCode: {
        type: "string",
        fieldName: "zipCode",
        required: false,
      },
      // Campos de documentos
      cpf: {
        type: "string",
        fieldName: "cpf",
        required: false,
      },
      rg: {
        type: "string",
        fieldName: "rg",
        required: false,
      },
      insuranceCard: {
        type: "string",
        fieldName: "insuranceCard",
        required: false,
      },
      // Campos de contato
      phoneNumber: {
        type: "string",
        fieldName: "phoneNumber",
        required: false,
      },
      responsiblePhone: {
        type: "string",
        fieldName: "responsiblePhone",
        required: false,
      },
      // Campos de responsáveis
      motherName: {
        type: "string",
        fieldName: "motherName",
        required: false,
      },
      fatherName: {
        type: "string",
        fieldName: "fatherName",
        required: false,
      },
      // Campo de convênio
      insurance: {
        type: "string",
        fieldName: "insurance",
        required: false,
      },
      // Campos existentes
      stripeCustomerId: {
        type: "string",
        fieldName: "stripeCustomerId",
        required: false,
      },
      stripeSubscriptionId: {
        type: "string",
        fieldName: "stripeSubscriptionId",
        required: false,
      },
      plan: {
        type: "string",
        fieldName: "plan",
        required: false,
      },
    },
  },
  session: {
    modelName: "sessionsTable",
    expiresIn: 60 * 60 * 12, // 12 horas em segundos
  },
  account: {
    modelName: "accountsTable",
  },
  verification: {
    modelName: "verificationsTable",
  },
  emailAndPassword: {
    enabled: true,
  },
});
