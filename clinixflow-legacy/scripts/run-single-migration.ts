import "dotenv/config";

import { readFileSync } from "fs";
import { join } from "path";
import { Client } from "pg";

async function runSingleMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("✅ Conectado ao banco de dados");

    const migration = "0026_add_doctor_birth_and_opening_dates.sql";
    console.log(`\n📄 Executando migration: ${migration}`);
    
    const sql = readFileSync(
      join(process.cwd(), "drizzle", migration),
      "utf-8",
    );

    await client.query(sql);
    console.log(`✅ Migration ${migration} executada com sucesso!`);
    console.log("\n🎉 Migration concluída!");
  } catch (error) {
    console.error("❌ Erro ao executar migration:", error);
    throw error;
  } finally {
    await client.end();
  }
}

runSingleMigration()
  .then(() => {
    console.log("✅ Processo concluído!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erro fatal:", error);
    process.exit(1);
  });
