import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { TouchableOpacity } from "react-native";
import { Image } from "expo-image";

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Política de Privacidade</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/logos/grupoone-branca-header.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Política de Privacidade - Grupo ONE App</Text>
        <Text style={styles.date}>Última atualização: {new Date().toLocaleDateString("pt-BR")}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introdução</Text>
          <Text style={styles.text}>
            O Grupo ONE valoriza sua privacidade e está comprometido em proteger seus dados pessoais. 
            Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações 
            quando você usa nosso aplicativo.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Informações que Coletamos</Text>
          <Text style={styles.text}>Coletamos as seguintes informações:</Text>
          <Text style={styles.bullet}>• Nome completo</Text>
          <Text style={styles.bullet}>• Endereço de e-mail</Text>
          <Text style={styles.bullet}>• Unidade de trabalho</Text>
          <Text style={styles.bullet}>• Cargo/função</Text>
          <Text style={styles.bullet}>• Foto de perfil (opcional)</Text>
          <Text style={styles.bullet}>• Conteúdo que você publica (posts, mensagens, reconhecimentos)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Como Usamos suas Informações</Text>
          <Text style={styles.text}>Utilizamos suas informações para:</Text>
          <Text style={styles.bullet}>• Fornecer e melhorar nossos serviços</Text>
          <Text style={styles.bullet}>• Facilitar a comunicação entre membros</Text>
          <Text style={styles.bullet}>• Gerenciar aprovações e acesso ao aplicativo</Text>
          <Text style={styles.bullet}>• Enviar notificações relevantes</Text>
          <Text style={styles.bullet}>• Garantir a segurança e prevenir fraudes</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Compartilhamento de Informações</Text>
          <Text style={styles.text}>
            Suas informações são compartilhadas apenas com:
          </Text>
          <Text style={styles.bullet}>• Outros membros autorizados do Grupo ONE</Text>
          <Text style={styles.bullet}>• Administradores e sócios para fins de gerenciamento</Text>
          <Text style={styles.bullet}>• Prestadores de serviços que nos auxiliam (sob acordo de confidencialidade)</Text>
          <Text style={styles.text}>
            Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins comerciais.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Armazenamento e Segurança</Text>
          <Text style={styles.text}>
            Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados contra 
            acesso não autorizado, alteração, divulgação ou destruição. Seus dados são armazenados de forma 
            segura e acessíveis apenas por pessoal autorizado.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Seus Direitos</Text>
          <Text style={styles.text}>Você tem o direito de:</Text>
          <Text style={styles.bullet}>• Acessar seus dados pessoais</Text>
          <Text style={styles.bullet}>• Corrigir informações incorretas</Text>
          <Text style={styles.bullet}>• Solicitar a exclusão de seus dados</Text>
          <Text style={styles.bullet}>• Retirar seu consentimento a qualquer momento</Text>
          <Text style={styles.text}>
            Para exercer esses direitos, entre em contato conosco através do aplicativo ou pelo e-mail: 
            agenciatrafegon@gmail.com
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Retenção de Dados</Text>
          <Text style={styles.text}>
            Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir os propósitos descritos 
            nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Cookies e Tecnologias Similares</Text>
          <Text style={styles.text}>
            O aplicativo pode usar tecnologias como cookies para melhorar sua experiência. 
            Você pode gerenciar essas preferências nas configurações do seu dispositivo.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Alterações nesta Política</Text>
          <Text style={styles.text}>
            Podemos atualizar esta Política de Privacidade periodicamente. 
            Alterações significativas serão comunicadas através do aplicativo. 
            Recomendamos revisar esta política regularmente.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Contato</Text>
          <Text style={styles.text}>
            Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou sobre como tratamos 
            seus dados pessoais, entre em contato conosco:
          </Text>
          <Text style={styles.text}>
            E-mail: agenciatrafegon@gmail.com
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Desenvolvido por</Text>
          <Image
            source={require("@/assets/images/logos/trafegon-azul.png")}
            style={styles.footerLogo}
            resizeMode="contain"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#003FC3",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 150,
    height: 56,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  date: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 24,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#003FC3",
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
    marginLeft: 16,
    marginBottom: 4,
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
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
