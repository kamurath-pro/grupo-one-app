import { useState, useEffect, useMemo, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform, useWindowDimensions, ScrollView, StyleSheet, Alert, Pressable } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppAuth } from "@/lib/auth-context";
import { useData, Conversation, Message } from "@/lib/data-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { AppHeader } from "@/components/app-header";
import { useNotifications } from "@/lib/notification-context";
import { ScreenHeader, Card, Button, EmptyState, LoadingState, SearchBar, SPACING, RADIUS, COLORS, TYPOGRAPHY, MAX_CONTENT_WIDTH } from "@/components/design-system";

function ChatModal({
  visible,
  conversation,
  onClose,
}: {
  visible: boolean;
  conversation: Conversation | null;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { user } = useAppAuth();
  const { getMessages, sendMessage, deleteMessage, deleteConversation } = useData();
  const [message, setMessage] = useState("");
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
  const [showDeleteConversationConfirm, setShowDeleteConversationConfirm] = useState(false);

  const confirmDeleteMessage = () => {
    if (messageToDelete !== null) {
      deleteMessage(messageToDelete);
      setMessageToDelete(null);
    }
  };

  const handleDeleteConversation = () => {
    setShowDeleteConversationConfirm(true);
  };

  const confirmDeleteConversation = () => {
    if (conversation) {
      deleteConversation(conversation.id);
      setShowDeleteConversationConfirm(false);
      onClose();
    }
  };

  if (!conversation) return null;

  const messages = getMessages(conversation.id);

  const handleSend = () => {
    if (message.trim() && conversation) {
      sendMessage(conversation.id, message.trim());
      setMessage("");
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(diff / 86400000);
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={[styles.modalHeader, { paddingTop: insets.top }]}>
          <View style={styles.modalHeaderContent}>
            <TouchableOpacity onPress={onClose} style={styles.modalBackButton}>
              <IconSymbol name="chevron.left" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.modalAvatar}>
              <Text style={styles.modalAvatarText}>{conversation.name[0].toUpperCase()}</Text>
            </View>
            <Text style={styles.modalHeaderTitle}>{conversation.name}</Text>
            <TouchableOpacity onPress={handleDeleteConversation} style={styles.modalHeaderAction}>
              <IconSymbol name="trash.fill" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isMe = item.senderId === user?.id;
            return (
              <Pressable
                style={[styles.messageContainer, isMe ? styles.messageRight : styles.messageLeft]}
                onLongPress={() => {
                  if (isMe) {
                    setMessageToDelete(item.id);
                  }
                }}
              >
                <View style={[styles.messageBubble, isMe ? styles.messageBubbleMe : styles.messageBubbleOther]}>
                  {!isMe && (
                    <Text style={styles.messageSender}>{item.senderName}</Text>
                  )}
                  <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>
                    {item.content}
                  </Text>
                </View>
              </Pressable>
            );
          }}
          contentContainerStyle={styles.messagesList}
          ListEmptyComponent={
            <View style={styles.messagesEmpty}>
              <IconSymbol name="message.fill" size={48} color={COLORS.gray300} />
              <Text style={styles.messagesEmptyText}>Nenhuma mensagem ainda</Text>
              <Text style={styles.messagesEmptySubtext}>Comece a conversa!</Text>
            </View>
          }
        />

        {/* Input */}
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Digite sua mensagem..."
              placeholderTextColor={COLORS.gray400}
              value={message}
              onChangeText={setMessage}
              returnKeyType="send"
              onSubmitEditing={handleSend}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!message.trim()}
            >
              <IconSymbol name="paperplane.fill" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>

      {/* Modal de confirmação - Excluir Mensagem */}
      <Modal
        visible={messageToDelete !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setMessageToDelete(null)}
      >
        <View style={styles.confirmModalOverlay}>
          <Card style={styles.confirmModalCard}>
            <Text style={styles.confirmModalTitle}>Confirmar exclusão</Text>
            <Text style={styles.confirmModalText}>
              Tem certeza que deseja apagar esta mensagem? Esta ação não pode ser desfeita.
            </Text>
            <View style={styles.confirmModalActions}>
              <Button variant="outline" onPress={() => setMessageToDelete(null)}>
                Cancelar
              </Button>
              <Button variant="primary" onPress={confirmDeleteMessage} style={styles.confirmModalDeleteButton}>
                Apagar
              </Button>
            </View>
          </Card>
        </View>
      </Modal>

      {/* Modal de confirmação - Excluir Conversa */}
      <Modal
        visible={showDeleteConversationConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteConversationConfirm(false)}
      >
        <View style={styles.confirmModalOverlay}>
          <Card style={styles.confirmModalCard}>
            <Text style={styles.confirmModalTitle}>Confirmar exclusão</Text>
            <Text style={styles.confirmModalText}>
              Tem certeza que deseja apagar esta conversa? Todas as mensagens serão excluídas e esta ação não pode ser desfeita.
            </Text>
            <View style={styles.confirmModalActions}>
              <Button variant="outline" onPress={() => setShowDeleteConversationConfirm(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onPress={confirmDeleteConversation} style={styles.confirmModalDeleteButton}>
                Apagar
              </Button>
            </View>
          </Card>
        </View>
      </Modal>
    </Modal>
  );
}

