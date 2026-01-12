import { useState, useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, RefreshControl, useWindowDimensions, StyleSheet, Platform } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppAuth, AppRole, PendingUser } from "@/lib/auth-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { AppHeader } from "@/components/app-header";
import { useNotifications } from "@/lib/notification-context";
import * as Haptics from "expo-haptics";
import {
  ScreenHeader,
  Card,
  Button,
  LoadingState,
  EmptyState,
  SPACING,
  RADIUS,
  COLORS,
  TYPOGRAPHY,
  MAX_CONTENT_WIDTH,
} from "@/components/design-system";

type TabType = "pending" | "approved";

interface UserCardProps {
  name: string;
  email: string;
  role: string;
  unitName?: string;
  unitNames?: string[];
  date?: Date;
  onApprove?: () => void;
  onReject?: () => void;
  onRemove?: () => void;
  isPending?: boolean;
}

function UserCard({
  name,
  email,
  role,
  unitName,
  unitNames,
  date,
  onApprove,
  onReject,
  onRemove,
  isPending = false,
}: UserCardProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "gerente":
        return { bg: COLORS.primaryLight, color: COLORS.primary };
      case "consultora":
        return { bg: COLORS.primaryLight, color: COLORS.primary };
      case "socio":
        return { bg: COLORS.warningLight, color: COLORS.warning };
      default:
        return { bg: COLORS.gray100, color: COLORS.gray600 };
    }
  };

  const roleStyle = getRoleColor(role);
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "gerente":
        return "Gerente";
      case "consultora":
        return "Consultora";
      case "socio":
        return "Sócio(a)";
      default:
        return role;
    }
  };

  return (
    <Card style={styles.userCard}>
      <View style={styles.userCardHeader}>
        <View
          style={[
            styles.userAvatar,
            isPending ? styles.userAvatarPending : styles.userAvatarApproved,
          ]}
        >
          <Text
            style={[
              styles.userAvatarText,
              isPending ? styles.userAvatarTextPending : styles.userAvatarTextApproved,
            ]}
          >
            {name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{email}</Text>
          <View style={styles.userMeta}>
            <View style={[styles.roleBadge, { backgroundColor: roleStyle.bg }]}>
              <Text style={[styles.roleBadgeText, { color: roleStyle.color }]}>
                {getRoleLabel(role)}
              </Text>
            </View>
            <Text style={styles.unitText}>
              {unitName || unitNames?.join(", ") || "Grupo ONE"}
            </Text>
          </View>
          {date && (
            <Text style={styles.userDate}>
              Solicitado em {formatDate(date)}
            </Text>
          )}
        </View>
        {!isPending && onRemove && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={onRemove}
            activeOpacity={0.7}
          >
            <IconSymbol name="trash.fill" size={20} color={COLORS.error} />
          </TouchableOpacity>
        )}
      </View>

      {isPending && (onApprove || onReject) && (
        <View style={styles.userActions}>
          {onReject && (
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={onReject}
              activeOpacity={0.7}
            >
              <Text style={styles.rejectButtonText}>Rejeitar</Text>
            </TouchableOpacity>
          )}
          {onApprove && (
            <View style={styles.actionGap} />
          )}
          {onApprove && (
            <Button
              variant="primary"
              onPress={onApprove}
              style={styles.actionButton}
              fullWidth={!onReject}
            >
              Aprovar
            </Button>
          )}
        </View>
      )}
    </Card>
  );
}

