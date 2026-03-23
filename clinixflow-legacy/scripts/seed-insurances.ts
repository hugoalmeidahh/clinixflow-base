import "dotenv/config";

import { Client } from "pg";

const insurances = [
  { name: "unimed", displayName: "Unimed" },
  { name: "amil", displayName: "Amil" },
  { name: "sulamerica", displayName: "SulAmérica" },
  { name: "bradesco_saude", displayName: "Bradesco Saúde" },
  { name: "porto_seguro", displayName: "Porto Seguro" },
  { name: "allianz", displayName: "Allianz" },
  { name: "hapvida", displayName: "Hapvida" },
  { name: "cassems", displayName: "Cassems" },
  { name: "santa_casa_saude", displayName: "Santa Casa Saúde" },
  { name: "particular", displayName: "Particular" },
  { name: "outros", displayName: "Outros" },
];

async function seedInsurances() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("✅ Conectado ao banco de dados");

    for (const insurance of insurances) {
      const result = await client.query(
        `INSERT INTO insurances (name, display_name, is_active)
         VALUES ($1, $2, true)
         ON CONFLICT (name) DO UPDATE
         SET display_name = EXCLUDED.display_name,
             is_active = true
         RETURNING id, name, display_name`,
        [insurance.name, insurance.displayName],
      );

      if (result.rows[0]) {
        console.log(
          `✅ Convênio "${insurance.displayName}" (${insurance.name}) criado/atualizado`,
        );
      }
    }

    console.log("\n🎉 Seed de convênios concluído!");
  } catch (error) {
    console.error("❌ Erro ao fazer seed de convênios:", error);
    throw error;
  } finally {
    await client.end();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedInsurances()
    .then(() => {
      console.log("✅ Processo concluído!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Erro fatal:", error);
      process.exit(1);
    });
}

export { seedInsurances };
