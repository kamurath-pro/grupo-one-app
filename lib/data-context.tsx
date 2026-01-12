import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppAuth, AppUser } from "./auth-context";

export interface Post {
  id: number;
  authorId: number;
  authorName: string;
  authorRole: string;
  authorUnit: string;
  authorAvatar?: string;
  content: string;
  imageUrl?: string;
  category: string; // unidade/time
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: Date;
}

export interface Comment {
  id: number;
  postId: number;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: Date;
}

export interface Conversation {
  id: number;
  name: string;
  isGroup: boolean;
  participants: { id: number; name: string }[];
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  content: string;
  createdAt: Date;
}

export interface Recognition {
  id: number;
  senderId: number;
  senderName: string;
  senderUnit: string;
  receiverId: number;
  receiverName: string;
  receiverUnit: string;
  type: "parabens" | "obrigado" | "destaque";
  message?: string;
  createdAt: Date;
}

export interface FileItem {
  id: number;
  name: string;
  mimeType: string;
  isFolder: boolean;
  parentId: number | null;
  unitId: number;
  accessLevel: "all" | "socio";
  driveUrl?: string;
}

export interface Birthday {
  id: number;
  userId: number;
  name: string;
  unitName: string;
  avatarUrl?: string;
  birthDate: Date; // dia e mês do aniversário
  isTodayBirthday: boolean;
}

interface DataContextType {
  posts: Post[];
  conversations: Conversation[];
  recognitions: Recognition[];
  files: FileItem[];
  birthdays: Birthday[];
  allUsers: { id: number; name: string; unitName: string; appRole: string }[];
  addPost: (content: string, category?: string, imageUrl?: string) => void;
  likePost: (postId: number) => void;
  sendBirthdayWish: (birthdayId: number) => void;
  addComment: (postId: number, content: string) => void;
  getComments: (postId: number) => Comment[];
  deleteComment: (commentId: number) => void;
  sendMessage: (conversationId: number, content: string) => void;
  getMessages: (conversationId: number) => Message[];
  deleteMessage: (messageId: number) => void;
  deleteConversation: (conversationId: number) => void;
  startConversation: (participantIds: number[]) => number;
  sendRecognition: (receiverId: number, type: Recognition["type"], message?: string) => void;
  getFilesForUser: (parentId: number | null) => FileItem[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const POSTS_KEY = "@grupo_one_posts";
const CONVERSATIONS_KEY = "@grupo_one_conversations";
const MESSAGES_KEY = "@grupo_one_messages";
const RECOGNITIONS_KEY = "@grupo_one_recognitions";
const COMMENTS_KEY = "@grupo_one_comments";

// Lista de usuários será carregada dinamicamente do contexto de autenticação
// Não usar dados mock - dados reais vêm do sistema de autenticação

// Estrutura de arquivos será carregada dinamicamente quando necessário
const DEMO_FILES: FileItem[] = [];

// Posts iniciais vazios - serão carregados do AsyncStorage ou criados pelos usuários
const INITIAL_POSTS: Post[] = [];

// Importar dados mock (apenas em desenvolvimento)
let mockPostsModule: { getMockPosts: () => Post[] } | null = null;
if (__DEV__) {
  try {
    mockPostsModule = require("./mock-posts");
  } catch (e) {
    // Mock posts não disponível - ignorar silenciosamente
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, getApprovedUsers } = useAppAuth();
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  // Buscar usuários aprovados do contexto de autenticação
  const approvedUsers = getApprovedUsers();
  const allUsers = approvedUsers.map((u, index) => ({
    id: index + 1,
    name: u.name,
    unitName: u.unitNames[0] || "Grupo ONE",
    appRole: u.appRole,
  }));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedPosts, storedConversations, storedMessages, storedRecognitions, storedComments] = await Promise.all([
        AsyncStorage.getItem(POSTS_KEY),
        AsyncStorage.getItem(CONVERSATIONS_KEY),
        AsyncStorage.getItem(MESSAGES_KEY),
        AsyncStorage.getItem(RECOGNITIONS_KEY),
        AsyncStorage.getItem(COMMENTS_KEY),
      ]);

      let loadedPosts: Post[] = [];
      
      if (storedPosts) {
        const parsed = JSON.parse(storedPosts);
        loadedPosts = parsed.map((p: Post) => ({ ...p, createdAt: new Date(p.createdAt) }));
      }

      // Em desenvolvimento, adicionar posts mock se disponíveis
      // Os posts mock serão mesclados com os posts reais (posts reais primeiro)
      if (__DEV__ && mockPostsModule) {
        try {
          const mockPosts = mockPostsModule.getMockPosts();
          // Filtrar mock posts que já não existem nos posts carregados (por ID)
          const existingIds = new Set(loadedPosts.map((p) => p.id));
          const newMockPosts = mockPosts.filter((p) => !existingIds.has(p.id));
          // Mesclar: posts reais primeiro, depois mock posts
          loadedPosts = [...loadedPosts, ...newMockPosts].sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          );
        } catch (error) {
          // Erro ao carregar mock posts - ignorar silenciosamente
        }
      }

