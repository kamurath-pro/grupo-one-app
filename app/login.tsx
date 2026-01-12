import { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Modal, Image, useWindowDimensions, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppAuth, UNITS } from "@/lib/auth-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as ImagePicker from "expo-image-picker";
import { Image as ExpoImage } from "expo-image";
import {
  Card,
  Button,
  LoadingState,
  Input,
  ErrorAlert,
  ToggleButton,
  SPACING,
  RADIUS,
  COLORS,
  TYPOGRAPHY,
  MAX_CONTENT_WIDTH,
} from "@/components/design-system";

type AuthMode = "login" | "register" | "pending";
type UserType = "socio" | "colaborador";

function UnitSelector({
  visible,
  onClose,
  onSelect,
  selectedId,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (id: number) => void;
  selectedId: number;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecione sua Unidade</Text>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol name="xmark" size={24} color={COLORS.gray600} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
            {UNITS.map((unit) => (
              <TouchableOpacity
                key={unit.id}
                style={[
                  styles.unitOption,
                  selectedId === unit.id && styles.unitOptionSelected,
                ]}
                onPress={() => {
                  onSelect(unit.id);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <View style={styles.unitOptionContent}>
                  <Text style={styles.unitOptionName}>{unit.name}</Text>
                  <Text style={styles.unitOptionLocation}>{unit.city} - {unit.state}</Text>
                </View>
                {selectedId === unit.id && (
                  <IconSymbol name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function LoginScreen() {
  const { login, register } = useAppAuth();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  
  const isLargeScreen = width >= 768;
  const isShortScreen = height < 667;

  const [mode, setMode] = useState<AuthMode>("login");
  const [userType, setUserType] = useState<UserType>("colaborador");
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState(1);
  const [selectedRole, setSelectedRole] = useState<"consultora" | "gerente">("consultora");
  const [selectedPhoto, setSelectedPhoto] = useState<{ uri: string; mimeType?: string } | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showUnitSelector, setShowUnitSelector] = useState(false);

  const selectedUnit = UNITS.find((u) => u.id === selectedUnitId);

  const resetForm = () => {
    setIdentifier("");
    setPassword("");
    setName("");
    setEmail("");
    setConfirmPassword("");
    setSelectedPhoto(null);
    setError("");
  };

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      if (Platform.OS === "web") {
        alert("Precisamos de permissão para acessar suas fotos");
      } else {
        Alert.alert("Permissão necessária", "Precisamos de permissão para acessar suas fotos");
      }
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setSelectedPhoto({
        uri: asset.uri,
        mimeType: (asset as any).mimeType,
      });
    }
  };

  const handleLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      setError("Preencha todos os campos");
      return;
    }

    setLoading(true);
    setError("");

    const result = await login(identifier.trim(), password);

    if (result.success) {
      router.replace("/(tabs)");
    } else if (result.pending) {
      router.replace("/pending-approval");
    } else {
      setError(result.error || "Erro ao fazer login");
    }

    setLoading(false);
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Preencha todos os campos");
      return;
    }

    if (!selectedPhoto) {
      setError("Adicione uma foto para completar o cadastro");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 4) {
      setError("A senha deve ter pelo menos 4 caracteres");
      return;
    }

    setLoading(true);
    setError("");

    const result = await register({
      name: name.trim(),
      email: email.trim(),
      password,
      unitId: selectedUnitId,
      appRole: selectedRole,
      photo: selectedPhoto,
    });

    if (result.success) {
      setMode("pending");
    } else {
      setError(result.error || "Erro ao cadastrar");
    }

    setLoading(false);
  };

  if (loading && mode === "login") {
    return <LoadingState message="Entrando..." />;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.headerContainer}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/logos/grupoone-branca-header.png")}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={0}
      >
        <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={[styles.content, isLargeScreen && { maxWidth: MAX_CONTENT_WIDTH }]}>
              {mode === "pending" ? (
                <Card style={styles.pendingCard}>
                  <View style={styles.pendingIcon}>
                    <IconSymbol name="clock.fill" size={40} color={COLORS.warning} />
                  </View>
                  <Text style={styles.pendingTitle}>Cadastro Enviado!</Text>
                  <Text style={styles.pendingText}>
                    Seu cadastro foi enviado para aprovação. Você receberá acesso assim que o administrador aprovar sua solicitação.
                  </Text>
                  <Card style={styles.pendingInfoCard}>
                    <Text style={styles.pendingInfoText}>
                      Entre em contato com sua gerente ou sócio(a) para agilizar o processo.
                    </Text>
                  </Card>
                  <Button
                    variant="primary"
                    onPress={() => {
                      resetForm();
                      setMode("login");
                    }}
                    fullWidth
                  >
                    Voltar ao Login
                  </Button>
                </Card>
              ) : (
                <Card style={styles.formCard}>
                  <Text style={styles.title}>
                    {mode === "login" ? "Acesse sua conta" : "Criar conta"}
                  </Text>

                  <ErrorAlert message={error} visible={!!error} />

                  {mode === "login" ? (
                    <>
                      <View style={styles.toggleContainer}>
                        <Text style={styles.toggleLabel}>Tipo de acesso:</Text>
                        <View style={styles.toggleGroup}>
                          <ToggleButton
                            label="Sócio(a)"
                            selected={userType === "socio"}
                            onPress={() => {
                              setUserType("socio");
                              setIdentifier("");
                              setPassword("");
                              setError("");
                            }}
                          />
                          <View style={styles.toggleGap} />
                          <ToggleButton
                            label="Colaborador(a)"
                            selected={userType === "colaborador"}
                            onPress={() => {
                              setUserType("colaborador");
                              setIdentifier("");
                              setPassword("");
                              setError("");
                            }}
                          />
                        </View>
                      </View>

                      <Input
                        label={userType === "socio" ? "Nome" : "E-mail"}
                        icon={userType === "socio" ? "person.fill" : "envelope.fill"}
                        placeholder={userType === "socio" ? "Seu nome" : "seu@email.com"}
                        value={identifier}
                        onChangeText={setIdentifier}
                        keyboardType={userType === "socio" ? "default" : "email-address"}
                        autoCapitalize={userType === "socio" ? "words" : "none"}
                        returnKeyType="next"
                        containerStyle={styles.inputSpacing}
                      />

                      <Input
                        label={userType === "socio" ? "Senha (4 dígitos)" : "Senha"}
                        icon="lock.fill"
                        placeholder={userType === "socio" ? "••••" : "••••••••"}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        keyboardType={userType === "socio" ? "number-pad" : "default"}
                        maxLength={userType === "socio" ? 4 : undefined}
                        returnKeyType="done"
                        onSubmitEditing={handleLogin}
                        containerStyle={styles.inputSpacing}
                      />

                      <Button
                        variant="primary"
                        onPress={handleLogin}
                        fullWidth
                        loading={loading}
                        style={styles.primaryButton}
                      >
                        Entrar
                      </Button>

                      {userType === "colaborador" && (
                        <TouchableOpacity
                          onPress={() => {
                            resetForm();
                            setMode("register");
                          }}
                          style={styles.linkButton}
                        >
                          <Text style={styles.linkText}>
                            Não tem conta? <Text style={styles.linkBold}>Cadastre-se</Text>
                          </Text>
                        </TouchableOpacity>
                      )}
                    </>
                  ) : (
                    <>
                      <Input
                        label="Nome completo"
                        icon="person.fill"
                        placeholder="Seu nome"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        returnKeyType="next"
                        containerStyle={styles.inputSpacing}
                      />

                      <Input
                        label="E-mail"
                        icon="envelope.fill"
                        placeholder="seu@email.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        returnKeyType="next"
                        containerStyle={styles.inputSpacing}
                      />

                      <View style={styles.inputSpacing}>
                        <Text style={styles.label}>Cargo</Text>
                        <View style={styles.toggleGroup}>
                          <ToggleButton
                            label="Consultora"
                            selected={selectedRole === "consultora"}
                            onPress={() => setSelectedRole("consultora")}
                          />
                          <View style={styles.toggleGap} />
                          <ToggleButton
                            label="Gerente"
                            selected={selectedRole === "gerente"}
                            onPress={() => setSelectedRole("gerente")}
                          />
                        </View>
                      </View>

                      <TouchableOpacity
                        style={[styles.unitSelector, styles.inputSpacing]}
                        onPress={() => setShowUnitSelector(true)}
                        activeOpacity={0.7}
                      >
                        <IconSymbol name="building.2.fill" size={20} color={COLORS.gray400} />
                        <Text style={styles.unitSelectorText}>
                          {selectedUnit?.name || "Selecione"}
                        </Text>
                        <IconSymbol name="chevron.right" size={20} color={COLORS.gray400} />
                      </TouchableOpacity>

                      <View style={styles.inputSpacing}>
                        <Text style={styles.label}>Foto *</Text>
                        {selectedPhoto ? (
                          <View style={styles.photoContainer}>
                            <View style={styles.photoWrapper}>
                              <ExpoImage
                                source={{ uri: selectedPhoto.uri }}
                                style={styles.photo}
                                contentFit="cover"
                              />
                              <TouchableOpacity
                                onPress={() => setSelectedPhoto(null)}
                                style={styles.photoRemove}
                              >
                                <IconSymbol name="xmark" size={16} color={COLORS.white} />
                              </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={pickPhoto} style={styles.photoChange}>
                              <Text style={styles.photoChangeText}>Trocar foto</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <TouchableOpacity
                            style={styles.photoPlaceholder}
                            onPress={pickPhoto}
                            activeOpacity={0.7}
                          >
                            <IconSymbol name="camera.fill" size={24} color={COLORS.gray400} />
                            <Text style={styles.photoPlaceholderText}>Adicionar foto</Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      <Input
                        label="Senha"
                        icon="lock.fill"
                        placeholder="Crie uma senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        returnKeyType="next"
                        containerStyle={styles.inputSpacing}
                      />

                      <Input
                        label="Confirmar senha"
                        icon="lock.fill"
                        placeholder="Repita a senha"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        returnKeyType="done"
                        onSubmitEditing={handleRegister}
                        containerStyle={styles.inputSpacing}
                      />

                      <Button
                        variant="primary"
                        onPress={handleRegister}
                        fullWidth
                        loading={loading}
                        style={styles.primaryButton}
                      >
                        Cadastrar
                      </Button>

                      <TouchableOpacity
                        onPress={() => {
                          resetForm();
                          setMode("login");
                        }}
                        style={styles.linkButton}
                      >
                        <Text style={styles.linkText}>
                          Já tem conta? <Text style={styles.linkBold}>Entrar</Text>
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </Card>
              )}

              <View style={styles.footer}>
                <Text style={styles.footerText}>Desenvolvido por</Text>
                <Image
                  source={require("@/assets/images/logos/trafegon-azul.png")}
                  style={styles.footerLogo}
                  resizeMode="contain"
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>

      <UnitSelector
        visible={showUnitSelector}
        onClose={() => setShowUnitSelector(false)}
        onSelect={setSelectedUnitId}
        selectedId={selectedUnitId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  headerContainer: {
    backgroundColor: COLORS.primary,
  },
  header: {
    alignItems: "center",
    paddingVertical: SPACING.lg,
  },
  headerLogo: {
    width: 120,
    height: 45,
  },
  keyboardView: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "ios" ? 20 : SPACING.lg,
  },
  content: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  formCard: {
    padding: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes["2xl"],
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.gray900,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  inputSpacing: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.gray600,
    marginBottom: SPACING.xs,
  },
  toggleContainer: {
    marginBottom: SPACING.lg,
  },
  toggleLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.gray600,
    marginBottom: SPACING.xs,
  },
  toggleGroup: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  toggleGap: {
    width: SPACING.sm,
  },
  unitSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    minHeight: 56,
    marginBottom: SPACING.md,
  },
  unitSelectorText: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.gray900,
  },
  photoContainer: {
    marginTop: SPACING.xs,
  },
  photoWrapper: {
    position: "relative",
    width: 120,
    height: 120,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    marginBottom: SPACING.sm,
  },
  photo: {
    width: 120,
    height: 120,
  },
  photoRemove: {
    position: "absolute",
    top: SPACING.xs,
    right: SPACING.xs,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: RADIUS.full,
    padding: SPACING.xs,
  },
  photoChange: {
    marginTop: SPACING.xs,
  },
  photoChangeText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  photoPlaceholder: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 120,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: COLORS.gray300,
    backgroundColor: COLORS.gray50,
    marginTop: SPACING.xs,
  },
  photoPlaceholderText: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.gray600,
    marginLeft: SPACING.sm,
  },
  primaryButton: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  linkButton: {
    alignItems: "center",
    paddingVertical: SPACING.md,
  },
  linkText: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.gray500,
  },
  linkBold: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  pendingCard: {
    alignItems: "center",
    padding: SPACING.xl,
  },
  pendingIcon: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.warningLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
  },
  pendingTitle: {
    fontSize: TYPOGRAPHY.sizes["2xl"],
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.gray900,
    textAlign: "center",
    marginBottom: SPACING.sm + 2,
  },
  pendingText: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.gray500,
    textAlign: "center",
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  pendingInfoCard: {
    backgroundColor: COLORS.gray100,
    marginBottom: SPACING.lg,
  },
  pendingInfoText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.gray600,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    marginTop: SPACING.xl * 1.5,
    paddingTop: SPACING.md,
  },
  footerText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.gray400,
    marginBottom: SPACING.sm,
  },
  footerLogo: {
    width: 100,
    height: 32,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.gray900,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: SPACING.md,
  },
  unitOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.gray100,
  },
  unitOptionSelected: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  unitOptionContent: {
    flex: 1,
  },
  unitOptionName: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.gray900,
  },
  unitOptionLocation: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.gray500,
    marginTop: SPACING.xs / 4,
  },
});
