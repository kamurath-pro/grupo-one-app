import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, Pressable, RefreshControl, StyleSheet, ActivityIndicator, Linking } from "react-native";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppAuth } from "@/lib/auth-context";
import { AppHeader } from "@/components/app-header";
import { ProfilePhoto } from "@/components/profile-photo";
import { fetchMetricas, formatCurrency, formatNumber, type MetricasData } from "@/lib/sheets-service";

// Dados de métricas por unidade (links das planilhas e pastas)
// NOTA: Esta configuração está sendo mantida apenas para compatibilidade com relatórios/notas fiscais
// As métricas agora são buscadas do sheets-service.ts usando os IDs do UNIT_ACCESS_CONFIG
const UNIDADES_CONFIG: Record<string, { 
  sheetId: string;
  relatorios: string; 
  notasFiscais: string;
}> = {
  "Araripina": {
    sheetId: "1XxorSEspVwY-VAa8XeR2YleixguDwGwVaumu3rQS9OI",
    relatorios: "https://drive.google.com/drive/folders/1_ruchybS9pn0wJLPPxQ532ERujkaFkXv?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/1KzbqZIewrEoKOajE3fO8ktOG25GCyb9z?usp=sharing",
  },
  "Serra Talhada": {
    sheetId: "1xkhRGEhHMyntv2DcGtZPovX3vAzKglqEnbIRAFPxx10",
    relatorios: "https://drive.google.com/drive/folders/1rGELW3lZHYCSWwdxa-hKR2q3jHPi-RHy?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/19gVgCa02Hew0kZhek7FmUMG0FvY-_yKH?usp=sharing",
  },
  "Vitória de Santo Antão": {
    sheetId: "1bZYM4-lw-7TWMtNcgX1apj5jrSpR1pBPXKAVxciSOWo",
    relatorios: "https://drive.google.com/drive/folders/1wJRrTnvmljdl6rAUdCiV-h8BjNjGUrDI?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/11LxWga_VVM2BRszI06pCdjNuM5EKxXn1?usp=sharing",
  },
  "Macaé Shopping": {
    sheetId: "1oVNAUdxSa1v-54QfAOLP7lyq0s-NYunU24sItzolrBw",
    relatorios: "https://drive.google.com/drive/folders/1dWjMOMh_4UPWAa553bT-WHNxpe7vLxJV?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/1sDRzGPbnanSmXuup83UiG5KvFDWqEcin?usp=sharing",
  },
};

// Mapeamento de nome de unidade para ID usado no sheets-service
// Os nomes devem corresponder exatamente aos nomes no UNIT_ACCESS_CONFIG (auth-context.tsx)
const UNIT_ID_MAP: Record<string, string> = {
  "Araripina": "araripina",
  "Serra Talhada": "serra",
  "Vitória de Santo Antão": "vitoria",
  "Garanhuns": "garanhuns",
  "Cajazeiras": "cajazeiras",
  "Santana do Livramento": "livramento",
  "Muriaé": "muriae",
  "Vilhena": "vilhena",
  "Corumbá": "corumba",
  "Fortaleza": "fortaleza",
  "Macaé Shopping": "macae_plaza",
  "Macaé Centro": "macae_centro",
};

