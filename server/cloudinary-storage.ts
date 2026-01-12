// Cloudinary storage helpers for free image hosting
// Uses Cloudinary free tier: 25GB storage, 25GB bandwidth/month
// Sign up at https://cloudinary.com (free account)
// Documentation: https://cloudinary.com/documentation/image_upload

import { ENV } from "./_core/env.js";
import crypto from "crypto";

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

function getCloudinaryConfig(): CloudinaryConfig {
  const cloudName = ENV.cloudinaryCloudName;
  const apiKey = ENV.cloudinaryApiKey;
  const apiSecret = ENV.cloudinaryApiSecret;

  // Verificar credenciais faltantes e fornecer mensagem de erro precisa
  const missing: string[] = [];
  if (!cloudName || cloudName.trim() === "") {
    missing.push("CLOUDINARY_CLOUD_NAME");
  }
  if (!apiKey || apiKey.trim() === "") {
    missing.push("CLOUDINARY_API_KEY");
  }
  if (!apiSecret || apiSecret.trim() === "") {
    missing.push("CLOUDINARY_API_SECRET");
  }

  if (missing.length > 0) {
    throw new Error(
      `Credenciais do Cloudinary faltando no arquivo .env: ${missing.join(", ")}. ` +
        `Configure estas variáveis de ambiente e reinicie o servidor.`
    );
  }

  return { cloudName, apiKey, apiSecret };
}

/**
 * Generate Cloudinary signature for authenticated uploads
 */
function generateSignature(params: Record<string, string>, apiSecret: string): string {
  // Sort parameters by key
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  // Add API secret
  const stringToSign = sortedParams + apiSecret;

  // Generate SHA-1 hash
  return crypto.createHash("sha1").update(stringToSign).digest("hex");
}

/**
 * Upload image to Cloudinary using API with authentication
 */
export async function uploadToCloudinary(
  data: Buffer | Uint8Array | string,
  folder: string = "uploads",
  publicId?: string,
): Promise<{ key: string; url: string }> {
  const config = getCloudinaryConfig();
  
  // Convert to base64 if it's a Buffer or Uint8Array
  let base64Data: string;
  if (Buffer.isBuffer(data)) {
    base64Data = data.toString("base64");
  } else if (data instanceof Uint8Array) {
    base64Data = Buffer.from(data).toString("base64");
  } else {
    // Already base64 string, remove data URL prefix if present
    base64Data = data.replace(/^data:image\/\w+;base64,/, "");
  }

  // Generate unique public ID if not provided
  const finalPublicId = publicId || `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

  // Cloudinary API endpoint
  const uploadUrl = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`;

  // Prepare upload parameters
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params: Record<string, string> = {
    folder,
    public_id: finalPublicId,
    api_key: config.apiKey,
    timestamp,
  };

  // Generate signature
  const signature = generateSignature(params, config.apiSecret);

  // Create form data using URLSearchParams (works in Node.js)
  const formData = new URLSearchParams();
  formData.append("file", `data:image/jpeg;base64,${base64Data}`);
  formData.append("folder", folder);
  formData.append("public_id", finalPublicId);
  formData.append("api_key", config.apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Falha no upload para Cloudinary: ${response.status} ${response.statusText}`;
      
      // Tentar parsear resposta de erro do Cloudinary para mensagem mais clara
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          errorMessage += ` - ${errorJson.error.message}`;
        } else if (typeof errorJson.error === "string") {
          errorMessage += ` - ${errorJson.error}`;
        } else {
          errorMessage += ` - ${errorText}`;
        }
      } catch {
        // Se não for JSON, usar o texto diretamente
        if (errorText) {
          errorMessage += ` - ${errorText}`;
        }
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (!result || !result.secure_url) {
      throw new Error("Resposta inválida do Cloudinary: secure_url não encontrado na resposta");
    }

    return {
      key: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    // Se já é um erro de credenciais, propagar sem alterar
    if (error instanceof Error && error.message.includes("Credenciais do Cloudinary")) {
      throw error;
    }
    
    // Para outros erros, fornecer mensagem contextualizada
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    
    // Verificar se é erro de rede/conexão
    if (errorMessage.includes("fetch") || errorMessage.includes("network") || errorMessage.includes("ECONNREFUSED")) {
      throw new Error(
        `Falha ao conectar com Cloudinary. Verifique sua conexão com a internet e tente novamente. Detalhes: ${errorMessage}`
      );
    }
    
    throw new Error(
      `Erro ao fazer upload para Cloudinary: ${errorMessage}`
    );
  }
}

/**
 * Get Cloudinary URL (no-op, kept for compatibility)
 * Images are publicly accessible via the URL returned from upload
 */
export async function getCloudinaryUrl(publicId: string): Promise<{ key: string; url: string }> {
  const config = getCloudinaryConfig();
  
  return {
    key: publicId,
    url: `https://res.cloudinary.com/${config.cloudName}/image/upload/${publicId}`,
  };
}
