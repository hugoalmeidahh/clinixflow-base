#!/usr/bin/env npx tsx

/**
 * Script TypeScript para fazer backup do banco de dados PostgreSQL
 * 
 * Uso:
 *   npx tsx scripts/backup-database.ts
 *   npx tsx scripts/backup-database.ts --output ./my-backups
 *   npx tsx scripts/backup-database.ts --format plain
 *   npx tsx scripts/backup-database.ts --format custom --compress
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { config } from "dotenv";

config({ path: ".env" });

type BackupFormat = "custom" | "plain" | "tar";

interface BackupOptions {
  outputDir: string;
  format: BackupFormat;
  compress: boolean;
  verbose: boolean;
}

const DEFAULT_OPTIONS: BackupOptions = {
  outputDir: "./backups",
  format: "custom",
  compress: true,
  verbose: false,
};

function parseArgs(): Partial<BackupOptions> {
  const args = process.argv.slice(2);
  const options: Partial<BackupOptions> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--output":
      case "-o":
        options.outputDir = args[++i];
        break;
      case "--format":
      case "-f":
        options.format = args[++i] as BackupFormat;
        break;
      case "--compress":
      case "-c":
        options.compress = true;
        break;
      case "--no-compress":
        options.compress = false;
        break;
      case "--verbose":
      case "-v":
        options.verbose = true;
        break;
      case "--help":
      case "-h":
        console.log(`
Uso: npx tsx scripts/backup-database.ts [opções]

Opções:
  -o, --output DIR      Diretório onde salvar o backup (padrão: ./backups)
  -f, --format FORMAT   Formato do backup: custom, plain, tar (padrão: custom)
  -c, --compress        Comprimir backup (apenas para formato custom)
  --no-compress         Não comprimir backup
  -v, --verbose         Mostrar informações detalhadas
  -h, --help            Mostra esta ajuda

Formatos:
  custom  - Formato binário comprimido (recomendado, mais rápido)
  plain   - Formato SQL texto (legível, mais lento)
  tar     - Formato tar (intermediário)

Exemplos:
  npx tsx scripts/backup-database.ts
  npx tsx scripts/backup-database.ts --output ./my-backups
  npx tsx scripts/backup-database.ts --format plain
  npx tsx scripts/backup-database.ts --format custom --compress
        `);
        process.exit(0);
      default:
        if (arg.startsWith("-")) {
          console.error(`❌ Opção desconhecida: ${arg}`);
          console.error("Use --help para ver as opções disponíveis");
          process.exit(1);
        }
    }
  }

  return options;
}

function checkDependencies(): void {
  try {
    execSync("pg_dump --version", { stdio: "ignore" });
  } catch {
    console.error("❌ pg_dump não está instalado");
    console.error("\nInstale o PostgreSQL client tools:");
    console.error("  macOS: brew install postgresql");
    console.error("  Ubuntu/Debian: sudo apt-get install postgresql-client");
    console.error("  Windows: Instale PostgreSQL do site oficial");
    process.exit(1);
  }
}

function getDatabaseName(databaseUrl: string): string {
  const match = databaseUrl.match(/\/([^/?]+)(\?|$)/);
  return match ? match[1] : "unknown";
}

function getBackupFileName(
  dbName: string,
  format: BackupFormat,
  timestamp: string
): string {
  const extensions: Record<BackupFormat, string> = {
    custom: ".dump",
    plain: ".sql",
    tar: ".tar",
  };

  return `backup_${dbName}_${timestamp}${extensions[format]}`;
}

function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

function getFileSize(filePath: string): number {
  try {
    const { statSync } = require("fs");
    return statSync(filePath).size;
  } catch {
    return 0;
  }
}

async function createBackup(options: BackupOptions): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL não está definida no arquivo .env");
    process.exit(1);
  }

  // Criar diretório de backup se não existir
  if (!existsSync(options.outputDir)) {
    mkdirSync(options.outputDir, { recursive: true });
  }

  const dbName = getDatabaseName(databaseUrl);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const backupFileName = getBackupFileName(dbName, options.format, timestamp);
  const backupFilePath = join(options.outputDir, backupFileName);

  console.log("🔄 Iniciando backup do banco de dados...");
  console.log(`📁 Diretório: ${options.outputDir}`);
  console.log(`📄 Arquivo: ${backupFileName}`);
  console.log(`🔧 Formato: ${options.format}`);
  console.log("");

  // Preparar comando pg_dump
  const dumpOptions: string[] = [];

  switch (options.format) {
    case "custom":
      dumpOptions.push("-Fc"); // Formato custom (binário comprimido)
      break;
    case "plain":
      dumpOptions.push("-Fp"); // Formato plain (SQL texto)
      break;
    case "tar":
      dumpOptions.push("-Ft"); // Formato tar
      break;
  }

  if (options.verbose) {
    dumpOptions.push("-v");
  }

  if (options.compress && options.format === "custom") {
    dumpOptions.push("--compress=9"); // Máxima compressão
  }

  dumpOptions.push(`-f "${backupFilePath}"`);

  try {
    const command = `pg_dump "${databaseUrl}" ${dumpOptions.join(" ")}`;
    
    if (options.verbose) {
      console.log(`🔧 Comando: ${command}`);
      console.log("");
    }

    execSync(command, { stdio: "inherit" });

    const fileSize = getFileSize(backupFilePath);
    const formattedSize = formatFileSize(fileSize);

    console.log("");
    console.log("✅ Backup criado com sucesso!");
    console.log(`📦 Arquivo: ${backupFilePath}`);
    console.log(`📊 Tamanho: ${formattedSize}`);
    console.log("");
    console.log("💡 Para restaurar, use:");
    console.log(`   ./scripts/restore-database.sh ${backupFilePath}`);
    console.log(`   ou: npx tsx scripts/restore-database.ts ${backupFilePath}`);
  } catch (error) {
    console.error("");
    console.error("❌ Erro ao criar backup");
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const userOptions = parseArgs();
  const options: BackupOptions = { ...DEFAULT_OPTIONS, ...userOptions };

  // Validar formato
  if (options.format && !["custom", "plain", "tar"].includes(options.format)) {
    console.error(`❌ Formato inválido: ${options.format}`);
    console.error("Formatos válidos: custom, plain, tar");
    process.exit(1);
  }

  checkDependencies();
  await createBackup(options);
}

main().catch((error) => {
  console.error("❌ Erro inesperado:", error);
  process.exit(1);
});
