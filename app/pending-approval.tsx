import { View, Text, Image, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppAuth } from "@/lib/auth-context";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function PendingApprovalScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAppAuth();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header com Logo */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logos/grupoone-branca-header.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Conteúdo Central */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <IconSymbol name="clock.fill" size={64} color="#FF9012" />
        </View>

        <Text style={styles.title}>Aguardando Aprovação</Text>

        <Text style={styles.message}>
          Seu cadastro foi enviado para aprovação. Você receberá acesso assim que o administrador ou sócio(a) aprovar sua solicitação.
        </Text>

        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userInfoLabel}>Cadastro enviado por:</Text>
            <Text style={styles.userInfoName}>{user.name}</Text>
            <Text style={styles.userInfoEmail}>{user.email}</Text>
            {user.unitNames && user.unitNames.length > 0 && (
              <Text style={styles.userInfoUnit}>{user.unitNames[0]}</Text>
            )}
          </View>
        )}

        <View style={styles.helpBox}>
          <IconSymbol name="info.circle.fill" size={20} color="#003FC3" />
          <Text style={styles.helpText}>
            Entre em contato com sua gerente ou sócio(a) para agilizar o processo de aprovação.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Desenvolvido por</Text>
        <Image
          source={require("@/assets/images/logos/trafegon-azul.png")}
          style={styles.footerLogo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#003FC3",
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 45,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFF3E0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  userInfo: {
    width: "100%",
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  userInfoLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  userInfoName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  userInfoEmail: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  userInfoUnit: {
    fontSize: 14,
    color: "#003FC3",
    fontWeight: "500",
  },
  helpBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#E6F0FF",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    color: "#003FC3",
    lineHeight: 20,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 32,
    paddingTop: 16,
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  footerLogo: {
    width: 100,
    height: 30,
  },
});
