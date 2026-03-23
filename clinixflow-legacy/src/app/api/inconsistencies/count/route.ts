import { NextResponse } from "next/server";

import { getInconsistenciesCount } from "@/src/actions/get-inconsistencies-count";

export async function GET() {
  try {
    const count = await getInconsistenciesCount();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Erro ao buscar contagem de inconsistências:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