export default function MetricasScreen() {
  const { user, isSocio, isAuthenticated, loading: authLoading, getUserUnitAccess } = useAppAuth();
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [metricas, setMetricas] = useState<MetricasData | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unitAccess = getUserUnitAccess();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    // Se só tem uma unidade, seleciona automaticamente
    if (unitAccess.length === 1 && !selectedUnit) {
      setSelectedUnit(unitAccess[0].unitName);
      loadMetricas(unitAccess[0].unitName);
    }
  }, [unitAccess, selectedUnit]);

  const loadMetricas = async (unitName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const unitId = UNIT_ID_MAP[unitName] || unitName.toLowerCase();
      const data = await fetchMetricas(unitId);
      
      if (data) {
        setMetricas(data);
      } else {
        // Se não conseguiu buscar dados reais, mostrar mensagem
        setError("Dados não disponíveis para esta unidade");
        setMetricas(null);
      }
    } catch (err) {
      console.error("Erro ao carregar métricas:", err);
      setError("Erro ao carregar dados. Tente novamente.");
      setMetricas(null);
    }
    
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (selectedUnit) {
      await loadMetricas(selectedUnit);
    }
    setRefreshing(false);
  }, [selectedUnit]);

  const handleSelectUnit = (unitName: string) => {
    setSelectedUnit(unitName);
    loadMetricas(unitName);
  };

  const handleOpenRelatorios = () => {
    if (selectedUnit && UNIDADES_CONFIG[selectedUnit]?.relatorios) {
      Linking.openURL(UNIDADES_CONFIG[selectedUnit].relatorios);
    }
  };

  const handleOpenNotasFiscais = () => {
    if (selectedUnit && UNIDADES_CONFIG[selectedUnit]?.notasFiscais) {
      Linking.openURL(UNIDADES_CONFIG[selectedUnit].notasFiscais);
    }
  };

  const handleChangeUnit = () => {
    setSelectedUnit(null);
    setMetricas(null);
    setError(null);
  };

  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003FC3" />
      </View>
    );
  }

  if (!isAuthenticated || !isSocio) {
    return (
      <View style={styles.container}>
        <AppHeader showBack />
        <View style={styles.noAccessContainer}>
          <MaterialIcons name="lock" size={48} color="#9CA3AF" />
          <Text style={styles.noAccessText}>Acesso restrito a sócios</Text>
        </View>
      </View>
    );
  }

  // Tela de seleção de unidade
  if (!selectedUnit) {
    return (
      <View style={styles.container}>
        <AppHeader showBack />
        <ScrollView contentContainerStyle={styles.selectUnitContainer}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>PAINEL EXECUTIVO</Text>
          </View>
          <Text style={styles.welcomeText}>Olá, {user?.name}! 👋</Text>
          <Text style={styles.selectUnitTitle}>Escolha uma unidade</Text>
          
          <View style={styles.unitsGrid}>
            {unitAccess.map((access) => (
              <Pressable
                key={access.unitName}
                style={({ pressed }) => [
                  styles.unitCard,
                  pressed && styles.unitCardPressed,
                ]}
                onPress={() => handleSelectUnit(access.unitName)}
              >
                <View style={styles.unitIconContainer}>
                  <MaterialIcons name="business" size={28} color="#003FC3" />
                </View>
                <Text style={styles.unitName}>{access.unitName}</Text>
                <Text style={styles.unitAction}>ACESSAR INTELIGÊNCIA DE TRÁFEGO</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Tela de métricas da unidade selecionada
  return (
    <View style={styles.container}>
      <AppHeader showBack />
      
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#003FC3" />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={{ maxWidth: 800, alignSelf: "center", width: "100%" }}>
          {/* Saudação com Foto de Perfil - igual à Home */}
          <View style={styles.greetingContainer}>
            <ProfilePhoto
              uri={user?.avatarUrl || user?.photoUrl}
              name={user?.name || "Usuário"}
              size={48}
            />
            <View style={styles.greetingText}>
              <Text style={styles.greetingName}>
                Olá, {user?.name?.split(" ")[0] || "Usuário"}!
              </Text>
              <Pressable style={styles.unitBadge} onPress={handleChangeUnit}>
                <Text style={styles.unitBadgeText}>{selectedUnit}</Text>
                {unitAccess.length > 1 && (
                  <MaterialIcons name="keyboard-arrow-down" size={14} color="#003FC3" />
                )}
              </Pressable>
            </View>
          </View>

          {/* Banner de Performance - estilo igual ao banner da Home */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance</Text>
            <Pressable style={styles.banner}>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTag}>Tráfego Pago</Text>
                <Text style={styles.bannerTitle}>
                  Métricas em Tempo Real
                </Text>
                <Text style={styles.bannerDescription}>
                  Dados atualizados automaticamente do Google Sheets
                </Text>
              </View>
            </Pressable>
          </View>

        {/* Performance do Tráfego Pago */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance do Tráfego Pago</Text>
          {metricas && (
            <Text style={styles.updateTime}>
              Atualizado às {metricas.ultimaAtualizacao.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} • Mês atual
            </Text>
          )}

          {loading ? (
            <View style={styles.loadingMetricas}>
              <ActivityIndicator size="large" color="#003FC3" />
              <Text style={styles.loadingText}>Carregando dados do Google Sheets...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={48} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
              <Pressable style={styles.retryButton} onPress={() => loadMetricas(selectedUnit)}>
                <Text style={styles.retryButtonText}>Tentar novamente</Text>
              </Pressable>
            </View>
          ) : metricas ? (
            <View style={styles.metricasGrid}>
              <View style={styles.metricCardWrapper}>
                <View style={[styles.metricCard, { borderLeftColor: "#22C55E", borderLeftWidth: 4 }]}>
                  <View style={styles.metricCardHeader}>
                    <View style={[styles.metricIconContainer, { backgroundColor: "#DCFCE7" }]}>
                      <MaterialIcons name="attach-money" size={20} color="#22C55E" />
                    </View>
                  </View>
                  <Text style={[styles.metricValue, { color: "#22C55E" }]}>
                    {formatCurrency(metricas.investimento)}
                  </Text>
                  <Text style={styles.metricLabel}>INVESTIMENTO</Text>
                </View>
              </View>

              <View style={styles.metricCardWrapper}>
                <View style={[styles.metricCard, { borderLeftColor: "#003FC3", borderLeftWidth: 4 }]}>
                  <View style={styles.metricCardHeader}>
                    <View style={[styles.metricIconContainer, { backgroundColor: "#E6F0FF" }]}>
                      <MaterialIcons name="visibility" size={20} color="#003FC3" />
                    </View>
                  </View>
                  <Text style={[styles.metricValue, { color: "#003FC3" }]}>
                    {formatNumber(metricas.visualizacoes)}
                  </Text>
                  <Text style={styles.metricLabel}>VISUALIZAÇÕES</Text>
                </View>
              </View>

              <View style={styles.metricCardWrapper}>
                <View style={[styles.metricCard, { borderLeftColor: "#003FC3", borderLeftWidth: 4 }]}>
                  <View style={styles.metricCardHeader}>
                    <View style={[styles.metricIconContainer, { backgroundColor: "#E6F0FF" }]}>
                      <MaterialIcons name="people" size={20} color="#003FC3" />
                    </View>
                  </View>
                  <Text style={[styles.metricValue, { color: "#003FC3" }]}>
                    {formatNumber(metricas.alcance)}
                  </Text>
                  <Text style={styles.metricLabel}>PESSOAS ALCANÇADAS</Text>
                </View>
              </View>

              <View style={styles.metricCardWrapper}>
                <View style={[styles.metricCard, { borderLeftColor: "#003FC3", borderLeftWidth: 4 }]}>
                  <View style={styles.metricCardHeader}>
                    <View style={[styles.metricIconContainer, { backgroundColor: "#E6F0FF" }]}>
                      <MaterialIcons name="favorite" size={20} color="#003FC3" />
                    </View>
                  </View>
                  <Text style={[styles.metricValue, { color: "#003FC3" }]}>
                    {formatNumber(metricas.engajamento)}
                  </Text>
                  <Text style={styles.metricLabel}>ENGAJAMENTO</Text>
                </View>
              </View>

              <View style={[styles.metricCardWrapper, styles.metricCardWrapperFull]}>
                <View style={[styles.metricCard, { borderLeftColor: "#D97706", borderLeftWidth: 4 }]}>
                  <View style={styles.metricCardHeader}>
                    <View style={[styles.metricIconContainer, { backgroundColor: "#FEF3C7" }]}>
                      <MaterialIcons name="link" size={20} color="#D97706" />
                    </View>
                  </View>
                  <Text style={[styles.metricValue, { color: "#D97706" }]}>
                    {formatNumber(metricas.cliques)}
                  </Text>
                  <Text style={styles.metricLabel}>CLIQUES NO LINK</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <MaterialIcons name="analytics" size={48} color="#9CA3AF" />
              <Text style={styles.noDataText}>Selecione uma unidade para ver as métricas</Text>
            </View>
          )}
        </View>

          {/* Informação sobre atualização */}
          <View style={styles.infoSection}>
            <MaterialIcons name="info-outline" size={16} color="#6B7280" />
            <Text style={styles.infoText}>
              Os dados são atualizados automaticamente a partir das planilhas do Google Sheets. 
              Puxe para baixo para atualizar.
            </Text>
          </View>

          {/* Espaço para o rodapé */}
          <View style={{ height: 50 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  noAccessContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  noAccessText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 12,
  },
  selectUnitContainer: {
    padding: 20,
  },
  headerBadge: {
    backgroundColor: "#003FC3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  headerBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  selectUnitTitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 24,
  },
  unitsGrid: {
    gap: 16,
  },
  unitCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  unitCardPressed: {
    backgroundColor: "#F9FAFB",
    transform: [{ scale: 0.98 }],
  },
  unitIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E6F0FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  unitName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  unitAction: {
    fontSize: 10,
    fontWeight: "600",
    color: "#003FC3",
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greetingText: {
    marginLeft: 12,
    flex: 1,
  },
  greetingName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  unitBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  unitBadgeText: {
    fontSize: 14,
    color: "#6B7280",
  },
  section: {
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  banner: {
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#001C65",
    overflow: "hidden",
  },
  bannerContent: {
    padding: 16,
  },
  bannerTag: {
    fontSize: 12,
    color: "#93C5FD",
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  bannerDescription: {
    fontSize: 14,
    color: "#BFDBFE",
  },
  updateTime: {
    fontSize: 12,
    color: "#6B7280",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  resourcesRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  resourceCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  resourceCardPressed: {
    backgroundColor: "#F9FAFB",
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  resourceAction: {
    fontSize: 9,
    fontWeight: "600",
    color: "#003FC3",
    letterSpacing: 0.5,
  },
  loadingMetricas: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  errorContainer: {
    padding: 40,
    alignItems: "center",
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: "#EF4444",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "#003FC3",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  noDataContainer: {
    padding: 40,
    alignItems: "center",
  },
  noDataText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  metricasGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
  metricCardWrapper: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  metricCardWrapperFull: {
    width: "100%",
  },
  metricCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    minHeight: 110,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  metricCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6B7280",
    letterSpacing: 0.5,
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 0,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
  },
});
