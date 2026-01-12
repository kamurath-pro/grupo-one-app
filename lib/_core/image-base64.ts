import { Platform } from "react-native";
import { File } from "expo-file-system";

type Params = {
  uri: string;
  mimeType?: string;
};

/**
 * Normaliza mimeType para garantir formato válido: image/<subtype>
 * Onde <subtype> é compatível com regex \w+ (sem caracteres especiais)
 */
function normalizeMimeType(input?: string | null): string {
  if (!input) return "image/jpeg";

  const normalized = input.toLowerCase().trim();

  // Se não começa com "image/", assume jpeg
  if (!normalized.startsWith("image/")) return "image/jpeg";

  const subtype = normalized.split("/")[1];
  if (!subtype) return "image/jpeg";

  // Normaliza aliases comuns
  if (subtype === "jpg" || subtype === "jpeg") return "image/jpeg";
  if (subtype === "png") return "image/png";

  // Valida que subtype é compatível com \w+ (apenas letras, números, underscore)
  if (!/^\w+$/.test(subtype)) return "image/jpeg";

  return `image/${subtype}`;
}

/**
 * Detecta mimeType a partir da extensão do URI
 */
function detectMimeTypeFromUri(uri: string): string {
  const extension = uri.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    default:
      return "image/jpeg";
  }
}

/**
 * Normaliza dataUrl para garantir formato: data:image/<subtype>;base64,<payload>
 */
function normalizeDataUrl(dataUrl: string, fallbackMime: string): string {
  // Se já está no formato correto, retorna
  if (/^data:image\/\w+;base64,/.test(dataUrl)) {
    return dataUrl;
  }

  // Extrai base64 do dataUrl (pode ser data:;base64, ou data:application/octet-stream;base64,)
  const match = dataUrl.match(/^data:[^;]*;base64,(.+)$/);
  if (!match) {
    throw new Error("Formato de dataUrl inválido");
  }

  const base64 = match[1];
  return `data:${fallbackMime};base64,${base64}`;
}

export async function getImageBase64DataUrl({ uri, mimeType }: Params) {
  if (!uri) {
    throw new Error("URI da imagem inválida");
  }

  // WEB
  if (Platform.OS === "web") {
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`Falha ao carregar imagem: ${response.status}`);
      }

      const blob = await response.blob();
      const blobMime = normalizeMimeType(blob.type || mimeType);

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          if (typeof result !== "string") {
            reject(new Error("Falha ao converter imagem para base64"));
            return;
          }
          resolve(result);
        };
        reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
        reader.readAsDataURL(blob);
      });

      // Normaliza dataUrl para garantir formato correto
      const normalizedDataUrl = normalizeDataUrl(dataUrl, blobMime);

      return {
        dataUrl: normalizedDataUrl,
        mimeType: blobMime,
      };
    } catch (error) {
      throw new Error(`Erro ao processar imagem (web): ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    }
  }

  // MOBILE (Expo Go / Android / iOS) - SDK 54 API
  try {
    // Nova API SDK 54: File constructor + base64() method
    const file = new File(uri);
    
    // Verifica se arquivo existe (propriedade exists é síncrona)
    if (!file.exists) {
      throw new Error("Arquivo de imagem não encontrado");
    }

    // File.base64() retorna string base64 diretamente
    const base64 = await file.base64();

    if (!base64 || base64.trim().length === 0) {
      throw new Error("Arquivo de imagem vazio ou inválido");
    }

    // Detecta mimeType: prioriza o fornecido, depois extensão do URI, depois jpeg
    const detectedMime = normalizeMimeType(mimeType || detectMimeTypeFromUri(uri));

    return {
      dataUrl: `data:${detectedMime};base64,${base64}`,
      mimeType: detectedMime,
    };
  } catch (error) {
    if (error instanceof Error && (error.message.includes("No such file") || error.message.includes("não encontrado"))) {
      throw new Error("Arquivo de imagem não encontrado. Tente selecionar novamente.");
    }
    throw new Error(`Erro ao ler imagem (mobile): ${error instanceof Error ? error.message : "Erro desconhecido"}`);
  }
}
