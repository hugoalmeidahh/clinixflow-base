#!/usr/bin/env node
/**
 * Script para criar usuário master no sistema
 * 
 * Uso:
 *   npm run create:master
 * 
 * Ou execute diretamente:
 *   npx tsx scripts/create-master-user.ts
 */

import "dotenv/config";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";

import { db } from "../src/db";
import * as schema from "../src/db/schema";
import { usersTable } from "../src/db/schema";

// Configurar auth igual ao lib/auth.ts mas sem customSession (não precisa para criar usuário)
const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  user: {
    modelName: "usersTable",
  },
  session: {
    modelName: "sessionsTable",
  },
  account: {
    modelName: "accountsTable",
  },
  verification: {
    modelName: "verificationsTable",
  },
  emailAndPassword: {
    enabled: true,
  },
});

async function createMasterUser() {
  try {
    const email = "HUGO.MASTER@clinixflow.com.br";
    const password = "xXPDX3lyYck-3N#42";
    const name = "Hugo Master";

    console.log("🔐 Criando usuário master...");
    console.log(`Email: ${email}`);
    console.log(`Nome: ${name}`);

    // Verificar se usuário já existe (com email exato ou similar)
    const existingUsers = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    // Também verificar se existe com @clinixflow.local (caso tenha sido criado antes)
    const existingUsersLocal = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, "HUGO.MASTER@clinixflow.local"))
      .limit(1);

    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      console.log("⚠️  Usuário já existe com este email! Atualizando para master...");
      
      // Atualizar para master
      await db
        .update(usersTable)
        .set({
          role: "master",
          name: name,
          email: email, // Garantir que o email está correto
        })
        .where(eq(usersTable.id, existingUser.id));

      console.log("✅ Usuário atualizado para master!");
      console.log(`ID: ${existingUser.id}`);
      console.log(`Email: ${email}`);
      console.log("\n📝 Credenciais de acesso:");
      console.log(`   Email: ${email}`);
      console.log(`   Senha: (já existente - use a senha atual ou redefina)`);
      return;
    }

    // Se existe com @clinixflow.local, atualizar email e role
    if (existingUsersLocal.length > 0) {
      const existingUser = existingUsersLocal[0];
      console.log("⚠️  Usuário encontrado com @clinixflow.local! Atualizando email e role...");
      
      // Atualizar email e role
      await db
        .update(usersTable)
        .set({
          email: email,
          role: "master",
          name: name,
        })
        .where(eq(usersTable.id, existingUser.id));

      console.log("✅ Usuário atualizado para master com email correto!");
      console.log(`ID: ${existingUser.id}`);
      console.log(`Email antigo: HUGO.MASTER@clinixflow.local`);
      console.log(`Email novo: ${email}`);
      console.log("\n📝 Credenciais de acesso:");
      console.log(`   Email: ${email}`);
      console.log(`   Senha: (já existente - use a senha atual ou redefina)`);
      return;
    }

    // Criar novo usuário usando BetterAuth
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    // Verificar se houve erro
    if (result && "error" in result && result.error) {
      const errorData = result.error;
      if (
        errorData &&
        typeof errorData === "object" &&
        "code" in errorData &&
        errorData.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
      ) {
        throw new Error("Este email já está em uso. Por favor, use outro email.");
      }
      const errorMessage =
        typeof errorData === "string"
          ? errorData
          : errorData &&
              typeof errorData === "object" &&
              "message" in errorData &&
              typeof errorData.message === "string"
            ? errorData.message
            : "Erro ao criar usuário. Por favor, tente novamente.";
      throw new Error(errorMessage);
    }

    if (!result || !result.user) {
      throw new Error("Falha ao criar usuário");
    }

    const userId = result.user.id;

    // Atualizar role para master
    await db
      .update(usersTable)
      .set({
        role: "master",
      })
      .where(eq(usersTable.id, userId));

    console.log("✅ Usuário master criado com sucesso!");
    console.log(`ID: ${userId}`);
    console.log(`Email: ${email}`);
    console.log(`Senha: ${password}`);
    console.log("\n📝 Credenciais de acesso:");
    console.log(`   Email: ${email}`);
    console.log(`   Senha: ${password}`);
    console.log("\n⚠️  IMPORTANTE: Guarde essas credenciais com segurança!");
  } catch (error) {
    console.error("❌ Erro ao criar usuário master:", error);
    if (error instanceof Error) {
      console.error("   Mensagem:", error.message);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  createMasterUser()
    .then(() => {
      console.log("\n✅ Processo concluído!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Erro fatal:", error);
      process.exit(1);
    });
}

export { createMasterUser };
