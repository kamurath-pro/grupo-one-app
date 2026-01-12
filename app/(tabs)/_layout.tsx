import { Tabs, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";

import { HapticTab } from "@/components/haptic-tab";
import { useAppAuth } from "@/lib/auth-context";

// Logo Espaçolaser - Altere o nome do arquivo aqui para usar uma nova imagem
const ESPACOLASER_LOGO = require("@/assets/images/logos/LOGO - espaçolaser principal (1).png");

export default function TabLayout() {
  const { isAdmin, pendingUsers } = useAppAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const bottomPadding = Platform.OS === "web" ? 0 : Math.max(insets.bottom, 0);
  const tabBarHeight = 64;
  // Altura do rodapé com logos (40px) + safe area bottom
  const footerHeight = 40 + bottomPadding;

  const pendingCount = pendingUsers.length;

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#003FC3",
          tabBarInactiveTintColor: "#6B7280",
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            paddingTop: 8,
            paddingBottom: 4,
            height: tabBarHeight,
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 8,
            marginBottom: footerHeight,
            position: "absolute",
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "600",
            letterSpacing: 0.2,
            marginTop: 4,
          },
          tabBarItemStyle: {
            paddingVertical: 6,
            justifyContent: "center",
            alignItems: "center",
          },
          tabBarIconStyle: {
            marginBottom: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconContainer}>
                <MaterialIcons 
                  name="home" 
                  size={24} 
                  color={color} 
                />
                {focused && <View style={styles.activeIndicator} />}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconContainer}>
                <MaterialIcons 
                  name={focused ? "chat-bubble" : "chat-bubble-outline"} 
                  size={24} 
                  color={color} 
                />
                {focused && <View style={styles.activeIndicator} />}
              </View>
            ),
          }}
        />
        {/* Placeholder for center button */}
        <Tabs.Screen
          name="create"
          options={{
            title: "",
            tabBarIcon: () => null,
            tabBarButton: () => (
              <View style={styles.centerButtonContainer}>
                <Pressable
                  style={({ pressed }) => [
                    styles.centerButton,
                    pressed && styles.centerButtonPressed,
                  ]}
                  onPress={() => {
                    // Navigate to create post modal
                    router.push("/(tabs)/create");
                  }}
                >
                  <MaterialIcons name="add" size={32} color="#FFFFFF" />
                </Pressable>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="recognition"
          options={{
            title: "Reconhecer",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconContainer}>
                <MaterialIcons 
                  name={focused ? "star" : "star-outline"} 
                  size={24} 
                  color={color} 
                />
                {focused && <View style={styles.activeIndicator} />}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconContainer}>
                <MaterialIcons 
                  name={focused ? "person" : "person-outline"} 
                  size={24} 
                  color={color} 
                />
                {focused && <View style={styles.activeIndicator} />}
              </View>
            ),
          }}
        />
        {/* Hidden screens */}
        <Tabs.Screen
          name="files"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="metricas"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="admin"
          options={{
            href: isAdmin ? undefined : null,
            title: "Admin",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconContainer}>
                <MaterialIcons 
                  name="admin-panel-settings" 
                  size={24} 
                  color={color} 
                />
                {focused && <View style={styles.activeIndicator} />}
                {pendingCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {pendingCount > 9 ? "9+" : pendingCount}
                    </Text>
                  </View>
                )}
              </View>
            ),
          }}
        />
      </Tabs>

      {/* Rodapé fixo com as 4 logos */}
      <View style={[styles.footerContainer, { paddingBottom: bottomPadding }]}>
        <View style={styles.logosRow}>
          {/* Espaçolaser alinhada à esquerda */}
          <View style={styles.logoWideContainer}>
            <Image
              source={ESPACOLASER_LOGO}
              style={styles.logoWide}
              contentFit="contain"
            />
          </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    marginBottom: 2,
  },
  activeIndicator: {
    position: "absolute",
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#003FC3",
  },
  centerButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: -22,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#003FC3",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#003FC3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  centerButtonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    backgroundColor: "#DF007E",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#003FC3",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  logosRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  logoWideContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
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
