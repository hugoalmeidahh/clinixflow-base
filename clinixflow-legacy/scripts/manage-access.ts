#!/usr/bin/env node
/**
 * Script para gerenciar acesso de usuários no sistema
 * 
 * Uso:
 *   npm run access:create-code -- --code TESTE2024 --plan alpha --days 30
 *   npm run access:activate -- --email user@example.com --days 30 --plan alpha
 *   npm run access:status -- --email user@example.com
 *   npm run access:list
 *   npm run access:extend -- --email user@example.com --days 30
 *   npm run access:cleanup
 */

import "dotenv/config";

import { eq, and, isNotNull, lt, or, sql } from "drizzle-orm";
import { db } from "../src/db";
import { usersTable, activationCodesTable } from "../src/db/schema";

// Cores para output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message: string, color: keyof typeof colors = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message: string) {
  log(`❌ ${message}`, "red");
}

function success(message: string) {
  log(`✅ ${message}`, "green");
}

function info(message: string) {
  log(`ℹ️  ${message}`, "blue");
}

function warn(message: string) {
  log(`⚠️  ${message}`, "yellow");
}

// ============================================
// FUNÇÕES PRINCIPAIS
// ============================================

/**
 * Criar um novo código de ativação
 */
async function createActivationCode(
  code: string,
  plan: string,
  days: number,
): Promise<void> {
  try {
    // Verificar se código já existe
    const existing = await db
      .select()
      .from(activationCodesTable)
      .where(eq(activationCodesTable.code, code))
      .limit(1);

    if (existing.length > 0) {
      error(`Código ${code} já existe!`);
      process.exit(1);
    }

    // Criar código
    await db.insert(activationCodesTable).values({
      code: code.toUpperCase(),
      plan,
      days,
      isActive: true,
    });

    success(`Código ${code} criado com sucesso!`);
    info(`Plano: ${plan}`);
    info(`Duração: ${days} dias`);
  } catch (err) {
    error(`Erro ao criar código: ${err}`);
    process.exit(1);
  }
}

/**
 * Ativar usuário diretamente (sem código)
 */
async function activateUser(
  email: string,
  plan: string,
  days: number,
): Promise<void> {
  try {
    // Buscar usuário
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (users.length === 0) {
      error(`Usuário com email ${email} não encontrado!`);
      process.exit(1);
    }

    const user = users[0];

    // Calcular data de expiração
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    // Atualizar usuário
    await db
      .update(usersTable)
      .set({
        plan,
        planExpiresAt: expiresAt,
        activatedByCode: `MANUAL_${new Date().toISOString()}`,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, user.id));

    success(`Usuário ${email} ativado com sucesso!`);
    info(`Plano: ${plan}`);
    info(`Duração: ${days} dias`);
    info(`Expira em: ${expiresAt.toLocaleString("pt-BR")}`);
  } catch (err) {
    error(`Erro ao ativar usuário: ${err}`);
    process.exit(1);
  }
}

/**
 * Verificar status de um usuário
 */
