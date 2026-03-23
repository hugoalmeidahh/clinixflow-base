import { and, eq, isNotNull, lt } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/src/db";
import { usersTable } from "@/src/db/schema";

export async function POST() {
  try {
    console.log("🔧 Iniciando limpeza de planos expirados...");

    // Buscar usuários com planos expirados (qualquer tipo de plano)
    const expiredUsers = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        plan: usersTable.plan,
        planExpiresAt: usersTable.planExpiresAt,
        activatedByCode: usersTable.activatedByCode,
      })
      .from(usersTable)
      .where(
        and(
          isNotNull(usersTable.plan),
          isNotNull(usersTable.planExpiresAt),
          lt(usersTable.planExpiresAt, new Date()),
        ),
      );

    console.log(
      `🔧 Encontrados ${expiredUsers.length} usuários com planos expirados`,
    );

    if (expiredUsers.length === 0) {
      return NextResponse.json({
        success: true,
        found: 0,
        cleaned: 0,
        message: "✅ Nenhum plano expirado encontrado",
      });
    }

    // Limpar planos expirados
    let cleaned = 0;
    for (const user of expiredUsers) {
      await db
        .update(usersTable)
        .set({
          plan: null,
          planExpiresAt: null,
          activatedByCode: null,
          updatedAt: new Date(),
        })
        .where(eq(usersTable.id, user.id));

      console.log(
        `🧹 Limpo plano expirado do usuário: ${user.email} (ativado por: ${user.activatedByCode})`,
      );
      cleaned++;
    }

    return NextResponse.json({
      success: true,
      found: expiredUsers.length,
      cleaned,
      message: `✅ Limpeza concluída: ${cleaned} planos expirados removidos`,
      details: expiredUsers.map((user) => ({
        email: user.email,
        activatedByCode: user.activatedByCode,
        expiredAt: user.planExpiresAt,
      })),
    });
  } catch (error) {
    console.error("❌ Erro na limpeza de planos expirados:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
