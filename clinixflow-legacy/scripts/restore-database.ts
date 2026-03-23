#!/usr/bin/env npx tsx

/**
 * Script TypeScript para restaurar backup do banco de dados PostgreSQL
 * 
 * Uso:
 *   npx tsx scripts/restore-database.ts <arquivo_backup>
 *   npx tsx scripts/restore-database.ts backups/backup.dump --clean
 */

import { execSync } from "child_process";
import { existsSync } from "fs";
import { config } from "dotenv";
import * as readline from "readline";

config({ path: ".env" });

interface RestoreOptions {
  clean: boolean;
  ifExists: boolean;
  verbose: boolean;
}

function parseArgs(): { backupFile: string; options: RestoreOptions } {
  const args = process.argv.slice(2);
  const options: RestoreOptions = {
    clean: false,
    ifExists: false,
    verbose: false,
  };

  let backupFile = "";

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--clean":
        options.clean = true;
        break;
      case "--if-exists":
        options.ifExists = true;
        break;
      case "--verbose":
      case "-v":
        options.verbose = true;
        break;
      case "--help":
      case "-h":
        console.log(`
Uso: npx tsx scripts/restore-database.ts <arquivo_backup> [opções]

Opções:
  --clean          Limpa objetos antes de restaurar (DROP/CREATE)
  --if-exists      Usa IF EXISTS ao limpar (mais seguro)
  -v, --verbose    Mostrar informações detalhadas
  -h, --help       Mostra esta ajuda

Exemplos:
  npx tsx scripts/restore-database.ts backups/backup_neondb_20250123_120000.dump
  npx tsx scripts/restore-database.ts backups/backup.sql --clean
  npx tsx scripts/restore-database.ts backups/backup.dump --clean --if-exists
        `);
        process.exit(0);
      default:
        if (!arg.startsWith("-")) {
          backupFile = arg;
        } else {
          console.error(`❌ Opção desconhecida: ${arg}`);
          console.error("Use --help para ver as opções disponíveis");
          process.exit(1);
        }
    }
  }

  if (!backupFile) {
    console.error("❌ Arquivo de backup não especificado");
    console.error("Uso: npx tsx scripts/restore-database.ts <arquivo_backup>");
    process.exit(1);
  }

  return { backupFile, options };
}

function checkDependencies(backupFile: string): void {
  const isCustomOrTar = backupFile.endsWith(".dump") || backupFile.endsWith(".tar");
  const command = isCustomOrTar ? "pg_restore" : "psql";

  try {
    execSync(`${command} --version`, { stdio: "ignore" });
  } catch {
    console.error(`❌ ${command} não está instalado`);
    console.error("\nInstale o PostgreSQL client tools:");
    console.error("  macOS: brew install postgresql");
    console.error("  Ubuntu/Debian: sudo apt-get install postgresql-client");
    process.exit(1);
  }
}

function getDatabaseName(databaseUrl: string): string {
  const match = databaseUrl.match(/\/([^/?]+)(\?|$)/);
  return match ? match[1] : "unknown";
}

function askConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "sim" || answer.toLowerCase() === "yes");
    });
  });
}

async function restoreBackup(
  backupFile: string,
  options: RestoreOptions
): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL não está definida no arquivo .env");
    process.exit(1);
  }

  // Verificar se arquivo existe
  if (!existsSync(backupFile)) {
    console.error(`❌ Arquivo não encontrado: ${backupFile}`);
    process.exit(1);
  }

  const dbName = getDatabaseName(databaseUrl);

  console.log("⚠️  ATENÇÃO: Esta operação irá sobrescrever dados no banco!");
  console.log(`📁 Arquivo: ${backupFile}`);
  console.log(`🗄️  Banco: ${dbName}`);
  console.log("");

  const confirmed = await askConfirmation(
    "Tem certeza que deseja continuar? (digite 'sim' para confirmar): "
  );

  if (!confirmed) {
    console.log("❌ Restauração cancelada");
    process.exit(0);
  }

  console.log("");
  console.log("🔄 Iniciando restauração...");

  const isCustom = backupFile.endsWith(".dump");
  const isTar = backupFile.endsWith(".tar");
  const isPlain = backupFile.endsWith(".sql");

  try {
    if (isCustom || isTar) {
      // Usar pg_restore para formatos custom e tar
      const restoreOptions: string[] = [];

      if (options.clean) {
        restoreOptions.push("--clean");
      }

      if (options.ifExists) {
        restoreOptions.push("--if-exists");
      }

      if (options.verbose) {
        restoreOptions.push("--verbose");
      }

      restoreOptions.push(`-d "${databaseUrl}"`);
      restoreOptions.push(`"${backupFile}"`);

      const command = `pg_restore ${restoreOptions.join(" ")}`;
      
      if (options.verbose) {
        console.log(`🔧 Comando: ${command}`);
        console.log("");
      }

      execSync(command, { stdio: "inherit" });
    } else if (isPlain) {
      // Usar psql para formato SQL
      if (options.clean) {
        console.log("⚠️  Opção --clean não é suportada para backups SQL");
      }

      const command = `psql "${databaseUrl}" -f "${backupFile}"`;
      
      if (options.verbose) {
        console.log(`🔧 Comando: ${command}`);
        console.log("");
      }

      execSync(command, { stdio: "inherit" });
    } else {
      console.error("❌ Formato de backup não reconhecido");
      console.error("Formatos suportados: .dump, .tar, .sql");
      process.exit(1);
    }

    console.log("");
    console.log("✅ Backup restaurado com sucesso!");
  } catch (error) {
    console.error("");
    console.error("❌ Erro ao restaurar backup");
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const { backupFile, options } = parseArgs();

  checkDependencies(backupFile);
  await restoreBackup(backupFile, options);
}

main().catch((error) => {
  console.error("❌ Erro inesperado:", error);
  process.exit(1);
});
