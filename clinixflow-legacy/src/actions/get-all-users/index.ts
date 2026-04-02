"use server";

import { asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import { usersTable } from "@/src/db/schema";

const userRoles = [
  "master",
  "clinic_owner",
  "clinic_admin",
  "clinic_gestor",
  "clinic_recepcionist",
  "doctor",
  "patient",
] as const;

export const getAllUsers = actionClient
  .schema(
    z.object({
      role: z.enum(userRoles),
    }),
  )
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    if (session.user.role !== "master") {
      throw new Error("Forbidden: Apenas usuário master pode acessar");
    }

    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        plan: usersTable.plan,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.role, parsedInput.role))
      .orderBy(asc(usersTable.name));

    return users;
  });
