import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Image, useWindowDimensions, StyleSheet, Platform } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppAuth } from "@/lib/auth-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { AppHeader } from "@/components/app-header";
import { useNotifications } from "@/lib/notification-context";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenHeader, Card, Button, LoadingState, SPACING, RADIUS, COLORS, TYPOGRAPHY, MAX_CONTENT_WIDTH } from "@/components/design-system";

const PROFILE_PHOTO_KEY = "grupo_one_profile_photo";

function ProfileMenuItem({
  icon,
  title,
  description,
  onPress,
  isLast = false,
}: {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, !isLast && styles.menuItemBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemIcon}>
        <IconSymbol name={icon as any} size={22} color={COLORS.primary} />
      </View>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemTitle}>{title}</Text>
        <Text style={styles.menuItemDescription}>{description}</Text>
      </View>
      <IconSymbol name="chevron.right" size={20} color={COLORS.gray400} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { width } = useWindowDimensions();
  const { user, isAuthenticated, loading: authLoading, logout } = useAppAuth();
  const { unreadCount } = useNotifications();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const isLargeScreen = width >= 768;

  useEffect(() => {
    if (!authLoading && user && user.approvalStatus === "pending") {
      router.replace("/pending-approval");
    } else if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, user]);

  useEffect(() => {
    const loadProfilePhoto = async () => {
      if (user?.email) {
        try {
          const savedPhoto = await AsyncStorage.getItem(`${PROFILE_PHOTO_KEY}_${user.email}`);
          if (savedPhoto) {
            setProfilePhoto(savedPhoto);
          }
        } catch (error) {
          // Erro ao carregar foto - ignorar
        }
      }
    };
    loadProfilePhoto();
  }, [user?.email]);

  const handleChangePhoto = async () => {
    Alert.alert(
      "Foto de Perfil",
      "Escolha uma opção",
      [
        {
          text: "Tirar Foto",
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
              Alert.alert("Permissão necessária", "Precisamos de acesso à câmera para tirar fotos.");
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ["images"],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            if (!result.canceled && result.assets[0]) {
              const uri = result.assets[0].uri;
              setProfilePhoto(uri);
              if (user?.email) {
                await AsyncStorage.setItem(`${PROFILE_PHOTO_KEY}_${user.email}`, uri);
              }
              if (Platform.OS !== "web") {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
            }
          },
        },
        {
          text: "Escolher da Galeria",
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
              Alert.alert("Permissão necessária", "Precisamos de acesso à galeria para escolher fotos.");
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ["images"],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            if (!result.canceled && result.assets[0]) {
              const uri = result.assets[0].uri;
              setProfilePhoto(uri);
              if (user?.email) {
                await AsyncStorage.setItem(`${PROFILE_PHOTO_KEY}_${user.email}`, uri);
              }
              if (Platform.OS !== "web") {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
            }
          },
        },
        profilePhoto
          ? {
              text: "Remover Foto",
              style: "destructive" as const,
              onPress: async () => {
                setProfilePhoto(null);
                if (user?.email) {
                  await AsyncStorage.removeItem(`${PROFILE_PHOTO_KEY}_${user.email}`);
                }
              },
            }
          : null,
        { text: "Cancelar", style: "cancel" as const },
      ].filter(Boolean) as any
    );
  };

  const handleLogout = () => {
    if (Platform.OS === "web") {
      // Use window.confirm for web
      const shouldLogout = typeof window !== "undefined" && window.confirm("Tem certeza que deseja sair?");
      if (shouldLogout) {
        logout().then(() => {
          router.replace("/login");
        });
      }
    } else {
      // Use Alert.alert for native
      Alert.alert(
        "Sair da conta",
        "Tem certeza que deseja sair?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Sair",
            style: "destructive",
            onPress: async () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              await logout();
              router.replace("/login");
            },
          },
        ]
      );
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "socio":
        return "Sócio(a)";
      case "gerente":
        return "Gerente";
      case "consultora":
        return "Consultora";
      case "admin":
        return "Administrador";
      default:
        return role;
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case "socio":
        return { bg: COLORS.warningLight, color: COLORS.warning };
      case "admin":
        return { bg: "#FEF3C7", color: "#F59E0B" };
      default:
        return { bg: COLORS.primaryLight, color: COLORS.primary };
    }
  };

  if (authLoading) {
    return <LoadingState />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const roleStyle = getRoleColor(user.appRole);

  return (
    <View style={styles.container}>
      <AppHeader
        notificationCount={unreadCount}
        onNotificationPress={() => router.push("/notifications" as any)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.content, isLargeScreen && { maxWidth: 600 }]}>
          <Card style={styles.profileCard}>
            <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.8} style={styles.photoContainer}>
              <View style={styles.photoWrapper}>
                {profilePhoto ? (
                  <Image source={{ uri: profilePhoto }} style={styles.photo} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Text style={styles.photoPlaceholderText}>
                      {user.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.photoBadge}>
                  <IconSymbol name="camera.fill" size={16} color={COLORS.white} />
                </View>
              </View>
              <Text style={styles.photoHint}>Toque para alterar foto</Text>
            </TouchableOpacity>

            <Text style={styles.profileName}>{user.name}</Text>

            <View style={styles.roleBadgeContainer}>
              <View style={[styles.roleBadge, { backgroundColor: roleStyle.bg }]}>
                <Text style={[styles.roleBadgeText, { color: roleStyle.color }]}>
                  {getRoleLabel(user.appRole)}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <IconSymbol name="building.2.fill" size={18} color={COLORS.gray500} />
              <Text style={styles.infoText}>
                {user.unitNames?.join(", ") || "Grupo ONE"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <IconSymbol name="envelope.fill" size={18} color={COLORS.gray500} />
              <Text style={styles.infoText}>{user.email}</Text>
            </View>
          </Card>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configurações</Text>
            <Card noPadding style={styles.menuCard}>
              <ProfileMenuItem
                icon="person.fill"
                title="Editar Perfil"
                description="Altere suas informações pessoais"
                onPress={() => router.push("/edit-profile" as any)}
              />
              <ProfileMenuItem
                icon="doc.text.fill"
                title="Termos de Uso"
                description="Leia nossos termos e condições"
                onPress={() => router.push("/terms" as any)}
              />
              <ProfileMenuItem
                icon="lock.shield.fill"
                title="Política de Privacidade"
                description="Como protegemos seus dados"
                onPress={() => router.push("/privacy" as any)}
                isLast
              />
            </Card>
          </View>

          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <IconSymbol name="arrow.right.square.fill" size={20} color={COLORS.error} />
              <Text style={styles.logoutButtonText}>Sair do Aplicativo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Desenvolvido por</Text>
            <Image
              source={require("@/assets/images/logos/trafegon-azul.png")}
              style={styles.footerLogo}
              resizeMode="contain"
            />
            <Text style={styles.footerText}>Versão 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    width: "100%",
    alignSelf: "center",
  },
  profileCard: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    alignItems: "center",
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  photoWrapper: {
    position: "relative",
    marginBottom: SPACING.sm,
  },
  photo: {
    width: 112,
    height: 112,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.gray100,
  },
  photoPlaceholder: {
    width: 112,
    height: 112,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  photoPlaceholderText: {
    fontSize: 48,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.white,
  },
  photoBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  photoHint: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.gray400,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  profileName: {
    fontSize: TYPOGRAPHY.sizes["2xl"],
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.gray900,
    marginBottom: SPACING.sm + 2,
  },
  roleBadgeContainer: {
    marginBottom: SPACING.md,
  },
  roleBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
  },
  roleBadgeText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.md,
  },
  infoText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.gray700,
    fontWeight: TYPOGRAPHY.weights.medium,
    marginLeft: SPACING.sm,
  },
  section: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.gray500,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: SPACING.sm + 2,
    paddingHorizontal: SPACING.sm,
  },
  menuCard: {
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  menuItemIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.gray900,
  },
  menuItemDescription: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.gray500,
    marginTop: SPACING.xs / 4,
  },
  logoutContainer: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
  logoutButton: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.errorLight,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  logoutButtonText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.error,
    marginLeft: SPACING.sm,
  },
  footer: {
    alignItems: "center",
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  footerText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.gray400,
    marginBottom: SPACING.sm,
  },
  footerLogo: {
    width: 100,
    height: 30,
    marginBottom: SPACING.sm,
  },
});
