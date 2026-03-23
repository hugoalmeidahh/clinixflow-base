/**
 * Script para corrigir conta de usuário sem senha
 * 
 * Uso: npx tsx scripts/fix-user-account.ts <email> <senha>
 * Exemplo: npx tsx scripts/fix-user-account.ts pls.amanda@clinixflow.local PL3N0K-3N
 * 
 * Este script:
 * 1. Verifica se o usuário existe
 * 2. Verifica se a conta existe e tem senha
 * 3. Se não tiver senha, tenta criar usando Better Auth
 */

import { eq } from "drizzle-orm";
import { auth } from "../lib/auth";
import { db } from "../src/db";
import { accountsTable, usersTable } from "../src/db/schema";

async function fixUserAccount(email: string, password: string) {
  console.log(`\n🔧 Corrigindo conta para: ${email}\n`);

  // 1. Buscar usuário
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
  });

  if (!user) {
    console.error("❌ Usuário não encontrado!");
    process.exit(1);
  }

  console.log("✅ Usuário encontrado:");
  console.log(`   ID: ${user.id}`);
  console.log(`   Nome: ${user.name}`);
  console.log(`   Email: ${user.email}`);

  // 2. Verificar conta existente
  const account = await db.query.accountsTable.findFirst({
    where: (accounts, { and, eq: eqFn }) =>
      and(
        eqFn(accounts.userId, user.id),
        eqFn(accounts.providerId, "credential")
      ),
  });

  if (account && account.password) {
    console.log("\n✅ Conta já existe e tem senha!");
    console.log("   Não é necessário corrigir.");
    return;
  }

  if (account && !account.password) {
    console.log("\n⚠️  Conta existe mas não tem senha!");
    console.log("   Tentando atualizar senha...");
  } else {
    console.log("\n⚠️  Conta não encontrada!");
    console.log("   Tentando criar conta...");
  }

  // 3. Tentar criar/atualizar usando Better Auth
  // Como o Better Auth não tem API direta para atualizar senha de outro usuário,
  // vamos tentar deletar a conta existente e criar novamente
  try {
    if (account) {
      console.log("   Removendo conta existente...");
      await db.delete(accountsTable).where(eq(accountsTable.id, account.id));
    }

    console.log("   Criando nova conta usando Better Auth...");
    
    // Usar a API do Better Auth para criar a conta
    // Como o usuário já existe, vamos tentar usar signUpEmail novamente
    // O Better Auth pode retornar erro se o usuário já existe, mas a conta deve ser criada
    const result = await auth.api.signUpEmail({
      body: {
        email: email,
        password: password,
        name: user.name,
      },
    });

    if (result && "error" in result && result.error) {
      // Se o usuário já existe, isso é esperado
      // Mas a conta deve ser criada mesmo assim
      console.log("   Usuário já existe (esperado), verificando se conta foi criada...");
    }

    // Aguardar um pouco
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verificar se a conta foi criada
    const newAccount = await db.query.accountsTable.findFirst({
      where: (accounts, { and, eq: eqFn }) =>
        and(
          eqFn(accounts.userId, user.id),
          eqFn(accounts.providerId, "credential")
        ),
    });

    if (newAccount && newAccount.password) {
      console.log("\n✅ Conta criada/atualizada com sucesso!");
      console.log(`   Account ID: ${newAccount.id}`);
      console.log(`   Senha: Hash armazenado`);
      console.log("\n✅ Agora você pode fazer login!");
    } else {
      console.error("\n❌ Não foi possível criar a conta automaticamente.");
      console.error("   Por favor, recrie o profissional com 'Criar conta' marcado.");
      process.exit(1);
    }
  } catch (error) {
    console.error("\n❌ Erro ao corrigir conta:", error);
    console.error("\n💡 SOLUÇÃO ALTERNATIVA:");
    console.error("   1. Recrie o profissional com 'Criar conta' marcado");
    console.error("   2. Ou use o reset de senha do Better Auth");
    process.exit(1);
  }
}

// Executar
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("❌ Por favor, forneça email e senha como argumentos");
  console.log("\nUso: npx tsx scripts/fix-user-account.ts <email> <senha>");
  console.log("Exemplo: npx tsx scripts/fix-user-account.ts pls.amanda@clinixflow.local PL3N0K-3N");
  process.exit(1);
}

fixUserAccount(email, password)
  .then(() => {
    console.log("\n✅ Correção concluída!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Erro:", error);
    process.exit(1);
  });