function NewChatModal({
  visible,
  onClose,
  onSelectUser,
}: {
  visible: boolean;
  onClose: () => void;
  onSelectUser: (userId: number) => void;
}) {
  const { user } = useAppAuth();
  const { allUsers } = useData();
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    return allUsers.filter(
      (u) =>
        u.id !== user?.id &&
        (u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.unitName.toLowerCase().includes(search.toLowerCase()))
    );
  }, [allUsers, user?.id, search]);

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "socio":
        return "Sócio(a)";
      case "gerente":
        return "Gerente";
      case "consultora":
        return "Consultora";
      default:
        return role;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.bottomModalOverlay}>
        <View style={styles.bottomModal}>
          <View style={styles.bottomModalHeader}>
            <Text style={styles.bottomModalTitle}>Nova Conversa</Text>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol name="xmark" size={24} color={COLORS.gray600} />
            </TouchableOpacity>
          </View>

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
                  onSelectUser(item.id);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>{item.name[0].toUpperCase()}</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <Text style={styles.userRole}>
                    {getRoleLabel(item.appRole)} • {item.unitName}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.usersList}
          />
        </View>
      </View>
    </Modal>
  );
}

function ConversationItem({
  conversation,
  onPress,
}: {
  conversation: Conversation;
  onPress: () => void;
}) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(diff / 86400000);
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  return (
    <TouchableOpacity style={styles.conversationItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.conversationAvatar}>
        <Text style={styles.conversationAvatarText}>{conversation.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{conversation.name}</Text>
          {conversation.lastMessageTime && (
            <Text style={styles.conversationTime}>{formatTime(conversation.lastMessageTime)}</Text>
          )}
        </View>
        {conversation.lastMessage && (
          <Text style={styles.conversationLastMessage} numberOfLines={1}>
            {conversation.lastMessage}
          </Text>
        )}
      </View>
      {conversation.unreadCount > 0 && (
        <View style={styles.conversationBadge}>
          <Text style={styles.conversationBadgeText}>
            {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function ChatScreen() {
  const { width } = useWindowDimensions();
  const { isAuthenticated, loading: authLoading, user } = useAppAuth();
  const { conversations, startConversation } = useData();
  const { unreadCount } = useNotifications();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isLargeScreen = width >= 768;

  useEffect(() => {
    if (!authLoading && user && user.approvalStatus === "pending") {
      router.replace("/pending-approval");
    } else if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, user]);

  const handleNewChat = useCallback((userId: number) => {
    const conversationId = startConversation([userId]);
    const newConv = conversations.find((c) => c.id === conversationId);
    if (newConv) {
      setSelectedConversation(newConv);
    }
  }, [conversations, startConversation]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter((c) => c.name.toLowerCase().includes(query));
  }, [conversations, searchQuery]);

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
            title="Mensagens"
            subtitle="Converse com seus colegas"
            action={
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowNewChat(true)}
                activeOpacity={0.8}
              >
                <IconSymbol name="plus" size={20} color={COLORS.white} />
              </TouchableOpacity>
            }
          />

          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar conversas..."
            />
          </View>

          {filteredConversations.length === 0 ? (
            <EmptyState
              icon={
                <View style={styles.emptyIcon}>
                  <IconSymbol name="message.fill" size={40} color={COLORS.primary} />
                </View>
              }
              title="Nenhuma conversa ainda"
              description="Inicie uma conversa com seus colegas"
              actionLabel="Iniciar conversa"
              onAction={() => setShowNewChat(true)}
            />
          ) : (
            <Card noPadding style={styles.conversationsCard}>
              {filteredConversations.map((conversation, index) => (
                <View key={conversation.id}>
                  <ConversationItem
                    conversation={conversation}
                    onPress={() => setSelectedConversation(conversation)}
                  />
                  {index < filteredConversations.length - 1 && <View style={styles.conversationDivider} />}
                </View>
              ))}
            </Card>
          )}
        </View>
      </ScrollView>

      <ChatModal
        visible={!!selectedConversation}
        conversation={selectedConversation}
        onClose={() => setSelectedConversation(null)}
      />

      <NewChatModal
        visible={showNewChat}
        onClose={() => setShowNewChat(false)}
        onSelectUser={handleNewChat}
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
    paddingBottom: 100,
  },
  content: {
    width: "100%",
    alignSelf: "center",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  conversationsCard: {
    marginHorizontal: SPACING.md,
  },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
  },
  conversationDivider: {
    height: 1,
    backgroundColor: COLORS.gray100,
    marginLeft: SPACING.md + 56, // avatar width + padding
  },
  conversationAvatar: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  conversationAvatarText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.white,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.xs / 2,
  },
  conversationName: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.gray900,
  },
  conversationTime: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.gray400,
  },
  conversationLastMessage: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.gray500,
  },
  conversationBadge: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: SPACING.sm,
  },
  conversationBadgeText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.white,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  modalHeader: {
    backgroundColor: COLORS.primary,
  },
  modalHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
  },
  modalBackButton: {
    marginRight: SPACING.sm,
    padding: SPACING.xs,
  },
  modalAvatar: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalAvatarText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.white,
  },
  modalHeaderTitle: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.white,
  },
  modalHeaderAction: {
    padding: SPACING.sm,
  },
  messagesList: {
    paddingVertical: SPACING.md,
  },
  messageContainer: {
    paddingHorizontal: SPACING.md,
    marginVertical: SPACING.xs / 2,
    maxWidth: "80%",
  },
  messageLeft: {
    alignSelf: "flex-start",
  },
  messageRight: {
    alignSelf: "flex-end",
  },
  messageBubble: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
  },
  messageBubbleMe: {
    backgroundColor: COLORS.primary,
  },
  messageBubbleOther: {
    backgroundColor: COLORS.white,
  },
  messageSender: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.primary,
    marginBottom: SPACING.xs / 2,
  },
  messageText: {
    fontSize: TYPOGRAPHY.sizes.base,
  },
  messageTextMe: {
    color: COLORS.white,
  },
  messageTextOther: {
    color: COLORS.gray900,
  },
  messagesEmpty: {
    alignItems: "center",
    paddingVertical: SPACING.xl * 2,
  },
  messagesEmptyText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.gray400,
  },
  messagesEmptySubtext: {
    marginTop: SPACING.xs / 2,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.gray400,
  },
  messageInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  messageInput: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.gray100,
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.gray900,
    marginRight: SPACING.sm,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.gray300,
  },
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.md,
  },
  confirmModalCard: {
    maxWidth: 400,
    width: "100%",
  },
  confirmModalTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.gray900,
    marginBottom: SPACING.sm,
  },
  confirmModalText: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.gray600,
    marginBottom: SPACING.lg,
  },
  confirmModalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: SPACING.sm,
  },
  confirmModalDeleteButton: {
    backgroundColor: COLORS.error,
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
    maxHeight: "80%",
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
  },
  userAvatarText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.white,
  },
  userInfo: {
    marginLeft: SPACING.sm,
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
});
