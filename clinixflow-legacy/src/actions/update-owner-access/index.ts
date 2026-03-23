"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { usersTable } from "@/src/db/schema";

import { updateOwnerAccessSchema } from "./schema";

export const updateOwnerAccess = actionClient
  .schema(updateOwnerAccessSchema)
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

    const { userId, plan, days } = parsedInput;

    // Buscar o usuário
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, userId),
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (user.role !== "clinic_owner") {
      throw new Error("Apenas owners podem ter acesso atualizado");
    }

    // Calcular data de expiração
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    // Atualizar usuário
    await db
      .update(usersTable)
      .set({
        plan,
        planExpiresAt: expiresAt,
        activatedByCode: `MASTER_${session.user.id}_${new Date().toISOString()}`,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, userId));

    console.log(
      `✅ Master ${session.user.email} atualizou acesso de ${user.email}: ${plan} por ${days} dias`,
    );

    revalidatePath("/master/owners");
    revalidatePath(`/master/owners/${userId}`);

    return {
      success: true,
      message: `Acesso atualizado com sucesso! Plano ${plan} por ${days} dias.`,
      expiresAt: expiresAt.toISOString(),
    };
  });
