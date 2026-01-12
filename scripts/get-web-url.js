#!/usr/bin/env node
/**
 * Script para obter URL de acesso ao app web
 * 
 * Uso:
 *   node scripts/get-web-url.js [ambiente]
 * 
 * Ambientes:
 *   dev     - URL de desenvolvimento (localhost:8081)
 *   local   - URL local (http://localhost:8081)
 *   preview - URL de preview (se configurado)
 *   prod    - URL de produção (requer EXPO_PUBLIC_WEB_URL)
 */

const args = process.argv.slice(2);
const env = args[0] || "dev";

const config = {
  name: "Grupo ONE",
  slug: "grupo-one-app",
  port: 8081,
};

function getWebUrl() {
  switch (env) {
    case "local":
    case "dev":
      return `http://localhost:${config.port}`;
    
    case "preview":
      // Se tiver variável de ambiente para preview
      const previewUrl = process.env.EXPO_PUBLIC_PREVIEW_URL;
      if (previewUrl) return previewUrl;
      console.warn("⚠️  EXPO_PUBLIC_PREVIEW_URL não configurado, usando localhost");
      return `http://localhost:${config.port}`;
    
    case "prod":
    case "production":
      const prodUrl = process.env.EXPO_PUBLIC_WEB_URL;
      if (prodUrl) return prodUrl;
      console.warn("⚠️  EXPO_PUBLIC_WEB_URL não configurado");
      console.log("💡 Configure a variável EXPO_PUBLIC_WEB_URL para URL de produção");
      return null;
    
    default:
      console.error(`❌ Ambiente desconhecido: ${env}`);
      console.log("Ambientes disponíveis: dev, local, preview, prod");
      return null;
  }
}

const url = getWebUrl();

if (url) {
  console.log("");
  console.log("🌐 URL de Acesso ao App Web:");
  console.log("");
  console.log(`   ${url}`);
  console.log("");
  console.log("📋 Para desenvolvimento:");
  console.log(`   pnpm dev:metro:web`);
  console.log("");
  console.log("📋 Para build de produção:");
  console.log(`   npx expo export:web`);
  console.log("   (arquivos em: web-build/)");
  console.log("");
} else {
  process.exit(1);
}
