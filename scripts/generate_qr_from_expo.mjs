#!/usr/bin/env node
import QRCode from "qrcode";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Tenta obter a URL do Expo que está rodando
// Formato esperado: exp://192.168.x.x:8081 ou similar
let expoUrl = process.argv[2];

if (!expoUrl) {
  console.log("📱 Gerando QR code para Expo Go...");
  console.log("");
  console.log("Para gerar o QR code com a URL correta:");
  console.log("1. Execute: npx expo start --lan");
  console.log("2. Copie a URL que aparece (ex: exp://192.168.1.100:8081)");
  console.log("3. Execute: npm run qr \"exp://192.168.1.100:8081\"");
  console.log("");
  console.log("Ou simplesmente escaneie o QR code que aparece no terminal do Expo!");
  console.log("");
  
  // Tenta detectar IP local automaticamente (Windows)
  try {
    const ipOutput = execSync("ipconfig", { encoding: "utf-8" });
    const ipMatch = ipOutput.match(/IPv4.*?(\d+\.\d+\.\d+\.\d+)/);
    if (ipMatch) {
      const localIp = ipMatch[1];
      expoUrl = `exp://${localIp}:8081`;
      console.log(`🔍 Detectado IP local: ${localIp}`);
      console.log(`📱 Gerando QR code para: ${expoUrl}`);
      console.log("");
    }
  } catch (e) {
    // Ignora erro
  }
  
  if (!expoUrl) {
    console.log("⚠️  Não foi possível detectar o IP automaticamente.");
    console.log("   Use: npm run qr \"exp://SEU_IP:8081\"");
    process.exit(1);
  }
}

try {
  const outputPath = join(__dirname, "..", "expo-qr-code.png");
  await QRCode.toFile(outputPath, expoUrl, { 
    width: 512,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF"
    }
  });
  
  console.log(`✅ QR code salvo em: ${outputPath}`);
  console.log(`📱 URL: ${expoUrl}`);
  console.log("");
  console.log("Agora você pode:");
  console.log("1. Abrir o Expo Go no seu celular");
  console.log("2. Escanear este QR code");
  console.log("3. O app será carregado automaticamente!");
} catch (error) {
  console.error("❌ Erro ao gerar QR code:", error.message);
  process.exit(1);
}