async function checkUserStatus(email: string): Promise<void> {
  try {
    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        plan: usersTable.plan,
        planExpiresAt: usersTable.planExpiresAt,
        activatedByCode: usersTable.activatedByCode,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (users.length === 0) {
      error(`Usuário com email ${email} não encontrado!`);
      process.exit(1);
    }

    const user = users[0];
    const now = new Date();
    const isExpired = user.planExpiresAt
      ? new Date(user.planExpiresAt) < now
      : true;

    log("\n" + "=".repeat(50), "cyan");
    log("📊 STATUS DO USUÁRIO", "cyan");
    log("=".repeat(50), "cyan");
    log(`Nome: ${user.name}`);
    log(`Email: ${user.email}`);
    log(`Role: ${user.role || "N/A"}`);
    log(`Plano: ${user.plan || "Nenhum"}`);
    log(
      `Expira em: ${
        user.planExpiresAt
          ? new Date(user.planExpiresAt).toLocaleString("pt-BR")
          : "N/A"
      }`,
    );

    if (user.planExpiresAt) {
      const daysUntilExpiration = Math.ceil(
        (new Date(user.planExpiresAt).getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      if (isExpired) {
        warn(`Status: EXPIRADO (há ${Math.abs(daysUntilExpiration)} dias)`);
      } else if (daysUntilExpiration <= 7) {
        warn(`Status: EXPIRANDO EM BREVE (${daysUntilExpiration} dias)`);
      } else {
        success(`Status: ATIVO (${daysUntilExpiration} dias restantes)`);
      }
    } else {
      warn("Status: SEM PLANO");
    }

    log(`Ativado por código: ${user.activatedByCode || "N/A"}`);
    log(`Criado em: ${new Date(user.createdAt).toLocaleString("pt-BR")}`);
    log("=".repeat(50) + "\n", "cyan");
  } catch (err) {
    error(`Erro ao verificar status: ${err}`);
    process.exit(1);
  }
}

/**
 * Listar todos os usuários com planos
 */
async function listUsers(search?: string): Promise<void> {
  try {
    let users;

    if (search) {
      const searchPattern = `%${search}%`;
      users = await db
        .select({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          role: usersTable.role,
          plan: usersTable.plan,
          planExpiresAt: usersTable.planExpiresAt,
          activatedByCode: usersTable.activatedByCode,
        })
        .from(usersTable)
        .where(
          or(
            sql`${usersTable.email} ILIKE ${searchPattern}`,
            sql`${usersTable.name} ILIKE ${searchPattern}`,
          ),
        );
    } else {
      // Apenas usuários com plano
      users = await db
        .select({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          role: usersTable.role,
          plan: usersTable.plan,
          planExpiresAt: usersTable.planExpiresAt,
          activatedByCode: usersTable.activatedByCode,
        })
        .from(usersTable)
        .where(isNotNull(usersTable.plan));
    }

    if (users.length === 0) {
      warn("Nenhum usuário encontrado!");
      return;
    }

    const now = new Date();

    log("\n" + "=".repeat(80), "cyan");
    log("📋 LISTA DE USUÁRIOS", "cyan");
    log("=".repeat(80), "cyan");
    log(
      `${"Nome".padEnd(30)} ${"Email".padEnd(30)} ${"Plano".padEnd(15)} ${"Status".padEnd(20)}`,
      "cyan",
    );
    log("-".repeat(80), "cyan");

    for (const user of users) {
      const isExpired = user.planExpiresAt
        ? new Date(user.planExpiresAt) < now
        : !user.plan;

      let status = "SEM PLANO";
      let statusColor: keyof typeof colors = "yellow";

      if (user.plan && user.planExpiresAt) {
        const daysUntilExpiration = Math.ceil(
          (new Date(user.planExpiresAt).getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        if (isExpired) {
          status = `EXPIRADO (${Math.abs(daysUntilExpiration)}d)`;
          statusColor = "red";
        } else if (daysUntilExpiration <= 7) {
          status = `EXPIRA EM ${daysUntilExpiration}d`;
          statusColor = "yellow";
        } else {
          status = `ATIVO (${daysUntilExpiration}d)`;
          statusColor = "green";
        }
      }

      const name = (user.name || "N/A").substring(0, 28).padEnd(30);
      const email = (user.email || "N/A").substring(0, 28).padEnd(30);
      const plan = (user.plan || "N/A").padEnd(15);

      log(`${name} ${email} ${plan} `, "reset");
      log(`  ${status}`, statusColor);
    }

    log("=".repeat(80) + "\n", "cyan");
  } catch (err) {
    error(`Erro ao listar usuários: ${err}`);
    process.exit(1);
  }
}

/**
 * Estender/renovar plano de um usuário
 */
async function extendUserPlan(
  email: string,
  days: number,
  renew: boolean = false,
): Promise<void> {
  try {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (users.length === 0) {
      error(`Usuário com email ${email} não encontrado!`);
      process.exit(1);
    }

    const user = users[0];

    if (!user.plan) {
      error(`Usuário ${email} não possui plano ativo!`);
      info("Use 'activate' para ativar um plano primeiro.");
      process.exit(1);
    }

    // Calcular nova data de expiração
    let newExpiresAt: Date;
    if (renew) {
      // Renovar a partir de hoje
      newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + days);
    } else {
      // Estender a partir da data atual de expiração
      const currentExpiresAt = user.planExpiresAt
        ? new Date(user.planExpiresAt)
        : new Date();
      newExpiresAt = new Date(currentExpiresAt);
      newExpiresAt.setDate(newExpiresAt.getDate() + days);
    }

    // Atualizar usuário
    await db
      .update(usersTable)
      .set({
        planExpiresAt: newExpiresAt,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, user.id));

    success(`Plano do usuário ${email} ${renew ? "renovado" : "estendido"}!`);
    info(`Nova data de expiração: ${newExpiresAt.toLocaleString("pt-BR")}`);
  } catch (err) {
    error(`Erro ao estender plano: ${err}`);
    process.exit(1);
  }
}

/**
 * Limpar planos expirados
 */
async function cleanupExpiredPlans(): Promise<void> {
  try {
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

    if (expiredUsers.length === 0) {
      success("Nenhum plano expirado encontrado!");
      return;
    }

    info(`Encontrados ${expiredUsers.length} planos expirados`);

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

      log(
        `  🧹 Limpo plano de ${user.email} (ativado por: ${user.activatedByCode})`,
        "yellow",
      );
      cleaned++;
    }

    success(`Limpeza concluída: ${cleaned} planos expirados removidos`);
  } catch (err) {
    error(`Erro ao limpar planos: ${err}`);
    process.exit(1);
  }
}

/**
 * Listar códigos de ativação
 */
async function listActivationCodes(): Promise<void> {
  try {
    const codes = await db
      .select()
      .from(activationCodesTable)
      .orderBy(activationCodesTable.createdAt);

    if (codes.length === 0) {
      warn("Nenhum código de ativação encontrado!");
      return;
    }

    log("\n" + "=".repeat(80), "cyan");
    log("🔑 CÓDIGOS DE ATIVAÇÃO", "cyan");
    log("=".repeat(80), "cyan");
    log(
      `${"Código".padEnd(20)} ${"Plano".padEnd(15)} ${"Dias".padEnd(10)} ${"Status".padEnd(15)} ${"Usado por".padEnd(30)}`,
      "cyan",
    );
    log("-".repeat(80), "cyan");

    for (const code of codes) {
      const status = code.isActive
        ? code.usedBy
          ? "USADO"
          : "DISPONÍVEL"
        : "INATIVO";
      const statusColor = code.isActive
        ? code.usedBy
          ? "red"
          : "green"
        : "yellow";

      const codeStr = code.code.padEnd(20);
      const planStr = code.plan.padEnd(15);
      const daysStr = code.days.toString().padEnd(10);
      const statusStr = status.padEnd(15);
      const usedByStr = code.usedBy ? code.usedBy.substring(0, 28) : "-";

      log(`${codeStr} ${planStr} ${daysStr} `, "reset");
      log(`  ${statusStr} ${usedByStr}`, statusColor);
    }

    log("=".repeat(80) + "\n", "cyan");
  } catch (err) {
    error(`Erro ao listar códigos: ${err}`);
    process.exit(1);
  }
}

// ============================================
// CLI
// ============================================

function showHelp() {
  log("\n📖 GERENCIADOR DE ACESSO - ClinixFlow\n", "cyan");
  log("Uso: npm run access:<comando> [opções]\n");
  log("Comandos disponíveis:\n");
  log("  create-code     Criar um novo código de ativação");
  log("    --code        Código (ex: TESTE2024)");
  log("    --plan        Plano (ex: alpha, beta_partner)");
  log("    --days        Duração em dias\n");
  log("  activate        Ativar usuário diretamente");
  log("    --email       Email do usuário");
  log("    --plan        Plano (ex: alpha, beta_partner)");
  log("    --days        Duração em dias\n");
  log("  status          Verificar status de um usuário");
  log("    --email       Email do usuário\n");
  log("  list            Listar todos os usuários com planos");
  log("    --search      (opcional) Buscar por email ou nome\n");
  log("  extend          Estender plano de um usuário");
  log("    --email       Email do usuário");
  log("    --days        Dias a adicionar");
  log("    --renew       (opcional) Renovar a partir de hoje\n");
  log("  cleanup         Limpar planos expirados\n");
  log("  codes           Listar códigos de ativação\n");
  log("\nExemplos:\n");
  log("  npm run access:create-code -- --code TESTE2024 --plan alpha --days 30");
  log("  npm run access:activate -- --email user@example.com --plan alpha --days 30");
  log("  npm run access:status -- --email user@example.com");
  log("  npm run access:list");
  log("  npm run access:extend -- --email user@example.com --days 30");
  log("  npm run access:cleanup");
  log("  npm run access:codes\n");
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  // Parse arguments
  const parseArgs = (args: string[]) => {
    const parsed: Record<string, string | boolean> = {};
    for (let i = 0; i < args.length; i++) {
      if (args[i].startsWith("--")) {
        const key = args[i].substring(2);
        const value = args[i + 1];
        if (value && !value.startsWith("--")) {
          parsed[key] = value;
          i++;
        } else {
          parsed[key] = true;
        }
      }
    }
    return parsed;
  };

  const options = parseArgs(args.slice(1));

  if (options.help || options.h || !command) {
    showHelp();
    process.exit(0);
  }

  try {
    switch (command) {
      case "create-code": {
        const code = options.code as string;
        const plan = options.plan as string;
        const days = parseInt(options.days as string, 10);

        if (!code || !plan || !days) {
          error("Faltam argumentos: --code, --plan e --days são obrigatórios");
          showHelp();
          process.exit(1);
        }

        await createActivationCode(code, plan, days);
        break;
      }

      case "activate": {
        const email = options.email as string;
        const plan = options.plan as string;
        const days = parseInt(options.days as string, 10);

        if (!email || !plan || !days) {
          error("Faltam argumentos: --email, --plan e --days são obrigatórios");
          showHelp();
          process.exit(1);
        }

        await activateUser(email, plan, days);
        break;
      }

      case "status": {
        const email = options.email as string;

        if (!email) {
          error("Falta argumento: --email é obrigatório");
          showHelp();
          process.exit(1);
        }

        await checkUserStatus(email);
        break;
      }

      case "list": {
        const search = options.search as string | undefined;
        await listUsers(search);
        break;
      }

      case "extend": {
        const email = options.email as string;
        const days = parseInt(options.days as string, 10);
        const renew = options.renew === true;

        if (!email || !days) {
          error("Faltam argumentos: --email e --days são obrigatórios");
          showHelp();
          process.exit(1);
        }

        await extendUserPlan(email, days, renew);
        break;
      }

      case "cleanup": {
        await cleanupExpiredPlans();
        break;
      }

      case "codes": {
        await listActivationCodes();
        break;
      }

      default:
        error(`Comando desconhecido: ${command}`);
        showHelp();
        process.exit(1);
    }

    process.exit(0);
  } catch (err) {
    error(`Erro: ${err}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
