import "dotenv/config";

import { readFileSync } from "fs";
import { join } from "path";
import { Client } from "pg";

async function runMigrations() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("✅ Conectado ao banco de dados");

    // Lista de migrations para executar (em ordem)
    const migrations = [
      "0011_add_subscriptions_tables.sql",
      "0012_add_subscription_id_to_activation_codes.sql",
      "0013_add_compensation_fields_and_insurance_prices.sql",
      "0014_add_new_user_roles.sql",
      "0015_add_audit_log_and_tracking_fields.sql",
      "0016_add_patient_accompaniant_and_doctor_documents.sql",
      "0017_add_doctor_specialties_and_restructure_doctors.sql",
      "0018_add_doctor_availability_by_day.sql",
      "0019_add_specialties_table.sql",
      "0020_remove_not_null_from_deprecated_doctors_fields.sql",
      "0021_create_insurances_table_and_migrate.sql",
      // "0022_remove_insurance_enum.sql", // Descomentar apenas após confirmar migração
      "0023_make_attended_nullable.sql",
      "0024_add_master_role.sql",
      "0025_add_payment_history_and_inconsistencies.sql",
      "0026_add_doctor_birth_and_opening_dates.sql",
      "0027_add_appointment_reposicao_and_atendimento_avaliacao.sql",
      "0028_add_rescheduled_fields.sql",
      "0029_add_i18n_guides_finance_inactivation.sql",
    ];

    for (const migration of migrations) {
      console.log(`\n📄 Executando migration: ${migration}`);
      const sql = readFileSync(
        join(process.cwd(), "drizzle", migration),
        "utf-8",
      );

      await client.query(sql);
      console.log(`✅ Migration ${migration} executada com sucesso!`);
    }

    console.log("\n🎉 Todas as migrations foram executadas!");
  } catch (error) {
    console.error("❌ Erro ao executar migrations:", error);
    throw error;
  } finally {
    await client.end();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log("✅ Processo concluído!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Erro fatal:", error);
      process.exit(1);
    });
}

export { runMigrations };
