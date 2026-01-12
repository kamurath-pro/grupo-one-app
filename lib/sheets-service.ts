// Serviço de integração com Google Sheets para métricas de tráfego pago

export interface MetricasData {
  investimento: number;
  visualizacoes: number;
  alcance: number;
  engajamento: number;
  cliques: number;
  ultimaAtualizacao: Date;
}

// Mapeamento das planilhas por unidade
// IDs extraídos das URLs do UNIT_ACCESS_CONFIG em auth-context.tsx
const SHEETS_CONFIG: Record<string, string> = {
  araripina: "1XxorSEspVwY-VAa8XeR2YleixguDwGwVaumu3rQS9OI",
  serra: "1xkhRGEhHMyntv2DcGtZPovX3vAzKglqEnbIRAFPxx10",
  vitoria: "1bZYM4-lw-7TWMtNcgX1apj5jrSpR1pBPXKAVxciSOWo",
  livramento: "1NOeinp7l0oiXKb5zdjzmJ6C1YwMmwrsAqBrfGgnJ0cU",
  muriae: "12kkXFpvxDbn-iOAEph1BW6kVJCed2C41ht37rPt6ZJM",
  garanhuns: "1XPFZn437dv9wzMG7jX9kZVpPhsuzlRkWPlhmSC19DYY",
  cajazeiras: "12eWifNFUc5gVLGdPG48OUgWXzgiKnCxckNz2bXT3e_Q",
  vilhena: "19XhgdbWXFZLM3WbNASowzuBhKEhBxXHw2erhZwrHaY0",
  corumba: "1eK26sKMqm_B8jyVXBeMJ9XYp1lK94yDsI8vk4xkv95k",
  fortaleza: "197SLVpeuz1Bt3W9oLmnto_MyFU5fijUcGo-OjKzhN6c",
  macae_plaza: "1oVNAUdxSa1v-54QfAOLP7lyq0s-NYunU24sItzolrBw",
  macae_centro: "15A37s0jyQEsLK5KTlRHkOPO1Hu1Bc3l-xQV1nWUiIZM",
};

// Função para buscar dados da planilha usando a API pública do Google Sheets
export async function fetchMetricas(unidadeId: string): Promise<MetricasData | null> {
  const sheetId = SHEETS_CONFIG[unidadeId.toLowerCase()];
  
  if (!sheetId || sheetId.trim() === "") {
    console.warn("Planilha não configurada para unidade:", unidadeId);
    return null;
  }

  try {
    // Usar a API de visualização do Google Sheets (não requer autenticação para planilhas públicas)
    const url = "https://docs.google.com/spreadsheets/d/" + sheetId + "/gviz/tq?tqx=out:json&range=A2:E2";
    
    const response = await fetch(url);
    const text = await response.text();
    
    // O Google retorna JSONP, precisamos extrair o JSON
    const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
    
    if (!jsonMatch) {
      // Tentar buscar via CSV como fallback
      return await fetchMetricasCsv(sheetId);
    }

    const data = JSON.parse(jsonMatch[1]);
    
    if (data.table && data.table.rows && data.table.rows.length > 0) {
      const row = data.table.rows[0].c;
      
      return {
        investimento: parseFloat(row[0]?.v || 0),
        visualizacoes: parseInt(row[1]?.v || 0),
        alcance: parseInt(row[2]?.v || 0),
        engajamento: parseInt(row[3]?.v || 0),
        cliques: parseInt(row[4]?.v || 0),
        ultimaAtualizacao: new Date(),
      };
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar métricas:", error);
    return null;
  }
}

// Fallback: buscar via exportação CSV
async function fetchMetricasCsv(sheetId: string): Promise<MetricasData | null> {
  try {
    const csvUrl = "https://docs.google.com/spreadsheets/d/" + sheetId + "/export?format=csv&gid=0";
    
    const response = await fetch(csvUrl);
    const text = await response.text();
    
    // Parsear CSV simples
    const lines = text.trim().split("\n");
    if (lines.length < 2) return null;
    
    // Pegar a segunda linha (dados)
    const values = lines[1].split(",").map(v => v.replace(/"/g, "").trim());
    
    return {
      investimento: parseFloat(values[0]?.replace(",", ".") || "0"),
      visualizacoes: parseInt(values[1] || "0"),
      alcance: parseInt(values[2] || "0"),
      engajamento: parseInt(values[3] || "0"),
      cliques: parseInt(values[4] || "0"),
      ultimaAtualizacao: new Date(),
    };
  } catch (error) {
    console.error("Erro ao buscar CSV:", error);
    return null;
  }
}

// Função para formatar valores monetários
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Função para formatar números grandes
export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  }
  return new Intl.NumberFormat("pt-BR").format(value);
}

// Lista de unidades disponíveis com planilhas configuradas
export function getUnidadesComMetricas(): string[] {
  return Object.keys(SHEETS_CONFIG);
}

// Verificar se uma unidade tem planilha configurada
export function hasMetricas(unidadeId: string): boolean {
  return unidadeId.toLowerCase() in SHEETS_CONFIG;
}