      // Sempre definir posts (mesmo se vazio ou apenas mock)
      setPosts(loadedPosts);
      if (storedConversations) {
        const parsed = JSON.parse(storedConversations);
        setConversations(parsed.map((c: Conversation) => ({
          ...c,
          lastMessageTime: c.lastMessageTime ? new Date(c.lastMessageTime) : undefined,
        })));
      }
      if (storedMessages) {
        const parsed = JSON.parse(storedMessages);
        setMessages(parsed.map((m: Message) => ({ ...m, createdAt: new Date(m.createdAt) })));
      }
      if (storedRecognitions) {
        const parsed = JSON.parse(storedRecognitions);
        setRecognitions(parsed.map((r: Recognition) => ({ ...r, createdAt: new Date(r.createdAt) })));
      }
      if (storedComments) {
        const parsed = JSON.parse(storedComments);
        setComments(parsed.map((c: Comment) => ({ ...c, createdAt: new Date(c.createdAt) })));
      }
    } catch (error) {
      // Erro ao carregar dados - inicializar vazio
    }
  };

  const saveData = async (key: string, data: unknown) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      // Erro silencioso - dados podem não ser salvos temporariamente
    }
  };

  const addPost = (content: string, category: string = "geral", imageUrl?: string) => {
    if (!user) return;

    const newPost: Post = {
      id: Date.now(),
      authorId: user.id,
      authorName: user.name,
      authorRole: user.appRole === "socio" ? "Sócio(a)" : user.appRole === "gerente" ? "Gerente" : "Consultora",
      authorUnit: user.unitNames?.[0] || "Grupo ONE",
      authorAvatar: user.avatarUrl || user.photoUrl,
      content,
      imageUrl,
      category,
      likes: 0,
      comments: 0,
      isLiked: false,
      createdAt: new Date(),
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    saveData(POSTS_KEY, updated);
  };

  const likePost = (postId: number) => {
    const updated = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    });
    setPosts(updated);
    saveData(POSTS_KEY, updated);
  };

  const addComment = (postId: number, content: string) => {
    if (!user) return;

    const newComment: Comment = {
      id: Date.now(),
      postId,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatarUrl || user.photoUrl,
      content,
      createdAt: new Date(),
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    saveData(COMMENTS_KEY, updatedComments);

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return { ...post, comments: post.comments + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);
    saveData(POSTS_KEY, updatedPosts);
  };

  const getComments = (postId: number) => {
    return comments.filter((c) => c.postId === postId);
  };

  const deleteComment = (commentId: number) => {
    if (!user) return;
    
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;
    
    // Apenas o autor pode excluir o comentário
    if (comment.authorId !== user.id) return;
    
    const updatedComments = comments.filter((c) => c.id !== commentId);
    setComments(updatedComments);
    saveData(COMMENTS_KEY, updatedComments);
    
    // Atualizar contagem de comentários no post
    const updatedPosts = posts.map((post) => {
      if (post.id === comment.postId) {
        return { ...post, comments: Math.max(0, post.comments - 1) };
      }
      return post;
    });
    setPosts(updatedPosts);
    saveData(POSTS_KEY, updatedPosts);
  };

  const sendMessage = (conversationId: number, content: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: Date.now(),
      conversationId,
      senderId: user.id,
      senderName: user.name,
      content,
      createdAt: new Date(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    saveData(MESSAGES_KEY, updatedMessages);

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessage: content,
          lastMessageTime: new Date(),
        };
      }
      return conv;
    });
    setConversations(updatedConversations);
    saveData(CONVERSATIONS_KEY, updatedConversations);
  };

  const getMessages = (conversationId: number) => {
    return messages.filter((m) => m.conversationId === conversationId);
  };

  const startConversation = (participantIds: number[]) => {
    if (!user) return -1;

    const allParticipantIds = [...new Set([user.id, ...participantIds])];
    // Buscar participantes do contexto de autenticação
    const participants = allParticipantIds.map((id) => {
      if (id === user.id) {
        return { id, name: user.name };
      }
      const foundUser = approvedUsers.find((u, idx) => idx + 1 === id);
      return { id, name: foundUser?.name || `Usuário ${id}` };
    });

    const newConversation: Conversation = {
      id: Date.now(),
      name: participants.filter((p) => p.id !== user.id).map((p) => p.name).join(", "),
      isGroup: participants.length > 2,
      participants,
      unreadCount: 0,
    };

    const updated = [newConversation, ...conversations];
    setConversations(updated);
    saveData(CONVERSATIONS_KEY, updated);

    return newConversation.id;
  };

  const sendRecognition = (receiverId: number, type: Recognition["type"], message?: string) => {
    if (!user) return;

    // Buscar receiver do contexto de autenticação
    const receiver = approvedUsers.find((u, idx) => idx + 1 === receiverId);
    const receiverName = receiver?.name || `Usuário ${receiverId}`;
    const receiverUnit = receiver?.unitNames?.[0] || user.unitNames?.[0] || "Grupo ONE";

    const newRecognition: Recognition = {
      id: Date.now(),
      senderId: user.id,
      senderName: user.name,
      senderUnit: user.unitNames?.[0] || "Grupo ONE",
      receiverId,
      receiverName,
      receiverUnit,
      type,
      message,
      createdAt: new Date(),
    };

    const updated = [newRecognition, ...recognitions];
    setRecognitions(updated);
    saveData(RECOGNITIONS_KEY, updated);
  };

  const getFilesForUser = (parentId: number | null) => {
    if (!user) return [];

    return DEMO_FILES.filter((file) => {
      // Filter by parent
      if (file.parentId !== parentId) return false;

      // Root level: show only user's unit folder
      if (parentId === null) {
        return user.unitIds?.includes(file.unitId) || false;
      }

      // Check access level
      if (file.accessLevel === "socio" && user.appRole !== "socio") {
        return false;
      }

      // Check unit access
      if (!user.unitIds?.includes(file.unitId)) return false;

      return true;
    });
  };

  // Gerar aniversários do mês atual
  const getBirthdaysThisMonth = (): Birthday[] => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    // Dados de aniversários extraídos do Monday.com (quadro: Aniversariantes)
    // Integração automática com Monday.com via MCP
    // Prefixos: ARA, ST, GUS, CZ, VSA, LIV, MUR, VIL, COR, FOR, MACS, MACE
    const birthdayData = [
      // Janeiro
      { userId: 1, name: "Natália", unitName: "Araripina", day: 9, month: 0, photoUrl: null },
      { userId: 2, name: "Fernanda", unitName: "Serra Talhada", day: 15, month: 0, photoUrl: null },
      { userId: 3, name: "Juliana", unitName: "Garanhuns", day: 20, month: 0, photoUrl: null },
      { userId: 4, name: "Camila", unitName: "Cajazeiras", day: 25, month: 0, photoUrl: null },
      // Fevereiro
      { userId: 5, name: "Priscila", unitName: "Araripina", day: 8, month: 1, photoUrl: null },
      { userId: 6, name: "Maria", unitName: "Araripina", day: 14, month: 1, photoUrl: null },
      // Março
      { userId: 7, name: "Aylane", unitName: "Centro Macaé", day: 24, month: 2, photoUrl: null },
      // Abril
      { userId: 8, name: "Luana", unitName: "Shopping Plaza Macaé", day: 15, month: 3, photoUrl: null },
      // Maio
      { userId: 9, name: "Davi", unitName: "Centro Macaé", day: 5, month: 4, photoUrl: null },
      // Junho
      { userId: 10, name: "Renata", unitName: "Shopping Plaza Macaé", day: 8, month: 5, photoUrl: null },
      { userId: 11, name: "Nathalya", unitName: "Shopping Plaza Macaé", day: 12, month: 5, photoUrl: null },
      // Julho
      { userId: 12, name: "Narcisa", unitName: "Centro Macaé", day: 18, month: 6, photoUrl: null },
      // Agosto
      { userId: 13, name: "Mariane", unitName: "Centro Macaé", day: 15, month: 7, photoUrl: null },
      // Setembro
      { userId: 14, name: "Deborah", unitName: "Shopping Plaza Macaé", day: 22, month: 8, photoUrl: null },
      // Outubro
      { userId: 15, name: "Alice", unitName: "Garanhuns", day: 10, month: 9, photoUrl: null },
      { userId: 16, name: "Sabrina", unitName: "Cajazeiras", day: 20, month: 9, photoUrl: null },
      // Novembro
      { userId: 17, name: "Maria Larissa", unitName: "Centro Macaé", day: 12, month: 10, photoUrl: null },
      { userId: 18, name: "Carol", unitName: "Livramento", day: 25, month: 10, photoUrl: null },
      // Dezembro
      { userId: 19, name: "Ana Carla", unitName: "Centro Macaé", day: 21, month: 11, photoUrl: "https://agencia087.monday.com/protected_static/25296793/resources/2605879490/WhatsApp%20Image%202025-12-08%20at%2012.02.20.jpeg" },
      { userId: 20, name: "Ana Laura", unitName: "Muriaé", day: 28, month: 11, photoUrl: null },
    ];

    return birthdayData
      .filter((b) => b.month === currentMonth)
      .sort((a, b) => a.day - b.day)
      .map((b, index) => ({
        id: index + 1,
        userId: b.userId,
        name: b.name,
        unitName: b.unitName,
        avatarUrl: b.photoUrl || undefined,
        birthDate: new Date(today.getFullYear(), b.month, b.day),
        isTodayBirthday: b.day === currentDay,
      }));
  };

  const birthdays = getBirthdaysThisMonth();

  const deleteMessage = (messageId: number) => {
    if (!user) return;
    
    const message = messages.find((m) => m.id === messageId);
    if (!message) return;
    
    // Apenas o autor da mensagem pode excluí-la
    if (message.senderId !== user.id) return;
    
    const updated = messages.filter((m) => m.id !== messageId);
    setMessages(updated);
    saveData(MESSAGES_KEY, updated);
  };

  const deleteConversation = (conversationId: number) => {
    if (!user) return;
    
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) return;
    
    // Verificar se o usuário é participante da conversa
    const isParticipant = conversation.participants.some((p) => p.id === user.id);
    if (!isParticipant) return;
    
    // Remove a conversa
    const updatedConversations = conversations.filter((c) => c.id !== conversationId);
    setConversations(updatedConversations);
    saveData(CONVERSATIONS_KEY, updatedConversations);

    // Remove todas as mensagens da conversa
    const updatedMessages = messages.filter((m) => m.conversationId !== conversationId);
    setMessages(updatedMessages);
    saveData(MESSAGES_KEY, updatedMessages);
  };

  const sendBirthdayWish = (birthdayId: number) => {
    const birthday = birthdays.find((b) => b.id === birthdayId);
    if (birthday && user) {
      // Criar um reconhecimento de parabéns
      sendRecognition(birthday.userId, "parabens", "Feliz aniversário! 🎉");
    }
  };

  return (
    <DataContext.Provider
      value={{
        posts,
        conversations,
        recognitions,
        files: DEMO_FILES,
        birthdays,
        allUsers,
        addPost,
        likePost,
        sendBirthdayWish,
        addComment,
        getComments,
        deleteComment,
        sendMessage,
        getMessages,
        deleteMessage,
        deleteConversation,
        startConversation,
        sendRecognition,
        getFilesForUser,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
