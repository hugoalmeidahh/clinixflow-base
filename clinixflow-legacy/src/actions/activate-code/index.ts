"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import {
  activationCodesTable,
  usersTable,
} from "@/src/db/schema";

import { activateCodeSchema } from "./schema";

export const activateCode = actionClient
  .schema(activateCodeSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const { code } = parsedInput;

    // Buscar código no banco de dados
    const activationCode = await db.query.activationCodesTable.findFirst({
      where: (codes, { eq, and, isNull }) =>
        and(
          eq(codes.code, code),
          eq(codes.isActive, true),
          isNull(codes.usedBy),
        ),
    });

    if (!activationCode) {
      throw new Error("Código de ativação inválido ou já utilizado");
    }

    // Verificar se o código já foi usado
    if (activationCode.usedBy) {
      throw new Error("Este código de ativação já foi utilizado");
    }

    // Calcular data de expiração
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + activationCode.days);

    // Ativar o plano do usuário e marcar código como usado
    await db.transaction(async (tx) => {
      // Atualizar usuário
      await tx
        .update(usersTable)
        .set({
          plan: activationCode.plan,
          planExpiresAt: expiresAt,
          activatedByCode: code,
          updatedAt: new Date(),
        })
        .where(eq(usersTable.id, session.user.id));

      // Marcar código como usado
      await tx
        .update(activationCodesTable)
        .set({
          usedBy: session.user.id,
          usedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(activationCodesTable.id, activationCode.id));
    });

    console.log(
      `✅ Usuário ${session.user.email} ativado com código ${code} por ${activationCode.days} dias`,
    );

    revalidatePath("/dashboard");
    revalidatePath("/new-subscription");
    revalidatePath("/license-expired");
    revalidatePath("/", "layout"); // Revalidar layout raiz para atualizar sessão

    return {
      success: true,
      plan: activationCode.plan,
      expiresAt,
      days: activationCode.days,
    };
  });
