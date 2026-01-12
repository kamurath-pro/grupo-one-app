import { useState, useEffect, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, ScrollView, useWindowDimensions, StyleSheet, Platform } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppAuth } from "@/lib/auth-context";
import { useData, Recognition } from "@/lib/data-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { AppHeader } from "@/components/app-header";
import { useNotifications } from "@/lib/notification-context";
import * as Haptics from "expo-haptics";
import { ScreenHeader, Card, Button, EmptyState, LoadingState, SearchBar, SPACING, RADIUS, COLORS, TYPOGRAPHY, MAX_CONTENT_WIDTH } from "@/components/design-system";

const RECOGNITION_TYPES = [
  { value: "parabens" as const, label: "Parabéns!", emoji: "🎉", description: "Reconheça uma conquista", color: COLORS.success, bg: COLORS.successLight },
  { value: "obrigado" as const, label: "Obrigado!", emoji: "🙏", description: "Agradeça pela ajuda", color: COLORS.primary, bg: COLORS.primaryLight },
  { value: "destaque" as const, label: "Destaque!", emoji: "⭐", description: "Destaque um bom trabalho", color: COLORS.warning, bg: COLORS.warningLight },
];

function RecognitionCard({ recognition }: { recognition: Recognition }) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const typeInfo = RECOGNITION_TYPES.find((t) => t.value === recognition.type) || RECOGNITION_TYPES[0];

  return (
    <Card style={styles.recognitionCard}>
      <View style={styles.recognitionHeader}>
        <View style={styles.recognitionAvatar}>
          <Text style={styles.recognitionAvatarText}>{recognition.senderName[0].toUpperCase()}</Text>
        </View>
        <View style={styles.recognitionHeaderInfo}>
          <Text style={styles.recognitionHeaderText}>
            <Text style={styles.recognitionHeaderName}>{recognition.senderName}</Text>
            <Text style={styles.recognitionHeaderPlain}> enviou para </Text>
            <Text style={styles.recognitionHeaderName}>{recognition.receiverName}</Text>
          </Text>
          <Text style={styles.recognitionHeaderMeta}>
            {recognition.senderUnit} → {recognition.receiverUnit} • {formatTime(recognition.createdAt)}
          </Text>
        </View>
      </View>

      <View style={[styles.recognitionTypeContainer, { backgroundColor: typeInfo.bg }]}>
        <Text style={styles.recognitionEmoji}>{typeInfo.emoji}</Text>
        <View style={styles.recognitionTypeContent}>
          <Text style={[styles.recognitionTypeLabel, { color: typeInfo.color }]}>{typeInfo.label}</Text>
          {recognition.message && (
            <Text style={styles.recognitionMessage}>{recognition.message}</Text>
          )}
        </View>
      </View>
    </Card>
  );
}

