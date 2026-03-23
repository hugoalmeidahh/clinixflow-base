"use server";

import { NextResponse } from "next/server";

import { checkPaymentInconsistencies } from "@/src/actions/check-payment-inconsistencies";

/**
 * API route para verificar inconsistências de pagamento
 * Pode ser chamado manualmente ou via cron job
 */
export async function POST() {
  try {
    const result = await checkPaymentInconsistencies();

    return NextResponse.json({
      success: true,
      checked: result.checked,
      created: result.created,
      message: `Verificação concluída: ${result.created} nova(s) inconsistência(s) criada(s).`,
    });
  } catch (error) {
    console.error("❌ Erro ao verificar inconsistências:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
