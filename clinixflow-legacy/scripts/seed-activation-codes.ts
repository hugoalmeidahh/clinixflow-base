import "dotenv/config";

import { eq } from "drizzle-orm";

import { db } from "../src/db";
import { activationCodesTable } from "../src/db/schema";

// Códigos de ativação iniciais
const INITIAL_CODES = [
  { code: "BETA_PARTNER_2026", plan: "beta_partner", days: 1 },
];

async function seedActivationCodes() {
  try {
    for (const codeData of INITIAL_CODES) {
      const existing = await db
        .select()
        .from(activationCodesTable)
        .where(eq(activationCodesTable.code, codeData.code))
        .limit(1);

      if (existing.length > 0) {
        console.log(`⏭️  Código ${codeData.code} já existe, pulando...`);
        continue;
      }

      // Inserir código
      await db.insert(activationCodesTable).values({
        code: codeData.code,
        plan: codeData.plan,
        days: codeData.days,
        isActive: true,
      });

    }

  } catch (error) {
    throw error;
  }
}

if (require.main === module) {
  seedActivationCodes()
    .then(() => {
      console.log("✅ Processo concluído!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Erro fatal:", error);
      process.exit(1);
    });
}

export { seedActivationCodes };

