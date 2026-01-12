import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { TouchableOpacity } from "react-native";
import { Image } from "expo-image";

export default function TermsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Termos de Uso</Text>
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

        <Text style={styles.title}>Termos de Uso - Grupo ONE App</Text>
        <Text style={styles.date}>Última atualização: {new Date().toLocaleDateString("pt-BR")}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Aceitação dos Termos</Text>
          <Text style={styles.text}>
            Ao acessar e usar o aplicativo Grupo ONE, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
            Se você não concorda com qualquer parte destes termos, não deve usar o aplicativo.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Descrição do Serviço</Text>
          <Text style={styles.text}>
            O Grupo ONE App é uma plataforma de comunicação interna desenvolvida para conectar sócios e colaboradores 
            das unidades Espaçolaser. O aplicativo oferece funcionalidades de feed, chat, reconhecimento e compartilhamento 
            de informações entre membros autorizados.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Cadastro e Aprovação</Text>
          <Text style={styles.text}>
            Para usar o aplicativo, você deve se cadastrar fornecendo informações precisas e atualizadas. 
            Todos os novos cadastros estão sujeitos a aprovação por administradores ou sócios. 
            O acesso será concedido apenas após aprovação.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Uso Apropriado</Text>
          <Text style={styles.text}>
            Você concorda em usar o aplicativo apenas para fins legítimos e de acordo com estes Termos. 
            É proibido:
          </Text>
          <Text style={styles.bullet}>• Publicar conteúdo ofensivo, difamatório ou ilegal</Text>
          <Text style={styles.bullet}>• Violar direitos de propriedade intelectual</Text>
          <Text style={styles.bullet}>• Compartilhar informações confidenciais sem autorização</Text>
          <Text style={styles.bullet}>• Usar o aplicativo para qualquer atividade não autorizada</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Privacidade e Dados</Text>
          <Text style={styles.text}>
            Seus dados pessoais são tratados de acordo com nossa Política de Privacidade. 
            Ao usar o aplicativo, você consente com a coleta e uso de suas informações conforme descrito na política.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Propriedade Intelectual</Text>
          <Text style={styles.text}>
            Todo o conteúdo do aplicativo, incluindo textos, gráficos, logos e software, é propriedade do Grupo ONE 
            ou de seus licenciadores e está protegido por leis de propriedade intelectual.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Limitação de Responsabilidade</Text>
          <Text style={styles.text}>
            O Grupo ONE não se responsabiliza por danos diretos, indiretos, incidentais ou consequenciais 
            resultantes do uso ou incapacidade de usar o aplicativo.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Modificações dos Termos</Text>
          <Text style={styles.text}>
            Reservamos o direito de modificar estes Termos a qualquer momento. 
            Alterações significativas serão comunicadas aos usuários. 
            O uso continuado do aplicativo após as modificações constitui aceitação dos novos termos.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Contato</Text>
          <Text style={styles.text}>
            Para questões sobre estes Termos de Uso, entre em contato através do aplicativo 
            ou pelo e-mail: agenciatrafegon@gmail.com
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
