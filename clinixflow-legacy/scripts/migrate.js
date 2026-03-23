#!/usr/bin/env node

/**
 * Script para aplicar migrações do Drizzle em produção
 * Este script é executado durante o build na Vercel
 */

const { execSync } = require('child_process');
const path = require('path');

async function runMigrations() {
  try {
    console.log('🚀 Iniciando aplicação de migrações...');
    
    // Verificar se DATABASE_URL está definida
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL não está definida');
      process.exit(1);
    }
    
    console.log('📊 Aplicando migrações com drizzle-kit push...');
    
    // Executar drizzle-kit push
    execSync('npx drizzle-kit push', {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL
      }
    });
    
    console.log('✅ Migrações aplicadas com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao aplicar migrações:', error.message);
    
    // Em produção, não falhamos o build se as migrações falharem
    // Isso permite que o app seja deployado mesmo com problemas de migração
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️ Continuando o build mesmo com erro de migração...');
      process.exit(0);
    } else {
      process.exit(1);
    }
  }
}

runMigrations();
