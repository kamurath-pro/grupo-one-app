import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";

// Logo Espaçolaser - Altere o nome do arquivo aqui para usar uma nova imagem
const ESPACOLASER_LOGO = require("@/assets/images/logos/LOGO - espaçolaser principal (1).png");

/**
 * FooterLogos - Rodapé com as 4 logos em linha
 * Grupo ONE, Espaçolaser, Meta, TráfegON
 */
export function FooterLogos() {
  return (
    <View style={styles.container}>
      <View style={styles.logosRow}>
        {/* Espaçolaser alinhada à esquerda */}
        <Image
          source={ESPACOLASER_LOGO}
          style={styles.logoWide}
          contentFit="contain"
        />
        {/* Grupo de logos à direita com espaçamento equilibrado */}
        <View style={styles.rightLogosGroup}>
          <Image
            source={require("@/assets/images/logos/grupoone-branca.png")}
            style={styles.logo}
            contentFit="contain"
          />
          <Image
            source={require("@/assets/images/logos/meta-branca.png")}
            style={styles.logo}
            contentFit="contain"
          />
          <Image
            source={require("@/assets/images/logos/trafegon-branca.png")}
            style={styles.logo}
            contentFit="contain"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#003FC3",
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: "100%",
  },
  logosRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  logoWide: {
    width: 80,
    height: 20,
  },
  rightLogosGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    gap: 24,
  },
  logo: {
    width: 50,
    height: 20,
  },
});
