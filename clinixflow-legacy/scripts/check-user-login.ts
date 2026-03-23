/**
 * Script para verificar problemas de login de usuários
 * 
 * Uso: npx tsx scripts/check-user-login.ts <email>
 * Exemplo: npx tsx scripts/check-user-login.ts pls.amanda@clinixflow.local
 */

import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { accountsTable, usersTable, doctorsTable, doctorsToUsersTable } from "../src/db/schema";

async function checkUserLogin(email: string) {
  console.log(`\n🔍 Verificando login para: ${email}\n`);

  // 1. Buscar usuário pelo email
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
  });

  if (!user) {
    console.error("❌ Usuário não encontrado no banco de dados!");
    console.log("\n📋 Verificando usuários similares...");
    const similarUsers = await db.query.usersTable.findMany({
      where: (users, { like }) => like(users.email, `%${email.split("@")[0]}%`),
      limit: 10,
    });
    if (similarUsers.length > 0) {
      console.log("\nUsuários encontrados com email similar:");
      similarUsers.forEach((u) => {
        console.log(`  - ${u.email} (ID: ${u.id}, Role: ${u.role})`);
      });
    }
    return;
  }

  console.log("✅ Usuário encontrado:");
  console.log(`   ID: ${user.id}`);
  console.log(`   Nome: ${user.name}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Role: ${user.role}`);
  console.log(`   Email verificado: ${user.emailVerified}`);

  // 2. Buscar conta (account) com senha
  const account = await db.query.accountsTable.findFirst({
    where: (accounts, { and, eq: eqFn }) =>
      and(
        eqFn(accounts.userId, user.id),
        eqFn(accounts.providerId, "credential")
      ),
  });

  if (!account) {
    console.error("\n❌ Conta (account) não encontrada!");
    console.log("\n📋 Verificando todas as contas do usuário...");
    const allAccounts = await db.query.accountsTable.findMany({
      where: eq(accountsTable.userId, user.id),
    });
    if (allAccounts.length > 0) {
      console.log("\nContas encontradas:");
      allAccounts.forEach((acc) => {
        console.log(`  - Provider: ${acc.providerId}`);
        console.log(`    Account ID: ${acc.accountId}`);
        console.log(`    Tem senha: ${acc.password ? "Sim (hash)" : "Não"}`);
        console.log(`    Criado em: ${acc.createdAt}`);
      });
    } else {
      console.log("  Nenhuma conta encontrada!");
      console.log("\n💡 SOLUÇÃO: A conta precisa ser criada novamente.");
      console.log("   Execute: npm run db:studio");
      console.log("   Ou recrie o profissional com 'Criar conta' marcado.");
    }
    return;
  }

  console.log("\n✅ Conta (account) encontrada:");
  console.log(`   Provider ID: ${account.providerId}`);
  console.log(`   Account ID: ${account.accountId}`);
  console.log(`   Tem senha: ${account.password ? "Sim (hash armazenado)" : "Não (PROBLEMA!)"}`);
  console.log(`   Criado em: ${account.createdAt}`);

  if (!account.password) {
    console.error("\n❌ PROBLEMA ENCONTRADO: A conta não tem senha armazenada!");
    console.log("\n💡 SOLUÇÃO:");
    console.log("   1. Recrie o profissional com 'Criar conta' marcado");
    console.log("   2. Ou use o reset de senha do Better Auth");
    return;
  }

  // 3. Verificar se o profissional está vinculado
  const doctorRelation = await db.query.doctorsToUsersTable.findFirst({
    where: eq(doctorsToUsersTable.userId, user.id),
    with: { doctor: true },
  });

  if (doctorRelation) {
    console.log("\n✅ Profissional vinculado:");
    console.log(`   Doctor ID: ${doctorRelation.doctorId}`);
    console.log(`   Nome: ${doctorRelation.doctor?.name}`);
    console.log(`   Email: ${doctorRelation.doctor?.email}`);
    console.log(`   Código: ${doctorRelation.doctor?.doctorCode}`);
  } else {
    console.log("\n⚠️  Profissional não está vinculado ao usuário");
  }

  // 4. Resumo
  console.log("\n📊 RESUMO:");
  console.log(`   ✅ Usuário existe: Sim`);
  console.log(`   ✅ Email verificado: ${user.emailVerified ? "Sim" : "Não"}`);
  console.log(`   ✅ Conta existe: ${account ? "Sim" : "Não"}`);
  console.log(`   ✅ Senha armazenada: ${account?.password ? "Sim" : "Não"}`);
  console.log(`   ✅ Profissional vinculado: ${doctorRelation ? "Sim" : "Não"}`);

  if (user.emailVerified && account?.password && doctorRelation) {
    console.log("\n✅ Tudo parece estar correto!");
    console.log("\n💡 Se ainda não consegue fazer login:");
    console.log("   1. Verifique se a senha está correta");
    console.log("   2. Verifique se está usando o email correto no login");
    console.log("   3. Tente resetar a senha");
  } else {
    console.log("\n❌ Há problemas que precisam ser corrigidos!");
  }
}

// Executar
const email = process.argv[2];
if (!email) {
  console.error("❌ Por favor, forneça um email como argumento");
  console.log("\nUso: npx tsx scripts/check-user-login.ts <email>");
  console.log("Exemplo: npx tsx scripts/check-user-login.ts pls.amanda@clinixflow.local");
  process.exit(1);
}

checkUserLogin(email)
  .then(() => {
    console.log("\n✅ Verificação concluída!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Erro ao verificar:", error);
    process.exit(1);
  });
