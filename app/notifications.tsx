import { useMemo } from "react";
import { View, Text, Pressable, StyleSheet, SectionList } from "react-native";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNotifications, AppNotification } from "@/lib/notification-context";
import { AppHeader } from "@/components/app-header";
import { ScreenContainer } from "@/components/screen-container";

// Ícone por tipo de notificação
const NOTIFICATION_ICONS: Record<string, { name: string; color: string; bgColor: string }> = {
  birthday: { name: "cake", color: "#F59E0B", bgColor: "#FEF3C7" },
  recognition: { name: "star", color: "#22C55E", bgColor: "#DCFCE7" },
  post: { name: "article", color: "#003FC3", bgColor: "#E6F0FF" },
  system: { name: "notifications", color: "#6B7280", bgColor: "#F3F4F6" },
};

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Agora";
  if (diffMins < 60) return `${diffMins} min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `${diffDays} dias atrás`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function NotificationItem({ 
  notification, 
  onPress 
}: { 
  notification: AppNotification; 
  onPress: () => void;
}) {
  const icon = NOTIFICATION_ICONS[notification.type] || NOTIFICATION_ICONS.system;
  const timeAgo = getTimeAgo(notification.createdAt);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.notificationItem,
        !notification.read && styles.notificationUnread,
        pressed && styles.notificationPressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: icon.bgColor }]}>
        <MaterialIcons name={icon.name as any} size={22} color={icon.color} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, !notification.read && styles.titleUnread]} numberOfLines={1}>
            {notification.title}
          </Text>
          {!notification.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.message} numberOfLines={3}>
          {notification.message}
        </Text>
        <Text style={styles.time}>{timeAgo}</Text>
      </View>
    </Pressable>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

// Agrupar notificações por data
interface NotificationSection {
  title: string;
  data: AppNotification[];
}

function groupNotificationsByDate(notifications: AppNotification[]): NotificationSection[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const today: AppNotification[] = [];
  const yesterday: AppNotification[] = [];
  const thisWeek: AppNotification[] = [];
  const older: AppNotification[] = [];

  notifications.forEach((notification) => {
    const notifDate = new Date(notification.createdAt);
    notifDate.setHours(0, 0, 0, 0);
    
    const diffTime = now.getTime() - notifDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      today.push(notification);
    } else if (diffDays === 1) {
      yesterday.push(notification);
    } else if (diffDays < 7) {
      thisWeek.push(notification);
    } else {
      older.push(notification);
    }
  });

  const sections: NotificationSection[] = [];
  
  if (today.length > 0) {
    sections.push({ title: "Hoje", data: today });
  }
  if (yesterday.length > 0) {
    sections.push({ title: "Ontem", data: yesterday });
  }
  if (thisWeek.length > 0) {
    sections.push({ title: "Esta semana", data: thisWeek });
  }
  if (older.length > 0) {
    sections.push({ title: "Anteriores", data: older });
  }

  return sections;
}

export default function NotificationsScreen() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  // Agrupar notificações por data
  const groupedNotifications = useMemo(() => {
    return groupNotificationsByDate(notifications);
  }, [notifications]);

  const handleNotificationPress = (notification: AppNotification) => {
    markAsRead(notification.id);
    
    // Navegar para a tela relevante baseado no tipo
    if (notification.type === "birthday") {
      router.push("/(tabs)");
    } else if (notification.type === "recognition") {
      router.push("/(tabs)/recognition");
    } else if (notification.type === "post") {
      router.push("/(tabs)");
    }
  };

  const renderItem = ({ item }: { item: AppNotification }) => (
    <NotificationItem
      notification={item}
      onPress={() => handleNotificationPress(item)}
    />
  );

  const renderSectionHeader = ({ section }: { section: NotificationSection }) => (
    <SectionHeader title={section.title} />
  );

  return (
    <ScreenContainer>
      <AppHeader showBack title="Notificações" />
      
      {/* Ações do cabeçalho */}
      {notifications.length > 0 && unreadCount > 0 && (
        <View style={styles.actionsBar}>
          <Pressable style={styles.actionButton} onPress={markAllAsRead}>
            <MaterialIcons name="done-all" size={18} color="#003FC3" />
            <Text style={styles.actionText}>Marcar todas como lidas</Text>
          </Pressable>
        </View>
      )}

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="notifications-none" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Nenhuma notificação</Text>
          <Text style={styles.emptyText}>
            Você receberá notificações sobre aniversários, reconhecimentos e novidades aqui.
          </Text>
        </View>
      ) : (
        <SectionList
          sections={groupedNotifications}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actionsBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F0F7FF",
  },
  actionText: {
    fontSize: 14,
    color: "#003FC3",
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 100,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  notificationUnread: {
    backgroundColor: "#F9FBFF",
    borderLeftWidth: 3,
    borderLeftColor: "#003FC3",
    paddingLeft: 17,
  },
  notificationPressed: {
    backgroundColor: "#F3F4F6",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    flexShrink: 0,
  },
  contentContainer: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    flex: 1,
  },
  titleUnread: {
    fontWeight: "700",
    color: "#111827",
  },
  message: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#003FC3",
    flexShrink: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});
