#!/usr/bin/env node

/**
 * Script para aplicar migrações em produção
 * Este script roda durante o build da Vercel
 */

const { execSync } = require('child_process');

async function runProductionMigrations() {
  try {
    console.log('🚀 Aplicando migrações em produção...');
    
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
    
    console.log('✅ Migrações aplicadas com sucesso em produção!');
    
  } catch (error) {
    console.error('❌ Erro ao aplicar migrações em produção:', error.message);
    process.exit(1);
  }
}

// Só executa se for em produção
if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
  runProductionMigrations();
}
