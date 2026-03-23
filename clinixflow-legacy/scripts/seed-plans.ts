import "dotenv/config";

import { eq } from "drizzle-orm";

import { db } from "../src/db";
import { plansTable } from "../src/db/schema";

// Planos iniciais
const INITIAL_PLANS = [
  {
    name: "essential",
    displayName: "Essencial",
    description: "Plano ideal para profissionais autônomos ou pequenas clínicas",
    price: 8990, // R$ 89,90
    maxDoctors: 10,
    maxPatients: 50,
    isActive: true,
    isCustom: false,
  },
  {
    name: "professional",
    displayName: "Profissional",
    description: "Para clínicas em crescimento",
    price: 12990, // R$ 129,90
    maxDoctors: 20,
    maxPatients: 150,
    isActive: true,
    isCustom: false,
  },
  {
    name: "super",
    displayName: "Super",
    description: "Para grandes clínicas e redes",
    price: 18990, // R$ 189,90
    maxDoctors: 45,
    maxPatients: 500,
    isActive: true,
    isCustom: false,
  },
  {
    name: "custom",
    displayName: "Customizado",
    description: "Plano personalizado conforme necessidade",
    price: null,
    maxDoctors: null,
    maxPatients: null,
    isActive: true,
    isCustom: true,
  },
];

async function seedPlans() {
  console.log("🌱 Iniciando seed de planos...");

  try {
    for (const planData of INITIAL_PLANS) {
      // Verificar se o plano já existe
      const existing = await db
        .select()
        .from(plansTable)
        .where(eq(plansTable.name, planData.name))
        .limit(1);

      if (existing.length > 0) {
        console.log(`⏭️  Plano ${planData.name} já existe, pulando...`);
        continue;
      }

      // Inserir plano
      await db.insert(plansTable).values(planData);

      console.log(`✅ Plano ${planData.displayName} criado com sucesso!`);
    }

    console.log("🎉 Seed de planos concluído!");
  } catch (error) {
    console.error("❌ Erro ao fazer seed:", error);
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedPlans()
    .then(() => {
      console.log("✅ Processo concluído!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Erro fatal:", error);
      process.exit(1);
    });
}

export { seedPlans };