function TabBar({
  activeTab,
  onTabChange,
  pendingCount,
  approvedCount,
}: {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  pendingCount: number;
  approvedCount: number;
}) {
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "pending" && styles.tabActive]}
        onPress={() => onTabChange("pending")}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, activeTab === "pending" && styles.tabTextActive]}>
          Pendentes ({pendingCount})
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "approved" && styles.tabActive]}
        onPress={() => onTabChange("approved")}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, activeTab === "approved" && styles.tabTextActive]}>
          Aprovados ({approvedCount})
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function AdminScreen() {
  const { width } = useWindowDimensions();
  const {
    isAuthenticated,
    isAdmin,
    loading: authLoading,
    pendingUsers,
    approveUser,
    rejectUser,
    removeUser,
    getApprovedUsers,
    refreshPendingUsers,
  } = useAppAuth();
  const { unreadCount } = useNotifications();

  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [approvedUsers, setApprovedUsers] = useState<
    { email: string; name: string; appRole: AppRole; unitNames: string[] }[]
  >([]);
  const [refreshing, setRefreshing] = useState(false);

  const isLargeScreen = width >= 768;

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, isAdmin]);

  useEffect(() => {
    refreshPendingUsers();
    setApprovedUsers(getApprovedUsers());
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshPendingUsers();
    setApprovedUsers(getApprovedUsers());
    setRefreshing(false);
  };

  const handleApprove = async (userId: number, userName: string) => {
    if (Platform.OS === "web") {
      const confirmed = typeof window !== "undefined" && window.confirm(
        `Deseja aprovar o cadastro de ${userName}?`
      );
      if (!confirmed) return;
      await approveUser(userId);
      setApprovedUsers(getApprovedUsers());
    } else {
      Alert.alert(
        "Aprovar cadastro",
        `Deseja aprovar o cadastro de ${userName}?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Aprovar",
            onPress: async () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              await approveUser(userId);
              setApprovedUsers(getApprovedUsers());
            },
          },
        ]
      );
    }
  };

  const handleReject = async (userId: number, userName: string) => {
    if (Platform.OS === "web") {
      const confirmed = typeof window !== "undefined" && window.confirm(
        `Deseja rejeitar o cadastro de ${userName}? Esta ação não pode ser desfeita.`
      );
      if (!confirmed) return;
      await rejectUser(userId);
    } else {
      Alert.alert(
        "Rejeitar cadastro",
        `Deseja rejeitar o cadastro de ${userName}? Esta ação não pode ser desfeita.`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Rejeitar",
            style: "destructive",
            onPress: async () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              await rejectUser(userId);
            },
          },
        ]
      );
    }
  };

  const handleRemove = async (userEmail: string, userName: string) => {
    if (Platform.OS === "web") {
      const confirmed = typeof window !== "undefined" && window.confirm(
        `Deseja remover ${userName} do sistema? Esta pessoa perderá o acesso ao aplicativo imediatamente.`
      );
      if (!confirmed) return;
      await removeUser(userEmail);
      setApprovedUsers(getApprovedUsers());
    } else {
      Alert.alert(
        "Remover usuário",
        `Deseja remover ${userName} do sistema? Esta pessoa perderá o acesso ao aplicativo imediatamente.`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Remover",
            style: "destructive",
            onPress: async () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              await removeUser(userEmail);
              setApprovedUsers(getApprovedUsers());
            },
          },
        ]
      );
    }
  };

  if (authLoading) {
    return <LoadingState />;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === "approved") {
      setApprovedUsers(getApprovedUsers());
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        notificationCount={unreadCount}
        onNotificationPress={() => router.push("/notifications" as any)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.content, isLargeScreen && { maxWidth: MAX_CONTENT_WIDTH }]}>
          <ScreenHeader
            title="Administração"
            subtitle="Gerencie usuários do Grupo ONE"
          />

          <View style={styles.tabBarContainer}>
            <TabBar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              pendingCount={pendingUsers.length}
              approvedCount={approvedUsers.length}
            />
          </View>

          {activeTab === "pending" ? (
            <View style={styles.listContainer}>
              {pendingUsers.length === 0 ? (
                <EmptyState
                  icon={
                    <View style={styles.emptyIcon}>
                      <IconSymbol name="checkmark.circle.fill" size={48} color={COLORS.success} />
                    </View>
                  }
                  title="Nenhum cadastro pendente"
                  description="Todos os cadastros foram analisados. Novos pedidos aparecerão aqui."
                />
              ) : (
                <View>
                  {pendingUsers.map((pendingUser) => (
                    <UserCard
                      key={pendingUser.id}
                      name={pendingUser.name}
                      email={pendingUser.email}
                      role={pendingUser.appRole}
                      unitName={pendingUser.unitName}
                      date={pendingUser.registeredAt}
                      isPending
                      onApprove={() => handleApprove(pendingUser.id, pendingUser.name)}
                      onReject={() => handleReject(pendingUser.id, pendingUser.name)}
                    />
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View style={styles.listContainer}>
              {approvedUsers.length === 0 ? (
                <EmptyState
                  icon={
                    <View style={styles.emptyIcon}>
                      <IconSymbol name="person.2.fill" size={48} color={COLORS.gray300} />
                    </View>
                  }
                  title="Nenhum usuário aprovado"
                  description="Usuários aprovados aparecerão aqui."
                />
              ) : (
                <View>
                  {approvedUsers.map((approvedUser) => (
                    <UserCard
                      key={approvedUser.email}
                      name={approvedUser.name}
                      email={approvedUser.email}
                      role={approvedUser.appRole}
                      unitNames={approvedUser.unitNames}
                      onRemove={() => handleRemove(approvedUser.email, approvedUser.name)}
                    />
                  ))}
                </View>
              )}
            </View>
          )}
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
  tabBarContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.gray200,
    borderRadius: RADIUS.md,
    padding: SPACING.xs / 2,
    gap: SPACING.xs / 2,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: COLORS.white,
  },
  tabText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.gray500,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  listContainer: {
    paddingHorizontal: SPACING.md,
  },
  userCard: {
    marginBottom: SPACING.md,
  },
  userCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm + 2,
  },
  userAvatarPending: {
    backgroundColor: COLORS.primaryLight,
  },
  userAvatarApproved: {
    backgroundColor: COLORS.primary,
  },
  userAvatarText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  userAvatarTextPending: {
    color: COLORS.primary,
  },
  userAvatarTextApproved: {
    color: COLORS.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.gray900,
    marginBottom: SPACING.xs / 4,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.gray500,
    marginBottom: SPACING.xs / 2,
  },
  userMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: SPACING.xs / 4,
  },
  roleBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: RADIUS.full,
    marginRight: SPACING.sm,
  },
  roleBadgeText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  unitText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.gray400,
  },
  userDate: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.gray400,
    marginTop: SPACING.xs / 4,
  },
  removeButton: {
    padding: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.errorLight,
    marginLeft: SPACING.sm,
  },
  userActions: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  actionButton: {
    flex: 1,
  },
  rejectButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.errorLight,
    alignItems: "center",
    justifyContent: "center",
  },
  rejectButtonText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.error,
  },
  actionGap: {
    width: SPACING.sm,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
});