function NewRecognitionModal({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (receiverId: number, type: Recognition["type"], message?: string) => void;
}) {
  const { user } = useAppAuth();
  const { allUsers } = useData();
  const [step, setStep] = useState<"user" | "type" | "message">("user");
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<Recognition["type"] | null>(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    return allUsers.filter(
      (u) =>
        u.id !== user?.id &&
        (u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.unitName.toLowerCase().includes(search.toLowerCase()))
    );
  }, [allUsers, user?.id, search]);

  const selectedUserData = allUsers.find((u) => u.id === selectedUser);

  const handleClose = () => {
    setStep("user");
    setSelectedUser(null);
    setSelectedType(null);
    setMessage("");
    setSearch("");
    onClose();
  };

  const handleSubmit = () => {
    if (selectedUser && selectedType) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onSubmit(selectedUser, selectedType, message.trim() || undefined);
      handleClose();
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "user":
        return "Escolha quem reconhecer";
      case "type":
        return "Tipo de reconhecimento";
      case "message":
        return "Adicionar mensagem";
      default:
        return "";
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.bottomModalOverlay}>
        <View style={styles.bottomModal}>
          <View style={styles.bottomModalHeader}>
            <TouchableOpacity
              onPress={() => {
                if (step === "type") setStep("user");
                else if (step === "message") setStep("type");
                else handleClose();
              }}
            >
              <IconSymbol name="chevron.left" size={24} color={COLORS.gray900} />
            </TouchableOpacity>
            <Text style={styles.bottomModalTitle}>{getStepTitle()}</Text>
            <TouchableOpacity onPress={handleClose}>
              <IconSymbol name="xmark" size={24} color={COLORS.gray600} />
            </TouchableOpacity>
          </View>

          {step === "user" && (
            <>
              <View style={styles.bottomModalSearch}>
                <SearchBar
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Buscar colaborador..."
                />
              </View>
              <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.userItem}
                    onPress={() => {
                      setSelectedUser(item.id);
                      setStep("type");
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.userAvatar}>
                      <Text style={styles.userAvatarText}>{item.name[0].toUpperCase()}</Text>
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{item.name}</Text>
                      <Text style={styles.userRole}>{item.unitName}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.usersList}
              />
            </>
          )}

          {step === "type" && (
            <ScrollView style={styles.bottomModalScroll} contentContainerStyle={styles.bottomModalScrollContent}>
              {selectedUserData && (
                <Card style={styles.selectedUserCard}>
                  <View style={styles.selectedUserAvatar}>
                    <Text style={styles.selectedUserAvatarText}>{selectedUserData.name[0].toUpperCase()}</Text>
                  </View>
                  <View style={styles.selectedUserInfo}>
                    <Text style={styles.selectedUserName}>{selectedUserData.name}</Text>
                    <Text style={styles.selectedUserRole}>{selectedUserData.unitName}</Text>
                  </View>
                </Card>
              )}

              <Text style={styles.stepLabel}>Escolha o tipo:</Text>

              {RECOGNITION_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeOption,
                    {
                      backgroundColor: selectedType === type.value ? type.bg : COLORS.white,
                      borderColor: selectedType === type.value ? type.color : COLORS.gray200,
                    },
                  ]}
                  onPress={() => {
                    setSelectedType(type.value);
                    setStep("message");
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.typeOptionEmoji}>{type.emoji}</Text>
                  <View style={styles.typeOptionContent}>
                    <Text style={styles.typeOptionLabel}>{type.label}</Text>
                    <Text style={styles.typeOptionDescription}>{type.description}</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={COLORS.gray400} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {step === "message" && (
            <ScrollView style={styles.bottomModalScroll} contentContainerStyle={styles.bottomModalScrollContent}>
              {selectedUserData && selectedType && (
                <Card style={styles.selectedUserCard}>
                  <Text style={styles.selectedUserEmoji}>
                    {RECOGNITION_TYPES.find((t) => t.value === selectedType)?.emoji}
                  </Text>
                  <View style={styles.selectedUserInfo}>
                    <Text style={styles.selectedUserName}>
                      {RECOGNITION_TYPES.find((t) => t.value === selectedType)?.label} para {selectedUserData.name}
                    </Text>
                    <Text style={styles.selectedUserRole}>{selectedUserData.unitName}</Text>
                  </View>
                </Card>
              )}

              <Text style={styles.stepLabel}>Adicione uma mensagem (opcional):</Text>
              <TextInput
                style={styles.messageInput}
                placeholder="Escreva algo especial..."
                placeholderTextColor={COLORS.gray400}
                value={message}
                onChangeText={setMessage}
                multiline
                textAlignVertical="top"
              />

              <Button variant="primary" onPress={handleSubmit} fullWidth>
                Enviar Reconhecimento
              </Button>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default function RecognitionScreen() {
  const { width } = useWindowDimensions();
  const { user, isAuthenticated, loading: authLoading } = useAppAuth();
  const { recognitions, sendRecognition } = useData();
  const { unreadCount } = useNotifications();
  const [showNewRecognition, setShowNewRecognition] = useState(false);

  const isLargeScreen = width >= 768;

  useEffect(() => {
    if (!authLoading && user && user.approvalStatus === "pending") {
      router.replace("/pending-approval");
    } else if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, user]);

  if (authLoading) {
    return <LoadingState />;
  }

  if (!isAuthenticated) {
    return null;
  }

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
        <View style={[styles.content, isLargeScreen && { maxWidth: MAX_CONTENT_WIDTH }]}>
          <ScreenHeader
            title="Reconhecimento"
            subtitle="Valorize seus colegas de trabalho"
          />

          <View style={styles.typesContainer}>
            {RECOGNITION_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[styles.typeButton, { backgroundColor: type.bg }]}
                onPress={() => setShowNewRecognition(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.typeButtonEmoji}>{type.emoji}</Text>
                <Text style={[styles.typeButtonLabel, { color: type.color }]}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>Reconhecimentos Recentes</Text>

            {recognitions.length === 0 ? (
              <EmptyState
                icon={<Text style={styles.emptyIcon}>🌟</Text>}
                title="Seja o primeiro a reconhecer!"
                description="Envie um reconhecimento para valorizar o trabalho de um colega."
                actionLabel="Enviar reconhecimento"
                onAction={() => setShowNewRecognition(true)}
              />
            ) : (
              <View>
                {recognitions.map((recognition) => (
                  <RecognitionCard key={recognition.id} recognition={recognition} />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowNewRecognition(true)}
        activeOpacity={0.8}
      >
        <IconSymbol name="plus" size={28} color={COLORS.white} />
      </TouchableOpacity>

      <NewRecognitionModal
        visible={showNewRecognition}
        onClose={() => setShowNewRecognition(false)}
        onSubmit={sendRecognition}
      />
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
    paddingBottom: 120,
  },
  content: {
    width: "100%",
    alignSelf: "center",
  },
  typesContainer: {
    flexDirection: "row",
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  typeButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  typeButtonEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  typeButtonLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  listContainer: {
    paddingHorizontal: SPACING.md,
  },
  listTitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.gray900,
    marginBottom: SPACING.md,
  },
  recognitionCard: {
    marginBottom: SPACING.md,
  },
  recognitionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm + 2,
  },
  recognitionAvatar: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },
  recognitionAvatarText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.white,
  },
  recognitionHeaderInfo: {
    flex: 1,
  },
  recognitionHeaderText: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.gray900,
  },
  recognitionHeaderName: {
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  recognitionHeaderPlain: {
    color: COLORS.gray500,
  },
  recognitionHeaderMeta: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.gray400,
    marginTop: SPACING.xs / 4,
  },
  recognitionTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
  },
  recognitionEmoji: {
    fontSize: TYPOGRAPHY.sizes["2xl"],
    marginRight: SPACING.sm,
  },
  recognitionTypeContent: {
    flex: 1,
  },
  recognitionTypeLabel: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  recognitionMessage: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.gray700,
    marginTop: SPACING.xs / 2,
  },
  emptyIcon: {
    fontSize: 48,
  },
  fab: {
    position: "absolute",
    bottom: 96,
    right: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomModal: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: "85%",
  },
  bottomModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  bottomModalTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.gray900,
  },
  bottomModalSearch: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  bottomModalScroll: {
    flex: 1,
  },
  bottomModalScrollContent: {
    padding: SPACING.md,
  },
  usersList: {
    paddingBottom: SPACING.xl,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },
  userAvatarText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.gray900,
  },
  userRole: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.gray500,
    marginTop: SPACING.xs / 4,
  },
  selectedUserCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  selectedUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },
  selectedUserAvatarText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.white,
  },
  selectedUserInfo: {
    flex: 1,
  },
  selectedUserName: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.gray900,
  },
  selectedUserRole: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.gray500,
    marginTop: SPACING.xs / 4,
  },
  selectedUserEmoji: {
    fontSize: TYPOGRAPHY.sizes["2xl"],
    marginRight: SPACING.sm,
  },
  stepLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.gray500,
    marginBottom: SPACING.sm,
  },
  typeOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    marginBottom: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  typeOptionEmoji: {
    fontSize: TYPOGRAPHY.sizes["3xl"],
    marginRight: SPACING.md,
  },
  typeOptionContent: {
    flex: 1,
  },
  typeOptionLabel: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.gray900,
  },
  typeOptionDescription: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.gray500,
    marginTop: SPACING.xs / 4,
  },
  messageInput: {
    backgroundColor: COLORS.gray100,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.gray900,
    minHeight: 100,
    marginBottom: SPACING.md,
  },
});
