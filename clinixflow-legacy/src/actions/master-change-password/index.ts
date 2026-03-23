"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { accountsTable } from "@/src/db/schema";

import { masterChangePasswordSchema } from "./schema";

export const masterChangePassword = actionClient
  .schema(masterChangePasswordSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    if (session.user.role !== "master") {
      throw new Error("Forbidden: Apenas usuário master pode alterar senhas");
    }

    const { userId, newPassword } = parsedInput;

    // Usar a API do BetterAuth para gerar o hash da senha
    const ctx = await auth.$context;
    const hashedPassword = await ctx.password.hash(newPassword);

    // Atualizar a senha na tabela accounts (credential provider)
    const result = await db
      .update(accountsTable)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(accountsTable.userId, userId))
      .returning();

    if (result.length === 0) {
      throw new Error("Conta do usuário não encontrada");
    }

    return { success: true };
  });
