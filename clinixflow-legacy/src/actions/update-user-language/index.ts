"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/src/db";
import { usersTable } from "@/src/db/schema";

const schema = z.object({
  locale: z.enum(["pt-BR", "en", "es"]),
});

export async function updateUserLanguage(locale: string) {
  const parsed = schema.safeParse({ locale });
  if (!parsed.success) return;

  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return;

    await db
      .update(usersTable)
      .set({ preferredLanguage: parsed.data.locale, updatedAt: new Date() })
      .where(eq(usersTable.id, session.user.id));
  } catch {
    // Non-critical: cookie already handles the locale for this session
  }
}
