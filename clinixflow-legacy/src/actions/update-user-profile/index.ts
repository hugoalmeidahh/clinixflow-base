"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { usersTable } from "@/src/db/schema";

import { updateUserProfileSchema } from "./schema";

export const updateUserProfile = actionClient
  .schema(updateUserProfileSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // Atualizar o perfil do usuário
    await db
      .update(usersTable)
      .set({
        ...parsedInput,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, session.user.id));

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
    };
  });
